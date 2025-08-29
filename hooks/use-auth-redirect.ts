"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

/**
 * Hook to redirect authenticated users away from login/signup pages
 * Use this in login and signup page components
 */
export function useAuthRedirect() {
  const { state } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if user is fully authenticated (not just loading)
    if (state.isAuthenticated && state.user && !state.isLoading) {
      console.log('🔄 Authenticated user accessing login/signup page, redirecting to home')
      router.replace('/')
    }
  }, [state.isAuthenticated, state.user, state.isLoading, router])

  return {
    isRedirecting: state.isAuthenticated && state.user && !state.isLoading,
    isLoading: state.isLoading
  }
}
