"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

/**
 * Hook to redirect authenticated users away from login/signup pages
 * Use this in login and signup page components
 */
export function useAuthRedirect() {
  const { state } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Only redirect if user is fully authenticated (not just loading)
    if (state.isAuthenticated && state.user && !state.isLoading) {
      const next = searchParams.get('next')
      const safeNext = next && next.startsWith('/') ? next : '/'
      console.log('🔄 Authenticated user accessing login/signup page, redirecting to', safeNext)
      router.replace(safeNext)
    }
  }, [state.isAuthenticated, state.user, state.isLoading, router, searchParams])

  return {
    isRedirecting: state.isAuthenticated && state.user && !state.isLoading,
    isLoading: state.isLoading
  }
}
