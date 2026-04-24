'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/auth-store'
import { formatCurrency } from '@/lib/constants'
import {
  Store as StoreIcon,
  Plus,
  ShoppingCart,
  Eye,
  Package,
  TrendingUp,
  Star,
  Pencil,
  Trash2,
  Link2,
  LayoutGrid,
  List,
  ImageIcon,
  Loader2,
  ExternalLink,
  ArrowRight,
  ChartColumnIncreasing,
} from 'lucide-react'

// ---- Types ----
interface StoreProduct {
  id: string
  name: string
  description: string
  price: number
  category: string
  condition: string
  stock: number
  views: number
  gradient: string
}

interface StoreData {
  name: string
  description: string
  category: string
  coverGradient: string
  rating: number
  createdAt: string
  products: StoreProduct[]
}

// ---- Cover Gradient Presets ----
const coverGradients = [
  { name: 'Emerald', value: 'from-emerald-500 to-teal-600', ring: 'ring-emerald-500' },
  { name: 'Amber', value: 'from-amber-500 to-orange-600', ring: 'ring-amber-500' },
  { name: 'Rose', value: 'from-rose-500 to-pink-600', ring: 'ring-rose-500' },
  { name: 'Blue', value: 'from-blue-500 to-indigo-600', ring: 'ring-blue-500' },
  { name: 'Purple', value: 'from-purple-500 to-violet-600', ring: 'ring-purple-500' },
  { name: 'Cyan', value: 'from-cyan-500 to-sky-600', ring: 'ring-cyan-500' },
]

const storeCategories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Services', 'Food & Drinks', 'Other']
const productCategories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Vehicles', 'Services', 'Other']

// ---- Sample Data ----
const sampleStore: StoreData = {
  name: 'Demo Store',
  description: 'Your one-stop shop for quality electronics and gadgets at the best prices in Nigeria. Verified seller with 89+ items sold!',
  category: 'Electronics',
  coverGradient: 'from-emerald-500 to-teal-600',
  rating: 4.8,
  createdAt: 'March 2023',
  products: [
    { id: 'sp1', name: 'iPhone 14 Pro Max 256GB', description: 'Space Black, excellent condition with original accessories', price: 650000, category: 'Electronics', condition: 'Like New', stock: 3, views: 234, gradient: 'from-emerald-100 to-teal-100' },
    { id: 'sp2', name: 'Samsung Galaxy Watch 6', description: 'Bluetooth 44mm, Midnight Black, 1 year warranty', price: 185000, category: 'Electronics', condition: 'New', stock: 8, views: 156, gradient: 'from-amber-100 to-orange-100' },
    { id: 'sp3', name: 'MacBook Air M2 512GB', description: 'Space Gray, barely used - selling to upgrade', price: 820000, category: 'Electronics', condition: 'Like New', stock: 1, views: 345, gradient: 'from-blue-100 to-indigo-100' },
    { id: 'sp4', name: 'Sony WH-1000XM5 Headphones', description: 'Noise cancelling, premium sound quality, black', price: 295000, category: 'Electronics', condition: 'New', stock: 5, views: 189, gradient: 'from-purple-100 to-violet-100' },
    { id: 'sp5', name: 'Gaming Chair - Secretlab Titan', description: 'Evo 2024, ergonomic, excellent for long gaming sessions', price: 450000, category: 'Home & Garden', condition: 'New', stock: 2, views: 98, gradient: 'from-rose-100 to-pink-100' },
    { id: 'sp6', name: 'Standing Desk Electric Pro', description: 'Adjustable height, memory presets, cable management', price: 280000, category: 'Home & Garden', condition: 'New', stock: 4, views: 123, gradient: 'from-cyan-100 to-sky-100' },
  ],
}

const conditionColors: Record<string, string> = {
  'New': 'bg-emerald-100 text-emerald-700',
  'Like New': 'bg-teal-100 text-teal-700',
  'Good': 'bg-amber-100 text-amber-700',
  'Fair': 'bg-orange-100 text-orange-700',
}

