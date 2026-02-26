# Phase 2：认证系统

## 目标

让用户能注册、登录、登出、切换账号，并在首次登录时自动创建 profile。

## 实现方式

### 注册与登录

使用 Supabase 的**邮箱 + 密码**方式。页面上提供注册/登录切换。

**注册：**

```tsx
await supabase.auth.signUp({
  email: 'user@example.com',
  password: '123456',
})
```

**登录：**

```tsx
await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: '123456',
})
```

### Supabase 后台配置

需要在 Supabase 后台做一项设置：

1. 进入 **Authentication** → **Sign In / Providers**
2. 把 **Confirm email** 开关**关掉**
3. 点 Save changes

为什么关掉？因为 Supabase 免费版每小时只能发 3-4 封邮件，开发阶段频繁注册测试会被限流。关掉后注册即生效，不需要点邮箱确认链接。

> 上线后可以重新打开，或改用邀请码机制控制注册。

### Session 管理

通过两个机制维持登录状态：

1. **`getSession()`** — 页面加载时检查是否已登录
2. **`onAuthStateChange()`** — 监听认证状态变化（登录、登出、token 刷新）

```tsx
useEffect(() => {
  supabase.auth.getSession().then(({ data }) => setSession(data.session))
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
    setSession(s)
  })
  return () => subscription.unsubscribe()
}, [])
```

### 自动创建 Profile

两道保险：

1. **数据库触发器**（migration.sql 中）：新用户注册时自动在 profiles 表插入一行
2. **前端兜底**：登录后检查 profiles 表，如果没有则手动插入

这样即使触发器没执行（比如已有用户），前端也能补上。

### 登出

```tsx
await supabase.auth.signOut()
```

清空所有本地状态，回到登录页。

## 数据结构配合

- `session.user.id` 就是 `auth.uid()`，用于所有表的 `user_id` 字段
- 不需要额外的用户表，Supabase 的 `auth.users` 自带
- `profiles` 是对 `auth.users` 的扩展（加名字、学历等）

## 权限保证

- 未登录用户无法调用 API，因为 Supabase client 没有 session token
- 已登录用户只能操作自己的数据（RLS 检查 `auth.uid() = user_id`）
- 所有人可以查看所有人的数据（SELECT policy 是 `true`）

## 常见问题

### 注册成功但登录报 "Invalid login credentials"

原因：注册时 Supabase 开着 **Confirm email**，用户邮箱未确认，导致账号处于未激活状态。

解决：
1. 去 Supabase 后台关掉 Confirm email
2. 在 Authentication → Users 里删掉旧的未确认用户
3. 重新注册

### Supabase 免费版邮件发送限制

免费项目每小时只能发 3-4 封认证邮件。如果使用 Magic Link（OTP）登录方式会被限流。所以我们改用了邮箱密码登录，不依赖邮件。

## 验收标准

- [x] 能注册新账号（邮箱 + 密码）
- [x] 注册后能立刻登录
- [x] profiles 表中有对应记录
- [x] 点击"登出"回到登录页
- [x] 用不同邮箱注册登录，左侧能看到多个用户
