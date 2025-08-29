import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Terms and Conditions</h1>
            <p className="text-lg text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card>
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using BuisBuz ("we", "our", "us"), you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Permission is granted to temporarily download one copy of the materials on BuisBuz's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                  <li>attempt to decompile or reverse engineer any software contained on BuisBuz's website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  This license shall automatically terminate if you violate any of these restrictions and may be terminated by BuisBuz at any time.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Digital Content</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All digital books and content purchased through BuisBuz are subject to the following terms:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Digital content is licensed, not sold, to you for personal use only</li>
                  <li>You may download purchased content up to 3 times unless specified otherwise</li>
                  <li>Free books may be downloaded unlimited times</li>
                  <li>Sharing, distributing, or reselling digital content is strictly prohibited</li>
                  <li>BuisBuz reserves the right to remove content from your library in cases of copyright violation</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Account Terms</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Safeguarding the password and all activities that occur under your account</li>
                  <li>Immediately notifying us of any unauthorized uses of your account</li>
                  <li>Ensuring your account information remains accurate and up to date</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Payments and Refunds</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All purchases are processed securely through our payment partners. Due to the nature of instantly delivered digital goods, all sales are final and strictly non-refundable.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>No refunds will be issued once access is granted or a download has begun</li>
                  <li>Duplicate charges will be reviewed and, if verified, credited</li>
                  <li>Technical issues will be supported via email at support@buisbuz.com</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Privacy Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service. 
                  By using our service, you agree to the collection and use of information in accordance with our Privacy Policy.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Prohibited Uses</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You may not use our service:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The materials on BuisBuz's website are provided on an 'as is' basis. BuisBuz makes no warranties, expressed or implied, 
                  and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, 
                  fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Limitations</h2>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall BuisBuz or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, 
                  or due to business interruption) arising out of the use or inability to use the materials on BuisBuz's website, 
                  even if BuisBuz or a BuisBuz authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms and Conditions, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="font-medium">Email:</p>
                  <p className="text-muted-foreground">support@buisbuz.com</p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  SR Enterprises reserves the right to revise these terms of service at any time without notice. 
                  By using this website, you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
