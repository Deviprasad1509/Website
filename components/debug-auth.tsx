"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { db, auth } from "@/lib/firebase/client"
import { collection, getDocs, limit, query } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AuthDebugComponent() {
  const { state, login, signup } = useAuth()
  const [testEmail, setTestEmail] = useState("test@example.com")
  const [testPassword, setTestPassword] = useState("test123")
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const testConnection = async () => {
    try {
      // Test Firestore access
      const ebooksSnap = await getDocs(query(collection(db, 'ebooks'), limit(1)))
      addResult(`✅ Firestore 'ebooks' accessible (${ebooksSnap.size} records)`)

      const profilesSnap = await getDocs(query(collection(db, 'profiles'), limit(1)))
      addResult(`✅ Firestore 'profiles' accessible (${profilesSnap.size} records)`)

      // Test Firebase Auth state
      const user = auth.currentUser
      if (user) {
        addResult(`✅ Auth user: ${user.email}`)
      } else {
        addResult("ℹ️ No authenticated user")
      }
    } catch (error) {
      addResult(`❌ Connection test failed: ${error}`)
    }
  }

  const testLogin = async () => {
    addResult(`🔐 Testing login with ${testEmail}...`)
    const result = await login(testEmail, testPassword)
    if (result) {
      addResult("✅ Login successful")
    } else {
      addResult("❌ Login failed")
    }
  }

  const testSignup = async () => {
    addResult(`📝 Testing signup with ${testEmail}...`)
    const result = await signup(testEmail, testPassword, "Test", "User")
    if (result) {
      addResult("✅ Signup successful")
    } else {
      addResult("❌ Signup failed")
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-96 overflow-auto z-50 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Auth Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="debug-email" className="text-xs">Email</Label>
            <Input
              id="debug-email"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="h-7 text-xs"
            />
          </div>
          <div>
            <Label htmlFor="debug-password" className="text-xs">Password</Label>
            <Input
              id="debug-password"
              type="password"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              className="h-7 text-xs"
            />
          </div>
        </div>
        
        <div className="flex gap-1 flex-wrap">
          <Button onClick={testConnection} size="sm" className="h-6 text-xs">
            Test DB
          </Button>
          <Button onClick={testLogin} size="sm" className="h-6 text-xs">
            Login
          </Button>
          <Button onClick={testSignup} size="sm" className="h-6 text-xs">
            Signup
          </Button>
          <Button onClick={clearResults} size="sm" variant="outline" className="h-6 text-xs">
            Clear
          </Button>
        </div>

        <div className="text-xs space-y-1">
          <div className="font-semibold">Auth State:</div>
          <div className="bg-gray-100 p-1 rounded text-xs">
            <div>Loading: {state.isLoading ? '✅' : '❌'}</div>
            <div>Authenticated: {state.isAuthenticated ? '✅' : '❌'}</div>
            <div>User: {state.user ? `${state.user.display_name || state.user.full_name || state.user.email} (${state.user.role})` : '❌'}</div>
          </div>
        </div>

        <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
          <div className="font-semibold">Test Results:</div>
          <div className="bg-gray-100 p-1 rounded space-y-1">
            {testResults.length === 0 ? (
              <div className="text-gray-500">No tests run yet</div>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="text-xs break-words">{result}</div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
