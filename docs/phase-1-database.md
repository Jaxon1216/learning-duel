# Phase 1：数据库设计

## 为什么要重建数据库？

原来的 `goals` + `learning_nodes` 是原型阶段的表。现在我们要做一个完整的多人学习监督系统，数据结构需要重新设计。

新系统有 4 张表，各司其职：

## 表结构

### 1. profiles — 用户信息卡片

| 字段 | 类型 | 说明 |
|------|------|------|
| user_id | uuid (PK) | 关联 auth.users，一对一 |
| name | text | 显示名称 |
| education | text | 学历 |
| bio | text | 一句话简介 |
| contact_type | text | 联系方式类型（wx/qq/github/email） |
| contact_value | text | 联系方式值 |

**为什么用 user_id 做主键？** 因为每个用户只有一个 profile，不需要自增 id。

### 2. goals — 宏观目标（精神宣言）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid (PK) | 自动生成 |
| user_id | uuid (FK) | 谁的目标，默认 auth.uid() |
| title | text | "雅思7分"、"大厂Offer" |
| order_index | int4 | 排序 |
| created_at | timestamptz | 创建时间 |

**特点：** 没有进度条，没有截止日期。纯粹是"宣言展示"，最多 5 个。

### 3. routes — 学习路线模块

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid (PK) | 自动生成 |
| user_id | uuid (FK) | 谁的路线，默认 auth.uid() |
| name | text | "前端"、"英语"、"网工" |
| order_index | int4 | 排序 |
| created_at | timestamptz | 创建时间 |

**一个用户可以有多条路线。** 每条路线就是一个 Tab。

### 4. route_nodes — 学习节点（微观任务）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid (PK) | 自动生成 |
| route_id | uuid (FK) | 属于哪条路线，CASCADE 删除 |
| title | text | "HTML 基础" |
| tag | text | 标签（可选） |
| deadline | timestamptz | 截止日期（可选） |
| completed | boolean | 是否完成，默认 false |
| order_index | int4 | 排序 |
| created_at | timestamptz | 创建时间 |

## 表关系

```
auth.users (Supabase 自带)
  ├── profiles      (1:1)
  ├── goals         (1:N, 最多5个)
  └── routes        (1:N)
       └── route_nodes  (1:N, CASCADE 删除)
```

## RLS 权限设计

所有表遵循同一原则：

| 操作 | 规则 | 含义 |
|------|------|------|
| SELECT | `true` | 所有人都能看所有人的数据 |
| INSERT | `auth.uid() = user_id` | 只能给自己插入数据 |
| UPDATE | `auth.uid() = user_id` | 只能改自己的数据 |
| DELETE | `auth.uid() = user_id` | 只能删自己的数据 |

**route_nodes 比较特殊：** 它没有 user_id 字段，权限通过子查询判断——检查 route_id 对应的 route 是否属于当前用户。

## 自动创建 Profile

通过 Supabase 数据库触发器（trigger），当新用户注册时自动在 profiles 表插入一行。name 默认取邮箱地址。

## 如何执行

1. 打开 Supabase 后台
2. 进入 SQL Editor
3. 把 `supabase/migration.sql` 的全部内容粘贴进去
4. 点击 Run

## 验收标准

- [x] 4 张表都能在 Table Editor 看到
- [x] 登录后能插入 routes 和 route_nodes
- [x] 用另一个账号登录，能看到所有人的数据
- [x] 用另一个账号无法修改/删除别人的数据
- [x] 删除一条 route，其下的 route_nodes 自动消失（CASCADE）