export default function MyStorePage() {
  const { user } = useAuthStore()
  const [store, setStore] = useState<StoreData | null>(sampleStore)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [addProductOpen, setAddProductOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)

  // Store creation state
  const [newStoreName, setNewStoreName] = useState('')
  const [newStoreDesc, setNewStoreDesc] = useState('')
  const [newStoreCategory, setNewStoreCategory] = useState('')
  const [newStoreGradient, setNewStoreGradient] = useState(coverGradients[0].value)
  const [creatingStore, setCreatingStore] = useState(false)

  // Product creation state
  const [newProductName, setNewProductName] = useState('')
  const [newProductDesc, setNewProductDesc] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('')
  const [newProductCategory, setNewProductCategory] = useState('')
  const [newProductCondition, setNewProductCondition] = useState('')
  const [newProductStock, setNewProductStock] = useState('')
  const [addingProduct, setAddingProduct] = useState(false)

  const handleCreateStore = () => {
    if (!newStoreName.trim()) {
      toast.error('Please enter a store name')
      return
    }
    setCreatingStore(true)
    setTimeout(() => {
      setStore({
        name: newStoreName,
        description: newStoreDesc,
        category: newStoreCategory || 'Other',
        coverGradient: newStoreGradient,
        rating: 0,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        products: [],
      })
      setCreatingStore(false)
      toast.success('Store created successfully!')
    }, 800)
  }

  const handleAddProduct = () => {
    if (!newProductName.trim() || !newProductPrice) {
      toast.error('Please fill in product name and price')
      return
    }
    setAddingProduct(true)
    setTimeout(() => {
      const gradients = ['from-emerald-100 to-teal-100', 'from-amber-100 to-orange-100', 'from-blue-100 to-indigo-100', 'from-purple-100 to-violet-100', 'from-rose-100 to-pink-100', 'from-cyan-100 to-sky-100']
      const product: StoreProduct = {
        id: `sp-new-${Date.now()}`,
        name: newProductName,
        description: newProductDesc,
        price: parseInt(newProductPrice) || 0,
        category: newProductCategory || 'Other',
        condition: newProductCondition || 'New',
        stock: parseInt(newProductStock) || 0,
        views: 0,
        gradient: gradients[Math.floor(Math.random() * gradients.length)],
      }
      if (store) {
        setStore({ ...store, products: [product, ...store.products] })
      }
      // Reset form
      setNewProductName('')
      setNewProductDesc('')
      setNewProductPrice('')
      setNewProductCategory('')
      setNewProductCondition('')
      setNewProductStock('')
      setAddingProduct(false)
      setAddProductOpen(false)
      toast.success('Product added!')
    }, 800)
  }

  const handleDeleteProduct = () => {
    if (productToDelete && store) {
      setStore({ ...store, products: store.products.filter(p => p.id !== productToDelete) })
      toast.success('Product deleted')
    }
    setDeleteDialogOpen(false)
    setProductToDelete(null)
  }

  const handleEditProduct = (product: StoreProduct) => {
    setEditingProduct(product.id)
    setNewProductName(product.name)
    setNewProductDesc(product.description)
    setNewProductPrice(product.price.toString())
    setNewProductCategory(product.category)
    setNewProductCondition(product.condition)
    setNewProductStock(product.stock.toString())
    setAddProductOpen(true)
  }

  const handleSaveEdit = () => {
    if (editingProduct && store && newProductName.trim() && newProductPrice) {
      setStore({
        ...store,
        products: store.products.map(p =>
          p.id === editingProduct
            ? {
                ...p,
                name: newProductName,
                description: newProductDesc,
                price: parseInt(newProductPrice) || 0,
                category: newProductCategory || p.category,
                condition: newProductCondition || p.condition,
                stock: parseInt(newProductStock) || p.stock,
              }
            : p
        ),
      })
      setEditingProduct(null)
      setAddProductOpen(false)
      // Reset form
      setNewProductName('')
      setNewProductDesc('')
      setNewProductPrice('')
      setNewProductCategory('')
      setNewProductCondition('')
      setNewProductStock('')
      toast.success('Product updated!')
    }
  }

  // Store Setup View
  if (!store) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6">
              <StoreIcon className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Create Your Store</h2>
            <p className="text-muted-foreground max-w-sm mb-8">
              Set up your online store on PostAll and start selling to thousands of buyers across Nigeria.
            </p>

            <div className="w-full space-y-4 text-left">
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Store Name *</Label>
                <Input
                  placeholder="e.g., TechDeals NG"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className="h-10"
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Description</Label>
                <Textarea
                  placeholder="Tell buyers what your store is about..."
                  value={newStoreDesc}
                  onChange={(e) => setNewStoreDesc(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Category</Label>
                <Select value={newStoreCategory} onValueChange={setNewStoreCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {storeCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Cover Color</Label>
                <div className="flex gap-3 flex-wrap">
                  {coverGradients.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => setNewStoreGradient(g.value)}
                      className={`h-10 w-10 rounded-lg bg-gradient-to-br ${g.value} transition-all ${
                        newStoreGradient === g.value ? `ring-2 ring-offset-2 ${g.ring} scale-110` : 'opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <Button
                className="w-full mt-2"
                onClick={handleCreateStore}
                disabled={creatingStore || !newStoreName.trim()}
              >
                {creatingStore ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Store...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <StoreIcon className="h-4 w-4" />
                    Create Store
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Store Dashboard View
  const totalViews = store.products.reduce((sum, p) => sum + p.views, 0)
  const totalRevenue = store.products.reduce((sum, p) => sum + (p.price * (8 - p.stock)), 0)

  return (
    <div className="p-6 space-y-6">
      {/* Store Header */}
      <Card className="overflow-hidden">
        <div className={`h-32 bg-gradient-to-r ${store.coverGradient} relative`}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        </div>
        <CardContent className="p-5 pt-0 -mt-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${store.coverGradient} flex items-center justify-center border-4 border-white shadow-lg`}>
                  <StoreIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold flex items-center gap-2">
                    {store.name}
                    <Badge variant="secondary" className="text-xs">
                      {store.category}
                    </Badge>
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{store.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {store.rating} rating
                    </span>
                    <span>Selling since {store.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" className="gap-2 shrink-0 w-fit" onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/store/${(user?.username || 'demostore').toLowerCase()}`)
              toast.success('Store link copied!')
            }}>
              <Link2 className="h-4 w-4" />
              Store Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Package, label: 'Total Products', value: store.products.length, color: 'bg-emerald-50 text-emerald-700 border-emerald-100', iconColor: 'text-emerald-600' },
          { icon: Eye, label: 'Views This Week', value: totalViews, color: 'bg-blue-50 text-blue-700 border-blue-100', iconColor: 'text-blue-600' },
          { icon: ShoppingCart, label: 'Orders', value: 24, color: 'bg-amber-50 text-amber-700 border-amber-100', iconColor: 'text-amber-600' },
          { icon: TrendingUp, label: 'Revenue', value: formatCurrency(totalRevenue), color: 'bg-teal-50 text-teal-700 border-teal-100', iconColor: 'text-teal-600' },
        ].map((stat) => (
          <Card key={stat.label} className={`${stat.color} border`}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg bg-white/60 flex items-center justify-center shrink-0 ${stat.iconColor}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-xs opacity-70">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Products Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          Products
          <Badge variant="secondary">{store.products.length}</Badge>
        </h2>
        <div className="flex items-center gap-2">
          <Dialog open={addProductOpen} onOpenChange={(open) => {
            setAddProductOpen(open)
            if (!open) {
              setEditingProduct(null)
              setNewProductName('')
              setNewProductDesc('')
              setNewProductPrice('')
              setNewProductCategory('')
              setNewProductCondition('')
              setNewProductStock('')
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-1.5">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">Product Name *</Label>
                  <Input
                    placeholder="e.g., iPhone 14 Pro Max"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">Description</Label>
                  <Textarea
                    placeholder="Describe your product..."
                    value={newProductDesc}
                    onChange={(e) => setNewProductDesc(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">Price (₦) *</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">Stock Quantity</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newProductStock}
                      onChange={(e) => setNewProductStock(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">Category</Label>
                    <Select value={newProductCategory} onValueChange={setNewProductCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {productCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">Condition</Label>
                    <Select value={newProductCondition} onValueChange={setNewProductCondition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Like New">Like New</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1.5 block">Photos</Label>
                  <Button variant="outline" className="w-full gap-2 h-10 border-dashed">
                    <ImageIcon className="h-4 w-4" />
                    Upload Product Photos
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={editingProduct ? handleSaveEdit : handleAddProduct}
                    disabled={addingProduct || !newProductName.trim() || !newProductPrice}
                  >
                    {addingProduct ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </span>
                    ) : editingProduct ? 'Save Changes' : 'Add Product'}
                  </Button>
                  {editingProduct && (
                    <Button variant="outline" onClick={() => { setEditingProduct(null); setAddProductOpen(false) }}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              className="h-9 w-9"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              className="h-9 w-9"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid / List */}
      {store.products.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-1">No Products Yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Add your first product to start selling on PostAll.
            </p>
            <Button className="mt-4 gap-2" onClick={() => setAddProductOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {store.products.map((product) => (
            <Card key={product.id} className="overflow-hidden group">
              <div className={`h-36 bg-gradient-to-br ${product.gradient} relative flex items-center justify-center`}>
                <ShoppingCart className="h-10 w-10 opacity-30" />
                <Badge className={`absolute top-3 right-3 ${conditionColors[product.condition] || 'bg-gray-100 text-gray-700'}`}>
                  {product.condition}
                </Badge>
                <Badge variant="secondary" className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-[10px]">
                  {product.category}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-emerald-600 mt-1">
                  {formatCurrency(product.price)}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {product.stock} in stock
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {product.views} views
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-rose-600 hover:text-rose-600 hover:bg-rose-50"
                    onClick={() => { setProductToDelete(product.id); setDeleteDialogOpen(true) }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {store.products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`h-20 w-20 rounded-lg bg-gradient-to-br ${product.gradient} flex items-center justify-center shrink-0`}>
                    <ShoppingCart className="h-8 w-8 opacity-30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                      <Badge className={`text-[10px] px-1.5 py-0 ${conditionColors[product.condition] || 'bg-gray-100 text-gray-700'}`}>
                        {product.condition}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                    <p className="text-lg font-bold text-emerald-600 mt-0.5">{formatCurrency(product.price)}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {product.stock} in stock
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {product.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <ChartColumnIncreasing className="h-3 w-3" />
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => handleEditProduct(product)}>
                      <Pencil className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-rose-600 hover:text-rose-600 hover:bg-rose-50"
                      onClick={() => { setProductToDelete(product.id); setDeleteDialogOpen(true) }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
