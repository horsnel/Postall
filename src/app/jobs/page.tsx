'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import {
  Search,
  MapPin,
  Heart,
  Clock,
  Briefcase,
  Plus,
  ChevronDown,
  X,
  Star,
  Building2,
  Filter,
} from 'lucide-react';

/* ──────────────── Category Tabs ──────────────── */
const jobCategories = [
  'All',
  'Full-time',
  'Part-time',
  'Remote',
  'Freelance',
  'Internship',
  'Contract',
];

/* ──────────────── Sample Job Data ──────────────── */
interface JobItem {
  id: string;
  title: string;
  company: string;
  initials: string;
  logoColor: string;
  city: string;
  salaryRange: string;
  postedAgo: string;
  type: string;
  tags: string[];
  featured?: boolean;
}

const allJobs: JobItem[] = [
  { id: 'job1', title: 'Senior Frontend Developer', company: 'Paystack', initials: 'PY', logoColor: '#0D8A5C', city: 'Lagos', salaryRange: '₦6,000,000 – ₦10,000,000', postedAgo: '2h ago', type: 'Full-time', tags: ['React', 'TypeScript', 'Next.js'], featured: true },
  { id: 'job2', title: 'Product Designer', company: 'Flutterwave', initials: 'FW', logoColor: '#E85D3A', city: 'Lagos', salaryRange: '₦5,000,000 – ₦8,000,000', postedAgo: '4h ago', type: 'Full-time', tags: ['Figma', 'UI/UX', 'Design System'] },
  { id: 'job3', title: 'Data Analyst', company: 'Andela', initials: 'AN', logoColor: '#3B82F6', city: 'Abuja', salaryRange: '₦4,500,000 – ₦7,000,000', postedAgo: '6h ago', type: 'Full-time', tags: ['SQL', 'Python', 'Tableau'] },
  { id: 'job4', title: 'Marketing Manager', company: 'Jumia', initials: 'JM', logoColor: '#F59E0B', city: 'Lagos', salaryRange: '₦4,000,000 – ₦6,500,000', postedAgo: '8h ago', type: 'Full-time', tags: ['Digital Marketing', 'SEO', 'Analytics'] },
  { id: 'job5', title: 'Mobile Developer (React Native)', company: 'Cowrywise', initials: 'CR', logoColor: '#8B5CF6', city: 'Lagos', salaryRange: '₦5,500,000 – ₦9,000,000', postedAgo: '12h ago', type: 'Remote', tags: ['React Native', 'iOS', 'Android'] },
  { id: 'job6', title: 'DevOps Engineer', company: 'Interswitch', initials: 'IS', logoColor: '#EF4444', city: 'Lagos', salaryRange: '₦7,000,000 – ₦12,000,000', postedAgo: '1d ago', type: 'Full-time', tags: ['AWS', 'Docker', 'Kubernetes'] },
  { id: 'job7', title: 'Content Writer', company: 'Selar', initials: 'SE', logoColor: '#10B981', city: 'Remote', salaryRange: '₦2,500,000 – ₦4,000,000', postedAgo: '1d ago', type: 'Freelance', tags: ['Copywriting', 'SEO', 'Blog'] },
  { id: 'job8', title: 'Software Engineering Intern', company: 'Moniepoint', initials: 'MP', logoColor: '#06B6D4', city: 'Lagos', salaryRange: '₦150,000 – ₦250,000/mo', postedAgo: '2d ago', type: 'Internship', tags: ['Java', 'Spring Boot', 'Git'] },
  { id: 'job9', title: 'HR Business Partner', company: 'GTBank', initials: 'GT', logoColor: '#DC2626', city: 'Lagos', salaryRange: '₦5,000,000 – ₦8,000,000', postedAgo: '2d ago', type: 'Full-time', tags: ['HR', 'Recruitment', 'Strategy'] },
  { id: 'job10', title: 'UI/UX Designer (Part-time)', company: 'TechCabal', initials: 'TC', logoColor: '#7C3AED', city: 'Lagos', salaryRange: '₦2,000,000 – ₦3,500,000', postedAgo: '3d ago', type: 'Part-time', tags: ['UI Design', 'Prototyping', 'Research'] },
  { id: 'job11', title: 'Backend Engineer', company: 'PiggyVest', initials: 'PV', logoColor: '#F97316', city: 'Lagos', salaryRange: '₦6,500,000 – ₦11,000,000', postedAgo: '3d ago', type: 'Contract', tags: ['Node.js', 'PostgreSQL', 'Redis'] },
  { id: 'job12', title: 'Customer Success Lead', company: 'Carbon', initials: 'CB', logoColor: '#14B8A6', city: 'Lagos', salaryRange: '₦3,500,000 – ₦5,500,000', postedAgo: '4d ago', type: 'Full-time', tags: ['CRM', 'Support', 'Onboarding'] },
  { id: 'job13', title: 'Freelance Video Editor', company: 'IrokoTV', initials: 'IR', logoColor: '#E11D48', city: 'Lagos', salaryRange: '₦3,000,000 – ₦5,000,000', postedAgo: '4d ago', type: 'Freelance', tags: ['Premiere Pro', 'After Effects', 'Motion'] },
  { id: 'job14', title: 'Financial Analyst', company: 'Bamboo', initials: 'BA', logoColor: '#0EA5E9', city: 'Abuja', salaryRange: '₦4,500,000 – ₦7,500,000', postedAgo: '5d ago', type: 'Full-time', tags: ['Excel', 'Financial Modeling', 'Bloomberg'] },
  { id: 'job15', title: 'Community Manager', company: 'BudgIT', initials: 'BD', logoColor: '#6366F1', city: 'Abuja', salaryRange: '₦2,500,000 – ₦4,000,000', postedAgo: '5d ago', type: 'Remote', tags: ['Social Media', 'Engagement', 'Content'] },
  { id: 'job16', title: 'QA Engineer (Contract)', company: 'TeamApt', initials: 'TA', logoColor: '#D946EF', city: 'Lagos', salaryRange: '₦4,000,000 – ₦6,500,000', postedAgo: '1w ago', type: 'Contract', tags: ['Selenium', 'Cypress', 'API Testing'] },
];

