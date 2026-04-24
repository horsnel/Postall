'use client';

import Link from "next/link";

import { useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { cities } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import MagicLinkModal from '@/components/layout/magic-link-modal';
import {
  ChevronLeft,
  Recycle,
  Heart,
  Leaf,
  Clock,
  MapPin,
  Camera,
  Plus,
  Gift,
  Users,
  CheckCircle2,
  ArrowRight,
  Package,
  TrendingUp,
  Sparkles,
  X,
  Upload,
  Tag,
  Send,
} from 'lucide-react';

interface FreecycleItem {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  status: 'available' | 'requested' | 'picked_up';
  postedAgo: string;
  postedBy: string;
  photoCount: number;
}

const freecycleCategories = [
  'Electronics',
  'Furniture',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Toys',
  'Kitchen',
  'Other',
];

const sampleFreecycleItems: FreecycleItem[] = [
  {
    id: '1',
    title: 'Wooden Bookshelf',
    description: 'Solid mahogany bookshelf, 5 shelves. Some wear but still sturdy and beautiful. Perfect for a home office or living room.',
    category: 'Furniture',
    city: 'Lagos',
    status: 'available',
    postedAgo: '2h ago',
    postedBy: 'chioma_eze',
    photoCount: 3,
  },
  {
    id: '2',
    title: 'Kids Bicycle',
    description: 'Blue kids bicycle, suitable for ages 5-8. Needs new tires but otherwise in good working condition.',
    category: 'Sports',
    city: 'Lagos',
    status: 'available',
    postedAgo: '5h ago',
    postedBy: 'chinedu_okeke',
    photoCount: 2,
  },
  {
    id: '3',
    title: 'Samsung Galaxy S9',
    description: 'Working Galaxy S9, unlocked. Has a cracked screen protector but screen underneath is fine. Comes with charger.',
    category: 'Electronics',
    city: 'Abuja',
    status: 'requested',
    postedAgo: '1d ago',
    postedBy: 'amina_hassan',
    photoCount: 4,
  },
  {
    id: '4',
    title: 'Box of Children\'s Books',
    description: 'Over 30 children\'s storybooks and educational books, ages 3-10. Great condition, some barely used.',
    category: 'Books',
    city: 'Lagos',
    status: 'available',
    postedAgo: '3h ago',
    postedBy: 'funke_adeyemi',
    photoCount: 2,
  },
  {
    id: '5',
    title: 'Kitchen Pot Set',
    description: 'Set of 3 non-stick pots (small, medium, large) with lids. Still have plenty of life left.',
    category: 'Kitchen',
    city: 'Ibadan',
    status: 'picked_up',
    postedAgo: '2d ago',
    postedBy: 'adewale_adeniyi',
    photoCount: 1,
  },
  {
    id: '6',
    title: 'Office Chair',
    description: 'Ergonomic office chair with lumbar support. Adjustable height and armrests. Some fabric wear.',
    category: 'Furniture',
    city: 'Port Harcourt',
    status: 'available',
    postedAgo: '6h ago',
    postedBy: 'chukwuma_eme',
    photoCount: 3,
  },
  {
    id: '7',
    title: 'Winter Jackets (2)',
    description: 'Two warm winter jackets, sizes M and L. Gently used, clean and in great condition.',
    category: 'Clothing',
    city: 'Kano',
    status: 'available',
    postedAgo: '8h ago',
    postedBy: 'musibau_aliyu',
    photoCount: 2,
  },
  {
    id: '8',
    title: 'Garden Tools Set',
    description: 'Shovel, rake, pruning shears, and watering can. Used but functional. Great for starting a garden.',
    category: 'Home & Garden',
    city: 'Abuja',
    status: 'requested',
    postedAgo: '1d ago',
    postedBy: 'halima_usman',
    photoCount: 2,
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  available: {
    label: 'Available',
    className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
  },
  requested: {
    label: 'Requested',
    className: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
  },
  picked_up: {
    label: 'Picked Up',
    className: 'bg-gray-100 text-gray-500 hover:bg-gray-200',
  },
};

export default function FreecyclePage() {
  const { user } = useAuthStore();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);

  // Filters
  const [cityFilter, setCityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Post form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formCity, setFormCity] = useState('');
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  const filteredItems = sampleFreecycleItems.filter((item) => {
    if (cityFilter !== 'all' && item.city !== cityFilter) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    return true;
  });

  const handleClaim = () => {
    if (!user) {
      setAuthModalOpen(true);
    }
  };

  const handlePostItem = async () => {
    if (!user || !formTitle || !formDescription || !formCategory || !formCity) return;
    setPosting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setPosting(false);
    setPosted(true);
    setTimeout(() => {
      setPostModalOpen(false);
      setPosted(false);
      setFormTitle('');
      setFormDescription('');
      setFormCategory('');
      setFormCity('');
    }, 2000);
  };

  const openPostModal = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setPostModalOpen(true);
  };

  return (
    <div className="min-h-[60vh]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Badge className="bg-white/20 text-white mb-4 hover:bg-white/20">Freecycle Tool</Badge>
          <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
            <Recycle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Give Away, Don&apos;t Throw Away
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl mb-8">
            Reduce waste and help your community. Give away items you no longer need
            to someone who can use them. It&apos;s free, eco-friendly, and builds connections.
          </p>
          <Button
            size="lg"
            className="bg-white text-emerald-700 hover:bg-emerald-50 h-12 px-8 text-base"
            onClick={openPostModal}
          >
            <Gift className="h-5 w-5 mr-2" />
            Post Free Item
          </Button>
          <Link href="/browse#tools" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mt-6">
            <ChevronLeft className="h-4 w-4" />Back to All Tools
          </Link>
        </div>
      </div>

      {/* Environmental Impact Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="shadow-lg border-0">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl shrink-0">
                <Recycle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2,847</p>
                <p className="text-sm text-gray-500">Items Given Away</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-teal-100 rounded-xl shrink-0">
                <Leaf className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">14.2 tons</p>
                <p className="text-sm text-gray-500">CO₂ Saved from Landfills</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-cyan-100 rounded-xl shrink-0">
                <Users className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">1,523</p>
                <p className="text-sm text-gray-500">Happy Recipients</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How Freecycle Works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          How Freecycle Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              step: '1',
              icon: Upload,
              title: 'Post Your Item',
              description: 'Take a photo, add a description, and list your item for free. Set your pickup city.',
              color: 'emerald',
            },
            {
              step: '2',
              icon: Send,
              title: 'Someone Claims It',
              description: 'Interested people can claim your item. You choose who gets it from the requests.',
              color: 'teal',
            },
            {
              step: '3',
              icon: Heart,
              title: 'Arrange Pickup',
              description: 'Meet at a Safe Spot to hand over the item. Use Proof Cam to document the exchange.',
              color: 'cyan',
            },
          ].map((item) => (
            <Card key={item.step} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <div className={`p-2.5 rounded-xl mx-auto mb-3 w-fit ${
                  item.color === 'emerald' ? 'bg-emerald-100' :
                  item.color === 'teal' ? 'bg-teal-100' : 'bg-cyan-100'
                }`}>
                  <item.icon className={`h-6 w-6 ${
                    item.color === 'emerald' ? 'text-emerald-600' :
                    item.color === 'teal' ? 'text-teal-600' : 'text-cyan-600'
                  }`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Filters & Items Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Free Items Near You</h2>
            <p className="text-sm text-gray-500 mt-1">{filteredItems.length} items available</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {freecycleCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <Recycle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
              <p className="text-sm text-gray-500 mb-4">
                Try adjusting your filters or be the first to post in this area!
              </p>
              <Button variant="outline" onClick={() => { setCityFilter('all'); setCategoryFilter('all'); }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item) => {
              const status = statusConfig[item.status];
              return (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                  {/* Photo placeholder */}
                  <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="h-10 w-10 text-gray-300" />
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge className={status.className}>{status.label}</Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-white/80 text-gray-700">
                        <Camera className="h-3 w-3 mr-1" />
                        {item.photoCount}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {item.category}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {item.city}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.postedAgo}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                          {item.postedBy.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-500">{item.postedBy}</span>
                      </div>
                      <Button
                        size="sm"
                        disabled={item.status !== 'available'}
                        onClick={handleClaim}
                        className="text-xs h-8"
                      >
                        {item.status === 'available' ? (
                          <>
                            <Gift className="h-3 w-3 mr-1" />
                            Claim
                          </>
                        ) : item.status === 'requested' ? (
                          'Requested'
                        ) : (
                          'Picked Up'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Post Item Modal */}
      <Dialog open={postModalOpen} onOpenChange={(open) => {
        setPostModalOpen(open);
        if (!open) setPosted(false);
      }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-emerald-600" />
              Post a Free Item
            </DialogTitle>
            <DialogDescription>
              Give away items you no longer need. It&apos;s free and helps reduce waste!
            </DialogDescription>
          </DialogHeader>

          {posted ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Item Posted!</h3>
              <p className="text-sm text-gray-500">
                Your item is now live. People in your area can see and claim it.
              </p>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {/* Photo Upload Area */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors cursor-pointer">
                <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Add Photos</p>
                <p className="text-xs text-gray-400 mt-1">Click to upload up to 5 photos</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fc-title">Title</Label>
                <Input
                  id="fc-title"
                  placeholder="e.g. Wooden Bookshelf"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fc-desc">Description</Label>
                <Textarea
                  id="fc-desc"
                  placeholder="Describe the item, its condition, and any details..."
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formCategory} onValueChange={setFormCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {freecycleCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Select value={formCity} onValueChange={setFormCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setPostModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handlePostItem}
                  disabled={posting || !formTitle || !formDescription || !formCategory || !formCity}
                >
                  {posting ? (
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Post Item
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <MagicLinkModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
