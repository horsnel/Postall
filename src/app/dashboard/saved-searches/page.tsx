'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuthStore } from '@/lib/auth-store';
import { categories, cities } from '@/lib/constants';
import type { LucideIcon } from 'lucide-react';
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Tag,
  Clock,
  Bell,
  Zap,
  AlertCircle,
  TrendingUp,
  ChartColumnIncreasing,
  Activity,
  CheckCircle2,
  XCircle,
  Mail,
  Smartphone,
  Monitor,
  X,
  ChevronDown,
  Sparkles,
  Star,
  Home,
  Laptop,
  Car,
  Camera,
  Brain,
  SlidersHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';

interface SavedSearchAlert {
  id: string;
  query: string;
  category: string;
  city: string;
  priceMin: string;
  priceMax: string;
  newMatches: number;
  lastAlertSent: string;
  active: boolean;
  frequency: 'realtime' | 'daily' | 'weekly';
}

interface AlertHistoryEntry {
  id: string;
  alertName: string;
  triggeredTime: string;
  newMatches: number;
}

interface SampleListing {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  time: string;
}

const initialAlerts: SavedSearchAlert[] = [
  { id: 'a1', query: 'iPhone 14 Pro Max', category: 'for-sale', city: 'Lagos', priceMin: '', priceMax: '700000', newMatches: 3, lastAlertSent: 'Today, 11:30 AM', active: true, frequency: 'realtime' },
  { id: 'a2', query: '2 Bedroom Flat Lekki', category: 'housing', city: 'Lagos', priceMin: '1500000', priceMax: '3500000', newMatches: 7, lastAlertSent: 'Today, 8:00 AM', active: true, frequency: 'daily' },
  { id: 'a3', query: 'WordPress Developer', category: 'gigs', city: 'all', priceMin: '', priceMax: '', newMatches: 0, lastAlertSent: 'Jan 12, 8:00 AM', active: true, frequency: 'weekly' },
  { id: 'a4', query: 'Toyota Camry 2019', category: 'for-sale', city: 'Abuja', priceMin: '', priceMax: '5000000', newMatches: 12, lastAlertSent: 'Today, 7:20 AM', active: true, frequency: 'realtime' },
  { id: 'a5', query: 'Plumber Near Me', category: 'services', city: 'Lagos', priceMin: '', priceMax: '50000', newMatches: 2, lastAlertSent: 'Yesterday, 9:45 PM', active: true, frequency: 'daily' },
  { id: 'a6', query: 'Part-time Data Entry', category: 'jobs', city: 'all', priceMin: '', priceMax: '', newMatches: 0, lastAlertSent: 'Dec 20, 8:00 AM', active: false, frequency: 'weekly' },
];

const alertHistory: AlertHistoryEntry[] = [
  { id: 'h1', alertName: 'Toyota Camry 2019', triggeredTime: 'Today, 7:20 AM', newMatches: 12 },
  { id: 'h2', alertName: '2 Bedroom Flat Lekki', triggeredTime: 'Today, 8:00 AM', newMatches: 7 },
  { id: 'h3', alertName: 'iPhone 14 Pro Max', triggeredTime: 'Today, 11:30 AM', newMatches: 3 },
  { id: 'h4', alertName: 'Plumber Near Me', triggeredTime: 'Yesterday, 9:45 PM', newMatches: 2 },
  { id: 'h5', alertName: 'WordPress Developer', triggeredTime: 'Jan 12, 8:00 AM', newMatches: 0 },
];

const listingIconMap: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  home: Home,
  laptop: Laptop,
  car: Car,
  wrench: SlidersHorizontal,
  barchart: ChartColumnIncreasing,
  camera: Camera,
};

