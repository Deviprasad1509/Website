"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, CheckCircle, Clock, ArrowRight } from "lucide-react"

interface EmailVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
  onContinue: () => void
}

export function EmailVerificationModal({ isOpen, onClose, email, onContinue }: EmailVerificationModalProps) {
  const [isResending, setIsResending] = useState(false)

  const handleResendEmail = async () => {
    setIsResending(true)
    // Simulate resend email process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsResending(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center space-x-2">
            <Mail className="h-6 w-6 text-primary" />
            <span>Check Your Email</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            
            <h3 className="text-lg font-semibold mb-2">Verification Email Sent!</h3>
            <p className="text-muted-foreground mb-4">
              We've sent a verification email to:
            </p>
            <p className="font-medium text-foreground bg-muted px-4 py-2 rounded-lg">
              {email}
            </p>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">1</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Check your inbox</p>
                    <p className="text-xs text-muted-foreground">Look for an email from BuisBuz</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">2</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Click the verification link</p>
                    <p className="text-xs text-muted-foreground">This will activate your account</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Start exploring books!</p>
                    <p className="text-xs text-muted-foreground">Sign in with your new account</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground text-center">
              <Clock className="h-4 w-4 inline mr-1" />
              Check your spam folder if you don't see the email within 5 minutes
            </p>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handleResendEmail} 
                disabled={isResending}
                className="flex-1"
              >
                {isResending ? "Resending..." : "Resend Email"}
              </Button>
              <Button 
                onClick={onContinue}
                className="flex-1"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Need help? Contact our support team at{" "}
              <a 
                href="mailto:srenterprises20252025@gmail.com" 
                className="text-primary hover:underline"
              >
                srenterprises20252025@gmail.com
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
