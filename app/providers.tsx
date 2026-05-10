'use client'

import { SWRConfig } from 'swr'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

const CACHE_KEY = 'swr-cache-v1'

export default function Providers({ children }: { children: ReactNode }) {
  const mapRef = useRef<Map<string, any> | null>(null)

  if (!mapRef.current) {
    mapRef.current = new Map<string, any>()
  }

  const providerFn = () => mapRef.current!

  useEffect(() => {
    const map = mapRef.current!
    try {
      const stored = localStorage.getItem(CACHE_KEY)
      if (stored) {
        const entries: [string, any][] = JSON.parse(stored)
        for (const [k, v] of entries) {
          if (!map.has(k)) map.set(k, v)
        }
      }
    } catch { /* ignore parse errors */ }

    const persist = () => {
      try {
        const entries: [string, any][] = []
        map.forEach((v, k) => entries.push([k, v]))
        localStorage.setItem(CACHE_KEY, JSON.stringify(entries))
      } catch { /* quota exceeded */ }
    }

    window.addEventListener('beforeunload', persist)
    return () => window.removeEventListener('beforeunload', persist)
  }, [])

  return (
    <SWRConfig
      value={{
        provider: providerFn,
        dedupingInterval: 5000,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        errorRetryCount: 2,
      }}
    >
      {children}
    </SWRConfig>
  )
}
