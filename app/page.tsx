'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState, useCallback } from 'react'
import UserList from './components/UserList'
import GoalBanner from './components/GoalBanner'
import RouteTabs from './components/RouteTabs'
import NodeTimeline from './components/NodeTimeline'
import AddNodeForm from './components/AddNodeForm'
import ProfileCard from './components/ProfileCard'
import Roadmap from './components/Roadmap'
import Architecture from './components/Architecture'

interface UserWithStats {
  user_id: string
  name: string | null
  total_nodes: number
  completed_nodes: number
}

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)

  const [users, setUsers] = useState<UserWithStats[]>([])
  const [viewingUserId, setViewingUserId] = useState<string | null>(null)

  const [goals, setGoals] = useState<any[]>([])
  const [routes, setRoutes] = useState<any[]>([])
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null)
  const [nodes, setNodes] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [showAbout, setShowAbout] = useState(false)
  const [showArchitecture, setShowArchitecture] = useState(false)

  const currentUserId = session?.user?.id || null
  const isOwner = currentUserId === viewingUserId

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!currentUserId) return
    supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', currentUserId)
      .single()
      .then(({ data }) => {
        if (!data) {
          supabase.from('profiles').insert([{
            user_id: currentUserId,
            name: session?.user?.email || null,
          }]).then(() => fetchUsers())
        }
      })
  }, [currentUserId])

  const fetchUsers = useCallback(async () => {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, name')

    if (!profiles) return

    const { data: allNodes } = await supabase
      .from('route_nodes')
      .select('id, completed, route_id')

    const { data: allRoutes } = await supabase
      .from('routes')
      .select('id, user_id')

    const routeOwnerMap = new Map<string, string>()
    allRoutes?.forEach(r => routeOwnerMap.set(r.id, r.user_id))

    const statsMap = new Map<string, { total: number; completed: number }>()
    allNodes?.forEach(n => {
      const ownerId = routeOwnerMap.get(n.route_id)
      if (!ownerId) return
      const prev = statsMap.get(ownerId) || { total: 0, completed: 0 }
      prev.total++
      if (n.completed) prev.completed++
      statsMap.set(ownerId, prev)
    })

    const usersWithStats: UserWithStats[] = profiles.map(p => ({
      user_id: p.user_id,
      name: p.name,
      total_nodes: statsMap.get(p.user_id)?.total || 0,
      completed_nodes: statsMap.get(p.user_id)?.completed || 0,
    }))

    setUsers(usersWithStats)
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers, session])

  useEffect(() => {
    if (currentUserId) {
      setViewingUserId(currentUserId)
    }
  }, [currentUserId])

  useEffect(() => {
    if (!viewingUserId && users.length > 0) {
      setViewingUserId(users[0].user_id)
    }
  }, [users])

  const fetchGoals = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('order_index', { ascending: true })
    setGoals(data || [])
  }, [])

  const fetchRoutes = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('routes')
      .select('*')
      .eq('user_id', userId)
      .order('order_index', { ascending: true })
    setRoutes(data || [])
    setActiveRouteId(prev => {
      if (prev && data?.some(r => r.id === prev)) return prev
      return data?.[0]?.id ?? null
    })
  }, [])

  const fetchNodes = useCallback(async (routeId: string) => {
    const { data } = await supabase
      .from('route_nodes')
      .select('*')
      .eq('route_id', routeId)
      .order('order_index', { ascending: true })
    setNodes(data || [])
  }, [])

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    setProfile(data)
  }, [])

  useEffect(() => {
    if (!viewingUserId) return
    fetchGoals(viewingUserId)
    fetchRoutes(viewingUserId)
    fetchProfile(viewingUserId)
  }, [viewingUserId, fetchGoals, fetchRoutes, fetchProfile])

  useEffect(() => {
    if (activeRouteId) fetchNodes(activeRouteId)
    else setNodes([])
  }, [activeRouteId, fetchNodes])

  const handleAuth = async () => {
    if (!loginEmail.trim() || !loginPassword.trim()) return
    setAuthLoading(true)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email: loginEmail.trim(),
        password: loginPassword.trim(),
      })
      setAuthLoading(false)
      if (error) {
        alert('注册失败: ' + error.message)
      } else {
        alert('注册成功！现在可以登录了。')
        setIsSignUp(false)
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword.trim(),
      })
      setAuthLoading(false)
      if (error) {
        alert('登录失败: ' + error.message)
      }
    }
  }

  const [showLogin, setShowLogin] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setViewingUserId(users.length > 0 ? users[0].user_id : null)
    setGoals([])
    setRoutes([])
    setNodes([])
    setProfile(null)
  }

  const handleDeleteAccount = async () => {
    const token = session?.access_token
    if (!token) return
    const res = await fetch('/api/delete-account', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      await supabase.auth.signOut()
      setSession(null)
      setViewingUserId(users.length > 0 ? users[0].user_id : null)
      setGoals([])
      setRoutes([])
      setNodes([])
      setProfile(null)
      fetchUsers()
    } else {
      const { error } = await res.json()
      alert(error || '注销失败')
    }
  }

  const handleSelectUser = (userId: string) => {
    setViewingUserId(userId)
    setActiveRouteId(null)
    setNodes([])
    setShowAbout(false)
    setShowArchitecture(false)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <UserList
        users={users}
        currentUserId={currentUserId}
        viewingUserId={viewingUserId || ''}
        showAbout={showAbout}
        showArchitecture={showArchitecture}
        viewingProfile={profile}
        isLoggedIn={!!session}
        onSelectUser={handleSelectUser}
        onShowAbout={() => { setShowAbout(true); setShowArchitecture(false) }}
        onShowArchitecture={() => { setShowArchitecture(true); setShowAbout(false) }}
        onLogout={handleLogout}
        onLogin={() => setShowLogin(true)}
        onDeleteAccount={handleDeleteAccount}
      />

      <main className="flex-1 px-10 py-8 overflow-y-auto">
        {showArchitecture ? (
          <Architecture />
        ) : showAbout ? (
          <Roadmap />
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div
              className="flex items-center justify-between animate-fade-in-up"
            >
              <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                {profile?.name || '未命名'}
                {isOwner && <span className="text-slate-400 font-normal text-sm ml-2">的学习空间</span>}
              </h2>
              {isOwner && profile && (
                <ProfileCard
                  profile={profile}
                  isOwner={isOwner}
                  onProfileChange={() => {
                    if (viewingUserId) fetchProfile(viewingUserId)
                    fetchUsers()
                  }}
                />
              )}
            </div>

            {/* Macro goals */}
            <section
              className="bg-white rounded-xl border border-slate-200/80 shadow-sm px-6 py-5 animate-fade-in-up"
              style={{ animationDelay: '50ms' }}
            >
              <div className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">宏观目标</div>
              <GoalBanner
                goals={goals}
                isOwner={isOwner}
                onGoalsChange={() => viewingUserId && fetchGoals(viewingUserId)}
              />
            </section>

            {/* Route tabs */}
            <section
              className="bg-white rounded-xl border border-slate-200/80 shadow-sm px-6 py-5 animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              <div className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">学习路线</div>
              <RouteTabs
                routes={routes}
                activeRouteId={activeRouteId}
                isOwner={isOwner}
                onSelectRoute={setActiveRouteId}
                onRoutesChange={() => {
                  if (viewingUserId) {
                    fetchRoutes(viewingUserId)
                    fetchUsers()
                  }
                }}
              />
            </section>

            {/* Node timeline */}
            {activeRouteId ? (
              <section
                className="bg-white rounded-xl border border-slate-200/80 shadow-sm px-6 py-5 animate-fade-in-up"
                style={{ animationDelay: '150ms' }}
              >
                <NodeTimeline
                  nodes={nodes}
                  isOwner={isOwner}
                  onNodesChange={() => {
                    if (activeRouteId) fetchNodes(activeRouteId)
                    fetchUsers()
                  }}
                />
                {isOwner && (
                  <AddNodeForm
                    routeId={activeRouteId}
                    nodes={nodes.map(n => ({ id: n.id, title: n.title, order_index: n.order_index }))}
                    onNodeAdded={() => {
                      fetchNodes(activeRouteId)
                      fetchUsers()
                    }}
                  />
                )}
              </section>
            ) : (
              <div className="text-slate-400 text-sm py-4 animate-fade-in-up">
                {isOwner ? '创建一条学习路线开始吧' : '该用户还没有学习路线'}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Login modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowLogin(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-sm space-y-4 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">{isSignUp ? '注册新账号' : '欢迎回来'}</h2>
              <p className="text-sm text-slate-400 mt-0.5">{isSignUp ? '创建账号加入自习室' : '登录你的学习空间'}</p>
            </div>
            <input
              type="email"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              placeholder="邮箱"
              autoFocus
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-shadow"
            />
            <input
              type="password"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAuth()}
              placeholder="密码（至少6位）"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-shadow"
            />
            <button
              onClick={async () => {
                await handleAuth()
                if (!isSignUp) setShowLogin(false)
              }}
              disabled={authLoading}
              className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {authLoading ? '请稍候...' : isSignUp ? '注册' : '登录'}
            </button>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-slate-400 hover:text-indigo-600 transition-colors"
            >
              {isSignUp ? '已有账号？去登录' : '没有账号？去注册'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
