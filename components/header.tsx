"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Heart } from "lucide-react"
import { CartSidebar } from "@/components/cart-sidebar"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/lib/auth-context"

export function Header() {
  const { state } = useAuth()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">BuisBuz</h1>
                <p className="text-xs text-muted-foreground">Premium Book Store</p>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/books" className="text-foreground hover:text-primary transition-colors">
              Books
            </Link>
            <Link href="/categories" className="text-foreground hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/authors" className="text-foreground hover:text-primary transition-colors">
              Authors
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <CartSidebar />
            {state.isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link href="/login">
                <Button variant="outline" className="bg-transparent">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
