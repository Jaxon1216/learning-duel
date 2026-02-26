'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface AddNodeFormProps {
  routeId: string
  currentMaxOrder: number
  onNodeAdded: () => void
}

export default function AddNodeForm({ routeId, currentMaxOrder, onNodeAdded }: AddNodeFormProps) {
  const [title, setTitle] = useState('')
  const [tag, setTag] = useState('')
  const [deadline, setDeadline] = useState('')

  const handleSubmit = async () => {
    if (!title.trim()) return

    const { error } = await supabase.from('route_nodes').insert([{
      route_id: routeId,
      title: title.trim(),
      tag: tag.trim() || null,
      deadline: deadline || null,
      order_index: currentMaxOrder + 1,
    }])

    if (error) {
      alert('添加失败: ' + error.message)
    } else {
      setTitle('')
      setTag('')
      setDeadline('')
      onNodeAdded()
    }
  }

  return (
    <div className="mt-6 p-4 border border-zinc-200 rounded-lg">
      <div className="text-sm font-medium mb-3">添加学习节点</div>
      <div className="flex flex-col gap-2">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="节点标题（必填）"
          className="px-3 py-2 border border-zinc-200 rounded text-sm"
        />
        <div className="flex gap-2">
          <input
            value={tag}
            onChange={e => setTag(e.target.value)}
            placeholder="标签（选填）"
            className="flex-1 px-3 py-2 border border-zinc-200 rounded text-sm"
          />
          <input
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            className="px-3 py-2 border border-zinc-200 rounded text-sm"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="px-4 py-2 bg-black text-white rounded text-sm disabled:opacity-30 w-fit"
        >
          添加节点
        </button>
      </div>
    </div>
  )
}
