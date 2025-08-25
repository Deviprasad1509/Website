import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Award, Globe, Heart, Shield, Zap, Star } from "lucide-react"

const features = [
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: "Curated Collection",
    description: "Handpicked selection of high-quality ebooks across diverse genres and topics"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Community Driven",
    description: "Join thousands of readers discovering and sharing their favorite books"
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Instant Access",
    description: "Download your purchased books immediately and read them anywhere"
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Secure Platform",
    description: "Safe and secure payment processing with instant download access"
  }
]

const stats = [
  { number: "10,000+", label: "Books Available" },
  { number: "50,000+", label: "Happy Readers" },
  { number: "500+", label: "Featured Authors" },
  { number: "99%", label: "Customer Satisfaction" }
]

const values = [
  {
    icon: <Heart className="h-6 w-6 text-red-500" />,
    title: "Passion for Reading",
    description: "We believe in the transformative power of books and reading"
  },
  {
    icon: <Globe className="h-6 w-6 text-blue-500" />,
    title: "Global Accessibility",
    description: "Making quality literature accessible to readers worldwide"
  },
  {
    icon: <Award className="h-6 w-6 text-yellow-500" />,
    title: "Quality First",
    description: "Committed to providing only the best curated content"
  },
  {
    icon: <Users className="h-6 w-6 text-green-500" />,
    title: "Community Focus",
    description: "Building a vibrant community of readers and learners"
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-muted py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              About <span className="text-primary">BuisBuz</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Your premium destination for discovering, purchasing, and enjoying high-quality ebooks. 
              We're passionate about connecting readers with the books that will inspire, educate, and entertain them.
            </p>
            <Badge variant="secondary" className="text-base px-4 py-2">
              Est. 2024 • Premium Book Store
            </Badge>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At BuisBuz, we're on a mission to revolutionize the way people discover and consume digital literature. 
                We believe that great books have the power to change lives, spark conversations, and build bridges between 
                cultures and communities. Our platform is designed to make finding your next great read as simple and 
                enjoyable as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose BuisBuz?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're not just another bookstore. Here's what makes us different.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center h-full">
                  <CardHeader>
                    <div className="mx-auto mb-4 text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Impact</h2>
              <p className="text-muted-foreground">
                Numbers that tell our story
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {values.map((value, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
              <p className="text-muted-foreground">
                Getting started with BuisBuz is simple
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  1
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Browse & Discover
                </h3>
                <p className="text-muted-foreground">
                  Explore our curated collection of ebooks across various categories and genres
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  2
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Purchase Securely
                </h3>
                <p className="text-muted-foreground">
                  Add books to your cart and checkout securely with our trusted payment system
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  3
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Read Instantly
                </h3>
                <p className="text-muted-foreground">
                  Download your books immediately and start reading on any device
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Star className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Reading Journey?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of readers who have discovered their next favorite book with BuisBuz. 
              Start exploring our collection today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/books"
                className="bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Browse Books
              </a>
              <a 
                href="/signup"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-primary font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Create Account
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
