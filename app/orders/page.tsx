"use client"

export const dynamic = 'force-static'

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { OrderHistory } from "@/components/order-history"
import { OrderDetail } from "@/components/order-detail"
import { useAuth } from "@/lib/auth-context"

function OrdersPageInner() {
  const { state } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const orderId = params.get('orderId') || ""

  useEffect(() => {
    if (!state.isAuthenticated && !state.isLoading) {
      const redirect = `/login?next=${encodeURIComponent('/orders' + (orderId ? `?orderId=${orderId}` : ''))}`
      router.replace(redirect)
    }
  }, [state.isAuthenticated, state.isLoading, router, orderId])

  if (state.isLoading || !state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orderId ? (
          <OrderDetail orderId={orderId} />
        ) : (
          <OrderHistory />
        )}
      </div>
    </div>
  )
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background"><Header /><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"><div className="text-center">Loading...</div></div></div>}>
      <OrdersPageInner />
    </Suspense>
  )
}
