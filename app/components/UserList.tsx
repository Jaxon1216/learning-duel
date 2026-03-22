'use client'

import { useState } from 'react'

interface UserWithStats {
  user_id: string
  name: string | null
  total_nodes: number
  completed_nodes: number
}

interface Profile {
  user_id: string
  name: string | null
  education: string | null
  bio: string | null
  contact_type: string | null
  contact_value: string | null
}

interface UserListProps {
  users: UserWithStats[]
  currentUserId: string | null
  viewingUserId: string
  showAbout: boolean
  showArchitecture: boolean
  viewingProfile: Profile | null
  isLoggedIn: boolean
  onSelectUser: (userId: string) => void
  onShowAbout: () => void
  onShowArchitecture: () => void
  onLogout: () => void
  onLogin: () => void
  onDeleteAccount: () => void
}

export default function UserList({
  users,
  currentUserId,
  viewingUserId,
  showAbout,
  showArchitecture,
  viewingProfile,
  isLoggedIn,
  onSelectUser,
  onShowAbout,
  onShowArchitecture,
  onLogout,
  onLogin,
  onDeleteAccount,
}: UserListProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  return (
    <>
      <aside className="w-60 bg-slate-50 border-r border-slate-200/80 flex flex-col shrink-0 h-screen">
        <div className="flex items-center justify-between px-5 py-4">
          <h1 className="text-base font-bold text-slate-800 tracking-tight">自习室</h1>
          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              登出
            </button>
          ) : (
            <button
              onClick={onLogin}
              className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
            >
              登录
            </button>
          )}
        </div>

        <div className="flex flex-col gap-0.5 px-3 flex-1 overflow-y-auto">
          {users.map(user => {
            const isViewing = user.user_id === viewingUserId && !showAbout && !showArchitecture
            const isSelf = user.user_id === currentUserId
            return (
              <button
                key={user.user_id}
                onClick={() => onSelectUser(user.user_id)}
                className={`px-3 py-2 rounded-lg text-sm text-left transition-all truncate ${
                  isViewing
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {user.name || '未命名'}
                {isSelf && <span className={isViewing ? 'text-indigo-200' : 'text-slate-400'}> (我)</span>}
              </button>
            )
          })}
          {users.length === 0 && (
            <div className="text-sm text-slate-400 py-4 text-center">
              暂无用户
            </div>
          )}
        </div>

        {viewingProfile && !showAbout && !showArchitecture && (
          <div className="border-t border-slate-200/80 px-5 py-4">
            <div className="text-[11px] text-slate-400 mb-2 font-medium uppercase tracking-wider">个人信息</div>
            <div className="text-sm font-medium text-slate-700 truncate">{viewingProfile.name || '未命名'}</div>
            {viewingProfile.education && (
              <div className="text-xs text-slate-500 mt-1">{viewingProfile.education}</div>
            )}
            {viewingProfile.bio && (
              <div className="text-xs text-slate-500 mt-1 line-clamp-2">{viewingProfile.bio}</div>
            )}
            {viewingProfile.contact_value && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded font-medium">
                  {viewingProfile.contact_type || 'wx'}
                </span>
                <span className="text-xs text-slate-500 truncate">{viewingProfile.contact_value}</span>
              </div>
            )}
          </div>
        )}

        <div className="border-t border-slate-200/80 px-3 py-2 space-y-0.5">
          <button
            onClick={onShowArchitecture}
            className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-all ${
              showArchitecture
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            }`}
          >
            架构流程图
          </button>
          <button
            onClick={onShowAbout}
            className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-all ${
              showAbout
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            }`}
          >
            开发路线图
          </button>
        </div>

        {isLoggedIn && (
          <div className="border-t border-slate-200/80 px-3 py-2">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full px-3 py-2 rounded-lg text-xs text-left text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              注销账号
            </button>
          </div>
        )}
      </aside>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-sm space-y-4 animate-scale-in" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-red-600">确认注销账号</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              注销后，你的所有数据（个人信息、学习路线、节点记录）将被永久删除，且无法恢复。
            </p>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={async () => {
                  setDeleteLoading(true)
                  await onDeleteAccount()
                  setDeleteLoading(false)
                  setShowDeleteConfirm(false)
                }}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleteLoading ? '处理中...' : '确认注销'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
