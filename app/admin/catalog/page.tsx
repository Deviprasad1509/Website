"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { CatalogManagement } from "@/components/admin/catalog-management"

export default function AdminCatalogPage() {
  return (
    <AdminLayout>
      <CatalogManagement />
    </AdminLayout>
  )
}
