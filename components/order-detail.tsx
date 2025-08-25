"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Package, CheckCircle, Clock } from "lucide-react"
import Image from "next/image"

// Mock order data - in a real app, this would come from an API
const orderData = {
  id: "ORD-001",
  date: "2024-01-15",
  status: "completed",
  total: 24.99,
  subtotal: 24.99,
  tax: 0,
  shipping: 0,
  paymentMethod: "Credit Card ending in 4242",
  billingAddress: {
    name: "John Doe",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
  },
  items: [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      price: 24.99,
      quantity: 1,
      cover: "/midnight-library-cover.png",
    },
  ],
  timeline: [
    {
      status: "Order Placed",
      date: "2024-01-15 10:30 AM",
      completed: true,
      icon: Package,
    },
    {
      status: "Payment Confirmed",
      date: "2024-01-15 10:31 AM",
      completed: true,
      icon: CheckCircle,
    },
    {
      status: "Processing",
      date: "2024-01-15 10:35 AM",
      completed: true,
      icon: Clock,
    },
    {
      status: "Ready for Download",
      date: "2024-01-15 10:36 AM",
      completed: true,
      icon: Download,
    },
  ],
}

interface OrderDetailProps {
  orderId: string
}

export function OrderDetail({ orderId }: OrderDetailProps) {
  const order = orderData // In a real app, fetch by orderId

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
      <div className="flex items-center space-x-4">
        <Link href="/orders" className="inline-flex items-center text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Order {order.id}</h1>
          <p className="text-muted-foreground">Placed on {new Date(order.date).toLocaleDateString()}</p>
        </div>
        <Badge variant={getStatusVariant(order.status)} className="text-sm">
          {order.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.timeline.map((step, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <step.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.status}
                    </p>
                    <p className="text-sm text-muted-foreground">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Billing Information */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Billing Address</h4>
              <div className="text-sm text-muted-foreground">
                <p>{order.billingAddress.name}</p>
                <p>{order.billingAddress.address}</p>
                <p>
                  {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}
                </p>
                <p>{order.billingAddress.country}</p>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium mb-2">Payment Method</h4>
              <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <Image
                  src={item.cover || "/placeholder.svg"}
                  alt={item.title}
                  width={80}
                  height={100}
                  className="rounded object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.author}</p>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${item.price}</p>
                  {order.status === "completed" && (
                    <Button size="sm" className="mt-2">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span className="text-primary">Free</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
