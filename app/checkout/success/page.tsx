import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, Mail } from "lucide-react"

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">Order Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">Thank you for your purchase. Your ebooks are ready for download.</p>

          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>Confirmation email sent</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Download className="h-4 w-4" />
              <span>Download links included</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full" size="lg">
              <Download className="h-4 w-4 mr-2" />
              Download Your Books
            </Button>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full bg-transparent">
                Continue Shopping
              </Button>
            </Link>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Order #12345</p>
            <p>Need help? Contact our support team</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
