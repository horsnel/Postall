"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { categories, cities, sampleTasks, urgencyLevels } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import MagicLinkModal from "@/components/layout/magic-link-modal";
import {
  ArrowUpDown,
  Briefcase,
  CircleUserRound,
  Clock,
  DollarSign,
  LayoutGrid,
  Loader2,
  MapPin,
  Search,
  Shield,
  SlidersHorizontal,
  Star,
  TrendingUp,
  Users,
  Wrench,
  Zap
} from 'lucide-react';


// ─── Types ────────────────────────────────────────────────────
interface TaskItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  subcategory?: string;
  budget: number;
  currency?: string;
  city: string;
  urgency: string;
  postedAgo?: string;
  createdAt?: string;
  applicants?: number;
  _count?: { applications: number };
  postedBy?: { id: string; username: string; photo?: string; rating?: number };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Constants ────────────────────────────────────────────────
const ITEMS_PER_PAGE = 9;

const filterChips = [
  { value: "all", label: "All Categories", icon: LayoutGrid },
  { value: "gigs", label: "Gigs", icon: Zap },
  { value: "services", label: "Services", icon: SlidersHorizontal },
  { value: "jobs", label: "Jobs", icon: Briefcase },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "budget_high", label: "Budget High \u2192 Low" },
  { value: "budget_low", label: "Budget Low \u2192 High" },
  { value: "urgent", label: "Most Urgent" },
];

// ─── Helpers ──────────────────────────────────────────────────
function getCategoryIcon(categoryId: string) {
  const map: Record<string, React.ReactNode> = {
    gigs: <Zap className="h-3.5 w-3.5" />,
    services: <Wrench className="h-3.5 w-3.5" />,
    jobs: <Briefcase className="h-3.5 w-3.5" />,
    "for-sale": <CircleUserRound className="h-3.5 w-3.5" />,
    community: <CircleUserRound className="h-3.5 w-3.5" />,
  };
  return map[categoryId] || <Briefcase className="h-3.5 w-3.5" />;
}

