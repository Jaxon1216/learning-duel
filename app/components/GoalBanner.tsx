'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Goal {
  id: string
  title: string
  order_index: number
}

interface GoalBannerProps {
  goals: Goal[]
  isOwner: boolean
  onGoalsChange: () => void
}

export default function GoalBanner({ goals, isOwner, onGoalsChange }: GoalBannerProps) {
  const [newTitle, setNewTitle] = useState('')
  const [adding, setAdding] = useState(false)

  const addGoal = async () => {
    if (!newTitle.trim() || goals.length >= 5) return
    const { error } = await supabase
      .from('goals')
      .insert([{ title: newTitle.trim(), order_index: goals.length }])
    if (error) {
      alert('添加失败: ' + error.message)
    } else {
      setNewTitle('')
      setAdding(false)
      onGoalsChange()
    }
  }

  const removeGoal = async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id)
    if (!error) onGoalsChange()
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {goals.map(goal => (
        <span
          key={goal.id}
          className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-100 rounded-full text-sm"
        >
          {goal.title}
          {isOwner && (
            <button
              onClick={() => removeGoal(goal.id)}
              className="text-zinc-400 hover:text-red-500 text-xs ml-1"
            >
              ✕
            </button>
          )}
        </span>
      ))}

      {isOwner && goals.length < 5 && (
        adding ? (
          <div className="inline-flex items-center gap-1">
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') addGoal()
                if (e.key === 'Escape') { setAdding(false); setNewTitle('') }
              }}
              placeholder="目标名称"
              autoFocus
              className="px-2 py-1 border border-zinc-200 rounded text-sm w-32"
            />
            <button onClick={addGoal} className="text-sm text-zinc-600 hover:text-black">
              确定
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="px-3 py-1 border border-dashed border-zinc-300 rounded-full text-sm text-zinc-400 hover:text-zinc-600 hover:border-zinc-400"
          >
            + 添加目标
          </button>
        )
      )}

      {goals.length === 0 && !isOwner && (
        <span className="text-sm text-zinc-400">暂无宏观目标</span>
      )}
    </div>
  )
}
