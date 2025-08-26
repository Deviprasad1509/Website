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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Search, Upload, Loader2, Star, FileText } from "lucide-react"
import Image from "next/image"
import { db } from "@/lib/database.service"
import { fileUploadService } from "@/lib/file-upload.service"

const CATEGORIES = [
  "Fiction",
  "Non-Fiction", 
  "Self-Help",
  "Science Fiction",
  "Romance",
  "Mystery",
  "Biography",
  "History",
  "Business",
  "Technology"
]

interface Book {
  id: string
  title: string
  author: string
  category: string
  price: number
  cover_image: string | null
  pdf_url: string | null
  description: string
  is_featured: boolean
  tags: string[] | null
  created_at: string
}

export function ProductManagement() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    loadBooks()
  }, [])

  useEffect(() => {
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredBooks(filtered)
  }, [books, searchTerm])

  const loadBooks = async () => {
    try {
      const { data, error } = await db.getEbooks({ limit: 1000 })
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load books",
          variant: "destructive",
        })
      } else if (data) {
        setBooks(data)
        setFilteredBooks(data)
      }
    } catch (err) {
      console.error('Error loading books:', err)
      toast({
        title: "Error",
        description: "Failed to load books",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditBook = (book: Book) => {
    setEditingBook(book)
    setIsEditDialogOpen(true)
  }

  const handleDeleteBook = async (bookId: string) => {
    try {
      const { success, error } = await db.deleteEbook(bookId)
      if (success) {
        toast({
          title: "Success",
          description: "Book deleted successfully",
        })
        loadBooks() // Refresh the list
      } else {
        toast({
          title: "Error",
          description: "Failed to delete book",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error('Error deleting book:', err)
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      })
    }
  }

  const handleBookAdded = () => {
    setIsAddDialogOpen(false)
    loadBooks() // Refresh the list
  }

  const handleBookUpdated = () => {
    setIsEditDialogOpen(false)
    setEditingBook(null)
    loadBooks() // Refresh the list
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading books...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <AddProductForm onClose={() => setIsAddDialogOpen(false)} onBookAdded={handleBookAdded} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
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
                <TableHead>Product</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>PDF Status</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Image
                        src={book.cover_image || "/placeholder.svg"}
                        alt={book.title}
                        width={40}
                        height={60}
                        className="rounded object-cover"
                      />
                      <div>
                        <p className="font-medium">{book.title}</p>
                        {book.is_featured && (
                          <Badge variant="outline" className="mt-1">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{book.category}</Badge>
                  </TableCell>
                  <TableCell>${book.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge variant={book.pdf_url ? "default" : "destructive"}>
                        {book.pdf_url ? "Available" : "No PDF"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">Active</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditBook(book)}
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
                            <AlertDialogTitle>Delete Book</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{book.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteBook(book.id)}>
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
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingBook && (
            <EditProductForm 
              book={editingBook}
              onClose={() => {
                setIsEditDialogOpen(false)
                setEditingBook(null)
              }} 
              onBookUpdated={handleBookUpdated} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AddProductForm({ onClose, onBookAdded }: { onClose: () => void; onBookAdded: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    price: '',
    description: '',
    tags: '',
    is_featured: false
  })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.author || !formData.category || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create the book first
      const bookData = {
        title: formData.title,
        author: formData.author,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : null,
        is_featured: formData.is_featured
      }

      const { data: book, error: createError } = await db.createEbook(bookData)

      if (createError || !book) {
        toast({
          title: "Error",
          description: "Failed to create book",
          variant: "destructive",
        })
        return
      }

      // Upload files if provided
      let coverUrl = null
      let pdfUrl = null

      if (coverFile) {
        const { url, error } = await fileUploadService.uploadBookCover(coverFile, book.id)
        if (error) {
          console.error('Error uploading cover:', error)
        } else {
          coverUrl = url
        }
      }

      if (pdfFile) {
        const { url, error } = await fileUploadService.uploadBookPdf(pdfFile, book.id)
        if (error) {
          console.error('Error uploading PDF:', error)
        } else {
          pdfUrl = url
        }
      }

      // Update book with file URLs
      if (coverUrl || pdfUrl) {
        const updates: any = {}
        if (coverUrl) updates.cover_image = coverUrl
        if (pdfUrl) updates.pdf_url = pdfUrl

        await db.updateEbook(book.id, updates)
      }

      toast({
        title: "Success",
        description: "Book created successfully",
      })

      onBookAdded()
    } catch (err) {
      console.error('Error creating book:', err)
      toast({
        title: "Error",
        description: "Failed to create book",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input 
            id="title" 
            placeholder="Book title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="author">Author *</Label>
          <Input 
            id="author" 
            placeholder="Author name"
            value={formData.author}
            onChange={(e) => handleInputChange('author', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="price">Price *</Label>
          <Input 
            id="price" 
            type="number" 
            step="0.01" 
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="Book description" 
          rows={4}
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input 
          id="tags" 
          placeholder="Fiction, Adventure, Classic"
          value={formData.tags}
          onChange={(e) => handleInputChange('tags', e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={formData.is_featured}
          onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
        />
        <Label htmlFor="featured">Featured Book</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cover">Book Cover</Label>
          <Input
            id="cover"
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
          />
        </div>
        <div>
          <Label htmlFor="pdf">PDF File</Label>
          <Input
            id="pdf"
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          />
        </div>
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
            'Add Product'
          )}
        </Button>
      </div>
    </form>
  )
}

function EditProductForm({ book, onClose, onBookUpdated }: { book: Book; onClose: () => void; onBookUpdated: () => void }) {
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    category: book.category,
    price: book.price.toString(),
    description: book.description,
    tags: book.tags ? book.tags.join(', ') : '',
    is_featured: book.is_featured
  })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.author || !formData.category || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare update data
      const updateData: any = {
        title: formData.title,
        author: formData.author,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : null,
        is_featured: formData.is_featured
      }

      // Upload new files if provided
      if (coverFile) {
        const { url, error } = await fileUploadService.uploadBookCover(coverFile, book.id)
        if (error) {
          console.error('Error uploading cover:', error)
          toast({
            title: "Warning",
            description: "Failed to upload new cover image",
            variant: "destructive",
          })
        } else {
          updateData.cover_image = url
        }
      }

      if (pdfFile) {
        const { url, error } = await fileUploadService.uploadBookPdf(pdfFile, book.id)
        if (error) {
          console.error('Error uploading PDF:', error)
          toast({
            title: "Warning",
            description: "Failed to upload new PDF file",
            variant: "destructive",
          })
        } else {
          updateData.pdf_url = url
        }
      }

      // Update the book
      const { success, error } = await db.updateEbook(book.id, updateData)

      if (success) {
        toast({
          title: "Success",
          description: "Book updated successfully",
        })
        onBookUpdated()
      } else {
        toast({
          title: "Error",
          description: "Failed to update book",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error('Error updating book:', err)
      toast({
        title: "Error",
        description: "Failed to update book",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-title">Title *</Label>
          <Input 
            id="edit-title" 
            placeholder="Book title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-author">Author *</Label>
          <Input 
            id="edit-author" 
            placeholder="Author name"
            value={formData.author}
            onChange={(e) => handleInputChange('author', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="edit-price">Price *</Label>
          <Input 
            id="edit-price" 
            type="number" 
            step="0.01" 
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="edit-description">Description</Label>
        <Textarea 
          id="edit-description" 
          placeholder="Book description" 
          rows={4}
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
        <Input 
          id="edit-tags" 
          placeholder="Fiction, Adventure, Classic"
          value={formData.tags}
          onChange={(e) => handleInputChange('tags', e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="edit-featured"
          checked={formData.is_featured}
          onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
        />
        <Label htmlFor="edit-featured">Featured Book</Label>
      </div>

      {/* Current files display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Current Cover</Label>
          {book.cover_image ? (
            <div className="flex items-center space-x-2">
              <Image 
                src={book.cover_image} 
                alt="Current cover" 
                width={60} 
                height={80} 
                className="rounded object-cover"
              />
              <span className="text-sm text-muted-foreground">Current cover image</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No cover image</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Current PDF</Label>
          {book.pdf_url ? (
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span className="text-sm text-muted-foreground">PDF file available</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No PDF file</p>
          )}
        </div>
      </div>

      {/* New file uploads */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-cover">Upload New Cover (optional)</Label>
          <Input
            id="edit-cover"
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
          />
        </div>
        <div>
          <Label htmlFor="edit-pdf">Upload New PDF (optional)</Label>
          <Input
            id="edit-pdf"
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          />
        </div>
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
            'Update Product'
          )}
        </Button>
      </div>
    </form>
  )
}
