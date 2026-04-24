"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CirclePlus,
  Eye,
  Pencil,
  Trash2,
  Eye as EyeIcon,
  MapPin,
  Inbox,
  Archive,
  Zap,
  X,
} from "lucide-react";

const listingTabs = ["Drafts", "Active", "Pending Sale", "Sold", "Expired"];

const initialSampleListings = [
  {
    id: "1",
    title: "iPhone 14 Pro Max - 256GB Space Black",
    price: 650,
    condition: "Like New",
    city: "Lagos",
    status: "active",
    views: 128,
    postedDate: "Dec 15, 2024",
  },
  {
    id: "2",
    title: "MacBook Air M2 - Midnight 8GB/256GB",
    price: 800,
    condition: "Good",
    city: "Lagos",
    status: "pending_sale",
    views: 95,
    postedDate: "Dec 14, 2024",
  },
  {
    id: "3",
    title: 'Samsung 55" Smart TV Crystal UHD',
    price: 350,
    condition: "Good",
    city: "Abuja",
    status: "active",
    views: 67,
    postedDate: "Dec 13, 2024",
  },
  {
    id: "4",
    title: "Mountain Bike - Trek Marlin 7",
    price: 400,
    condition: "New",
    city: "Lagos",
    status: "sold",
    views: 203,
    postedDate: "Dec 8, 2024",
  },
  {
    id: "5",
    title: "Gaming Chair - Secretlab Titan Evo",
    price: 250,
    condition: "Like New",
    city: "Lagos",
    status: "draft",
    views: 0,
    postedDate: "Dec 16, 2024",
  },
  {
    id: "6",
    title: "Standing Desk - Electric Adjustable",
    price: 280,
    condition: "New",
    city: "Lagos",
    status: "expired",
    views: 45,
    postedDate: "Nov 20, 2024",
  },
];

const conditionColors: Record<string, string> = {
  New: "bg-emerald-100 text-emerald-700",
  "Like New": "bg-teal-100 text-teal-700",
  Good: "bg-amber-100 text-amber-700",
  Fair: "bg-orange-100 text-orange-700",
  Poor: "bg-rose-100 text-rose-700",
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  active: "bg-emerald-100 text-emerald-700",
  pending_sale: "bg-cyan-100 text-cyan-700",
  sold: "bg-teal-100 text-teal-700",
  expired: "bg-rose-100 text-rose-700",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  active: "Active",
  pending_sale: "Pending Sale",
  sold: "Sold",
  expired: "Expired",
};

function ListingCard({
  listing,
  selected,
  onToggleSelect,
}: {
  listing: (typeof initialSampleListings)[0];
  selected: boolean;
  onToggleSelect: () => void;
}) {
  return (
    <Card className={`hover:shadow-md transition-shadow ${selected ? "ring-2 ring-emerald-500 bg-emerald-50/30" : ""}`}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {/* Header with Checkbox */}
          <div className="flex items-start gap-3">
            <div className="pt-0.5">
              <Checkbox
                checked={selected}
                onCheckedChange={onToggleSelect}
                aria-label={`Select ${listing.title}`}
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/item/${listing.id}`}
                className="text-sm font-semibold hover:text-primary transition-colors line-clamp-2"
              >
                {listing.title}
              </Link>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge
                  variant="secondary"
                  className={`text-[10px] ${conditionColors[listing.condition]}`}
                >
                  {listing.condition}
                </Badge>
                <Badge
                  variant="secondary"
                  className={`text-[10px] ${statusColors[listing.status]}`}
                >
                  {statusLabels[listing.status]}
                </Badge>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-emerald-600">
                ₦{listing.price.toLocaleString()}
              </p>
              <p className="text-[11px] text-muted-foreground">price</p>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground pl-7">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {listing.city}
            </span>
            <span className="flex items-center gap-1">
              <EyeIcon className="h-3 w-3" />
              {listing.views} views
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1 border-t pl-7">
            <Link href={`/item/${listing.id}`}>
              <Button variant="ghost" size="sm" className="gap-1 text-xs h-8">
                <Eye className="h-3 w-3" />
                View
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs h-8"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs h-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ tab }: { tab: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <Inbox className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="font-medium">No {tab.toLowerCase()} listings</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        {tab === "Drafts"
          ? "You don't have any draft listings. Start selling by creating a new listing."
          : `You don't have any ${tab.toLowerCase()} listings at the moment.`}
      </p>
      <Link href="/sell-item">
        <Button size="sm" className="gap-1.5 mt-3">
          <CirclePlus className="h-4 w-4" />
          Sell New Item
        </Button>
      </Link>
    </div>
  );
}

export default function MyListingsPage() {
  const [activeTab, setActiveTab] = useState("Drafts");
  const [listings, setListings] = useState(initialSampleListings);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const statusKey = activeTab.toLowerCase().replace(/\s+/g, "_");
  const filteredListings = listings.filter((l) => l.status === statusKey);

  const allTabSelected =
    filteredListings.length > 0 &&
    filteredListings.every((l) => selectedIds.has(l.id));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allTabSelected) {
      // Deselect all in current tab
      const tabIds = new Set(filteredListings.map((l) => l.id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        tabIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      // Select all in current tab
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredListings.forEach((l) => next.add(l.id));
        return next;
      });
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    setListings((prev) => prev.filter((l) => !selectedIds.has(l.id)));
    setSelectedIds(new Set());
  };

  const handleBulkArchive = () => {
    setListings((prev) =>
      prev.filter((l) => !selectedIds.has(l.id))
    );
    setSelectedIds(new Set());
  };

  const handleBulkPromote = () => {
    // Demo: just clear selection (in production would redirect to promote page)
    setSelectedIds(new Set());
  };

  const hasSelection = selectedIds.size > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Listings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your items for sale
          </p>
        </div>
        <Link href="/sell-item">
          <Button className="gap-2">
            <CirclePlus className="h-4 w-4" />
            Sell New Item
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); clearSelection(); }}>
        <TabsList className="h-auto flex-wrap gap-1 p-1">
          {listingTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="text-xs px-3 py-1.5">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {listingTabs.map((tab) => {
          const key = tab.toLowerCase().replace(/\s+/g, "_");
          const filtered = listings.filter((l) => l.status === key);

          return (
            <TabsContent key={tab} value={tab}>
              {filtered.length > 0 ? (
                <>
                  {/* Select All bar */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={allTabSelected}
                        onCheckedChange={toggleSelectAll}
                        aria-label={`Select all ${tab.toLowerCase()} listings`}
                        className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                      />
                      <span className="text-xs text-muted-foreground">
                        Select all ({filtered.length})
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        selected={selectedIds.has(listing.id)}
                        onToggleSelect={() => toggleSelect(listing.id)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState tab={tab} />
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Sticky Bulk Action Bar */}
      {hasSelection && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur-sm shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 max-w-7xl">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">
                {selectedIds.size} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkArchive}
                className="gap-1.5 text-xs h-9 border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <Archive className="h-3.5 w-3.5" />
                Archive
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="gap-1.5 text-xs h-9 border-rose-300 text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
              <Button
                size="sm"
                onClick={handleBulkPromote}
                className="gap-1.5 text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Zap className="h-3.5 w-3.5" />
                Promote
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
