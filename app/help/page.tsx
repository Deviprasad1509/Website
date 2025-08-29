"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock, MessageSquare, HelpCircle, Download, ShoppingCart, UserCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

export default function HelpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Create mailto link
    const subject = encodeURIComponent(formData.subject || "Support Request from BuisBuz")
    const body = encodeURIComponent(`Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}`)
    
    const mailtoLink = `mailto:srenterprises20252025@gmail.com?subject=${subject}&body=${body}`
    
    // Open default email client
    window.location.href = mailtoLink
    
    toast.success("Email client opened!", {
      description: "Your default email application should now open with the support request pre-filled.",
      duration: 5000
    })
    
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" })
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Help & Support</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're here to help you with any questions or issues you may have. Find answers to common questions or get in touch with our support team.
            </p>
          </div>

          {/* Quick Help Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <ShoppingCart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Orders</h3>
                <p className="text-sm text-muted-foreground mb-4">Track orders, payment issues, or refund requests.</p>
                <Link href="/orders/">
                  <Button variant="outline" size="sm">View Orders</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Download className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Downloads</h3>
                <p className="text-sm text-muted-foreground mb-4">Help with downloading your purchased books.</p>
                <Link href="/library/">
                  <Button variant="outline" size="sm">Download Help</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <UserCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Account</h3>
                <p className="text-sm text-muted-foreground mb-4">Manage your account settings and profile.</p>
                <Link href="/account/">
                  <Button variant="outline" size="sm">Account Help</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">General</h3>
                <p className="text-sm text-muted-foreground mb-4">General questions about our platform.</p>
                <Button variant="outline" size="sm" onClick={() => {
                  const faqSection = document.getElementById('faq-section')
                  if (faqSection) {
                    faqSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}>FAQ</Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Brief description of your inquiry"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Please provide detailed information about your question or issue..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    <Mail className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    This will open your default email client to send the message to our support team.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-muted-foreground">srenterprises20252025@gmail.com</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        We typically respond within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Response Time</p>
                      <p className="text-sm text-muted-foreground">
                        Monday - Friday: Within 8 hours<br />
                        Weekend: Within 24 hours
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">How do I download my purchased books?</h4>
                    <p className="text-sm text-muted-foreground">
                      After purchase, go to your Library page and click the "Download" button next to any book you own.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Can I re-download my books?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can re-download purchased books up to 3 times. Free books have unlimited downloads.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">What file formats are supported?</h4>
                    <p className="text-sm text-muted-foreground">
                      All our books are available in PDF format for maximum compatibility across devices.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">How do I get a refund?</h4>
                    <p className="text-sm text-muted-foreground">
                      Contact our support team within 30 days of purchase with your order details for refund requests.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
