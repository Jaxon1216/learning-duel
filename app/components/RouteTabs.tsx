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
    const maxOrder = routes.length > 0 ? Math.max(...routes.map(r => r.order_index)) + 1 : 0
    const { error } = await supabase
      .from('routes')
      .insert([{ name: newName.trim(), order_index: maxOrder }])
      .select()
    if (error) {
      alert('创建路线失败: ' + error.message)
    } else {
      setNewName('')
      setAdding(false)
      onRoutesChange()
    }
  }

  const deleteRoute = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('删除路线？所有节点也会一起删除。')) return
    const { error } = await supabase.from('routes').delete().eq('id', id)
    if (!error) onRoutesChange()
  }

  const pinRoute = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    for (const r of routes) {
      if (r.id === id) {
        await supabase.from('routes').update({ order_index: 0 }).eq('id', r.id)
      } else if (r.order_index < routes.find(x => x.id === id)!.order_index) {
        await supabase.from('routes').update({ order_index: r.order_index + 1 }).eq('id', r.id)
      }
    }
    onRoutesChange()
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
            <span className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 ml-1">
              {route.order_index !== 0 && (
                <span
                  onClick={(e) => pinRoute(route.id, e)}
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    activeRouteId === route.id
                      ? 'bg-white/20 text-white hover:bg-white/40'
                      : 'bg-zinc-200 text-zinc-500 hover:bg-zinc-300 hover:text-zinc-700'
                  }`}
                >
                  置顶
                </span>
              )}
              <span
                onClick={(e) => deleteRoute(route.id, e)}
                className={`text-xs ${
                  activeRouteId === route.id
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-zinc-400 hover:text-red-500'
                }`}
              >
                ✕
              </span>
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
