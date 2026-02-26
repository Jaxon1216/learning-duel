'use client'

interface UserWithStats {
  user_id: string
  name: string | null
  total_nodes: number
  completed_nodes: number
}

interface UserListProps {
  users: UserWithStats[]
  currentUserId: string
  viewingUserId: string
  onSelectUser: (userId: string) => void
  onLogout: () => void
}

function completionRate(total: number, completed: number): string {
  if (total === 0) return '0.00'
  return ((completed / total) * 100).toFixed(2)
}

export default function UserList({
  users,
  currentUserId,
  viewingUserId,
  onSelectUser,
  onLogout,
}: UserListProps) {
  return (
    <aside className="w-56 border-r border-zinc-200 p-4 flex flex-col gap-4 shrink-0">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold">自习室</h1>
        <button
          onClick={onLogout}
          className="text-xs text-zinc-400 hover:text-zinc-600"
        >
          登出
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {users.map(user => {
          const isViewing = user.user_id === viewingUserId
          const isSelf = user.user_id === currentUserId
          const rate = completionRate(user.total_nodes, user.completed_nodes)

          return (
            <button
              key={user.user_id}
              onClick={() => onSelectUser(user.user_id)}
              className={`flex items-center justify-between px-3 py-2 rounded text-sm text-left transition-colors ${
                isViewing
                  ? 'bg-black text-white'
                  : 'hover:bg-zinc-100'
              }`}
            >
              <span className="truncate">
                {user.name || '未命名'}
                {isSelf && ' (我)'}
              </span>
              <span className={`text-xs shrink-0 ml-2 ${
                isViewing ? 'text-zinc-300' : 'text-zinc-400'
              }`}>
                {rate}%
              </span>
            </button>
          )
        })}
        {users.length === 0 && (
          <div className="text-sm text-zinc-400 py-4 text-center">
            暂无用户
          </div>
        )}
      </div>
    </aside>
  )
}
