import useSWR, { mutate } from 'swr'
import { supabase } from './supabase'

export const swrKeys = {
  users: 'users',
  goals: (userId: string) => `goals:${userId}`,
  routes: (userId: string) => `routes:${userId}`,
  nodes: (routeId: string) => `nodes:${routeId}`,
  profile: (userId: string) => `profile:${userId}`,
}

interface UserWithStats {
  user_id: string
  name: string | null
  total_nodes: number
  completed_nodes: number
}

export function useUsers() {
  return useSWR<UserWithStats[]>(swrKeys.users, async () => {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, name')

    if (!profiles) return []

    const { data: allNodes } = await supabase
      .from('route_nodes')
      .select('id, completed, route_id')

    const { data: allRoutes } = await supabase
      .from('routes')
      .select('id, user_id')

    const routeOwnerMap = new Map<string, string>()
    allRoutes?.forEach(r => routeOwnerMap.set(r.id, r.user_id))

    const statsMap = new Map<string, { total: number; completed: number }>()
    allNodes?.forEach(n => {
      const ownerId = routeOwnerMap.get(n.route_id)
      if (!ownerId) return
      const prev = statsMap.get(ownerId) || { total: 0, completed: 0 }
      prev.total++
      if (n.completed) prev.completed++
      statsMap.set(ownerId, prev)
    })

    return profiles.map(p => ({
      user_id: p.user_id,
      name: p.name,
      total_nodes: statsMap.get(p.user_id)?.total || 0,
      completed_nodes: statsMap.get(p.user_id)?.completed || 0,
    }))
  })
}

export function useGoals(userId: string | null) {
  return useSWR(
    userId ? swrKeys.goals(userId) : null,
    async () => {
      const { data } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId!)
        .order('order_index', { ascending: true })
      return data || []
    },
  )
}

export function useRoutes(userId: string | null) {
  return useSWR(
    userId ? swrKeys.routes(userId) : null,
    async () => {
      const { data } = await supabase
        .from('routes')
        .select('*')
        .eq('user_id', userId!)
        .order('order_index', { ascending: true })
      return data || []
    },
  )
}

export function useNodes(routeId: string | null) {
  return useSWR(
    routeId ? swrKeys.nodes(routeId) : null,
    async () => {
      const { data } = await supabase
        .from('route_nodes')
        .select('*')
        .eq('route_id', routeId!)
        .order('order_index', { ascending: true })
      return data || []
    },
  )
}

export function useProfile(userId: string | null) {
  return useSWR(
    userId ? swrKeys.profile(userId) : null,
    async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId!)
        .single()
      return data
    },
  )
}

export function invalidate(...keys: string[]) {
  keys.forEach(key => mutate(key))
}
