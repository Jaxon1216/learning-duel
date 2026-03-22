'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Profile {
  user_id: string
  name: string | null
  education: string | null
  bio: string | null
  contact_type: string | null
  contact_value: string | null
}

interface ProfileCardProps {
  profile: Profile
  isOwner: boolean
  onProfileChange: () => void
}

const CONTACT_TYPES = ['wx', 'qq', 'github', 'email'] as const

export default function ProfileCard({ profile, isOwner, onProfileChange }: ProfileCardProps) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: profile.name || '',
    education: profile.education || '',
    bio: profile.bio || '',
    contact_type: profile.contact_type || 'wx',
    contact_value: profile.contact_value || '',
  })

  useEffect(() => {
    setEditing(false)
    setForm({
      name: profile.name || '',
      education: profile.education || '',
      bio: profile.bio || '',
      contact_type: profile.contact_type || 'wx',
      contact_value: profile.contact_value || '',
    })
  }, [profile.user_id, profile.name, profile.education, profile.bio, profile.contact_type, profile.contact_value])

  const save = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({
        name: form.name.trim() || null,
        education: form.education.trim() || null,
        bio: form.bio.trim() || null,
        contact_type: form.contact_type,
        contact_value: form.contact_value.trim() || null,
      })
      .eq('user_id', profile.user_id)

    if (error) {
      alert('保存失败: ' + error.message)
    } else {
      setEditing(false)
      onProfileChange()
    }
  }

  if (!isOwner) return null

  return (
    <>
      <button
        onClick={() => setEditing(true)}
        className="text-xs text-slate-400 hover:text-indigo-600 transition-colors"
      >
        编辑资料
      </button>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setEditing(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-md space-y-4 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="text-lg font-semibold text-slate-800">编辑个人信息</div>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="姓名"
              autoFocus
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-shadow"
            />
            <input
              value={form.education}
              onChange={e => setForm(f => ({ ...f, education: e.target.value }))}
              placeholder="学历 / 学校"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-shadow"
            />
            <input
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="一句话简介"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-shadow"
            />
            <div className="flex gap-2 items-center">
              <div className="flex gap-1">
                {CONTACT_TYPES.map(ct => (
                  <button
                    key={ct}
                    onClick={() => setForm(f => ({ ...f, contact_type: ct }))}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      form.contact_type === ct
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {ct}
                  </button>
                ))}
              </div>
              <input
                value={form.contact_value}
                onChange={e => setForm(f => ({ ...f, contact_value: e.target.value }))}
                placeholder="联系方式"
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-shadow"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={save} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                保存
              </button>
              <button onClick={() => setEditing(false)} className="px-5 py-2.5 text-slate-500 text-sm hover:text-slate-700 transition-colors">
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
