"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Download, Package } from "lucide-react"
import Image from "next/image"

// Mock order data - in a real app, this would come from an API
const orders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "completed",
    total: 24.99,
    items: [
      {
        id: 1,
        title: "The Midnight Library",
        author: "Matt Haig",
        price: 24.99,
        cover: "/midnight-library-cover.png",
      },
    ],
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "completed",
    total: 43.98,
    items: [
      {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        price: 18.99,
        cover: "/atomic-habits-cover.png",
      },
      {
        id: 3,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        price: 21.99,
        cover: "/psychology-of-money-book-cover.png",
      },
    ],
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    status: "processing",
    total: 16.99,
    items: [
      {
        id: 4,
        title: "The Seven Husbands of Evelyn Hugo",
        author: "Taylor Jenkins Reid",
        price: 16.99,
        cover: "/evelyn-hugo-inspired-cover.png",
      },
    ],
  },
]

export function OrderHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "processing":
        return "secondary"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Order History</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Order {order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusVariant(order.status)} className="mb-2">
                          {order.status}
                        </Badge>
                        <p className="font-semibold">${order.total.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <Image
                            src={item.cover || "/placeholder.svg"}
                            alt={item.title}
                            width={50}
                            height={70}
                            className="rounded object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.author}</p>
                            <p className="text-sm font-medium">${item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      {order.status === "completed" && (
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Books
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
