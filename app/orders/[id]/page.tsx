"use client"

import { Header } from "@/components/header"
import { OrderDetail } from "@/components/order-detail"

interface PageProps {
  params: {
    id: string
  }
}

export default function OrderDetailPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrderDetail orderId={params.id} />
      </div>
    </div>
  )
}
