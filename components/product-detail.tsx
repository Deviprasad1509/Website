"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { ArrowLeft, Star, ShoppingCart, Heart, Download, BookOpen, Calendar, Globe } from "lucide-react"

interface Book {
  id: number
  title: string
  author: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  cover: string
  description: string
  pages: number
  language: string
  publisher: string
  isbn: string
  publishDate: string
  tags: string[]
}

interface ProductDetailProps {
  book: Book
}

export function ProductDetail({ book }: ProductDetailProps) {
  const { dispatch } = useCart()

  const handleAddToCart = () => {
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Book Cover */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={book.cover || "/placeholder.svg"}
                alt={book.title}
                width={500}
                height={700}
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">{book.category}</Badge>
              <h1 className="text-3xl font-bold text-foreground mb-2">{book.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{book.rating}</span>
                </div>
                <span className="text-muted-foreground">({book.reviews.toLocaleString()} reviews)</span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-foreground">${book.price}</span>
                {book.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">${book.originalPrice}</span>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button onClick={handleAddToCart} size="lg" className="flex-1">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Book Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{book.pages} pages</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{book.language}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(book.publishDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span>Instant Download</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Publisher: {book.publisher}</p>
                  <p className="text-sm text-muted-foreground">ISBN: {book.isbn}</p>
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="font-semibold mb-4">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{book.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
