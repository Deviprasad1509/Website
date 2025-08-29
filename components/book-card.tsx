"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"

interface Book {
  id: string
  title: string
  author: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  cover: string
}

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const { dispatch } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the button
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        cover: book.cover,
      },
    })
  }

  return (
    <Link href={`/book?id=${book.id}`}>
      <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <CardContent className="p-4">
          <div className="relative mb-4">
            <Image
              src={book.cover || "/placeholder.svg"}
              alt={book.title}
              width={300}
              height={400}
              className="w-full h-64 object-cover rounded-md"
            />
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/80 hover:bg-background">
              <Heart className="h-4 w-4" />
            </Button>
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">{book.category}</Badge>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground line-clamp-2">{book.title}</h3>
            <p className="text-sm text-muted-foreground">by {book.author}</p>

            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{book.rating}</span>
              <span className="text-sm text-muted-foreground">({book.reviews.toLocaleString()} reviews)</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-foreground">${book.price}</span>
              {book.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">${book.originalPrice}</span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button className="w-full" size="sm" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
