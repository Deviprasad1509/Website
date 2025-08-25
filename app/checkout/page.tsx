"use client"
import { CheckoutForm } from "@/components/checkout-form"
import { OrderSummary } from "@/components/order-summary"
import { Header } from "@/components/header"
import { useCart } from "@/lib/cart-context"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function CheckoutPage() {
  const { state } = useCart()

  useEffect(() => {
    if (state.items.length === 0) {
      redirect("/")
    }
  }, [state.items.length])

  if (state.items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <CheckoutForm />
            </div>
            <div>
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
