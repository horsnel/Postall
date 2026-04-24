"use client";

import { useState } from "react";
import Link from "next/link";
import { categories, cities } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  BellOff,
  Bookmark,
} from "lucide-react";

// ─── Types & Data ────────────────────────────────────────────
interface SavedSearch {
  id: string;
  query: string;
  category: string;
  city: string;
  priceRange: string;
  frequency: "realtime" | "daily" | "weekly";
  newResults: number;
  lastChecked: string;
  active: boolean;
}

const initialSearches: SavedSearch[] = [
  { id: "ss1", query: "iPhone 14 Pro Max", category: "For Sale", city: "Lagos", priceRange: "₦500K - ₦700K", frequency: "daily", newResults: 3, lastChecked: "2h ago", active: true },
  { id: "ss2", query: "2 Bedroom Apartment", category: "Housing", city: "Lagos", priceRange: "₦1M - ₦3M", frequency: "daily", newResults: 7, lastChecked: "1h ago", active: true },
  { id: "ss3", query: "WordPress Developer", category: "Gigs", city: "Any", priceRange: "Any", frequency: "weekly", newResults: 0, lastChecked: "1d ago", active: true },
  { id: "ss4", query: "Toyota Camry 2019", category: "For Sale", city: "Lagos", priceRange: "₦5M - ₦10M", frequency: "daily", newResults: 1, lastChecked: "30m ago", active: true },
  { id: "ss5", query: "Plumber", category: "Services", city: "Abuja", priceRange: "Any", frequency: "weekly", newResults: 2, lastChecked: "3h ago", active: false },
  { id: "ss6", query: "Part-time Job", category: "Jobs", city: "Any", priceRange: "Any", frequency: "daily", newResults: 5, lastChecked: "15m ago", active: true },
];

const categoryColors: Record<string, string> = {
  "For Sale": "bg-amber-100 text-amber-700",
  Housing: "bg-orange-100 text-orange-700",
  Gigs: "bg-emerald-100 text-emerald-700",
  Services: "bg-teal-100 text-teal-700",
  Jobs: "bg-cyan-100 text-cyan-700",
  Community: "bg-rose-100 text-rose-700",
};

const frequencyOptions = [
  { value: "realtime", label: "Real-time", icon: Zap },
  { value: "daily", label: "Daily", icon: Clock },
  { value: "weekly", label: "Weekly", icon: Clock },
  { value: "off", label: "Off", icon: BellOff },
];

