import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { FeaturedBooks } from "@/components/featured-books"
import { Stats } from "@/components/stats"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Stats />
        <FeaturedBooks />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
