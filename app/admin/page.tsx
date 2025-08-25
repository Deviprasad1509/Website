"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { DashboardOverview } from "@/components/admin/dashboard-overview"

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <DashboardOverview />
    </AdminLayout>
  )
}