// ─── Main Page ───────────────────────────────────────────────
export default function SavedSearchesPage() {
  const [searches, setSearches] = useState<SavedSearch[]>(initialSearches);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // New search form state
  const [newQuery, setNewQuery] = useState("");
  const [newCategory, setNewCategory] = useState("all");
  const [newCity, setNewCity] = useState("all");
  const [newMinPrice, setNewMinPrice] = useState("");
  const [newMaxPrice, setNewMaxPrice] = useState("");
  const [newFrequency, setNewFrequency] = useState("daily");

  const toggleActive = (id: string) => {
    setSearches((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const cycleFrequency = (id: string) => {
    setSearches((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const freqs: SavedSearch["frequency"][] = ["daily", "weekly", "realtime"];
        const currentIdx = freqs.indexOf(s.frequency);
        return { ...s, frequency: freqs[(currentIdx + 1) % freqs.length] };
      })
    );
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setSearches((prev) => prev.filter((s) => s.id !== deleteId));
    setDeleteId(null);
  };

  const handleCreateSearch = () => {
    if (!newQuery.trim()) return;
    const catName = categories.find((c) => c.id === newCategory)?.name || "All";
    const cityName = newCity === "all" ? "Any" : newCity;
    const priceRange =
      newMinPrice && newMaxPrice
        ? `₦${Number(newMinPrice).toLocaleString()} - ₦${Number(newMaxPrice).toLocaleString()}`
        : "Any";

    const newSearch: SavedSearch = {
      id: `ss${Date.now()}`,
      query: newQuery,
      category: catName,
      city: cityName,
      priceRange,
      frequency: newFrequency as SavedSearch["frequency"],
      newResults: 0,
      lastChecked: "Just now",
      active: true,
    };

    setSearches((prev) => [newSearch, ...prev]);
    setDialogOpen(false);
    setNewQuery("");
    setNewCategory("all");
    setNewCity("all");
    setNewMinPrice("");
    setNewMaxPrice("");
    setNewFrequency("daily");
  };

  const totalNewResults = searches.reduce((sum, s) => sum + s.newResults, 0);
  const activeCount = searches.filter((s) => s.active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-primary" />
            Saved Searches
          </h1>
          <p className="text-muted-foreground mt-1">
            Save your search queries and get notified when new listings match.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Saved Search
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Searches</p>
            <p className="text-2xl font-bold">{searches.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-primary">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">New Results</p>
            <p className="text-2xl font-bold text-emerald-600">{totalNewResults}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Alerts Sent</p>
            <p className="text-2xl font-bold">1,247</p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {searches.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No saved searches yet</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">
              Save a search to get notified of new matches.
            </p>
            <Button className="mt-4 gap-2" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Your First Saved Search
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search Cards */}
      <div className="space-y-3">
        {searches.map((search) => {
          const FreqIcon = search.frequency === "realtime" ? Zap : Bell;
          return (
            <Card key={search.id} className={!search.active ? "opacity-60" : ""}>
              <CardContent className="p-4 md:p-5">
                <div className="flex flex-col gap-4">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg truncate">{search.query}</h3>
                        {search.newResults > 0 && (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 gap-1">
                            <Search className="h-3 w-3" />
                            {search.newResults} new result{search.newResults !== 1 ? "s" : ""}
                          </Badge>
                        )}
                        <Badge
                          variant="secondary"
                          className={categoryColors[search.category] || "bg-gray-100 text-gray-700"}
                        >
                          {search.category}
                        </Badge>
                        {search.active && (
                          <Badge variant="outline" className="text-xs gap-1 text-emerald-600 border-emerald-200">
                            <FreqIcon className="h-3 w-3" />
                            {search.frequency === "realtime"
                              ? "Real-time"
                              : search.frequency === "daily"
                                ? "Daily"
                                : "Weekly"}
                          </Badge>
                        )}
                        {!search.active && (
                          <Badge variant="outline" className="text-xs gap-1 text-gray-400 border-gray-200">
                            <BellOff className="h-3 w-3" />
                            Paused
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {search.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5" />
                          {search.priceRange}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          Last checked: {search.lastChecked}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Link href="/search" className="shrink-0">
                      <Button size="sm" className="gap-1.5">
                        <Eye className="h-3.5 w-3.5" />
                        View Results
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => cycleFrequency(search.id)}
                    >
                      <FreqIcon className="h-3.5 w-3.5" />
                      {search.frequency === "realtime"
                        ? "Real-time"
                        : search.frequency === "daily"
                          ? "Daily"
                          : "Weekly"}
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5">
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <div className="flex-1" />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleActive(search.id)}
                      className="gap-1.5 text-xs"
                    >
                      {search.active ? (
                        <>
                          <BellOff className="h-3.5 w-3.5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Bell className="h-3.5 w-3.5" />
                          Resume
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                      onClick={() => setDeleteId(search.id)}
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

      {/* Info note */}
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="p-4 flex items-start gap-3">
          <Bell className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">How Saved Searches Work</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              We periodically check for new listings that match your criteria. Set frequency to{" "}
              <strong>Real-time</strong> for instant alerts, <strong>Daily</strong> for daily digest, or{" "}
              <strong>Weekly</strong> for weekly summary.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Create New Search Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Saved Search</DialogTitle>
            <DialogDescription>
              Set up a search alert and we&apos;ll notify you when new listings match your criteria.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-query">Search Query</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="new-query"
                  placeholder="e.g., iPhone 14, 2BR Apartment, Plumber..."
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
                  <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Select value={newCity} onValueChange={setNewCity}>
                  <SelectTrigger><SelectValue placeholder="All Cities" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any City</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Price Range (optional, ₦ Naira)</Label>
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="Min ₦" value={newMinPrice} onChange={(e) => setNewMinPrice(e.target.value)} className="h-9" />
                <span className="text-muted-foreground">-</span>
                <Input type="number" placeholder="Max ₦" value={newMaxPrice} onChange={(e) => setNewMaxPrice(e.target.value)} className="h-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notification Frequency</Label>
              <Select value={newFrequency} onValueChange={setNewFrequency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateSearch} className="gap-2" disabled={!newQuery.trim()}>
              <Bookmark className="h-4 w-4" />
              Save Search
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Saved Search</DialogTitle>
            <DialogDescription>
              Are you sure? You&apos;ll stop receiving notifications for this search.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