const sampleListingsByAlert: Record<string, SampleListing[]> = {
  a1: [
    { id: 'sl1', title: 'iPhone 14 Pro Max 256GB - Deep Purple', price: '₦650,000', location: 'Computer Village, Lagos', image: 'smartphone', time: '2 hours ago' },
    { id: 'sl2', title: 'iPhone 14 Pro Max 512GB - Space Black', price: '₦720,000', location: 'Ikeja, Lagos', image: 'smartphone', time: '5 hours ago' },
    { id: 'sl3', title: 'iPhone 14 Pro Max 128GB - Silver (Like New)', price: '₦580,000', location: 'Lekki, Lagos', image: 'smartphone', time: '1 day ago' },
  ],
  a2: [
    { id: 'sl4', title: 'Spacious 2BR Flat in Lekki Phase 1', price: '₦2.5M/yr', location: 'Lekki Phase 1, Lagos', image: 'home', time: '3 hours ago' },
    { id: 'sl5', title: 'Modern 2 Bedroom with Boys Quarter', price: '₦2.8M/yr', location: 'Lekki Ajah, Lagos', image: 'home', time: '6 hours ago' },
    { id: 'sl6', title: 'Newly Renovated 2BR Flat - Serviced', price: '₦3.2M/yr', location: 'Lekki Phase 2, Lagos', image: 'home', time: '1 day ago' },
  ],
  a3: [
    { id: 'sl7', title: 'WordPress Developer Needed for E-commerce', price: '₦150,000', location: 'Remote', image: 'laptop', time: '2 days ago' },
    { id: 'sl8', title: 'Senior WordPress Developer - Long Term', price: '₦250,000/mo', location: 'Lagos', image: 'laptop', time: '5 days ago' },
    { id: 'sl9', title: 'WordPress Blog Setup & SEO', price: '₦80,000', location: 'Abuja', image: 'laptop', time: '1 week ago' },
  ],
  a4: [
    { id: 'sl10', title: 'Toyota Camry 2019 XLE - Excellent Condition', price: '₦14,500,000', location: 'Garki, Abuja', image: 'car', time: '1 hour ago' },
    { id: 'sl11', title: 'Toyota Camry 2019 SE - Low Mileage', price: '₦12,800,000', location: 'Wuse, Abuja', image: 'car', time: '4 hours ago' },
    { id: 'sl12', title: 'Toyota Camry 2019 XSE - Tokunbo', price: '₦16,500,000', location: 'Central Abuja', image: 'car', time: '8 hours ago' },
  ],
  a5: [
    { id: 'sl13', title: 'Expert Plumber - Drainage & Pipes', price: '₦15,000', location: 'Yaba, Lagos', image: 'wrench', time: '30 minutes ago' },
    { id: 'sl14', title: 'Licensed Plumber - Bathroom Installation', price: '₦25,000', location: 'Ikeja, Lagos', image: 'wrench', time: '3 hours ago' },
    { id: 'sl15', title: 'Emergency Plumbing Services', price: '₦20,000', location: 'Victoria Island, Lagos', image: 'wrench', time: '1 day ago' },
  ],
  a6: [
    { id: 'sl16', title: 'Data Entry Clerk - Remote', price: '₦60,000/mo', location: 'Remote', image: 'barchart', time: '3 days ago' },
    { id: 'sl17', title: 'Part-time Data Entry - Excel Expert', price: '₦45,000/mo', location: 'Lagos', image: 'barchart', time: '1 week ago' },
    { id: 'sl18', title: 'Data Entry & Admin Support', price: '₦55,000/mo', location: 'Abuja', image: 'barchart', time: '2 weeks ago' },
  ],
};

const categoryColors: Record<string, string> = {
  'for-sale': 'bg-amber-100 text-amber-700',
  'housing': 'bg-orange-100 text-orange-700',
  'gigs': 'bg-emerald-100 text-emerald-700',
  'services': 'bg-teal-100 text-teal-700',
  'jobs': 'bg-cyan-100 text-cyan-700',
  'community': 'bg-rose-100 text-rose-700',
};

const frequencyLabels: Record<string, string> = {
  realtime: 'Real-time',
  daily: 'Daily Digest',
  weekly: 'Weekly',
};

const frequencyColors: Record<string, string> = {
  realtime: 'bg-emerald-100 text-emerald-700',
  daily: 'bg-emerald-100 text-emerald-700',
  weekly: 'bg-amber-100 text-amber-700',
};

