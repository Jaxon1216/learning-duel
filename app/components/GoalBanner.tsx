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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
        >
          {goal.title}
          {isOwner && (
            <button
              onClick={() => removeGoal(goal.id)}
              className="text-indigo-300 hover:text-red-500 text-xs ml-0.5 transition-colors"
            >
              ✕
            </button>
          )}
        </span>
      ))}

      {isOwner && goals.length < 5 && (
        adding ? (
          <div className="inline-flex items-center gap-1.5">
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') addGoal()
                if (e.key === 'Escape') { setAdding(false); setNewTitle('') }
              }}
              placeholder="目标名称"
              autoFocus
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm w-32 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-shadow"
            />
            <button onClick={addGoal} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
              确定
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="px-3 py-1.5 border border-dashed border-slate-300 rounded-full text-sm text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
          >
            + 添加目标
          </button>
        )
      )}

      {goals.length === 0 && !isOwner && (
        <span className="text-sm text-slate-400">暂无宏观目标</span>
      )}
    </div>
  )
}
