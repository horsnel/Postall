"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SlidersHorizontal, Search, X, RotateCcw } from "lucide-react";
import { DistanceFilter } from "./DistanceFilter";
import { StateFilter } from "./StateFilter";

interface SearchFiltersProps {
  onSearch?: (filters: SearchFilterState) => void;
  className?: string;
}

export interface SearchFilterState {
  query: string;
  state: string;
  distance: number | undefined;
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
}

const defaultFilters: SearchFilterState = {
  query: "",
  state: "",
  distance: undefined,
  category: "",
  minPrice: "",
  maxPrice: "",
  sortBy: "newest",
};

const CATEGORIES = [
  "Gigs",
  "Services",
  "Jobs",
  "For Sale",
  "Housing",
  "Community",
  "Vehicles",
  "Electronics",
  "Fashion",
  "Real Estate",
];

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Closest", value: "distance" },
  { label: "Most Popular", value: "popular" },
];

export function SearchFilters({ onSearch, className }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilterState>(defaultFilters);
  const [open, setOpen] = useState(false);

  const activeCount = [
    filters.state,
    filters.distance,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.sortBy !== "newest" ? "sort" : "",
  ].filter(Boolean).length;

  const handleApply = () => {
    onSearch?.(filters);
    setOpen(false);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    onSearch?.(defaultFilters);
  };

  return (
    <div className={className}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2 relative">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <Badge className="h-5 w-5 rounded-full p-0 bg-emerald-600 text-white text-[10px] flex items-center justify-center absolute -top-1.5 -right-1.5">
                {activeCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-emerald-600" />
              Search Filters
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Category */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Category</div>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat}
                    variant={filters.category === cat ? "default" : "outline"}
                    size="sm"
                    className={`h-7 text-xs ${
                      filters.category === cat
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : ""
                    }`}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        category: prev.category === cat ? "" : cat,
                      }))
                    }
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* State Filter */}
            <StateFilter
              selected={filters.state}
              onChange={(state) =>
                setFilters((prev) => ({ ...prev, state }))
              }
            />

            {/* Distance Filter */}
            <DistanceFilter
              selected={filters.distance}
              onChange={(distance) =>
                setFilters((prev) => ({ ...prev, distance }))
              }
            />

            {/* Price Range */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Price Range (₦)</div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  className="h-9 text-sm"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
                  }
                />
                <span className="text-muted-foreground text-sm">—</span>
                <Input
                  placeholder="Max"
                  type="number"
                  className="h-9 text-sm"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Sort By</div>
              <div className="flex flex-wrap gap-1.5">
                {SORT_OPTIONS.map((opt) => (
                  <Button
                    key={opt.value}
                    variant={filters.sortBy === opt.value ? "default" : "outline"}
                    size="sm"
                    className={`h-7 text-xs ${
                      filters.sortBy === opt.value
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : ""
                    }`}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, sortBy: opt.value }))
                    }
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              className="flex-1 gap-1.5"
              onClick={handleReset}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              onClick={handleApply}
            >
              <Search className="h-3.5 w-3.5" />
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {filters.category && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {filters.category}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters((prev) => ({ ...prev, category: "" }))} />
            </Badge>
          )}
          {filters.state && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {filters.state}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters((prev) => ({ ...prev, state: "" }))} />
            </Badge>
          )}
          {filters.distance && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {filters.distance} km
              <X className="h-3 w-3 cursor-pointer" onClick={() => setFilters((prev) => ({ ...prev, distance: undefined }))} />
            </Badge>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <Badge variant="secondary" className="gap-1 text-xs">
              ₦{filters.minPrice || "0"} — ₦{filters.maxPrice || "∞"}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, minPrice: "", maxPrice: "" }))
                }
              />
            </Badge>
          )}
          {filters.sortBy !== "newest" && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {SORT_OPTIONS.find((o) => o.value === filters.sortBy)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters((prev) => ({ ...prev, sortBy: "newest" }))}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
