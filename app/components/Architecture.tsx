'use client'

import { useState } from 'react'

type Tab = 'overview' | 'dataflow' | 'components' | 'db' | 'gantt'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: '整体架构' },
  { id: 'dataflow', label: '数据流向' },
  { id: 'components', label: '组件关系' },
  { id: 'db', label: '数据库设计' },
  { id: 'gantt', label: '交互时序' },
]

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-zinc-700 mb-3">{children}</h3>
}

function Box({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-zinc-200 rounded-lg px-3 py-2 text-xs ${className}`}>
      {children}
    </div>
  )
}

function Arrow({ label, direction = 'down' }: { label?: string; direction?: 'down' | 'right' | 'both' }) {
  if (direction === 'right') {
    return (
      <div className="flex items-center gap-1 px-2 shrink-0">
        <div className="w-6 h-px bg-zinc-300" />
        <span className="text-[10px] text-zinc-400">{label}</span>
        <div className="w-0 h-0 border-l-4 border-l-zinc-300 border-y-[3px] border-y-transparent" />
      </div>
    )
  }
  if (direction === 'both') {
    return (
      <div className="flex flex-col items-center py-1">
        <div className="w-0 h-0 border-b-4 border-b-zinc-300 border-x-[3px] border-x-transparent" />
        <div className="w-px h-3 bg-zinc-300" />
        {label && <span className="text-[10px] text-zinc-400 my-0.5">{label}</span>}
        <div className="w-px h-3 bg-zinc-300" />
        <div className="w-0 h-0 border-t-4 border-t-zinc-300 border-x-[3px] border-x-transparent" />
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-4 bg-zinc-300" />
      {label && <span className="text-[10px] text-zinc-400 my-0.5">{label}</span>}
      <div className="w-0 h-0 border-t-4 border-t-zinc-300 border-x-[3px] border-x-transparent" />
    </div>
  )
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>技术栈一览（Vue 开发者对照）</SectionTitle>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <Box className="bg-zinc-50 font-medium text-zinc-500">概念</Box>
          <Box className="bg-zinc-50 font-medium text-zinc-500">Vue 生态</Box>
          <Box className="bg-zinc-50 font-medium text-zinc-500">本项目</Box>

          <Box>前端框架</Box>
          <Box>Vue 3</Box>
          <Box className="bg-blue-50 text-blue-700">React 19</Box>

          <Box>路由</Box>
          <Box>Vue Router</Box>
          <Box className="bg-blue-50 text-blue-700">Next.js App Router（文件系统路由）</Box>

          <Box>状态管理</Box>
          <Box>Pinia / Vuex</Box>
          <Box className="bg-blue-50 text-blue-700">React useState + props 传递</Box>

          <Box>样式方案</Box>
          <Box>Scoped CSS / UnoCSS</Box>
          <Box className="bg-blue-50 text-blue-700">Tailwind CSS v4</Box>

          <Box>后端 / API</Box>
          <Box>Express / Koa / 独立后端</Box>
          <Box className="bg-blue-50 text-blue-700">Next.js API Routes + Supabase</Box>

          <Box>数据库</Box>
          <Box>MySQL / MongoDB</Box>
          <Box className="bg-blue-50 text-blue-700">Supabase (PostgreSQL + RLS)</Box>

          <Box>用户认证</Box>
          <Box>手写 JWT / Passport</Box>
          <Box className="bg-blue-50 text-blue-700">Supabase Auth（内置）</Box>

          <Box>部署</Box>
          <Box>Nginx + PM2</Box>
          <Box className="bg-blue-50 text-blue-700">Vercel（零配置）</Box>
        </div>
      </div>

      <div>
        <SectionTitle>整体架构图</SectionTitle>
        <div className="flex flex-col items-center">
          <Box className="bg-emerald-50 text-emerald-700 font-medium w-64 text-center">
            用户浏览器
          </Box>
          <Arrow label="HTTPS 请求" />
          <Box className="bg-blue-50 text-blue-700 font-medium w-64 text-center">
            Vercel（托管 Next.js 应用）
          </Box>
          <div className="flex items-start gap-4 mt-1">
            <div className="flex flex-col items-center">
              <Arrow label="SSR / 静态页面" />
              <Box className="bg-violet-50 text-violet-700 w-44 text-center">
                Next.js 前端<br />React 组件 + Tailwind
              </Box>
            </div>
            <div className="flex flex-col items-center">
              <Arrow label="API Route" />
              <Box className="bg-amber-50 text-amber-700 w-44 text-center">
                Next.js 服务端<br />app/api/* (注销等)
              </Box>
            </div>
          </div>
          <Arrow label="Supabase JS SDK" />
          <Box className="bg-orange-50 text-orange-700 font-medium w-64 text-center">
            Supabase 云服务
          </Box>
          <div className="flex items-start gap-4 mt-1">
            <div className="flex flex-col items-center">
              <Arrow />
              <Box className="bg-rose-50 text-rose-700 w-36 text-center">Auth 认证</Box>
            </div>
            <div className="flex flex-col items-center">
              <Arrow />
              <Box className="bg-cyan-50 text-cyan-700 w-36 text-center">PostgreSQL</Box>
            </div>
            <div className="flex flex-col items-center">
              <Arrow />
              <Box className="bg-lime-50 text-lime-700 w-36 text-center">RLS 权限控制</Box>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-zinc-50 rounded-lg text-xs text-zinc-600 space-y-1">
        <div className="font-medium text-zinc-700">Vue 开发者理解要点</div>
        <ul className="list-disc pl-4 space-y-0.5">
          <li><b>没有独立后端</b>：Supabase 直接充当后端，前端通过 SDK 调用数据库，RLS 保证安全</li>
          <li><b>没有 Vue Router</b>：Next.js 用文件夹结构自动生成路由，本项目只有一个页面 <code className="bg-zinc-200 px-1 rounded">app/page.tsx</code></li>
          <li><b>没有 Pinia</b>：状态全部用 React 的 <code className="bg-zinc-200 px-1 rounded">useState</code> 管理，通过 props 传给子组件</li>
          <li><b>&apos;use client&apos;</b>：Next.js 默认组件是服务端渲染的，加了这个标记才能用 useState 等客户端 API</li>
        </ul>
      </div>
    </div>
  )
}

function DataflowTab() {
  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>用户登录流程</SectionTitle>
        <div className="flex flex-col items-center">
          <Box className="w-56 text-center">用户输入邮箱 + 密码</Box>
          <Arrow label="supabase.auth.signInWithPassword()" />
          <Box className="w-56 text-center bg-orange-50 text-orange-700">Supabase Auth 验证</Box>
          <Arrow label="返回 session (含 access_token)" />
          <Box className="w-56 text-center bg-blue-50 text-blue-700">前端保存 session 到 state</Box>
          <Arrow label="onAuthStateChange 触发" />
          <Box className="w-56 text-center bg-emerald-50 text-emerald-700">自动加载用户数据</Box>
        </div>
      </div>

      <div>
        <SectionTitle>数据读取流程（以加载学习节点为例）</SectionTitle>
        <div className="flex items-start justify-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <Box className="bg-violet-50 text-violet-700 w-40 text-center text-[11px]">
              page.tsx<br/>
              <code>fetchNodes(routeId)</code>
            </Box>
            <Arrow label="supabase.from('route_nodes').select()" />
            <Box className="bg-orange-50 text-orange-700 w-40 text-center text-[11px]">
              Supabase<br/>
              执行 SQL + RLS 检查
            </Box>
            <Arrow label="返回 JSON 数据" />
            <Box className="bg-blue-50 text-blue-700 w-40 text-center text-[11px]">
              setNodes(data)<br/>
              触发 React 重渲染
            </Box>
            <Arrow label="props 传递" />
            <Box className="bg-emerald-50 text-emerald-700 w-40 text-center text-[11px]">
              NodeTimeline 组件<br/>
              渲染节点列表
            </Box>
          </div>
          <div className="mt-8 w-52">
            <div className="text-[11px] text-zinc-500 p-3 bg-zinc-50 rounded-lg space-y-1">
              <div className="font-medium text-zinc-600">Vue 对照</div>
              <div>• <code className="bg-zinc-200 px-1 rounded">supabase.from()</code> ≈ <code className="bg-zinc-200 px-1 rounded">axios.get()</code></div>
              <div>• <code className="bg-zinc-200 px-1 rounded">setNodes()</code> ≈ <code className="bg-zinc-200 px-1 rounded">nodes.value = data</code></div>
              <div>• props 传递 ≈ Vue 的 <code className="bg-zinc-200 px-1 rounded">:nodes=&quot;nodes&quot;</code></div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <SectionTitle>数据写入流程（以新增节点为例）</SectionTitle>
        <div className="flex flex-col items-center">
          <Box className="w-64 text-center text-[11px]">
            AddNodeForm 组件：用户填写标题、标签、截止日期
          </Box>
          <Arrow label="supabase.from('route_nodes').insert()" />
          <Box className="w-64 text-center bg-orange-50 text-orange-700 text-[11px]">
            Supabase 执行 RLS 检查：<br/>
            该 route 的 user_id === 当前登录用户？
          </Box>
          <div className="flex gap-12 mt-1">
            <div className="flex flex-col items-center">
              <Arrow label="通过" />
              <Box className="bg-emerald-50 text-emerald-700 w-28 text-center">写入成功</Box>
              <Arrow label="回调 onNodeAdded()" />
              <Box className="bg-blue-50 text-blue-700 w-28 text-center text-[11px]">重新 fetch<br/>刷新列表</Box>
            </div>
            <div className="flex flex-col items-center">
              <Arrow label="拒绝" />
              <Box className="bg-red-50 text-red-600 w-28 text-center">权限不足</Box>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-zinc-50 rounded-lg text-xs text-zinc-600 space-y-1">
        <div className="font-medium text-zinc-700">关键理解</div>
        <ul className="list-disc pl-4 space-y-0.5">
          <li><b>没有 Vuex/Pinia 全局 store</b>：所有数据在 page.tsx 中用 useState 管理，通过 props 向下传递</li>
          <li><b>RLS 是安全核心</b>：即使有人篡改前端代码，数据库层面也会拒绝越权操作</li>
          <li><b>乐观更新 vs 重新 fetch</b>：本项目采用简单策略——写入成功后重新 fetch 最新数据</li>
        </ul>
      </div>
    </div>
  )
}

function ComponentsTab() {
  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>组件树</SectionTitle>
        <div className="text-xs font-mono bg-zinc-50 rounded-lg p-4 leading-relaxed">
          <div className="text-zinc-400">{'// app/layout.tsx'}</div>
          <div><span className="text-violet-600">RootLayout</span></div>
          <div className="pl-4"><span className="text-violet-600">└─ Home</span> <span className="text-zinc-400">(app/page.tsx) — 唯一页面，管理所有状态</span></div>
          <div className="pl-8"><span className="text-blue-600">├─ UserList</span> <span className="text-zinc-400">— 左侧栏：用户列表 + 个人信息 + 导航按钮</span></div>
          <div className="pl-8"><span className="text-emerald-600">├─ Architecture</span> <span className="text-zinc-400">— 架构流程图（本页面）</span></div>
          <div className="pl-8"><span className="text-emerald-600">├─ Roadmap</span> <span className="text-zinc-400">— 开发路线图</span></div>
          <div className="pl-8"><span className="text-amber-600">└─ [主内容区]</span></div>
          <div className="pl-12"><span className="text-rose-600">├─ ProfileCard</span> <span className="text-zinc-400">— 编辑个人信息弹窗</span></div>
          <div className="pl-12"><span className="text-rose-600">├─ GoalBanner</span> <span className="text-zinc-400">— 宏观目标（最多5个）</span></div>
          <div className="pl-12"><span className="text-rose-600">├─ RouteTabs</span> <span className="text-zinc-400">— 学习路线标签页（增删切换）</span></div>
          <div className="pl-12"><span className="text-rose-600">├─ NodeTimeline</span> <span className="text-zinc-400">— 节点时间线（完成/删除/编辑）</span></div>
          <div className="pl-12"><span className="text-rose-600">└─ AddNodeForm</span> <span className="text-zinc-400">— 新增节点表单（支持插入位置）</span></div>
        </div>
      </div>

      <div>
        <SectionTitle>各组件职责与数据流</SectionTitle>
        <div className="space-y-2">
          {[
            {
              name: 'page.tsx (Home)',
              role: '「大脑」',
              desc: '管理所有状态（session, users, goals, routes, nodes, profile）。所有数据获取函数（fetchUsers, fetchGoals 等）都在这里定义，通过 props + 回调传给子组件。',
              vue: '相当于 Vue 中 App.vue + Pinia store 的合体',
              color: 'violet',
            },
            {
              name: 'UserList',
              role: '「导航器」',
              desc: '展示用户列表，切换查看对象。包含登录/登出/注销按钮。底部有架构图和路线图的导航入口。',
              vue: '相当于 Vue 中的侧边栏 + 路由导航',
              color: 'blue',
            },
            {
              name: 'GoalBanner',
              role: '「目标展板」',
              desc: '显示/编辑宏观目标。isOwner 为 true 时可增删，否则只读。',
              vue: '相当于一个有 v-if="isOwner" 控制的 Vue 组件',
              color: 'rose',
            },
            {
              name: 'RouteTabs',
              role: '「路线标签页」',
              desc: '横向标签切换不同学习路线。支持新增和删除路线。',
              vue: '类似 el-tabs 组件',
              color: 'rose',
            },
            {
              name: 'NodeTimeline',
              role: '「节点列表」',
              desc: '纵向展示某条路线下的所有学习节点。支持标记完成、编辑、删除。',
              vue: '类似 v-for 渲染的列表组件',
              color: 'rose',
            },
            {
              name: 'AddNodeForm',
              role: '「添加器」',
              desc: '表单组件，填写节点信息后插入到指定位置。写入成功后调用 onNodeAdded 回调通知父组件刷新。',
              vue: '类似带 $emit 的表单子组件',
              color: 'rose',
            },
          ].map(c => (
            <div key={c.name} className={`border rounded-lg px-4 py-3 ${
              c.color === 'violet' ? 'border-violet-200 bg-violet-50/50' :
              c.color === 'blue' ? 'border-blue-200 bg-blue-50/50' :
              'border-rose-200 bg-rose-50/50'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-semibold ${
                  c.color === 'violet' ? 'text-violet-700' :
                  c.color === 'blue' ? 'text-blue-700' :
                  'text-rose-700'
                }`}>{c.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-white rounded border border-zinc-200 text-zinc-500">{c.role}</span>
              </div>
              <div className="text-xs text-zinc-600">{c.desc}</div>
              <div className="text-[11px] text-zinc-400 mt-1 italic">Vue 类比：{c.vue}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-zinc-50 rounded-lg text-xs text-zinc-600 space-y-1">
        <div className="font-medium text-zinc-700">React vs Vue 组件通信对照</div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Box className="bg-white">
            <div className="font-medium mb-1">Vue 方式</div>
            <code className="text-[10px]">:goals=&quot;goals&quot;</code> → 传值<br/>
            <code className="text-[10px]">@update=&quot;handleUpdate&quot;</code> → 回调
          </Box>
          <Box className="bg-white">
            <div className="font-medium mb-1">React 方式（本项目）</div>
            <code className="text-[10px]">goals={'{goals}'}</code> → 传值<br/>
            <code className="text-[10px]">onGoalsChange={'{() => fetch()}'}</code> → 回调
          </Box>
        </div>
      </div>
    </div>
  )
}

function DbTab() {
  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>数据库表关系</SectionTitle>
        <div className="flex flex-col items-center">
          <Box className="bg-orange-50 text-orange-700 font-medium w-56 text-center">
            auth.users<br/>
            <span className="font-normal text-[10px]">Supabase 内置用户表（id, email）</span>
          </Box>
          <div className="flex items-start gap-6 mt-1">
            <div className="flex flex-col items-center">
              <Arrow label="1:1" />
              <Box className="bg-cyan-50 text-cyan-700 w-40 text-center">
                <div className="font-medium">profiles</div>
                <div className="text-[10px] text-left mt-1 space-y-px">
                  <div>user_id (PK, FK)</div>
                  <div>name</div>
                  <div>education</div>
                  <div>bio</div>
                  <div>contact_type</div>
                  <div>contact_value</div>
                </div>
              </Box>
            </div>
            <div className="flex flex-col items-center">
              <Arrow label="1:N" />
              <Box className="bg-cyan-50 text-cyan-700 w-40 text-center">
                <div className="font-medium">goals</div>
                <div className="text-[10px] text-left mt-1 space-y-px">
                  <div>id (PK)</div>
                  <div>user_id (FK)</div>
                  <div>title</div>
                  <div>order_index</div>
                </div>
              </Box>
            </div>
            <div className="flex flex-col items-center">
              <Arrow label="1:N" />
              <Box className="bg-cyan-50 text-cyan-700 w-40 text-center">
                <div className="font-medium">routes</div>
                <div className="text-[10px] text-left mt-1 space-y-px">
                  <div>id (PK)</div>
                  <div>user_id (FK)</div>
                  <div>name</div>
                  <div>order_index</div>
                </div>
              </Box>
              <Arrow label="1:N" />
              <Box className="bg-violet-50 text-violet-700 w-40 text-center">
                <div className="font-medium">route_nodes</div>
                <div className="text-[10px] text-left mt-1 space-y-px">
                  <div>id (PK)</div>
                  <div>route_id (FK)</div>
                  <div>title</div>
                  <div>tag</div>
                  <div>deadline</div>
                  <div>completed</div>
                  <div>order_index</div>
                </div>
              </Box>
            </div>
          </div>
        </div>
      </div>

      <div>
        <SectionTitle>RLS（行级安全）策略</SectionTitle>
        <p className="text-xs text-zinc-500 mb-3">
          RLS 是 Supabase 的核心安全机制。相当于在数据库层面自动执行权限校验，即使有人绕过前端直接调 API，也无法越权操作。
        </p>
        <div className="space-y-2">
          <Box className="bg-emerald-50">
            <div className="font-medium text-emerald-700 mb-1">SELECT — 所有人可读</div>
            <div className="text-zinc-600">任何人（包括未登录）都可以查看所有用户的数据。这是"被看见的压力"的基础。</div>
          </Box>
          <Box className="bg-amber-50">
            <div className="font-medium text-amber-700 mb-1">INSERT / UPDATE / DELETE — 仅限本人</div>
            <div className="text-zinc-600">
              <code className="bg-zinc-200 px-1 rounded">auth.uid() = user_id</code>：只有数据的所有者才能修改。<br/>
              route_nodes 特殊处理：通过 <code className="bg-zinc-200 px-1 rounded">EXISTS (SELECT 1 FROM routes WHERE ...)</code> 间接检查所有权。
            </div>
          </Box>
          <Box className="bg-red-50">
            <div className="font-medium text-red-600 mb-1">ON DELETE CASCADE — 级联删除</div>
            <div className="text-zinc-600">
              删除用户 → 自动删除 profiles、goals、routes → 自动删除 route_nodes。注销账号时不需要手动清理数据。
            </div>
          </Box>
        </div>
      </div>

      <div className="p-4 bg-zinc-50 rounded-lg text-xs text-zinc-600 space-y-1">
        <div className="font-medium text-zinc-700">Vue 开发者理解要点</div>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>传统 Vue 项目：后端写中间件校验 token → 手动查询权限 → 才执行 SQL</li>
          <li>Supabase 项目：SDK 自动携带 token → 数据库 RLS 自动校验权限 → 省去后端中间件</li>
          <li>trade-off：简单高效，但复杂权限逻辑不如自定义后端灵活</li>
        </ul>
      </div>
    </div>
  )
}

const LANES = [
  { id: 'user', label: '用户操作', color: 'bg-emerald-500' },
  { id: 'react', label: 'React 前端', color: 'bg-blue-500' },
  { id: 'supabase', label: 'Supabase', color: 'bg-orange-500' },
  { id: 'db', label: 'PostgreSQL', color: 'bg-cyan-500' },
] as const

type LaneId = typeof LANES[number]['id']

interface GanttStep {
  lane: LaneId
  label: string
  span: number
  offset: number
  color: string
}

interface GanttScenario {
  title: string
  desc: string
  totalCols: number
  steps: GanttStep[]
}

const SCENARIOS: GanttScenario[] = [
  {
    title: '场景一：用户添加学习节点',
    desc: '用户在 AddNodeForm 填写信息 → 点击添加 → 数据写入 → 列表刷新',
    totalCols: 12,
    steps: [
      { lane: 'user', label: '填写标题/标签/截止日期', span: 3, offset: 0, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
      { lane: 'user', label: '点击「添加」', span: 1, offset: 3, color: 'bg-emerald-200 text-emerald-800 border-emerald-300' },
      { lane: 'react', label: 'AddNodeForm 调用 supabase.insert()', span: 2, offset: 4, color: 'bg-blue-100 text-blue-700 border-blue-200' },
      { lane: 'supabase', label: 'RLS 检查：route 属于当前用户？', span: 2, offset: 5, color: 'bg-orange-100 text-orange-700 border-orange-200' },
      { lane: 'db', label: 'INSERT INTO route_nodes', span: 2, offset: 6, color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
      { lane: 'supabase', label: '返回成功', span: 1, offset: 8, color: 'bg-orange-100 text-orange-700 border-orange-200' },
      { lane: 'react', label: '回调 onNodeAdded() → fetchNodes()', span: 2, offset: 8, color: 'bg-blue-100 text-blue-700 border-blue-200' },
      { lane: 'supabase', label: 'SELECT * FROM route_nodes', span: 2, offset: 9, color: 'bg-orange-100 text-orange-700 border-orange-200' },
      { lane: 'react', label: 'setNodes() → 重渲染 NodeTimeline', span: 2, offset: 10, color: 'bg-blue-200 text-blue-800 border-blue-300' },
      { lane: 'user', label: '看到新节点出现在列表中', span: 2, offset: 11, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    ],
  },
  {
    title: '场景二：用户登录',
    desc: '输入邮箱密码 → Supabase 验证 → 返回 session → 自动加载数据',
    totalCols: 10,
    steps: [
      { lane: 'user', label: '输入邮箱 + 密码', span: 2, offset: 0, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
      { lane: 'user', label: '点击「登录」', span: 1, offset: 2, color: 'bg-emerald-200 text-emerald-800 border-emerald-300' },
      { lane: 'react', label: 'signInWithPassword()', span: 1, offset: 3, color: 'bg-blue-100 text-blue-700 border-blue-200' },
      { lane: 'supabase', label: '验证邮箱密码', span: 2, offset: 3, color: 'bg-orange-100 text-orange-700 border-orange-200' },
      { lane: 'supabase', label: '返回 session + token', span: 1, offset: 5, color: 'bg-orange-200 text-orange-800 border-orange-300' },
      { lane: 'react', label: 'setSession() → onAuthStateChange', span: 2, offset: 5, color: 'bg-blue-100 text-blue-700 border-blue-200' },
      { lane: 'react', label: 'fetchUsers() + fetchGoals() + ...', span: 2, offset: 7, color: 'bg-blue-200 text-blue-800 border-blue-300' },
      { lane: 'supabase', label: '批量查询用户数据', span: 2, offset: 7, color: 'bg-orange-100 text-orange-700 border-orange-200' },
      { lane: 'db', label: 'SELECT（RLS: 全部可读）', span: 2, offset: 7, color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
      { lane: 'user', label: '看到自己的学习空间', span: 2, offset: 9, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    ],
  },
  {
    title: '场景三：标记节点完成',
    desc: '点击节点的完成按钮 → 更新数据库 → UI 即时反馈',
    totalCols: 9,
    steps: [
      { lane: 'user', label: '点击节点「完成」按钮', span: 1, offset: 0, color: 'bg-emerald-200 text-emerald-800 border-emerald-300' },
      { lane: 'react', label: 'NodeTimeline 调用 supabase.update()', span: 2, offset: 1, color: 'bg-blue-100 text-blue-700 border-blue-200' },
      { lane: 'supabase', label: 'RLS: route.user_id = auth.uid()?', span: 2, offset: 2, color: 'bg-orange-100 text-orange-700 border-orange-200' },
      { lane: 'db', label: 'UPDATE route_nodes SET completed=true', span: 2, offset: 3, color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
      { lane: 'supabase', label: '返回成功', span: 1, offset: 5, color: 'bg-orange-100 text-orange-700 border-orange-200' },
      { lane: 'react', label: '回调 onNodesChange() → fetchNodes()', span: 2, offset: 5, color: 'bg-blue-100 text-blue-700 border-blue-200' },
      { lane: 'react', label: 'fetchUsers() 更新完成数统计', span: 2, offset: 6, color: 'bg-blue-200 text-blue-800 border-blue-300' },
      { lane: 'user', label: '节点显示 ✓，左栏统计更新', span: 2, offset: 7, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    ],
  },
  {
    title: '场景四：查看他人学习空间',
    desc: '点击左侧用户名 → 加载该用户的数据 → 只读展示',
    totalCols: 8,
    steps: [
      { lane: 'user', label: '点击左侧某用户名', span: 1, offset: 0, color: 'bg-emerald-200 text-emerald-800 border-emerald-300' },
      { lane: 'react', label: 'setViewingUserId() 切换查看对象', span: 1, offset: 1, color: 'bg-blue-100 text-blue-700 border-blue-200' },
      { lane: 'react', label: 'useEffect 触发 fetchGoals/Routes/Profile', span: 2, offset: 2, color: 'bg-blue-200 text-blue-800 border-blue-300' },
      { lane: 'supabase', label: 'SELECT（RLS: 所有人可读）', span: 2, offset: 3, color: 'bg-orange-100 text-orange-700 border-orange-200' },
      { lane: 'db', label: '查询该用户的 goals/routes/nodes', span: 2, offset: 3, color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
      { lane: 'react', label: 'isOwner=false → 隐藏编辑按钮', span: 2, offset: 5, color: 'bg-blue-100 text-blue-700 border-blue-200' },
      { lane: 'user', label: '看到对方数据，无法修改', span: 2, offset: 6, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    ],
  },
  {
    title: '场景五：注销账号',
    desc: '点击注销 → 二次确认 → 调用服务端 API → 删除用户 → 级联清除所有数据',
    totalCols: 11,
    steps: [
      { lane: 'user', label: '点击「注销账号」', span: 1, offset: 0, color: 'bg-red-200 text-red-800 border-red-300' },
      { lane: 'react', label: '弹出确认弹窗', span: 1, offset: 1, color: 'bg-blue-100 text-blue-700 border-blue-200' },
      { lane: 'user', label: '点击「确认注销」', span: 1, offset: 2, color: 'bg-red-200 text-red-800 border-red-300' },
      { lane: 'react', label: 'fetch(/api/delete-account) + Bearer token', span: 2, offset: 3, color: 'bg-blue-100 text-blue-700 border-blue-200' },
      { lane: 'supabase', label: 'API Route 用 service_role 验证 token', span: 2, offset: 4, color: 'bg-amber-100 text-amber-700 border-amber-200' },
      { lane: 'supabase', label: 'admin.deleteUser()', span: 2, offset: 6, color: 'bg-orange-200 text-orange-800 border-orange-300' },
      { lane: 'db', label: 'DELETE auth.users → CASCADE 全部关联数据', span: 2, offset: 7, color: 'bg-red-100 text-red-700 border-red-200' },
      { lane: 'react', label: 'signOut() → 清空 state → fetchUsers()', span: 2, offset: 8, color: 'bg-blue-200 text-blue-800 border-blue-300' },
      { lane: 'user', label: '回到未登录状态', span: 2, offset: 10, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    ],
  },
]

function GanttChart({ scenario }: { scenario: GanttScenario }) {
  return (
    <div className="border border-zinc-200 rounded-lg overflow-hidden">
      <div className="bg-zinc-50 px-4 py-2 border-b border-zinc-200">
        <div className="text-sm font-medium">{scenario.title}</div>
        <div className="text-[11px] text-zinc-500">{scenario.desc}</div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {LANES.map(lane => {
            const laneSteps = scenario.steps.filter(s => s.lane === lane.id)
            return (
              <div key={lane.id} className="flex items-center border-b border-zinc-100 last:border-b-0">
                <div className="w-24 shrink-0 px-3 py-2 text-[11px] text-zinc-500 font-medium flex items-center gap-1.5 border-r border-zinc-100">
                  <div className={`w-2 h-2 rounded-full ${lane.color}`} />
                  {lane.label}
                </div>
                <div className="flex-1 relative h-10">
                  <div
                    className="absolute inset-0 flex"
                    style={{ display: 'grid', gridTemplateColumns: `repeat(${scenario.totalCols}, 1fr)` }}
                  >
                    {Array.from({ length: scenario.totalCols }).map((_, i) => (
                      <div key={i} className="border-r border-zinc-50" />
                    ))}
                  </div>
                  {laneSteps.map((step, i) => (
                    <div
                      key={i}
                      className={`absolute top-1 bottom-1 rounded border text-[10px] leading-tight flex items-center px-1.5 overflow-hidden ${step.color}`}
                      style={{
                        left: `${(step.offset / scenario.totalCols) * 100}%`,
                        width: `${(step.span / scenario.totalCols) * 100}%`,
                      }}
                    >
                      <span className="truncate">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="bg-zinc-50 px-4 py-1.5 border-t border-zinc-100 flex items-center gap-1">
        <span className="text-[10px] text-zinc-400">时间 →</span>
        <div className="flex-1 h-px bg-zinc-200" />
      </div>
    </div>
  )
}

function GanttTab() {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-zinc-50 rounded-lg text-xs text-zinc-600">
        <div className="font-medium text-zinc-700 mb-1">如何阅读时序图</div>
        <div className="flex items-center gap-4 flex-wrap">
          {LANES.map(lane => (
            <div key={lane.id} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${lane.color}`} />
              <span>{lane.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-1.5 text-zinc-500">
          每行代表一个参与者，色块表示该参与者在该时间段内执行的操作。色块越靠右表示越晚发生，有重叠表示并行执行。
        </div>
      </div>

      {SCENARIOS.map((s, i) => (
        <GanttChart key={i} scenario={s} />
      ))}

      <div className="p-4 bg-zinc-50 rounded-lg text-xs text-zinc-600 space-y-1">
        <div className="font-medium text-zinc-700">Vue 开发者理解要点</div>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>每次写入后都会重新 fetch 数据（而非手动修改本地 state），这是本项目的简单策略</li>
          <li>RLS 检查发生在 Supabase 层，前端不需要写权限判断逻辑，但 <code className="bg-zinc-200 px-1 rounded">isOwner</code> 用于控制 UI 显隐</li>
          <li>注销账号是唯一需要服务端 API Route 的操作（因为需要 admin 权限），其他操作都是前端直连 Supabase</li>
          <li>Vue 中类似流程：<code className="bg-zinc-200 px-1 rounded">axios.post()</code> → 后端校验 → 数据库操作 → 前端刷新。区别是这里省去了后端，由 Supabase SDK + RLS 替代</li>
        </ul>
      </div>
    </div>
  )
}

export default function Architecture() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">架构流程图</h2>
      <p className="text-sm text-zinc-500 mb-5">
        面向有 Vue 基础的前端开发者，帮助理解本项目的 React + Next.js + Supabase 架构。
      </p>

      <div className="flex gap-1 mb-6 border-b border-zinc-200">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm transition-colors relative ${
              activeTab === tab.id
                ? 'text-black font-medium'
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'dataflow' && <DataflowTab />}
      {activeTab === 'components' && <ComponentsTab />}
      {activeTab === 'db' && <DbTab />}
      {activeTab === 'gantt' && <GanttTab />}
    </div>
  )
}
