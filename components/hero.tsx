import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="bg-muted py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
          Discover Your Next <span className="text-primary">Great Read</span>
        </h1>
        <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Curated collection of bestsellers, classics, and hidden gems. Find books that inspire, educate, and entertain.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/books">
            <Button size="lg" className="px-8">
              Browse Books
            </Button>
          </Link>
          <Link href="/categories">
            <Button variant="outline" size="lg" className="px-8 bg-transparent">
              View Collections
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