function getCategoryColor(categoryId: string) {
  const map: Record<string, string> = {
    gigs: "bg-emerald-100 text-emerald-700 border-emerald-200",
    services: "bg-teal-100 text-teal-700 border-teal-200",
    jobs: "bg-cyan-100 text-cyan-700 border-cyan-200",
    "for-sale": "bg-amber-100 text-amber-700 border-amber-200",
    community: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return map[categoryId] || "bg-muted text-muted-foreground border-border";
}

function getUrgencyColor(urgency: string) {
  const map: Record<string, string> = {
    low: "bg-emerald-100 text-emerald-700",
    normal: "bg-muted text-muted-foreground",
    high: "bg-amber-100 text-amber-700",
    urgent: "bg-rose-100 text-rose-700",
  };
  return map[urgency] || "bg-muted text-muted-foreground";
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

// ─── Task Card ────────────────────────────────────────────────
function TaskCard({
  task,
  onApply,
}: {
  task: TaskItem;
  onApply: (task: TaskItem) => void;
}) {
  const applicantCount =
    task._count?.applications ?? task.applicants ?? 0;

  return (
    <Card className="group hover:shadow-md transition-all duration-200 hover:border-emerald-200 h-full flex flex-col">
      <CardContent className="p-4 flex flex-col flex-1">
        {/* Top: Badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <Badge
            variant="outline"
            className={`${getCategoryColor(task.category)} text-xs shrink-0`}
          >
            {getCategoryIcon(task.category)}
            <span className="ml-1 capitalize">
              {task.category.replace("-", " ")}
            </span>
          </Badge>
          <Badge
            className={`${getUrgencyColor(task.urgency)} text-xs capitalize shrink-0`}
          >
            {getUrgencyLabel(task.urgency)}
          </Badge>
        </div>

        {/* Title */}
        <Link href={`/task/${task.id}`} className="block">
          <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {task.title}
          </h3>
        </Link>

        {/* Poster info */}
        {task.postedBy && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <span className="text-[9px] text-white font-bold">
                {task.postedBy.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {task.postedBy.username}
            </span>
            {task.postedBy.rating && task.postedBy.rating > 0 && (
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                <span className="text-xs text-muted-foreground">
                  {task.postedBy.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom: Budget, meta, apply */}
        <div className="pt-3 border-t space-y-2.5 mt-auto">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-700 text-base">
              ₦${task.budget.toLocaleString()}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>
                {applicantCount} applicant
                {applicantCount !== 1 ? "s" : ""}
              </span>
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
          <Button
            size="sm"
            className="w-full"
            onClick={() => onApply(task)}
          >
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Pagination Component ────────────────────────────────────
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

// ─── Stats for hero ──────────────────────────────────────────
function HeroStat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <div className="h-10 w-10 rounded-full bg-[#F3F4F6] flex items-center justify-center mx-auto mb-1.5">
        <Icon className="h-5 w-5 text-[#0D8A5C]" />
      </div>
      <p className="text-lg sm:text-xl font-bold text-[#374151]">{value}</p>
      <p className="text-[11px] text-[#9CA3AF]">{label}</p>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function FindWorkPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  // Fetch tasks
  useEffect(() => {
    let cancelled = false;
    async function loadTasks() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (activeChip !== "all") params.set("category", activeChip);
        if (selectedCity !== "all") params.set("city", selectedCity);
        params.set("sort", sortBy);
        params.set("page", String(currentPage));
        params.set("limit", String(ITEMS_PER_PAGE));

        const res = await fetch(`/api/tasks?${params.toString()}`);
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (cancelled) return;
          if (data.tasks && data.tasks.length > 0) {
            // If sort is "urgent" and we got results from API, do client-side sort
            let sortedTasks = data.tasks;
            if (sortBy === "urgent") {
              const urgencyOrder: Record<string, number> = {
                urgent: 0,
                high: 1,
                normal: 2,
                low: 3,
              };
              sortedTasks = [...data.tasks].sort(
                (a: TaskItem, b: TaskItem) =>
                  (urgencyOrder[a.urgency] ?? 4) - (urgencyOrder[b.urgency] ?? 4)
              );
            }
            setTasks(sortedTasks);
            setPagination(data.pagination);
          } else {
            // Fallback to sample data
            let fallback = [...sampleTasks] as TaskItem[];
            if (activeChip !== "all")
              fallback = fallback.filter((t) => t.category === activeChip);
            if (selectedCity !== "all")
              fallback = fallback.filter((t) => t.city === selectedCity);
            if (search) {
              const q = search.toLowerCase();
              fallback = fallback.filter((t) =>
                t.title.toLowerCase().includes(q)
              );
            }
            if (sortBy === "budget_high")
              fallback.sort((a, b) => b.budget - a.budget);
            else if (sortBy === "budget_low")
              fallback.sort((a, b) => a.budget - b.budget);
            else if (sortBy === "urgent") {
              const urgencyOrder: Record<string, number> = {
                urgent: 0,
                high: 1,
                normal: 2,
                low: 3,
              };
              fallback.sort(
                (a, b) =>
                  (urgencyOrder[a.urgency] ?? 4) - (urgencyOrder[b.urgency] ?? 4)
              );
            }
            setTasks(fallback);
            setPagination({
              page: 1,
              limit: ITEMS_PER_PAGE,
              total: fallback.length,
              totalPages: 1,
            });
          }
        } else {
          // Fallback
          let fallback = [...sampleTasks] as TaskItem[];
          if (activeChip !== "all")
            fallback = fallback.filter((t) => t.category === activeChip);
          if (search) {
            const q = search.toLowerCase();
            fallback = fallback.filter((t) =>
              t.title.toLowerCase().includes(q)
            );
          }
          setTasks(fallback);
          setPagination({
            page: 1,
            limit: ITEMS_PER_PAGE,
            total: fallback.length,
            totalPages: 1,
          });
        }
      } catch {
        if (cancelled) return;
        setTasks(sampleTasks as TaskItem[]);
        setPagination({
          page: 1,
          limit: ITEMS_PER_PAGE,
          total: sampleTasks.length,
          totalPages: 1,
        });
      }
      if (!cancelled) setLoading(false);
    }
    loadTasks();
    return () => {
      cancelled = true;
    };
  }, [search, activeChip, selectedCity, sortBy, currentPage]);

  const handleApply = (task: TaskItem) => {
    if (!user) {
      setSelectedTask(task);
      setShowLogin(true);
    } else {
      // In production would navigate to apply page or open modal
      window.location.href = `/task/${task.id}`;
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleChipChange = (value: string) => {
    setActiveChip(value);
    setCurrentPage(1);
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  const totalLabel =
    pagination.total === 1
      ? "1 task available"
      : `${pagination.total.toLocaleString()} tasks available`;

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <Badge className="bg-[#F3F4F6] text-[#0D8A5C] hover:bg-[#F3F4F6] border-0 mb-4">
              <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
              Opportunities Near You
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#374151] mb-4 tracking-tight">
              Find Work That Fits
              <br className="hidden sm:block" /> Your Skills
            </h1>
            <p className="text-[#9CA3AF] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Browse gigs, services, and jobs posted by people in your city.
              Apply instantly and start earning on your terms.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
              <Input
                placeholder="Search for tasks, gigs, or services..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 h-12 sm:h-14 text-base rounded-xl bg-[#F3F4F6] border-[#E5E7EB] text-[#374151] placeholder:text-[#9CA3AF]"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 mt-8">
            <HeroStat icon={Briefcase} value="12,500+" label="Open Tasks" />
            <HeroStat icon={Users} value="8,200+" label="Active Users" />
            <HeroStat icon={MapPin} value="25+" label="Cities" />
            <HeroStat icon={Shield} value="Escrow" label="Protected" />
          </div>
        </div>
      </section>

      {/* Filter Chips + Controls */}
      <div className="bg-background border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
              {filterChips.map((chip) => {
                const Icon = chip.icon;
                const isActive = activeChip === chip.value;
                return (
                  <button
                    key={chip.value}
                    onClick={() => handleChipChange(chip.value)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {chip.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
              {/* City Filter */}
              <Select
                value={selectedCity}
                onValueChange={handleCityChange}
              >
                <SelectTrigger className="h-9 w-full sm:w-[170px] text-sm">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1" />
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

              {/* Sort */}
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="h-9 w-full sm:w-[180px] text-sm">
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground mr-1" />
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
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-muted/50 min-h-[60vh]">
        <div className="container mx-auto px-4 py-6">
          {/* Results Info */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-muted-foreground">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Loading tasks...
                </span>
              ) : (
                <>
                  <span className="font-medium text-foreground">
                    {totalLabel}
                  </span>
                  {activeChip !== "all" && (
                    <>
                      {" "}
                      &middot;{" "}
                      <span className="capitalize">{activeChip.replace("-", " ")}</span>
                    </>
                  )}
                  {selectedCity !== "all" && (
                    <>
                      {" "}
                      &middot; <span>{selectedCity}</span>
                    </>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-card rounded-lg border animate-pulse"
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-4">
                Try adjusting your filters or search to find more opportunities.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setActiveChip("all");
                  setSelectedCity("all");
                  setSortBy("newest");
                  setCurrentPage(1);
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}

          {/* Task Grid */}
          {!loading && tasks.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onApply={handleApply}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center">
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

      {/* CTA Banner */}
      <section className="bg-[#F3F4F6]">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-[#374151] mb-2">
              Have a task that needs doing?
            </h2>
            <p className="text-[#9CA3AF] text-sm mb-5">
              Post your task and get applications from skilled people in minutes.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/post-task">
                <Button
                  size="lg"
                  className="bg-[#0D8A5C] hover:bg-[#086B43] text-white font-semibold"
                >
                  Post a Task
                </Button>
              </Link>
              <Link href="/browse">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#E5E7EB] text-[#374151] hover:bg-white"
                >
                  Browse All
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Magic Link Modal */}
      <MagicLinkModal open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
}
