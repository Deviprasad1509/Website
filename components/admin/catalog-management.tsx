"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Search, Loader2, FolderOpen, BookOpen } from "lucide-react"
import { db as firestore } from "@/lib/firebase/client"
import { 
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore"

interface Category {
  id: string
  name: string
  description: string | null
  slug: string
  created_at: string
  updated_at: string
}

export function CatalogManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [bookCounts, setBookCounts] = useState<{ [key: string]: number }>({})

  // Firestore collections
  const categoriesCol = collection(firestore, 'categories')

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCategories(filtered)
  }, [categories, searchTerm])

  const loadCategories = async () => {
    try {
      const snap = await getDocs(query(categoriesCol, orderBy('name', 'asc')))
      const categoriesData = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Category[]
      setCategories(categoriesData)
      setFilteredCategories(categoriesData)

      const counts: { [key: string]: number } = {}
      for (const category of categoriesData) {
        const ebooksSnap = await getDocs(query(collection(firestore, 'ebooks'), where('category', '==', category.name)))
        counts[category.id] = ebooksSnap.size
      }
      setBookCounts(counts)
    } catch (err) {
      console.error('Error loading categories:', err)
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setIsEditDialogOpen(true)
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      // Check if category has books
      const category = categories.find(c => c.id === categoryId)
      const ebooksSnap = await getDocs(query(collection(firestore, 'ebooks'), where('category', '==', category?.name)))

      if (ebooksSnap.size > 0) {
        toast({
          title: "Cannot Delete Category",
          description: `This category has ${ebooksSnap.size} books. Please move or delete the books first.`,
          variant: "destructive",
        })
        return
      }

      await deleteDoc(doc(firestore, 'categories', categoryId))

      toast({
        title: "Success",
        description: "Category deleted successfully",
      })

      loadCategories() // Refresh the list
    } catch (err) {
      console.error('Error deleting category:', err)
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const handleCategoryAdded = () => {
    setIsAddDialogOpen(false)
    loadCategories() // Refresh the list
  }

  const handleCategoryUpdated = () => {
    setIsEditDialogOpen(false)
    setEditingCategory(null)
    loadCategories() // Refresh the list
  }

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading categories...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Catalog Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <AddCategoryForm onClose={() => setIsAddDialogOpen(false)} onCategoryAdded={handleCategoryAdded} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Books</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <FolderOpen className="h-4 w-4 text-primary" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {category.description || 'No description'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {category.slug}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{bookCounts[category.id] || 0}</span>
                      <span className="text-sm text-muted-foreground">books</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(category.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{category.name}"? This action cannot be undone.
                              {bookCounts[category.id] > 0 && (
                                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                                  Warning: This category contains {bookCounts[category.id]} books.
                                </div>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No categories found matching your search.' : 'No categories found.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingCategory && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <EditCategoryForm 
              category={editingCategory}
              onClose={() => setIsEditDialogOpen(false)} 
              onCategoryUpdated={handleCategoryUpdated} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function AddCategoryForm({ onClose, onCategoryAdded }: { onClose: () => void; onCategoryAdded: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const slug = createSlug(formData.name)

      await addDoc(collection(firestore, 'categories'), {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        slug,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      })

      toast({
        title: "Success",
        description: "Category created successfully",
      })

      onCategoryAdded()
    } catch (err) {
      console.error('Error creating category:', err)
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="name">Category Name *</Label>
        <Input 
          id="name" 
          placeholder="e.g., Science Fiction"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
        />
        {formData.name && (
          <p className="text-sm text-muted-foreground mt-1">
            Slug: {createSlug(formData.name)}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="Brief description of this category"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose} className="bg-transparent">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Category'
          )}
        </Button>
      </div>
    </form>
  )
}

function EditCategoryForm({ 
  category, 
  onClose, 
  onCategoryUpdated 
}: { 
  category: Category
  onClose: () => void
  onCategoryUpdated: () => void 
}) {
  const [formData, setFormData] = useState({
    name: category.name,
    description: category.description || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const slug = createSlug(formData.name)

      await updateDoc(doc(firestore, 'categories', category.id), {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        slug,
        updated_at: serverTimestamp(),
      })

      toast({
        title: "Success",
        description: "Category updated successfully",
      })

      onCategoryUpdated()
    } catch (err) {
      console.error('Error updating category:', err)
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="name">Category Name *</Label>
        <Input 
          id="name" 
          placeholder="e.g., Science Fiction"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
        />
        {formData.name && (
          <p className="text-sm text-muted-foreground mt-1">
            Slug: {createSlug(formData.name)}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="Brief description of this category"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose} className="bg-transparent">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Category'
          )}
        </Button>
      </div>
    </form>
  )
}
