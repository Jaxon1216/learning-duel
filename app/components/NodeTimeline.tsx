'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface RouteNode {
  id: string
  title: string
  tag: string | null
  deadline: string | null
  completed: boolean
  order_index: number
}

interface NodeTimelineProps {
  nodes: RouteNode[]
  isOwner: boolean
  onNodesChange: () => void
}

function formatDeadline(deadline: string | null): string | null {
  if (!deadline) return null
  const d = new Date(deadline)
  const now = new Date()
  const diff = d.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

  const dateStr = d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  if (days < 0) return `${dateStr} (已过期)`
  if (days === 0) return `${dateStr} (今天截止)`
  return `${dateStr} (还剩${days}天)`
}

export default function NodeTimeline({ nodes, isOwner, onNodesChange }: NodeTimelineProps) {
  const toggleComplete = async (node: RouteNode) => {
    if (!isOwner) return
    const { error } = await supabase
      .from('route_nodes')
      .update({ completed: !node.completed })
      .eq('id', node.id)
    if (!error) onNodesChange()
  }

  const deleteNode = async (id: string) => {
    if (!isOwner) return
    const { error } = await supabase.from('route_nodes').delete().eq('id', id)
    if (!error) onNodesChange()
  }

  if (nodes.length === 0) {
    return (
      <div className="text-zinc-400 text-sm py-4">
        {isOwner ? '还没有学习节点，从下方开始添加' : '暂无学习节点'}
      </div>
    )
  }

  const total = nodes.length
  const completed = nodes.filter(n => n.completed).length
  const rate = total > 0 ? ((completed / total) * 100).toFixed(2) : '0.00'

  return (
    <div>
      <div className="text-sm text-zinc-500 mb-4">
        进度: {completed}/{total} ({rate}%)
      </div>

      <div className="flex flex-col">
        {nodes.map((node, i) => {
          const deadlineText = formatDeadline(node.deadline)

          return (
            <div key={node.id} className="flex gap-4 group">
              {/* Timeline dot and line */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => toggleComplete(node)}
                  disabled={!isOwner}
                  className={`w-3.5 h-3.5 rounded-full shrink-0 mt-1.5 border-2 transition-colors ${
                    node.completed
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'bg-white border-zinc-300'
                  } ${isOwner ? 'cursor-pointer hover:border-emerald-400' : ''}`}
                />
                {i < nodes.length - 1 && (
                  <div className={`w-0.5 flex-1 min-h-[40px] ${
                    node.completed ? 'bg-emerald-300' : 'bg-zinc-200'
                  }`} />
                )}
              </div>

              {/* Content */}
              <div className="pb-6 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${
                    node.completed ? 'text-emerald-700 line-through' : ''
                  }`}>
                    {node.order_index}. {node.title}
                  </span>
                  {node.tag && (
                    <span className="text-xs px-1.5 py-0.5 bg-zinc-100 rounded text-zinc-500">
                      {node.tag}
                    </span>
                  )}
                  {isOwner && (
                    <button
                      onClick={() => deleteNode(node.id)}
                      className="text-xs text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
                    >
                      删除
                    </button>
                  )}
                </div>
                {deadlineText && (
                  <div className={`text-xs mt-0.5 ${
                    node.completed ? 'text-emerald-500' : 'text-zinc-400'
                  }`}>
                    {deadlineText}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
