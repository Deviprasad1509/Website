import { SignupForm } from "@/components/signup-form"
import Link from "next/link"
import { BookOpen } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">BuisBuz</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Create account</h1>
          <p className="text-muted-foreground mt-2">Join thousands of book lovers today</p>
        </div>

        <SignupForm />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
