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

  // All users with completion stats
  const [users, setUsers] = useState<UserWithStats[]>([])
  // Which user we're viewing
  const [viewingUserId, setViewingUserId] = useState<string | null>(null)

  // Viewed user's data
  const [goals, setGoals] = useState<any[]>([])
  const [routes, setRoutes] = useState<any[]>([])
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null)
  const [nodes, setNodes] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [showAbout, setShowAbout] = useState(false)

  const currentUserId = session?.user?.id || null
  const isOwner = currentUserId === viewingUserId

  // ── Auth ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Ensure profile exists for current user
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

  // ── Fetch all users with stats ──
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
    if (session) {
      fetchUsers()
      if (!viewingUserId) setViewingUserId(currentUserId)
    }
  }, [session, fetchUsers, currentUserId])

  // ── Fetch viewed user's data ──
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
    if (data && data.length > 0) {
      setActiveRouteId(data[0].id)
    } else {
      setActiveRouteId(null)
    }
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

  // ── Handlers ──
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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUsers([])
    setViewingUserId(null)
    setGoals([])
    setRoutes([])
    setNodes([])
    setProfile(null)
  }

  const handleSelectUser = (userId: string) => {
    setViewingUserId(userId)
    setActiveRouteId(null)
    setNodes([])
    setShowAbout(false)
  }

  // ── Login page ──
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col gap-3 w-80">
          <h1 className="text-2xl font-bold">学习监督自习室</h1>
          <p className="text-sm text-zinc-500">
            {isSignUp ? '注册新账号' : '登录已有账号'}
          </p>
          <input
            type="email"
            value={loginEmail}
            onChange={e => setLoginEmail(e.target.value)}
            placeholder="邮箱"
            className="px-3 py-2 border border-zinc-300 rounded text-sm"
          />
          <input
            type="password"
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAuth()}
            placeholder="密码（至少6位）"
            className="px-3 py-2 border border-zinc-300 rounded text-sm"
          />
          <button
            onClick={handleAuth}
            disabled={authLoading}
            className="px-4 py-2 bg-black text-white rounded text-sm disabled:opacity-50"
          >
            {authLoading ? '请稍候...' : isSignUp ? '注册' : '登录'}
          </button>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-zinc-400 hover:text-zinc-600"
          >
            {isSignUp ? '已有账号？去登录' : '没有账号？去注册'}
          </button>
        </div>
      </div>
    )
  }

  // ── Main layout ──
  const maxNodeOrder = nodes.length > 0
    ? Math.max(...nodes.map(n => n.order_index))
    : 0

  return (
    <div className="flex min-h-screen">
      {/* Left: User list */}
      <UserList
        users={users}
        currentUserId={currentUserId}
        viewingUserId={viewingUserId || ''}
        showAbout={showAbout}
        onSelectUser={handleSelectUser}
        onShowAbout={() => setShowAbout(true)}
        onLogout={handleLogout}
      />

      {/* Right: Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {showAbout ? (
          <Roadmap />
        ) : (
          <div className="max-w-2xl space-y-6">
            {/* ① Macro goals banner */}
            <section>
              <div className="text-xs text-zinc-400 mb-2 uppercase tracking-wide">宏观目标</div>
              <GoalBanner
                goals={goals}
                isOwner={isOwner}
                onGoalsChange={() => viewingUserId && fetchGoals(viewingUserId)}
              />
            </section>

            {/* ② Route tabs */}
            <section>
              <div className="text-xs text-zinc-400 mb-2 uppercase tracking-wide">学习路线</div>
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

            {/* ③ Node timeline */}
            {activeRouteId && (
              <section>
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
                    currentMaxOrder={maxNodeOrder}
                    onNodeAdded={() => {
                      fetchNodes(activeRouteId)
                      fetchUsers()
                    }}
                  />
                )}
              </section>
            )}

            {/* ④ Profile card */}
            {profile && (
              <section>
                <div className="text-xs text-zinc-400 mb-2 uppercase tracking-wide">个人信息</div>
                <ProfileCard
                  profile={profile}
                  isOwner={isOwner}
                  onProfileChange={() => {
                    if (viewingUserId) fetchProfile(viewingUserId)
                    fetchUsers()
                  }}
                />
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