export default function SavedSearchAlertsPage() {
  const user = useAuthStore((s) => s.user);
  const [alerts, setAlerts] = useState<SavedSearchAlert[]>(initialAlerts);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [previewAlertId, setPreviewAlertId] = useState<string | null>(null);

  // Create alert form state
  const [newQuery, setNewQuery] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newCity, setNewCity] = useState('all');
  const [newPriceMin, setNewPriceMin] = useState('');
  const [newPriceMax, setNewPriceMax] = useState('');
  const [newFrequency, setNewFrequency] = useState<'realtime' | 'daily' | 'weekly'>('realtime');
  const [newChannels, setNewChannels] = useState({ inApp: true, email: true, push: false });

  const stats = useMemo(() => ({
    total: alerts.length,
    active: alerts.filter((a) => a.active).length,
    matchesToday: alerts.reduce((sum, a) => sum + a.newMatches, 0),
    triggered: alertHistory.length,
  }), [alerts]);

  const toggleActive = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
    const alert = alerts.find((a) => a.id === id);
    if (alert) {
      toast.success(alert.active ? 'Alert disabled' : 'Alert enabled', {
        description: `"${alert.query}" has been ${alert.active ? 'paused' : 'activated'}`,
      });
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const alert = alerts.find((a) => a.id === deleteId);
    setAlerts((prev) => prev.filter((a) => a.id !== deleteId));
    setDeleteId(null);
    toast.success('Alert deleted', {
      description: `"${alert?.query}" has been removed`,
    });
  };

  const handleCreate = () => {
    if (!newQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    const newAlert: SavedSearchAlert = {
      id: `a${Date.now()}`,
      query: newQuery.trim(),
      category: newCategory || 'for-sale',
      city: newCity,
      priceMin: newPriceMin,
      priceMax: newPriceMax,
      newMatches: 0,
      lastAlertSent: 'Not yet',
      active: true,
      frequency: newFrequency,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setCreateDialogOpen(false);
    resetCreateForm();
    toast.success('Alert created', {
      description: `"${newQuery.trim()}" will notify you of new matches`,
    });
  };

  const resetCreateForm = () => {
    setNewQuery('');
    setNewCategory('');
    setNewCity('all');
    setNewPriceMin('');
    setNewPriceMax('');
    setNewFrequency('realtime');
    setNewChannels({ inApp: true, email: true, push: false });
  };

  const handleFrequencyChange = (id: string, frequency: 'realtime' | 'daily' | 'weekly') => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, frequency } : a)));
    const alert = alerts.find((a) => a.id === id);
    if (alert) {
      toast.success('Frequency updated', {
        description: `"${alert.query}" set to ${frequencyLabels[frequency]}`,
      });
    }
  };

  const previewListings = previewAlertId ? (sampleListingsByAlert[previewAlertId] || []) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Search className="h-6 w-6 text-emerald-600" />
            Saved Search Alerts
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your saved searches and get notified when new listings match
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={(open) => {
          setCreateDialogOpen(open);
          if (!open) resetCreateForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4" />
              Create New Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-emerald-600" />
                Create New Search Alert
              </DialogTitle>
              <DialogDescription>
                Set up an alert to be notified when new listings match your criteria
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="alert-query">Search Query *</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="alert-query"
                    placeholder="e.g. iPhone 14 Pro Max"
                    value={newQuery}
                    onChange={(e) => setNewQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Select value={newCity} onValueChange={setNewCity}>
                    <SelectTrigger>
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
                </div>
              </div>

              <div className="space-y-2">
                <Label>Price Range (optional)</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₦</span>
                    <Input
                      placeholder="Min"
                      value={newPriceMin}
                      onChange={(e) => setNewPriceMin(e.target.value)}
                      className="pl-7"
                      type="number"
                    />
                  </div>
                  <span className="text-muted-foreground text-sm">—</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₦</span>
                    <Input
                      placeholder="Max"
                      value={newPriceMax}
                      onChange={(e) => setNewPriceMax(e.target.value)}
                      className="pl-7"
                      type="number"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Alert Frequency</Label>
                <Select value={newFrequency} onValueChange={(v) => setNewFrequency(v as 'realtime' | 'daily' | 'weekly')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time — As soon as matches are found</SelectItem>
                    <SelectItem value="daily">Daily Digest — Once per day</SelectItem>
                    <SelectItem value="weekly">Weekly — Once per week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Notification Channels</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="ch-inapp"
                      checked={newChannels.inApp}
                      onCheckedChange={(checked) =>
                        setNewChannels((prev) => ({ ...prev, inApp: checked === true }))
                      }
                    />
                    <Label htmlFor="ch-inapp" className="flex items-center gap-2 cursor-pointer font-normal">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      In-App Notification
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="ch-email"
                      checked={newChannels.email}
                      onCheckedChange={(checked) =>
                        setNewChannels((prev) => ({ ...prev, email: checked === true }))
                      }
                    />
                    <Label htmlFor="ch-email" className="flex items-center gap-2 cursor-pointer font-normal">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email Notification
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="ch-push"
                      checked={newChannels.push}
                      onCheckedChange={(checked) =>
                        setNewChannels((prev) => ({ ...prev, push: checked === true }))
                      }
                    />
                    <Label htmlFor="ch-push" className="flex items-center gap-2 cursor-pointer font-normal">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      Push Notification
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Bell className="h-4 w-4" />
                Save Alert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Search className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                <Activity className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.matchesToday}</p>
                <p className="text-xs text-muted-foreground">New Matches</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center">
                <ChartColumnIncreasing className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.triggered}</p>
                <p className="text-xs text-muted-foreground">Alerts Triggered</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Smart Insights */}
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4 text-emerald-600" /> AI Smart Insights
              </CardTitle>
              <CardDescription>Personalized marketplace intelligence powered by AI</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-[10px] gap-1">
              <Sparkles className="h-2.5 w-2.5" />
              Powered by AI
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Trending in your area */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <h4 className="text-sm font-semibold">Trending in your area</h4>
              </div>
              <div className="space-y-2">
                {[
                  { icon: 'smartphone' as const, name: 'iPhone 15 Pro Max', increase: '+34%' },
                  { icon: 'home' as const, name: '3BR Apartments Lekki', increase: '+28%' },
                  { icon: 'car' as const, name: 'Toyota Camry 2023', increase: '+22%' },
                ].map((item) => {
                  const TrendIcon = listingIconMap[item.icon];
                  return (
                  <div key={item.name} className="flex items-center gap-3 p-2 rounded-lg bg-white/60 hover:bg-white transition-colors">
                    <span className="h-5 w-5 text-emerald-600"><TrendIcon className="h-5 w-5" /></span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-[10px] shrink-0">
                      {item.increase}
                    </Badge>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Price Drop Alerts */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-600" />
                <h4 className="text-sm font-semibold">Price Drop Alerts</h4>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Samsung Galaxy S24 Ultra', original: '₦750,000', newPrice: '₦620,000', drop: '-17%' },
                  { name: 'MacBook Air M2 256GB', original: '₦1.2M', newPrice: '₦980,000', drop: '-18%' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-3 p-2 rounded-lg bg-white/60 hover:bg-white transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <Tag className="h-3.5 w-3.5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-muted-foreground line-through">{item.original}</span>
                        <span className="font-semibold text-emerald-600">{item.newPrice}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-[10px] shrink-0">
                      {item.drop}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended for You */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-cyan-600" />
                <h4 className="text-sm font-semibold">Recommended for You</h4>
              </div>
              <div className="space-y-2">
                {[
                  { icon: 'laptop' as const, name: 'Web Development Services', price: '₦150,000' },
                  { icon: 'camera' as const, name: 'Professional Photography', price: '₦80,000' },
                ].map((item) => {
                  const RecIcon = listingIconMap[item.icon];
                  return (
                  <div key={item.name} className="flex items-center gap-3 p-2 rounded-lg bg-white/60 hover:bg-white transition-colors">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-100 to-emerald-100 flex items-center justify-center shrink-0">
                      <RecIcon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-emerald-600 font-semibold">{item.price}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-emerald-600 hover:bg-emerald-50 shrink-0"
                      onClick={() => toast.info(`Viewing "${item.name}"`)}
                    >
                      View
                    </Button>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-emerald-600" />
                Active Alerts
              </CardTitle>
              <CardDescription>
                {stats.active} of {stats.total} alerts are currently active
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              {stats.active} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No saved search alerts</h3>
              <p className="text-muted-foreground mt-1 max-w-sm text-sm">
                Create an alert to get notified when new listings match your criteria
              </p>
              <Button className="mt-4 gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Create Your First Alert
              </Button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {alerts.map((alert) => {
                const catLabel = categories.find((c) => c.id === alert.category)?.name || alert.category;
                return (
                  <Card key={alert.id} className={`${!alert.active ? 'opacity-60' : ''} border shadow-sm`}>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3">
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-base truncate">{alert.query}</h3>
                              {alert.newMatches > 0 && (
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs px-2 py-0.5 font-medium">
                                  {alert.newMatches} new match{alert.newMatches > 1 ? 'es' : ''}
                                </Badge>
                              )}
                              <Badge
                                variant="secondary"
                                className={`text-xs ${categoryColors[alert.category] || 'bg-gray-100 text-gray-700'}`}
                              >
                                {catLabel}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {alert.city === 'all' ? 'All Cities' : alert.city}
                              </span>
                              {(alert.priceMin || alert.priceMax) && (
                                <span className="flex items-center gap-1">
                                  <Tag className="h-3.5 w-3.5" />
                                  {alert.priceMin ? `₦${Number(alert.priceMin).toLocaleString()}` : 'Any'} — {alert.priceMax ? `₦${Number(alert.priceMax).toLocaleString()}` : 'Any'}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                Last alert: {alert.lastAlertSent}
                              </span>
                            </div>
                          </div>
                          <Switch
                            checked={alert.active}
                            onCheckedChange={() => toggleActive(alert.id)}
                            aria-label={`Toggle ${alert.query}`}
                          />
                        </div>

                        {/* Frequency + Actions row */}
                        <div className="flex items-center gap-2 pt-2 border-t flex-wrap">
                          {/* Frequency Dropdown */}
                          <Select
                            value={alert.frequency}
                            onValueChange={(v) => handleFrequencyChange(alert.id, v as 'realtime' | 'daily' | 'weekly')}
                          >
                            <SelectTrigger className="w-auto h-8 text-xs gap-1.5 px-2 border-dashed">
                              <Zap className="h-3 w-3 text-muted-foreground" />
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="realtime">
                                <span className="flex items-center gap-1.5">
                                  <Zap className="h-3 w-3 text-emerald-600" /> Real-time
                                </span>
                              </SelectItem>
                              <SelectItem value="daily">
                                <span className="flex items-center gap-1.5">
                                  <Clock className="h-3 w-3 text-emerald-600" /> Daily Digest
                                </span>
                              </SelectItem>
                              <SelectItem value="weekly">
                                <span className="flex items-center gap-1.5">
                                  <Clock className="h-3 w-3 text-amber-600" /> Weekly
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            size="sm"
                            variant="default"
                            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 h-8 text-xs"
                            onClick={() => setPreviewAlertId(alert.id)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Preview Matches
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 h-8 text-xs"
                            onClick={() => toast.info(`Editing "${alert.query}"`)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <div className="flex-1" />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 h-8 text-xs"
                            onClick={() => setDeleteId(alert.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert History */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600" />
                Alert History
              </CardTitle>
              <CardDescription>
                Recent triggered alerts and their results
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-cyan-100 text-cyan-700">
              Last 7 days
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Triggered</TableHead>
                  <TableHead className="text-center">New Matches</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.alertName}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                      {entry.triggeredTime}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className={
                          entry.newMatches > 0
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                        }
                      >
                        {entry.newMatches > 0 ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            {entry.newMatches} new
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            No matches
                          </span>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs gap-1 text-emerald-600 hover:text-emerald-700"
                        onClick={() => toast.info(`Viewing matches for "${entry.alertName}"`)}
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Info note */}
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="p-4 flex items-start gap-3">
          <Bell className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">How Search Alerts Work</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              We periodically check for new listings that match your criteria. When new matches are found,
              you&apos;ll receive a notification based on your selected frequency.{' '}
              <strong>Real-time</strong> alerts notify you immediately, <strong>Daily Digest</strong> sends a
              summary once per day at 9 AM WAT, and <strong>Weekly</strong> compiles all matches from the week.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview Matches Dialog */}
      <Dialog open={!!previewAlertId} onOpenChange={() => setPreviewAlertId(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-600" />
              Preview Matches
            </DialogTitle>
            <DialogDescription>
              Showing sample matches for &quot;{alerts.find((a) => a.id === previewAlertId)?.query}&quot;
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {previewListings.length > 0 ? (
              previewListings.map((listing) => (
                <div key={listing.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shrink-0 text-xl">
                    {(() => { const LIcon = listingIconMap[listing.image] || ChartColumnIncreasing; return <LIcon className="h-6 w-6 text-emerald-600" />; })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{listing.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                      <span>{listing.price}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="h-3 w-3" />
                        {listing.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px]">
                      {listing.time}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No sample matches available</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewAlertId(null)}>
              Close
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 gap-1.5" onClick={() => {
              toast.info('Browsing all matches...');
              setPreviewAlertId(null);
            }}>
              <Search className="h-3.5 w-3.5" />
              View All Matches
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete Search Alert
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this alert? You&apos;ll stop receiving notifications
              when new listings match &quot;{alerts.find((a) => a.id === deleteId)?.query}&quot;.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
