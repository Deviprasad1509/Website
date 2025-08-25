import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <section className="bg-primary py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-primary-foreground mb-4">Stay Updated</h2>
        <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Get notified about new releases, exclusive deals, and reading recommendations
        </p>

        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input type="email" placeholder="Enter your email" className="bg-background text-foreground" />
          <Button variant="secondary" className="px-8">
            Subscribe
          </Button>
        </div>
      </div>
    </section>
  )
}
