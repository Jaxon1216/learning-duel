'use client'

const ROADMAP_SECTIONS = [
  {
    title: '已完成',
    items: [
      '邮箱密码注册登录',
      '多路线管理 + 节点增删编辑',
      '节点任意位置插入与自动排序',
      '完成状态标记 + 截止日期倒计时',
      '宏观目标（最多5个）',
      '查看他人路线（只读）',
      '个人信息编辑（弹窗）',
      '左侧栏固定 + 卡片式布局',
    ],
    color: 'emerald',
  },
  {
    title: '计划中',
    items: [
      '节点拖拽排序',
      '路线 Tab 拖拽排序',
      'UI 美化（配色、间距、动效）',
      '移动端适配',
    ],
    color: 'amber',
  },
  {
    title: '远期想法',
    items: [
      '可视化',
    ],
    color: 'zinc',
  },
]

export default function Roadmap() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">开发路线图</h2>
      <p className="text-sm text-zinc-500 mb-6">
        这是一个面向小规模用户（2-30人）的学习监督系统。
        核心理念是"被看见的压力"——所有人可以查看彼此的学习进度，但只能修改自己的数据。
      </p>

      <div className="space-y-6">
        {ROADMAP_SECTIONS.map(section => (
          <div key={section.title}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${
                section.color === 'emerald' ? 'bg-emerald-500' :
                section.color === 'amber' ? 'bg-amber-500' :
                'bg-zinc-400'
              }`} />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
                {section.title}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {section.items.map(item => (
                <div
                  key={item}
                  className={`px-3 py-2 rounded text-sm ${
                    section.color === 'emerald'
                      ? 'bg-emerald-50 text-emerald-700'
                      : section.color === 'amber'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-zinc-50 text-zinc-500'
                  }`}
                >
                  {section.color === 'emerald' && '✓ '}
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-zinc-50 rounded-lg">
        <div className="text-sm font-medium mb-1">技术栈</div>
        <div className="text-sm text-zinc-500">
          Next.js (App Router) + React + Tailwind CSS + Supabase (Auth + PostgreSQL + RLS)
        </div>
      </div>
    </div>
  )
}
