"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import {
  categories,
  cities,
  sampleTasks,
  urgencyLevels,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  Search,
  MapPin,
  DollarSign,
  Clock,
  Users,
  ArrowUpDown,
  Briefcase,
  Zap,
  ShoppingCart,
  Home,
  CircleUserRound,
} from "lucide-react";

// ─── Subcategory Map ─────────────────────────────────────────
const subcategoryMap: Record<string, { id: string; label: string }[]> = {
  gigs: [
    { id: "web-development", label: "Web Development" },
    { id: "writing", label: "Writing" },
    { id: "design", label: "Design" },
    { id: "video", label: "Video" },
    { id: "music", label: "Music" },
    { id: "data-entry", label: "Data Entry" },
    { id: "moving", label: "Moving" },
    { id: "delivery", label: "Delivery" },
    { id: "tutoring", label: "Tutoring" },
    { id: "other", label: "Other" },
  ],
  services: [
    { id: "plumbing", label: "Plumbing" },
    { id: "electrical", label: "Electrical" },
    { id: "cleaning", label: "Cleaning" },
    { id: "tutoring", label: "Tutoring" },
    { id: "design", label: "Design" },
    { id: "photography", label: "Photography" },
    { id: "event-planning", label: "Event Planning" },
    { id: "other", label: "Other" },
  ],
  jobs: [
    { id: "full-time", label: "Full-time" },
    { id: "part-time", label: "Part-time" },
    { id: "remote", label: "Remote" },
    { id: "contract", label: "Contract" },
    { id: "internship", label: "Internship" },
    { id: "freelance", label: "Freelance" },
  ],
  "for-sale": [
    { id: "electronics", label: "Electronics" },
    { id: "furniture", label: "Furniture" },
    { id: "vehicles", label: "Vehicles" },
    { id: "clothing", label: "Clothing" },
    { id: "books", label: "Books" },
    { id: "sports", label: "Sports" },
    { id: "home-garden", label: "Home & Garden" },
    { id: "other", label: "Other" },
  ],
  community: [
    { id: "events", label: "Events" },
    { id: "groups", label: "Groups" },
    { id: "activities", label: "Activities" },
    { id: "volunteers", label: "Volunteers" },
    { id: "lost-found", label: "Lost & Found" },
  ],
};

// ─── Types ───────────────────────────────────────────────────
interface TaskItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  subcategory?: string;
  budget: number;
  city: string;
  urgency: string;
  postedAgo?: string;
  createdAt?: string;
  applicants?: number;
  _count?: { applications: number };
  postedBy?: { id: string; username: string; photo?: string };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const ITEMS_PER_PAGE = 12;

// ─── Helpers ─────────────────────────────────────────────────
function getCategoryIcon(categoryId: string) {
  const map: Record<string, React.ReactNode> = {
    gigs: <Zap className="h-4 w-4" />,
    services: <SlidersHorizontal className="h-4 w-4" />,
    jobs: <Briefcase className="h-4 w-4" />,
    "for-sale": <ShoppingCart className="h-4 w-4" />,
    community: <CircleUserRound className="h-4 w-4" />,
  };
  return map[categoryId] || <Briefcase className="h-4 w-4" />;
}

function getCategoryLargeIcon(categoryId: string) {
  const map: Record<string, React.ReactNode> = {
    gigs: <Zap className="h-8 w-8" />,
    services: <SlidersHorizontal className="h-8 w-8" />,
    jobs: <Briefcase className="h-8 w-8" />,
    "for-sale": <ShoppingCart className="h-8 w-8" />,
    community: <CircleUserRound className="h-8 w-8" />,
  };
  return map[categoryId] || <Briefcase className="h-8 w-8" />;
}

