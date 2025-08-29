import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Returns Policy - SR Enterprises",
  description: "Returns and refunds policy for SR Enterprises ebook store",
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
          <h1 className="text-3xl font-bold text-foreground mb-8">Returns & Refunds Policy (No Refunds)</h1>
          <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Digital Content Policy</h2>
            <p className="text-muted-foreground mb-4">
              As SR Enterprises primarily sells digital ebooks and content, our return policy differs from physical goods due to the nature of digital products. Once digital content is delivered or access is granted, it cannot be "returned" in the traditional sense.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-blue-700 dark:text-blue-300 font-semibold">
                Important: All sales of digital products are final. We do not offer refunds.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Refund Policy</h2>
            <p className="text-muted-foreground mb-4">
              We operate a strict no-refund policy for digital products. Please review product details carefully before purchase. If you experience technical issues, contact our support team and we will assist you in resolving access or download problems.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Refund Timeline</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">Request Window</h3>
                <p className="text-muted-foreground">
                  Refund requests must be made within <strong>14 days</strong> of purchase.
                </p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">Processing Time</h3>
                <p className="text-muted-foreground">
                  Approved refunds are processed within <strong>5-7 business days</strong>.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">How to Request a Refund</h2>
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Contact Support</h3>
                  <p className="text-muted-foreground">
                    Email us at <a href="mailto:support@buisbuz.com" className="text-primary hover:underline">support@buisbuz.com</a> with "Refund Request" in the subject line.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Provide Details</h3>
                  <p className="text-muted-foreground">Include your order number, purchase date, and reason for the refund request.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Review Process</h3>
                  <p className="text-muted-foreground">Our team will review your request within 2 business days and respond with a decision.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Refund Processing</h3>
                  <p className="text-muted-foreground">If approved for exceptional cases (e.g., duplicate charge), credits are processed to your original payment method.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Required Information for Refund Requests</h2>
            <p className="text-muted-foreground mb-4">
              To process your refund request efficiently, please include:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Your full name and email address associated with the account</li>
              <li>Order number or transaction ID</li>
              <li>Date of purchase</li>
              <li>Title(s) of the ebook(s) in question</li>
              <li>Detailed reason for the refund request</li>
              <li>Screenshots or error messages (if technical issues)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Alternative Solutions</h2>
            <p className="text-muted-foreground mb-4">
              Before requesting a refund, consider these alternatives:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">🛠️ Technical Support</h3>
                <p className="text-muted-foreground text-sm">
                  We can help resolve download or access issues, file format problems, or compatibility concerns.
                </p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">🔄 Exchange</h3>
                <p className="text-muted-foreground text-sm">
                  In some cases, we may offer a store credit or exchange for a different title of equal value.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Subscription Cancellations</h2>
            <p className="text-muted-foreground mb-4">
              If you have a subscription service:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>You can cancel your subscription at any time from your account settings</li>
              <li>Cancellations take effect at the end of your current billing period</li>
              <li>No partial refunds are provided for unused portions of subscription periods</li>
              <li>You retain access to content until the subscription expires</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Payment Method Refunds</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Credit/Debit Cards</h3>
                <p className="text-muted-foreground text-sm">
                  Refunds are processed to the original card and may take 3-5 business days to appear on your statement.
                </p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Digital Wallets</h3>
                <p className="text-muted-foreground text-sm">
                  PayPal, Apple Pay, and other digital wallet refunds typically process within 1-2 business days.
                </p>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Store Credit</h3>
                <p className="text-muted-foreground text-sm">
                  In some cases, we may offer store credit that can be used for future purchases.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For refund requests or questions about this policy:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="space-y-2">
                <p className="text-foreground"><strong>Email:</strong> support@buisbuz.com</p>
                <p className="text-foreground"><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p className="text-foreground"><strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM EST</p>
                <p className="text-foreground"><strong>Response Time:</strong> Within 24 hours on business days</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Returns & Refunds Policy from time to time. Any changes will be posted on this page with an updated revision date. Continued use of our services after such changes constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
