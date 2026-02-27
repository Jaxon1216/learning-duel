'use client'

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
  currentUserId: string
  viewingUserId: string
  showAbout: boolean
  viewingProfile: Profile | null
  onSelectUser: (userId: string) => void
  onShowAbout: () => void
  onLogout: () => void
}

export default function UserList({
  users,
  currentUserId,
  viewingUserId,
  showAbout,
  viewingProfile,
  onSelectUser,
  onShowAbout,
  onLogout,
}: UserListProps) {
  return (
    <aside className="w-56 border-r border-zinc-200 flex flex-col shrink-0 h-screen">
      <div className="flex items-center justify-between p-4 pb-2">
        <h1 className="text-base font-bold">自习室</h1>
        <button
          onClick={onLogout}
          className="text-xs text-zinc-400 hover:text-zinc-600"
        >
          登出
        </button>
      </div>

      <div className="flex flex-col gap-0.5 px-3 flex-1 overflow-y-auto">
        {users.map(user => {
          const isViewing = user.user_id === viewingUserId && !showAbout
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

      {viewingProfile && !showAbout && (
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

      <div className="border-t border-zinc-200 px-3 py-2">
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
    </aside>
  )
}
