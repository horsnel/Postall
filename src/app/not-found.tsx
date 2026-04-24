import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Home, ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-8 max-w-lg mx-auto">
        {/* Large 404 */}
        <div>
          <h1 className="text-[120px] sm:text-[160px] font-black leading-none text-[#0D8A5C]">
            404
          </h1>
        </div>

        {/* Message */}
        <div className="space-y-3 -mt-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-base">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for tasks, services, items..."
            className="pl-12 h-12 text-base rounded-xl border-2 border-[#E5E7EB] focus-visible:border-[#0D8A5C]"
          />
          <Link
            href="/browse"
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <Button size="sm" className="rounded-lg">
              Search
            </Button>
          </Link>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/">
            <Button className="gap-2 w-full sm:w-auto">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/browse">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <ChevronLeft className="h-4 w-4" />
              Browse Marketplace
            </Button>
          </Link>
        </div>

        {/* Helpful links */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground pt-4 border-t">
          <Link
            href="/help"
            className="hover:text-[#0D8A5C] transition-colors"
          >
            Help Center
          </Link>
          <span>•</span>
          <Link
            href="/about"
            className="hover:text-[#0D8A5C] transition-colors"
          >
            About PostAll
          </Link>
          <span>•</span>
          <Link
            href="/contact"
            className="hover:text-[#0D8A5C] transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
