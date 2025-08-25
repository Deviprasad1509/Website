"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ArrowRight } from "lucide-react"
import { db } from "@/lib/database.service"
import { Loader2 } from "lucide-react"

const CATEGORY_DESCRIPTIONS = {
  "fiction": "Explore imaginative stories and literary masterpieces",
  "non-fiction": "Discover real-world insights and factual narratives",
  "self-help": "Transform your life with practical guidance",
  "science fiction": "Journey into futuristic worlds and possibilities",
  "romance": "Fall in love with heartwarming stories",
  "mystery": "Unravel thrilling puzzles and suspenseful tales",
  "biography": "Learn from the lives of remarkable individuals",
  "history": "Discover the past through engaging narratives",
  "business": "Master the art of success and entrepreneurship",
  "technology": "Stay ahead with the latest tech insights"
}

const CATEGORY_COLORS = [
  "bg-blue-500",
  "bg-green-500", 
  "bg-purple-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500"
]

interface CategoryData {
  name: string
  count: number
  description: string
  color: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data: books, error } = await db.getEbooks({ limit: 1000 })
        
        if (error) {
          console.error('Error loading books for categories:', error)
          setError('Failed to load categories')
          return
        }

        if (books) {
          // Count books per category
          const categoryCount: { [key: string]: number } = {}
          books.forEach(book => {
            const category = book.category.toLowerCase()
            categoryCount[category] = (categoryCount[category] || 0) + 1
          })

          // Create category data with descriptions and colors
          const categoriesData: CategoryData[] = Object.entries(categoryCount).map(([name, count], index) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            count,
            description: CATEGORY_DESCRIPTIONS[name] || "Discover amazing books in this category",
            color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
          }))

          // Sort by count (descending) then by name
          categoriesData.sort((a, b) => {
            if (b.count !== a.count) {
              return b.count - a.count
            }
            return a.name.localeCompare(b.name)
          })

          setCategories(categoriesData)
        }
      } catch (err) {
        console.error('Error loading categories:', err)
        setError('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading categories...</span>
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Browse by Category</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse collection of ebooks organized by genres and topics
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={`/books?category=${encodeURIComponent(category.name.toLowerCase())}`}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-3`}>
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {category.count} {category.count === 1 ? 'book' : 'books'}
                    </Badge>
                    <span className="text-sm text-primary font-medium group-hover:underline">
                      Browse →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Categories Found</h3>
            <p className="text-muted-foreground">
              Categories will appear here once books are added to the collection.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