const ITEMS_PER_PAGE = 8;

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════ */
export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  /* ── Filtering & Sorting ── */
  const filteredJobs = useMemo(() => {
    let results = allJobs.filter((job) => {
      const matchCategory = activeCategory === 'All' || job.type === activeCategory;
      const matchSearch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
    return results;
  }, [searchQuery, activeCategory]);

  /* ── Pagination ── */
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || activeCategory !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
    setCurrentPage(1);
  };

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  /* ──────────────── RENDER ──────────────── */
  return (
    <div className="min-h-screen flex flex-col bg-white">

      <div className="flex-1">
        {/* ═══ GREEN GRADIENT HEADER ═══ */}
        <section
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0D8A5C 0%, #0B7A52 100%)',
          }}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(-30%, 30%)' }} />

          <div className="container mx-auto px-4 py-10 md:py-14 max-w-6xl relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white font-medium">Jobs</span>
            </nav>

            {/* Title Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Find Your Dream Job
                </h1>
                <p className="text-sm md:text-base" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Browse {filteredJobs.length}+ job listings from top companies across Nigeria
                </p>
              </div>
              <Button
                className="gap-2 rounded-full px-6 font-semibold shrink-0"
                style={{ background: 'white', color: '#0D8A5C' }}
                asChild
              >
                <Link href="/post-task">
                  <Plus className="h-4 w-4" />
                  Post a Job
                </Link>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="mt-8 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'rgba(255,255,255,0.5)' }} />
                <Input
                  placeholder="Search jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-0 text-sm bg-white/15 text-white placeholder:text-white/50 focus-visible:ring-2 focus-visible:ring-white/30"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X className="h-4 w-4 text-white/70" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CATEGORY FILTER TABS ═══ */}
        <section className="border-b sticky top-0 bg-white z-20 shadow-sm" style={{ borderColor: '#E5E7EB' }}>
          <div className="container mx-auto px-4 py-3 max-w-6xl">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {jobCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={
                    activeCategory === cat
                      ? { background: '#0D8A5C', color: '#FFFFFF' }
                      : { background: '#F3F4F6', color: '#374151' }
                  }
                >
                  {cat}
                </button>
              ))}
              <div className="ml-auto shrink-0">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-full border transition-colors"
                  style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">More Filters</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ MAIN CONTENT ═══ */}
        <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl flex-1">
          {/* Results count & clear */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Showing{' '}
              <span className="font-semibold" style={{ color: '#1F2937' }}>
                {filteredJobs.length}
              </span>{' '}
              {filteredJobs.length === 1 ? 'job' : 'jobs'}
              {activeCategory !== 'All' && (
                <span> in <span className="font-medium" style={{ color: '#0D8A5C' }}>{activeCategory}</span></span>
              )}
            </p>
            {hasActiveFilters && (
              <button
                className="flex items-center gap-1 text-xs hover:underline"
                style={{ color: '#0D8A5C' }}
                onClick={clearFilters}
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            )}
          </div>

          {/* ── Empty State ── */}
          {filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: '#F3F4F6' }}
              >
                <Search className="h-7 w-7" style={{ color: '#9CA3AF' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1F2937' }}>
                No jobs found
              </h3>
              <p className="text-sm mb-6 max-w-sm" style={{ color: '#9CA3AF' }}>
                We couldn&apos;t find any jobs matching your criteria. Try adjusting your search or filters.
              </p>
              <Button
                className="gap-1.5 rounded-full"
                style={{ background: '#0D8A5C', color: '#FFFFFF' }}
                onClick={clearFilters}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              {/* ── Job Cards Grid ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    saved={savedIds.includes(job.id)}
                    onToggleSave={toggleSave}
                  />
                ))}
              </div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="mt-10 mb-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className={`cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-40' : ''}`}
                          style={{ color: '#0D8A5C' }}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                            style={
                              currentPage === page
                                ? { background: '#0D8A5C', color: 'white', borderColor: '#0D8A5C' }
                                : { color: '#374151' }
                            }
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      {totalPages > 5 && <PaginationItem><PaginationEllipsis /></PaginationItem>}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          className={`cursor-pointer ${currentPage === totalPages ? 'pointer-events-none opacity-40' : ''}`}
                          style={{ color: '#0D8A5C' }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </main>
      </div>

    </div>
  );
}

/* ════════════════════════════════════════════════════
   JOB CARD
   ════════════════════════════════════════════════════ */
function JobCard({
  job,
  saved,
  onToggleSave,
}: {
  job: JobItem;
  saved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
}) {
  return (
    <Card
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 border flex flex-col"
      style={{ borderColor: '#E5E7EB', borderRadius: '12px' }}
    >
      <CardContent className="p-4 flex flex-col flex-1 gap-3">
        {/* Top Row: Logo + Save */}
        <div className="flex items-center justify-between">
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ background: job.logoColor }}
          >
            {job.initials}
          </div>
          <button
            onClick={(e) => onToggleSave(job.id, e)}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={saved ? 'Unsave job' : 'Save job'}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                saved ? 'fill-red-500 text-red-500' : 'text-[#9CA3AF]'
              }`}
            />
          </button>
        </div>

        {/* Job Title */}
        <Link href={`/task/${job.id}`} className="block">
          <h3
            className="text-sm font-semibold leading-snug group-hover:underline line-clamp-2 mb-1"
            style={{ color: '#1F2937' }}
          >
            {job.title}
          </h3>
        </Link>

        {/* Company & Location */}
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#374151' }}>
            <Building2 className="h-3 w-3" style={{ color: '#6B7280' }} />
            {job.company}
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: '#9CA3AF' }}>
            <MapPin className="h-3 w-3" />
            {job.city}
          </span>
        </div>

        {/* Salary */}
        <p className="text-sm font-bold" style={{ color: '#0D8A5C' }}>
          {job.salaryRange}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {job.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[10px] px-2 py-0 rounded-full font-normal"
              style={{ background: '#F3F4F6', color: '#6B7280' }}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Bottom Row: Type + Time */}
        <div className="mt-auto pt-2 border-t flex items-center justify-between" style={{ borderColor: '#F3F4F6' }}>
          <Badge
            className="text-[10px] px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: '#ECFDF5', color: '#0D8A5C' }}
          >
            <Briefcase className="h-2.5 w-2.5 mr-1" />
            {job.type}
          </Badge>
          <span className="flex items-center gap-1 text-[10px]" style={{ color: '#9CA3AF' }}>
            <Clock className="h-2.5 w-2.5" />
            {job.postedAgo}
          </span>
        </div>

        {/* Apply Button */}
        <Button
          className="w-full rounded-lg text-xs font-semibold h-9 transition-all"
          style={{
            background: '#0D8A5C',
            color: '#FFFFFF',
          }}
          asChild
        >
          <Link href={`/task/${job.id}`}>
            Apply Now
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
