"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { state } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('🛡️ AdminGuard: Checking access...', {
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      userRole: state.user?.role,
      isLoading: state.isLoading
    })
    
    if (!state.isAuthenticated) {
      console.log('❌ AdminGuard: User not authenticated, redirecting to login')
      router.push("/login")
      return
    }

    if (state.user?.role !== "admin") {
      console.log('❌ AdminGuard: User is not admin (role:', state.user?.role, '), redirecting to home')
      router.push("/")
      return
    }
    
    console.log('✅ AdminGuard: Access granted for admin user')
  }, [state.isAuthenticated, state.user?.role, router])

  if (!state.isAuthenticated || state.user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
