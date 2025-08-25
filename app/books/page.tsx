"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { db } from "@/lib/database.service"
import { Loader2 } from "lucide-react"

const CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Self-Help",
  "Science Fiction",
  "Romance",
  "Mystery",
  "Biography",
  "History",
  "Business",
  "Technology"
]

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([])
  const [filteredBooks, setFilteredBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const { data, error } = await db.getEbooks({ limit: 100 })
        
        if (error) {
          console.error('Error loading books:', error)
          setError('Failed to load books')
        } else if (data) {
          const transformedBooks = data.map(book => ({
            id: book.id,
            title: book.title,
            author: book.author,
            category: book.category,
            price: parseFloat(book.price.toString()),
            rating: 4.5, // Default rating
            reviews: Math.floor(Math.random() * 500) + 50, // Random reviews
            cover: book.cover_image || '/placeholder-book-cover.png',
            description: book.description,
            is_featured: book.is_featured,
            created_at: book.created_at
          }))
          setBooks(transformedBooks)
          setFilteredBooks(transformedBooks)
        }
      } catch (err) {
        console.error('Error loading books:', err)
        setError('Failed to load books')
      } finally {
        setLoading(false)
      }
    }

    loadBooks()
  }, [])

  useEffect(() => {
    let filtered = [...books]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(book =>
        book.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Sort books
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
    }

    setFilteredBooks(filtered)
  }, [books, searchTerm, selectedCategory, sortBy])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading books...</span>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-red-500">
            <p>{error}</p>
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">All Books</h1>
          <p className="text-muted-foreground">
            Discover our complete collection of ebooks across all categories
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredBooks.length} of {books.length} books
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="ml-2">
                {CATEGORIES.find(cat => cat.toLowerCase() === selectedCategory) || selectedCategory}
              </Badge>
            )}
          </p>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No books found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setSortBy("newest")
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
