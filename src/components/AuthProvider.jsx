'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext({ session: null, loading: true })

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isSupabaseConfigured) {
      Promise.resolve().then(() => {
        setSession(null)
        setLoading(false)
      })
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      Promise.resolve().then(() => {
        setSession(session)
        setLoading(false)
      })
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      Promise.resolve().then(() => {
        setSession(session)
        setLoading(false)
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (loading) return

    // Auth guard redirects
    if (!session && isSupabaseConfigured) {
      if (pathname.startsWith('/app')) {
        router.push('/auth')
      }
    } else if (session) {
      if (pathname === '/auth') {
        router.push('/app')
      }
    }
  }, [session, loading, pathname, router])

  if (loading && pathname.startsWith('/app')) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-sm text-ink-muted">
        로딩 중...
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
