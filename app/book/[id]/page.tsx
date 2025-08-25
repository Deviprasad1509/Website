"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BookOpen, ShoppingCart, Download, Star, Heart, ArrowLeft, Share, Eye } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/database.service"
import { Loader2 } from "lucide-react"

export default function BookDetailPage() {
  const params = useParams()
  const bookId = params.id as string
  const [book, setBook] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userOwnsBook, setUserOwnsBook] = useState(false)
  const [checkingOwnership, setCheckingOwnership] = useState(false)
  
  const { dispatch } = useCart()
  const { state: authState } = useAuth()

  useEffect(() => {
    const loadBookDetails = async () => {
      try {
        const { data, error } = await db.getEbookById(bookId)
        
        if (error) {
          console.error('Error loading book details:', error)
          setError('Failed to load book details')
          return
        }

        if (data) {
          const transformedBook = {
            id: data.id,
            title: data.title,
            author: data.author,
            category: data.category,
            price: parseFloat(data.price.toString()),
            rating: 4.5, // Default rating
            reviews: Math.floor(Math.random() * 500) + 50,
            cover: data.cover_image || '/placeholder-book-cover.png',
            description: data.description,
            is_featured: data.is_featured,
            pdf_url: data.pdf_url,
            tags: data.tags || []
          }
          setBook(transformedBook)

          // Check if user owns this book
          if (authState.isAuthenticated && authState.user) {
            setCheckingOwnership(true)
            try {
              const { owns } = await db.checkUserOwnsEbook(authState.user.id, bookId)
              setUserOwnsBook(owns)
            } catch (err) {
              console.error('Error checking book ownership:', err)
            } finally {
              setCheckingOwnership(false)
            }
          }
        }
      } catch (err) {
        console.error('Error loading book details:', err)
        setError('Failed to load book details')
      } finally {
        setLoading(false)
      }
    }

    if (bookId) {
      loadBookDetails()
    }
  }, [bookId, authState.isAuthenticated, authState.user])

  const handleAddToCart = () => {
    if (book) {
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
  }

  const handleDownload = async () => {
    if (book && book.pdf_url && userOwnsBook) {
      // Create a link element and trigger download
      const link = document.createElement('a')
      link.href = book.pdf_url
      link.download = `${book.title}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading book details...</span>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Book Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || "The book you're looking for doesn't exist or has been removed."}
            </p>
            <Link href="/books">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Books
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/books" className="hover:text-foreground">Books</Link>
          <span>/</span>
          <Link href={`/books?category=${encodeURIComponent(book.category.toLowerCase())}`} className="hover:text-foreground">
            {book.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{book.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Book Image */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={book.cover}
                alt={book.title}
                width={500}
                height={700}
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
              {book.is_featured && (
                <Badge className="absolute top-4 left-4 bg-yellow-500">
                  Featured
                </Badge>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2 max-w-md mx-auto">
              <Button variant="outline" size="icon" className="bg-transparent">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-transparent">
                <Share className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-transparent">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">
                {book.category}
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {book.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                by {book.author}
              </p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{book.rating}</span>
                  <span className="text-muted-foreground">
                    ({book.reviews.toLocaleString()} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Price and Purchase */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-3xl font-bold text-foreground">
                      ${book.price}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Digital download
                    </p>
                  </div>
                </div>

                {userOwnsBook ? (
                  <div className="space-y-3">
                    <div className="flex items-center text-green-600 mb-3">
                      <BookOpen className="h-5 w-5 mr-2" />
                      <span className="font-medium">You own this book</span>
                    </div>
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={handleDownload}
                      disabled={!book.pdf_url}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {book.pdf_url ? 'Download PDF' : 'PDF not available'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Link href="/checkout" className="w-full">
                      <Button variant="outline" className="w-full bg-transparent" size="lg">
                        Buy Now
                      </Button>
                    </Link>
                    {!authState.isAuthenticated && (
                      <p className="text-xs text-muted-foreground text-center">
                        <Link href="/login" className="underline">
                          Sign in
                        </Link> to purchase and download books
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            {book.tags && book.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-12">
          <Separator className="mb-8" />
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">About this book</h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {book.description}
              </p>
            </div>
          </div>
        </div>

        {/* Related Books Section */}
        <div className="mt-12">
          <Separator className="mb-8" />
          <h2 className="text-2xl font-bold text-foreground mb-6">More books by {book.author}</h2>
          <div className="text-center py-8 text-muted-foreground">
            <p>Related books will be displayed here</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
