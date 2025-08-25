"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { OrderManagement } from "@/components/admin/order-management"

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <OrderManagement />
    </AdminLayout>
  )
}
