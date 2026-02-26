'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Route {
  id: string
  name: string
  order_index: number
}

interface RouteTabsProps {
  routes: Route[]
  activeRouteId: string | null
  isOwner: boolean
  onSelectRoute: (routeId: string) => void
  onRoutesChange: () => void
}

export default function RouteTabs({
  routes,
  activeRouteId,
  isOwner,
  onSelectRoute,
  onRoutesChange,
}: RouteTabsProps) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')

  const addRoute = async () => {
    if (!newName.trim()) return
    const { data, error } = await supabase
      .from('routes')
      .insert([{ name: newName.trim(), order_index: routes.length }])
      .select()
    if (error) {
      alert('创建路线失败: ' + error.message)
    } else if (data?.[0]) {
      setNewName('')
      setAdding(false)
      onRoutesChange()
      onSelectRoute(data[0].id)
    }
  }

  const deleteRoute = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('删除路线？所有节点也会一起删除。')) return
    const { error } = await supabase.from('routes').delete().eq('id', id)
    if (!error) onRoutesChange()
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {routes.map(route => (
        <button
          key={route.id}
          onClick={() => onSelectRoute(route.id)}
          className={`group inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm transition-colors ${
            activeRouteId === route.id
              ? 'bg-black text-white'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
          }`}
        >
          {route.name}
          {isOwner && (
            <span
              onClick={(e) => deleteRoute(route.id, e)}
              className={`text-xs opacity-0 group-hover:opacity-100 ml-0.5 ${
                activeRouteId === route.id
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-400 hover:text-red-500'
              }`}
            >
              ✕
            </span>
          )}
        </button>
      ))}

      {isOwner && (
        adding ? (
          <div className="inline-flex items-center gap-1">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') addRoute()
                if (e.key === 'Escape') { setAdding(false); setNewName('') }
              }}
              placeholder="路线名称"
              autoFocus
              className="px-2 py-1 border border-zinc-200 rounded text-sm w-24"
            />
            <button onClick={addRoute} className="text-sm text-zinc-600 hover:text-black">
              确定
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="px-4 py-1.5 border border-dashed border-zinc-300 rounded-full text-sm text-zinc-400 hover:text-zinc-600 hover:border-zinc-400"
          >
            + 新路线
          </button>
        )
      )}

      {routes.length === 0 && !isOwner && (
        <span className="text-sm text-zinc-400">暂无学习路线</span>
      )}
    </div>
  )
}
