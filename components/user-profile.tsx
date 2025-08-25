"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { User, Settings, BookOpen, Download, ShoppingBag } from "lucide-react"

// Mock recent orders for the profile
const recentOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "completed",
    total: 24.99,
    itemCount: 1,
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "completed",
    total: 43.98,
    itemCount: 2,
  },
]

export function UserProfile() {
  const { state, dispatch } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: state.user?.firstName || "",
    lastName: state.user?.lastName || "",
    email: state.user?.email || "",
  })

  const handleSave = () => {
    dispatch({
      type: "UPDATE_USER",
      payload: formData,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      firstName: state.user?.firstName || "",
      lastName: state.user?.lastName || "",
      email: state.user?.email || "",
    })
    setIsEditing(false)
  }

  if (!state.user) return null

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "processing":
        return "secondary"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarImage src={state.user.avatar || "/placeholder.svg"} />
          <AvatarFallback className="text-lg">
            {state.user.firstName[0]}
            {state.user.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {state.user.firstName} {state.user.lastName}
          </h1>
          <p className="text-muted-foreground">{state.user.email}</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center space-x-2">
            <ShoppingBag className="h-4 w-4" />
            <span>Orders</span>
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>My Library</span>
          </TabsTrigger>
          <TabsTrigger value="downloads" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Downloads</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSave}>Save Changes</Button>
                    <Button variant="outline" onClick={handleCancel} className="bg-transparent">
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <p className="text-foreground">{state.user.firstName}</p>
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <p className="text-foreground">{state.user.lastName}</p>
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-foreground">{state.user.email}</p>
                  </div>
                  <div>
                    <Label>Member Since</Label>
                    <p className="text-foreground">{new Date(state.user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Link href="/orders">
                  <Button variant="outline" className="bg-transparent">
                    View All Orders
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Order {order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()} • {order.itemCount} item(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusVariant(order.status)} className="mb-2">
                        {order.status}
                      </Badge>
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library">
          <Card>
            <CardHeader>
              <CardTitle>My Library</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your purchased books will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downloads">
          <Card>
            <CardHeader>
              <CardTitle>Download History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your download history will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Account settings and preferences will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
