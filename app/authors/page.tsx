"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, User, ArrowRight } from "lucide-react"
import { db } from "@/lib/database.service"
import { Loader2 } from "lucide-react"

interface AuthorData {
  name: string
  bookCount: number
  categories: string[]
  books: any[]
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<AuthorData[]>([])
  const [filteredAuthors, setFilteredAuthors] = useState<AuthorData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadAuthors = async () => {
      try {
        const { data: books, error } = await db.getEbooks({ limit: 1000 })
        
        if (error) {
          console.error('Error loading books for authors:', error)
          setError('Failed to load authors')
          return
        }

        if (books) {
          // Group books by author
          const authorMap: { [key: string]: any[] } = {}
          books.forEach(book => {
            const authorName = book.author
            if (!authorMap[authorName]) {
              authorMap[authorName] = []
            }
            authorMap[authorName].push(book)
          })

          // Create author data
          const authorsData: AuthorData[] = Object.entries(authorMap).map(([name, authorBooks]) => {
            const categories = [...new Set(authorBooks.map(book => book.category))]
            return {
              name,
              bookCount: authorBooks.length,
              categories,
              books: authorBooks
            }
          })

          // Sort by book count (descending) then by name
          authorsData.sort((a, b) => {
            if (b.bookCount !== a.bookCount) {
              return b.bookCount - a.bookCount
            }
            return a.name.localeCompare(b.name)
          })

          setAuthors(authorsData)
          setFilteredAuthors(authorsData)
        }
      } catch (err) {
        console.error('Error loading authors:', err)
        setError('Failed to load authors')
      } finally {
        setLoading(false)
      }
    }

    loadAuthors()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = authors.filter(author =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredAuthors(filtered)
    } else {
      setFilteredAuthors(authors)
    }
  }, [authors, searchTerm])

  const getAuthorInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAuthorColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500'
    ]
    
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading authors...</span>
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Featured Authors</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover books from talented authors across various genres
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="text-center mb-8">
          <p className="text-muted-foreground">
            Showing {filteredAuthors.length} of {authors.length} authors
          </p>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuthors.map((author) => (
            <Link
              key={author.name}
              href={`/books?author=${encodeURIComponent(author.name)}`}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className={`${getAuthorColor(author.name)} text-white font-semibold text-lg`}>
                        {getAuthorInitials(author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {author.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {author.bookCount} {author.bookCount === 1 ? 'book' : 'books'}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Categories:</p>
                      <div className="flex flex-wrap gap-1">
                        {author.categories.slice(0, 3).map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                        {author.categories.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{author.categories.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Recent Books:</p>
                      <div className="space-y-1">
                        {author.books.slice(0, 2).map((book, index) => (
                          <p key={index} className="text-xs text-muted-foreground truncate">
                            • {book.title}
                          </p>
                        ))}
                        {author.books.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            ... and {author.books.length - 2} more
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t">
                    <span className="text-sm text-primary font-medium group-hover:underline">
                      View all books →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty States */}
        {filteredAuthors.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No authors found</h3>
            <p className="text-muted-foreground">
              No authors match "{searchTerm}". Try a different search term.
            </p>
          </div>
        )}

        {filteredAuthors.length === 0 && !searchTerm && (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Authors Found</h3>
            <p className="text-muted-foreground">
              Authors will appear here once books are added to the collection.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
