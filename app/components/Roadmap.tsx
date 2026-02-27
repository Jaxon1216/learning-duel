'use client'

const ROADMAP_SECTIONS = [
  {
    title: '已完成',
    items: [
      '邮箱密码注册与登录',
      '学习路线创建与管理',
      '节点添加、完成标记、删除',
      '竖向 Timeline 时间轴（绿色/灰色）',
      '截止日期与自动倒计时',
      '完成率计算（精确到两位小数）',
      '左侧用户列表 + 完成率展示',
      '查看其他用户路线（只读）',
      '宏观目标模块（最多5个）',
      '用户信息卡片（姓名、学历、简介、联系方式高亮）',
      'RLS 权限控制（只能改自己的数据）',
      '节点内联编辑',
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
      '邀请码注册机制',
      '数据导出（JSON / CSV）',
    ],
    color: 'amber',
  },
  {
    title: '远期想法',
    items: [
      '每日学习打卡记录',
      '学习时长统计',
      '路线模板分享',
      '深色模式',
      '消息通知（有人完成了节点）',
    ],
    color: 'zinc',
  },
]

export default function Roadmap() {
  return (
    <div className="max-w-2xl">
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
