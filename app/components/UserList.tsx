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
      <aside className="w-56 border-r border-zinc-200 flex flex-col shrink-0 h-screen">
        <div className="flex items-center justify-between p-4 pb-2">
          <h1 className="text-base font-bold">自习室</h1>
          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="text-xs text-zinc-400 hover:text-zinc-600"
            >
              登出
            </button>
          ) : (
            <button
              onClick={onLogin}
              className="text-xs px-2.5 py-1 bg-black text-white rounded-md hover:bg-zinc-800 transition-colors"
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
                className={`px-3 py-1.5 rounded text-sm text-left transition-colors truncate ${
                  isViewing
                    ? 'bg-black text-white'
                    : 'hover:bg-zinc-100'
                }`}
              >
                {user.name || '未命名'}
                {isSelf && ' (我)'}
              </button>
            )
          })}
          {users.length === 0 && (
            <div className="text-sm text-zinc-400 py-4 text-center">
              暂无用户
            </div>
          )}
        </div>

        {viewingProfile && !showAbout && !showArchitecture && (
          <div className="border-t border-zinc-200 px-4 py-3">
            <div className="text-xs text-zinc-400 mb-1.5">个人信息</div>
            <div className="text-sm font-medium truncate">{viewingProfile.name || '未命名'}</div>
            {viewingProfile.education && (
              <div className="text-xs text-zinc-500 mt-0.5">{viewingProfile.education}</div>
            )}
            {viewingProfile.bio && (
              <div className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{viewingProfile.bio}</div>
            )}
            {viewingProfile.contact_value && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[10px] px-1.5 py-0.5 bg-black text-white rounded">
                  {viewingProfile.contact_type || 'wx'}
                </span>
                <span className="text-xs text-zinc-600 truncate">{viewingProfile.contact_value}</span>
              </div>
            )}
          </div>
        )}

        <div className="border-t border-zinc-200 px-3 py-2 space-y-0.5">
          <button
            onClick={onShowArchitecture}
            className={`w-full px-3 py-1.5 rounded text-sm text-left transition-colors ${
              showArchitecture
                ? 'bg-black text-white'
                : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600'
            }`}
          >
            架构流程图
          </button>
          <button
            onClick={onShowAbout}
            className={`w-full px-3 py-1.5 rounded text-sm text-left transition-colors ${
              showAbout
                ? 'bg-black text-white'
                : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600'
            }`}
          >
            开发路线图
          </button>
        </div>

        {isLoggedIn && (
          <div className="border-t border-zinc-200 px-3 py-2">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full px-3 py-1.5 rounded text-xs text-left text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              注销账号
            </button>
          </div>
        )}
      </aside>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm space-y-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-red-600">确认注销账号</h2>
            <p className="text-sm text-zinc-600">
              注销后，你的所有数据（个人信息、学习路线、节点记录）将被永久删除，且无法恢复。
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-zinc-200 rounded-lg text-sm hover:bg-zinc-50"
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
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
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
