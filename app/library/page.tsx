"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Download, Search, Filter, Calendar, FileText, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/database.service"
import { toast } from "@/hooks/use-toast"

interface LibraryBook {
  id: string
  title: string
  author: string
  category: string
  price: number
  cover_image: string | null
  pdf_url: string | null
  description: string
  purchased_at: string
}

export default function LibraryPage() {
  const [library, setLibrary] = useState<LibraryBook[]>([])
  const [filteredLibrary, setFilteredLibrary] = useState<LibraryBook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recent")

  const { state: authState } = useAuth()

  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      loadUserLibrary()
    } else if (!authState.isAuthenticated && !loading) {
      setError("Please sign in to view your library")
      setLoading(false)
    }
  }, [authState.isAuthenticated, authState.user])

  useEffect(() => {
    let filtered = [...library]

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
      case "recent":
        filtered.sort((a, b) => new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.purchased_at).getTime() - new Date(b.purchased_at).getTime())
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "author":
        filtered.sort((a, b) => a.author.localeCompare(b.author))
        break
    }

    setFilteredLibrary(filtered)
  }, [library, searchTerm, selectedCategory, sortBy])

  const loadUserLibrary = async () => {
    if (!authState.user) return

    try {
      const { data, error } = await db.getUserLibrary(authState.user.id)
      
      if (error) {
        console.error('Error loading user library:', error)
        setError('Failed to load your library')
        return
      }

      if (data) {
        // Transform the data to match our interface
        const libraryBooks: LibraryBook[] = data.map((item: any) => ({
          id: item.ebooks.id,
          title: item.ebooks.title,
          author: item.ebooks.author,
          category: item.ebooks.category,
          price: parseFloat(item.ebooks.price.toString()),
          cover_image: item.ebooks.cover_image,
          pdf_url: item.ebooks.pdf_url,
          description: item.ebooks.description,
          purchased_at: item.purchased_at
        }))

        setLibrary(libraryBooks)
        setFilteredLibrary(libraryBooks)
      }
    } catch (err) {
      console.error('Error loading user library:', err)
      setError('Failed to load your library')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (book: LibraryBook) => {
    if (!book.pdf_url) {
      toast({
        title: "PDF Not Available",
        description: "This book doesn't have a PDF file available for download.",
        variant: "destructive",
      })
      return
    }

    try {
      // Create a link element and trigger download
      const link = document.createElement('a')
      link.href = book.pdf_url
      link.download = `${book.title}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download Started",
        description: `Downloading "${book.title}"...`,
      })
    } catch (err) {
      console.error('Error downloading book:', err)
      toast({
        title: "Download Failed",
        description: "Failed to download the book. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getUniqueCategories = () => {
    const categories = [...new Set(library.map(book => book.category))]
    return categories.sort()
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-md mx-auto">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-4">Sign In Required</h1>
            <p className="text-muted-foreground mb-6">
              Please sign in to view your personal library of purchased books.
            </p>
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading your library...</span>
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
          <h1 className="text-3xl font-bold text-foreground mb-4">My Library</h1>
          <p className="text-muted-foreground">
            Your personal collection of purchased books
          </p>
        </div>

        {library.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Your library is empty</h3>
            <p className="text-muted-foreground mb-6">
              Start building your digital library by purchasing some books.
            </p>
            <Link href="/books">
              <Button>Browse Books</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your library..."
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
                    {getUniqueCategories().map((category) => (
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
                    <SelectItem value="recent">Recently Purchased</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="author">Author A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                {filteredLibrary.length} of {library.length} books
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="ml-2">
                    {getUniqueCategories().find(cat => cat.toLowerCase() === selectedCategory) || selectedCategory}
                  </Badge>
                )}
              </p>
            </div>

            {/* Library Grid */}
            {filteredLibrary.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLibrary.map((book) => (
                  <Card key={book.id} className="flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex space-x-4">
                        <Image
                          src={book.cover_image || "/placeholder-book-cover.png"}
                          alt={book.title}
                          width={80}
                          height={120}
                          className="rounded-md object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg line-clamp-2 mb-2">
                            {book.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mb-2">
                            by {book.author}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {book.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0 flex-1">
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {book.description}
                        </p>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Purchased {formatDate(book.purchased_at)}</span>
                          </div>
                          <span className="font-medium">${book.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <div className="p-4 pt-0 space-y-2">
                      <Button 
                        className="w-full" 
                        onClick={() => handleDownload(book)}
                        disabled={!book.pdf_url}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {book.pdf_url ? 'Download PDF' : 'PDF Not Available'}
                      </Button>
                      
                      <Link href={`/book/${book.id}`} className="w-full">
                        <Button variant="outline" className="w-full bg-transparent">
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No books found</h3>
                <p className="text-muted-foreground">
                  No books match your current filters. Try adjusting your search or filters.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSortBy("recent")
                  }}
                  className="mt-4 bg-transparent"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
