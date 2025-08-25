"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { ProductManagement } from "@/components/admin/product-management"

export default function AdminProductsPage() {
  return (
    <AdminLayout>
      <ProductManagement />
    </AdminLayout>
  )
}
