'use client'

import { supabase } from '@/lib/supabase'
import { useUsers, useGoals, useRoutes, useNodes, useProfile, swrKeys, invalidate } from '@/lib/swr-hooks'
import { useEffect, useState } from 'react'
import UserList from './components/UserList'
import GoalBanner from './components/GoalBanner'
import RouteTabs from './components/RouteTabs'
import NodeTimeline from './components/NodeTimeline'
import AddNodeForm from './components/AddNodeForm'
import ProfileCard from './components/ProfileCard'
import Roadmap from './components/Roadmap'
import Architecture from './components/Architecture'

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)

  const [viewingUserId, setViewingUserId] = useState<string | null>(null)
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null)
  const [showAbout, setShowAbout] = useState(false)
  const [showArchitecture, setShowArchitecture] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const currentUserId = session?.user?.id || null
  const isOwner = currentUserId === viewingUserId

  const { data: users = [] } = useUsers()
  const { data: goals = [] } = useGoals(viewingUserId)
  const { data: routes = [] } = useRoutes(viewingUserId)
  const { data: nodes = [] } = useNodes(activeRouteId)
  const { data: profile = null } = useProfile(viewingUserId)

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
          }]).then(() => invalidate(swrKeys.users))
        }
      })
  }, [currentUserId, session?.user?.email])

  useEffect(() => {
    if (currentUserId) {
      setViewingUserId(currentUserId)
    }
  }, [currentUserId])

  useEffect(() => {
    if (!viewingUserId && users.length > 0) {
      setViewingUserId(users[0].user_id)
    }
  }, [users, viewingUserId])

  useEffect(() => {
    if (routes.length > 0) {
      setActiveRouteId(prev => {
        if (prev && routes.some((r: any) => r.id === prev)) return prev
        return routes[0]?.id ?? null
      })
    } else {
      setActiveRouteId(null)
    }
  }, [routes])

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
    setViewingUserId(users.length > 0 ? users[0].user_id : null)
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
      invalidate(swrKeys.users)
    } else {
      const { error } = await res.json()
      alert(error || '注销失败')
    }
  }

  const handleSelectUser = (userId: string) => {
    setViewingUserId(userId)
    setActiveRouteId(null)
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
                    if (viewingUserId) invalidate(swrKeys.profile(viewingUserId))
                    invalidate(swrKeys.users)
                  }}
                />
              )}
            </div>

            <section
              className="bg-white rounded-xl border border-slate-200/80 shadow-sm px-6 py-5 animate-fade-in-up"
              style={{ animationDelay: '50ms' }}
            >
              <div className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">宏观目标</div>
              <GoalBanner
                goals={goals}
                isOwner={isOwner}
                onGoalsChange={() => viewingUserId && invalidate(swrKeys.goals(viewingUserId))}
              />
            </section>

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
                  if (viewingUserId) invalidate(swrKeys.routes(viewingUserId))
                  invalidate(swrKeys.users)
                }}
              />
            </section>

            {activeRouteId ? (
              <section
                className="bg-white rounded-xl border border-slate-200/80 shadow-sm px-6 py-5 animate-fade-in-up"
                style={{ animationDelay: '150ms' }}
              >
                <NodeTimeline
                  nodes={nodes}
                  isOwner={isOwner}
                  onNodesChange={() => {
                    if (activeRouteId) invalidate(swrKeys.nodes(activeRouteId))
                    invalidate(swrKeys.users)
                  }}
                />
                {isOwner && (
                  <AddNodeForm
                    routeId={activeRouteId}
                    nodes={nodes.map((n: any) => ({ id: n.id, title: n.title, order_index: n.order_index }))}
                    onNodeAdded={() => {
                      invalidate(swrKeys.nodes(activeRouteId))
                      invalidate(swrKeys.users)
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