function getCategoryColor(categoryId: string) {
  const map: Record<string, string> = {
    gigs: "bg-emerald-100 text-emerald-700 border-emerald-200",
    services: "bg-teal-100 text-teal-700 border-teal-200",
    jobs: "bg-cyan-100 text-cyan-700 border-cyan-200",
    "for-sale": "bg-amber-100 text-amber-700 border-amber-200",
    community: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return map[categoryId] || "bg-gray-100 text-gray-700 border-gray-200";
}

function getCategoryBgColor(categoryId: string) {
  const map: Record<string, string> = {
    gigs: "bg-emerald-50 border-emerald-200",
    services: "bg-teal-50 border-teal-200",
    jobs: "bg-cyan-50 border-cyan-200",
    "for-sale": "bg-amber-50 border-amber-200",
    community: "bg-rose-50 border-rose-200",
  };
  return map[categoryId] || "bg-gray-50 border-gray-200";
}

function getCategoryIconBg(categoryId: string) {
  const map: Record<string, string> = {
    gigs: "bg-emerald-600 text-white",
    services: "bg-teal-600 text-white",
    jobs: "bg-cyan-600 text-white",
    "for-sale": "bg-amber-600 text-white",
    community: "bg-rose-600 text-white",
  };
  return map[categoryId] || "bg-gray-600 text-white";
}

function getUrgencyColor(urgency: string) {
  const map: Record<string, string> = {
    low: "bg-emerald-100 text-emerald-700",
    normal: "bg-gray-100 text-gray-600",
    high: "bg-amber-100 text-amber-700",
    urgent: "bg-rose-100 text-rose-700",
  };
  return map[urgency] || "bg-gray-100 text-gray-600";
}

function getUrgencyLabel(urgency: string) {
  const found = urgencyLevels.find((u) => u.value === urgency);
  return found?.label || urgency;
}

function formatTimeAgo(createdAt?: string, postedAgo?: string) {
  if (postedAgo) return postedAgo;
  if (!createdAt) return "";
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

// ─── Filter State ────────────────────────────────────────────
interface FilterState {
  subcategories: string[];
  city: string;
  urgency: string[];
  minPrice: string;
  maxPrice: string;
  datePosted: string;
  sort: string;
}

const defaultFilters: FilterState = {
  subcategories: [],
  city: "all",
  urgency: [],
  minPrice: "",
  maxPrice: "",
  datePosted: "any",
  sort: "newest",
};

// ─── Filter Sidebar Content ──────────────────────────────────
function FilterSidebarContent({
  category,
  filters,
  setFilters,
  onClearAll,
}: {
  category: string;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClearAll: () => void;
}) {
  const subcategories = subcategoryMap[category] || [];

  const toggleSubcategory = (subId: string) => {
    setFilters((prev) => ({
      ...prev,
      subcategories: prev.subcategories.includes(subId)
        ? prev.subcategories.filter((s) => s !== subId)
        : [...prev.subcategories, subId],
    }));
  };

  const toggleUrgency = (level: string) => {
    setFilters((prev) => ({
      ...prev,
      urgency: prev.urgency.includes(level)
        ? prev.urgency.filter((u) => u !== level)
        : [...prev.urgency, level],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          Filters
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={onClearAll}
        >
          Clear all
        </Button>
      </div>

      <Separator />

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <>
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Subcategory</h3>
            <div className="space-y-2.5 max-h-48 overflow-y-auto">
              {subcategories.map((sub) => (
                <div key={sub.id} className="flex items-center gap-2.5">
                  <Checkbox
                    id={`sub-${sub.id}`}
                    checked={filters.subcategories.includes(sub.id)}
                    onCheckedChange={() => toggleSubcategory(sub.id)}
                    className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                  />
                  <Label
                    htmlFor={`sub-${sub.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {sub.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* City */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">City</h3>
        <Select
          value={filters.city}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, city: value }))
          }
        >
          <SelectTrigger className="w-full">
            <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
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

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm flex items-center gap-1.5">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
            }
            className="h-9"
            min={0}
          />
          <span className="text-muted-foreground text-sm">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
            }
            className="h-9"
            min={0}
          />
        </div>
      </div>

      <Separator />

      {/* Urgency */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Urgency</h3>
        <div className="space-y-2.5">
          {urgencyLevels.map((level) => (
            <div key={level.value} className="flex items-center gap-2.5">
              <Checkbox
                id={`urgency-${level.value}`}
                checked={filters.urgency.includes(level.value)}
                onCheckedChange={() => toggleUrgency(level.value)}
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
              <Label
                htmlFor={`urgency-${level.value}`}
                className="text-sm cursor-pointer flex items-center gap-2"
              >
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    level.value === "low"
                      ? "bg-emerald-500"
                      : level.value === "normal"
                        ? "bg-gray-400"
                        : level.value === "high"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                  }`}
                />
                {level.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Date Posted */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Date Posted
        </h3>
        <div className="space-y-2">
          {[
            { value: "any", label: "Any time" },
            { value: "today", label: "Today" },
            { value: "week", label: "This week" },
            { value: "month", label: "This month" },
          ].map((option) => (
            <div key={option.value} className="flex items-center gap-2.5">
              <Checkbox
                id={`date-${option.value}`}
                checked={filters.datePosted === option.value}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters((prev) => ({
                      ...prev,
                      datePosted: option.value,
                    }));
                  }
                }}
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
              <Label
                htmlFor={`date-${option.value}`}
                className="text-sm cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Task Card (Grid) ────────────────────────────────────────
function TaskCardGrid({ task }: { task: TaskItem }) {
  const applicantCount =
    task._count?.applications ?? task.applicants ?? 0;

  return (
    <Link href={`/task/${task.id}`} className="block">
    <Card className="group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 hover:border-emerald-200 cursor-pointer h-full hover-lift">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-start justify-between gap-2 mb-3">
          {task.subcategory && (
            <Badge variant="secondary" className="text-xs shrink-0">
              {task.subcategory.replace(/-/g, " ")}
            </Badge>
          )}
          <Badge className={`${getUrgencyColor(task.urgency)} text-xs capitalize ml-auto`}>
            {getUrgencyLabel(task.urgency)}
          </Badge>
        </div>

        <h3 className="font-semibold text-sm leading-snug mb-3 line-clamp-2 group-hover:text-emerald-700 transition-colors flex-1">
          {task.title}
        </h3>

        <div className="space-y-2 mt-auto pt-3 border-t">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-700 text-base">
              ₦${task.budget.toLocaleString()}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>{applicantCount} applicant{applicantCount !== 1 ? "s" : ""}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{task.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatTimeAgo(task.createdAt, task.postedAgo)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}

// ─── Task Card (List) ────────────────────────────────────────
function TaskCardList({ task }: { task: TaskItem }) {
  const applicantCount =
    task._count?.applications ?? task.applicants ?? 0;

  return (
    <Link href={`/task/${task.id}`} className="block">
    <Card className="group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 hover:border-emerald-200 cursor-pointer hover-lift">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {task.subcategory && (
                <Badge variant="secondary" className="text-xs">
                  {task.subcategory.replace(/-/g, " ")}
                </Badge>
              )}
              <Badge className={`${getUrgencyColor(task.urgency)} text-xs capitalize`}>
                {getUrgencyLabel(task.urgency)}
              </Badge>
            </div>
            <h3 className="font-semibold text-sm leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1">
              {task.title}
            </h3>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{task.city}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatTimeAgo(task.createdAt, task.postedAgo)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{applicantCount} applicant{applicantCount !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:flex-col sm:items-end">
            <span className="font-bold text-emerald-700 text-lg whitespace-nowrap">
              ₦${task.budget.toLocaleString()}
            </span>
            <Link href={`/task/${task.id}`}>
              <Button size="sm" className="text-xs">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}

// ─── Active Filter Chips ─────────────────────────────────────
function ActiveFilterChips({
  filters,
  search,
  onRemoveSubcategory,
  onRemoveUrgency,
  onRemoveCity,
  onRemoveDate,
  onRemovePrice,
  onClearAll,
}: {
  filters: FilterState;
  search: string;
  onRemoveSubcategory: (sub: string) => void;
  onRemoveUrgency: (urg: string) => void;
  onRemoveCity: () => void;
  onRemoveDate: () => void;
  onRemovePrice: (field: "min" | "max") => void;
  onClearAll: () => void;
}) {
  const hasFilters =
    filters.subcategories.length > 0 ||
    filters.urgency.length > 0 ||
    filters.city !== "all" ||
    filters.datePosted !== "any" ||
    filters.minPrice ||
    filters.maxPrice ||
    search;

  if (!hasFilters) return null;

  const dateLabelMap: Record<string, string> = {
    today: "Today",
    week: "This week",
    month: "This month",
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground font-medium">Active:</span>
      {search && (
        <Badge
          variant="secondary"
          className="gap-1 text-xs cursor-pointer hover:bg-secondary/80"
        >
          <Search className="h-3 w-3" />
          &quot;{search}&quot;
          <X className="h-3 w-3 ml-0.5" />
        </Badge>
      )}
      {filters.subcategories.map((sub) => (
        <Badge
          key={sub}
          variant="secondary"
          className="gap-1 text-xs cursor-pointer hover:bg-secondary/80"
          onClick={() => onRemoveSubcategory(sub)}
        >
          <span className="capitalize">{sub.replace(/-/g, " ")}</span>
          <X className="h-3 w-3" />
        </Badge>
      ))}
      {filters.city !== "all" && (
        <Badge
          variant="secondary"
          className="gap-1 text-xs cursor-pointer hover:bg-secondary/80"
          onClick={onRemoveCity}
        >
          <MapPin className="h-3 w-3" />
          {filters.city}
          <X className="h-3 w-3" />
        </Badge>
      )}
      {filters.urgency.map((urg) => (
        <Badge
          key={urg}
          variant="secondary"
          className="gap-1 text-xs cursor-pointer hover:bg-secondary/80"
          onClick={() => onRemoveUrgency(urg)}
        >
          <span className="capitalize">{getUrgencyLabel(urg)}</span>
          <X className="h-3 w-3" />
        </Badge>
      ))}
      {filters.minPrice && (
        <Badge
          variant="secondary"
          className="gap-1 text-xs cursor-pointer hover:bg-secondary/80"
          onClick={() => onRemovePrice("min")}
        >
          {`Min: ₦${filters.minPrice}`}
          <X className="h-3 w-3" />
        </Badge>
      )}
      {filters.maxPrice && (
        <Badge
          variant="secondary"
          className="gap-1 text-xs cursor-pointer hover:bg-secondary/80"
          onClick={() => onRemovePrice("max")}
        >
          {`Max: ₦${filters.maxPrice}`}
          <X className="h-3 w-3" />
        </Badge>
      )}
      {filters.datePosted !== "any" && (
        <Badge
          variant="secondary"
          className="gap-1 text-xs cursor-pointer hover:bg-secondary/80"
          onClick={onRemoveDate}
        >
          <Clock className="h-3 w-3" />
          {dateLabelMap[filters.datePosted] || filters.datePosted}
          <X className="h-3 w-3" />
        </Badge>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="text-xs text-muted-foreground h-6 px-2"
        onClick={onClearAll}
      >
        Clear all
      </Button>
    </div>
  );
}

// ─── No Results ──────────────────────────────────────────────
function NoResults({ onClearAll }: { onClearAll: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Search className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No results found</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Try adjusting your filters or search terms. Here are some suggestions:
      </p>
      <ul className="text-sm text-muted-foreground space-y-1.5 mb-6 text-left">
        <li className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Remove some filters to see more results
        </li>
        <li className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Check your spelling or use different keywords
        </li>
        <li className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Try a broader price range
        </li>
        <li className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Select &quot;All Cities&quot; for more options
        </li>
      </ul>
      <Button onClick={onClearAll} variant="outline">
        Clear all filters
      </Button>
    </div>
  );
}

// ─── Pagination ──────────────────────────────────────────────
function TaskPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            className={
              currentPage <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
        {getPageNumbers().map((page, idx) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            className={
              currentPage >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function CategoryBrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const categorySlug = params.category as string;

  // Find category info
  const categoryInfo = categories.find((c) => c.id === categorySlug);
  const subcategories = subcategoryMap[categorySlug] || [];

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>(() => {
    const urgencyParam = searchParams.get("urgency");
    const subParam = searchParams.get("subcategory");
    return {
      subcategories: subParam ? subParam.split(",") : [],
      city: searchParams.get("city") || "all",
      urgency: urgencyParam ? urgencyParam.split(",") : [],
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      datePosted: searchParams.get("date") || "any",
      sort: searchParams.get("sort") || "newest",
    };
  });

  // Fetch tasks
  useEffect(() => {
    let cancelled = false;
    async function loadTasks() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.set("category", categorySlug);
        if (search) queryParams.set("search", search);
        if (filters.subcategories.length > 0)
          queryParams.set("subcategory", filters.subcategories.join(","));
        if (filters.city && filters.city !== "all")
          queryParams.set("city", filters.city);
        if (filters.urgency.length > 0)
          queryParams.set("urgency", filters.urgency.join(","));
        if (filters.minPrice) queryParams.set("minPrice", filters.minPrice);
        if (filters.maxPrice) queryParams.set("maxPrice", filters.maxPrice);
        if (filters.sort) queryParams.set("sort", filters.sort);
        queryParams.set("page", String(currentPage));
        queryParams.set("limit", String(ITEMS_PER_PAGE));

        const res = await fetch(`/api/tasks?${queryParams.toString()}`);
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (cancelled) return;
          if (data.tasks && data.tasks.length > 0) {
            setTasks(data.tasks);
            setPagination(data.pagination);
          } else {
            const filtered = sampleTasks.filter(
              (t) => t.category === categorySlug
            );
            setTasks(filtered as TaskItem[]);
            setPagination({
              page: 1,
              limit: ITEMS_PER_PAGE,
              total: filtered.length,
              totalPages: 1,
            });
          }
        } else {
          const filtered = sampleTasks.filter(
            (t) => t.category === categorySlug
          );
          setTasks(filtered as TaskItem[]);
          setPagination({
            page: 1,
            limit: ITEMS_PER_PAGE,
            total: filtered.length,
            totalPages: 1,
          });
        }
      } catch {
        if (cancelled) return;
        const filtered = sampleTasks.filter(
          (t) => t.category === categorySlug
        );
        setTasks(filtered as TaskItem[]);
        setPagination({
          page: 1,
          limit: ITEMS_PER_PAGE,
          total: filtered.length,
          totalPages: 1,
        });
      }
      if (!cancelled) setLoading(false);
    }
    loadTasks();
    return () => { cancelled = true; };
  }, [search, filters, currentPage, categorySlug]);

  // Update URL when filters/page change
  const updateURL = useCallback(
    (newFilters: FilterState, page: number, newSearch: string) => {
      const params = new URLSearchParams();
      if (newSearch) params.set("q", newSearch);
      if (newFilters.subcategories.length > 0)
        params.set("subcategory", newFilters.subcategories.join(","));
      if (newFilters.city && newFilters.city !== "all")
        params.set("city", newFilters.city);
      if (newFilters.urgency.length > 0)
        params.set("urgency", newFilters.urgency.join(","));
      if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
      if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
      if (newFilters.datePosted && newFilters.datePosted !== "any")
        params.set("date", newFilters.datePosted);
      if (newFilters.sort && newFilters.sort !== "newest")
        params.set("sort", newFilters.sort);
      if (page > 1) params.set("page", String(page));

      const queryString = params.toString();
      router.push(
        `/browse/${categorySlug}${queryString ? `?${queryString}` : ""}`,
        { scroll: false }
      );
    },
    [router, categorySlug]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL(filters, currentPage, search);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, currentPage, search, updateURL]);

  const handleClearAll = () => {
    setFilters(defaultFilters);
    setSearch("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "budget_high", label: "Budget: High to Low" },
    { value: "budget_low", label: "Budget: Low to High" },
  ];

  const sortLabel =
    sortOptions.find((o) => o.value === filters.sort)?.label || "Newest First";

  // Invalid category
  if (!categoryInfo) {
    return (
      <div className="bg-gray-50/50 min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The category you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/browse">
            <Button>Browse All Categories</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* Category Header */}
      <div className={`border-b ${getCategoryBgColor(categorySlug)}`}>
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb className="mb-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/browse">Browse</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">
                  {categoryInfo.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-4">
            <div
              className={`h-14 w-14 rounded-xl ${getCategoryIconBg(categorySlug)} flex items-center justify-center shrink-0`}
            >
              {getCategoryLargeIcon(categorySlug)}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {categoryInfo.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {categoryInfo.description}
              </p>
            </div>
          </div>

          {/* Subcategory Quick Links */}
          {subcategories.length > 0 && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              {subcategories.map((sub) => (
                <Button
                  key={sub.id}
                  variant={
                    filters.subcategories.includes(sub.id)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      subcategories: prev.subcategories.includes(sub.id)
                        ? prev.subcategories.filter((s) => s !== sub.id)
                        : [...prev.subcategories, sub.id],
                    }));
                    setCurrentPage(1);
                  }}
                >
                  {sub.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search Bar + Controls Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search in ${categoryInfo.name}...`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-10"
            />
          </div>

          {/* Sort */}
          <Select
            value={filters.sort}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, sort: value }))
            }
          >
            <SelectTrigger className="w-full sm:w-[200px] h-10">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground mr-1" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-10 w-10 rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-10 w-10 rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Filter Button */}
          <Sheet
            open={mobileFiltersOpen}
            onOpenChange={setMobileFiltersOpen}
          >
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" className="h-10 gap-2 w-full sm:w-auto">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {(filters.subcategories.length > 0 ||
                  filters.urgency.length > 0 ||
                  filters.city !== "all" ||
                  filters.datePosted !== "any") && (
                  <span className="h-5 w-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">
                    {filters.subcategories.length +
                      filters.urgency.length +
                      (filters.city !== "all" ? 1 : 0) +
                      (filters.datePosted !== "any" ? 1 : 0)}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-4">
                <FilterSidebarContent
                  category={categorySlug}
                  filters={filters}
                  setFilters={setFilters}
                  onClearAll={handleClearAll}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filter Chips */}
        <div className="mb-4">
          <ActiveFilterChips
            filters={filters}
            search={search}
            onRemoveSubcategory={(sub) =>
              setFilters((prev) => ({
                ...prev,
                subcategories: prev.subcategories.filter((s) => s !== sub),
              }))
            }
            onRemoveUrgency={(urg) =>
              setFilters((prev) => ({
                ...prev,
                urgency: prev.urgency.filter((u) => u !== urg),
              }))
            }
            onRemoveCity={() =>
              setFilters((prev) => ({ ...prev, city: "all" }))
            }
            onRemoveDate={() =>
              setFilters((prev) => ({ ...prev, datePosted: "any" }))
            }
            onRemovePrice={(field) =>
              setFilters((prev) => ({
                ...prev,
                [field === "min" ? "minPrice" : "maxPrice"]: "",
              }))
            }
            onClearAll={handleClearAll}
          />
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[260px] shrink-0">
            <div className="sticky top-20 bg-white rounded-lg border p-5 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <FilterSidebarContent
                category={categorySlug}
                filters={filters}
                setFilters={setFilters}
                onClearAll={handleClearAll}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-medium text-foreground">
                      {pagination.total}
                    </span>{" "}
                    {pagination.total === 1 ? "result" : "results"}{" "}
                    in{" "}
                    <span className="font-medium text-foreground capitalize">
                      {categoryInfo.name}
                    </span>
                    {filters.sort !== "newest" && (
                      <>
                        {" "}
                        &middot; Sorted by{" "}
                        <span className="font-medium text-foreground">
                          {sortLabel}
                        </span>
                      </>
                    )}
                  </>
                )}
              </p>
              {/* Mobile view toggle */}
              <div className="flex sm:hidden items-center border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8 rounded-l-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Loading Skeleton */}
            {loading && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                    : "space-y-3"
                }
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-40 bg-white rounded-lg border animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* Results */}
            {!loading && tasks.length === 0 && (
              <NoResults onClearAll={handleClearAll} />
            )}

            {!loading && tasks.length > 0 && (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {tasks.map((task) => (
                      <TaskCardGrid key={task.id} task={task} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <TaskCardList key={task.id} task={task} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <div className="mt-8">
                  <TaskPagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
