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

  if (editing) {
    return (
      <div className="p-4 border border-zinc-200 rounded-lg space-y-3">
        <div className="text-sm font-medium">编辑个人信息</div>
        <input
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="姓名"
          className="w-full px-3 py-2 border border-zinc-200 rounded text-sm"
        />
        <input
          value={form.education}
          onChange={e => setForm(f => ({ ...f, education: e.target.value }))}
          placeholder="学历"
          className="w-full px-3 py-2 border border-zinc-200 rounded text-sm"
        />
        <input
          value={form.bio}
          onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
          placeholder="一句话简介"
          className="w-full px-3 py-2 border border-zinc-200 rounded text-sm"
        />
        <div className="flex gap-2 items-center">
          <div className="flex gap-1">
            {CONTACT_TYPES.map(ct => (
              <button
                key={ct}
                onClick={() => setForm(f => ({ ...f, contact_type: ct }))}
                className={`px-2 py-1 rounded text-xs ${
                  form.contact_type === ct
                    ? 'bg-black text-white'
                    : 'bg-zinc-100 text-zinc-500'
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
            className="flex-1 px-3 py-2 border border-zinc-200 rounded text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={save} className="px-3 py-1.5 bg-black text-white rounded text-sm">
            保存
          </button>
          <button onClick={() => setEditing(false)} className="px-3 py-1.5 text-zinc-500 text-sm">
            取消
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 border border-zinc-200 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">{profile.name || '未命名'}</div>
        {isOwner && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-zinc-400 hover:text-zinc-600"
          >
            编辑
          </button>
        )}
      </div>

      {profile.education && (
        <div className="text-sm text-zinc-500">{profile.education}</div>
      )}
      {profile.bio && (
        <div className="text-sm text-zinc-600 mt-1">{profile.bio}</div>
      )}
      {profile.contact_value && (
        <div className="flex items-center gap-2 mt-2">
          {CONTACT_TYPES.map(ct => (
            <span
              key={ct}
              className={`px-2 py-0.5 rounded text-xs ${
                profile.contact_type === ct
                  ? 'bg-black text-white'
                  : 'bg-zinc-50 text-zinc-300'
              }`}
            >
              {ct}
            </span>
          ))}
          <span className="text-sm text-zinc-600">{profile.contact_value}</span>
        </div>
      )}

      {!profile.education && !profile.bio && !profile.contact_value && !isOwner && (
        <div className="text-sm text-zinc-400">该用户还没有填写个人信息</div>
      )}
      {!profile.education && !profile.bio && !profile.contact_value && isOwner && (
        <div className="text-sm text-zinc-400">
          点击右上角"编辑"填写你的信息
        </div>
      )}
    </div>
  )
}
