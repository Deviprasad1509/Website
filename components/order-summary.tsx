"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"

export function OrderSummary() {
  const { state } = useCart()
  const subtotal = state.total
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {state.items.map((item) => (
            <div key={item.id} className="flex space-x-4">
              <div className="relative">
                <Image
                  src={item.cover || "/placeholder.svg"}
                  alt={item.title}
                  width={60}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.author}</p>
                <p className="text-sm font-medium">${item.price}</p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span className="text-primary">Free</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>• Instant download after payment</p>
          <p>• 30-day money-back guarantee</p>
          <p>• DRM-free files</p>
        </div>
      </CardContent>
    </Card>
  )
}
