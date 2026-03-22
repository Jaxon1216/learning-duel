'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface NodeInfo {
  id: string
  title: string
  order_index: number
}

interface AddNodeFormProps {
  routeId: string
  nodes: NodeInfo[]
  onNodeAdded: () => void
}

export default function AddNodeForm({ routeId, nodes, onNodeAdded }: AddNodeFormProps) {
  const [title, setTitle] = useState('')
  const [tag, setTag] = useState('')
  const [deadline, setDeadline] = useState('')
  const [insertAfter, setInsertAfter] = useState<string>('end')

  const handleSubmit = async () => {
    if (!title.trim()) return

    let newOrderIndex: number

    if (insertAfter === 'start') {
      newOrderIndex = 1
      for (const node of nodes) {
        await supabase
          .from('route_nodes')
          .update({ order_index: node.order_index + 1 })
          .eq('id', node.id)
      }
    } else if (insertAfter === 'end') {
      newOrderIndex = nodes.length > 0
        ? Math.max(...nodes.map(n => n.order_index)) + 1
        : 1
    } else {
      const afterNode = nodes.find(n => n.id === insertAfter)
      if (!afterNode) return
      newOrderIndex = afterNode.order_index + 1

      const toShift = nodes.filter(n => n.order_index > afterNode.order_index)
      for (const node of toShift) {
        await supabase
          .from('route_nodes')
          .update({ order_index: node.order_index + 1 })
          .eq('id', node.id)
      }
    }

    const { error } = await supabase.from('route_nodes').insert([{
      route_id: routeId,
      title: title.trim(),
      tag: tag.trim() || null,
      deadline: deadline || null,
      order_index: newOrderIndex,
    }])

    if (error) {
      alert('添加失败: ' + error.message)
    } else {
      setTitle('')
      setTag('')
      setDeadline('')
      setInsertAfter('end')
      onNodeAdded()
    }
  }

  return (
    <div className="mt-6 pt-5 border-t border-slate-100">
      <div className="text-sm font-medium text-slate-700 mb-3">添加学习节点</div>
      <div className="flex flex-col gap-2.5">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="节点标题（必填）"
          className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-shadow"
        />
        <div className="flex gap-2">
          <input
            value={tag}
            onChange={e => setTag(e.target.value)}
            placeholder="标签（选填）"
            className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-shadow"
          />
          <input
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-shadow"
          />
        </div>
        {nodes.length > 0 && (
          <select
            value={insertAfter}
            onChange={e => setInsertAfter(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-shadow"
          >
            <option value="end">插入到末尾</option>
            <option value="start">插入到最前面</option>
            {nodes.map(n => (
              <option key={n.id} value={n.id}>
                插入到「{n.order_index}. {n.title}」后面
              </option>
            ))}
          </select>
        )}
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium disabled:opacity-30 w-fit hover:bg-indigo-700 transition-colors"
        >
          添加节点
        </button>
      </div>
    </div>
  )
}
