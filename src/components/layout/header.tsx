"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useNotificationStore } from "@/lib/notification-store";
import { cities, categories } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Menu,
  CirclePlus,
  Search,
  Heart,
  Bell,
  MapPin,
  Loader2,
  Languages,
  LogOut,
  User,
  LayoutDashboard,
  Check,
  ChevronDown,
  Home,
} from "lucide-react";
import LanguageSelector from "@/components/layout/language-selector";
import { SearchSuggestions, saveRecentSearch } from "@/components/search/search-suggestions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguageStore } from "@/lib/i18n";
import { locales } from "@/lib/i18n/translations";
import { toast } from "sonner";

// Nigerian city lat/lng bounds for geo-matching
const cityGeoBounds: { name: string; latMin: number; latMax: number; lngMin: number; lngMax: number }[] = [
  { name: "Lagos", latMin: 6.3, latMax: 6.7, lngMin: 2.9, lngMax: 4.1 },
  { name: "Abuja", latMin: 8.8, latMax: 9.2, lngMin: 7.2, lngMax: 7.7 },
  { name: "Port Harcourt", latMin: 4.7, latMax: 4.9, lngMin: 6.9, lngMax: 7.1 },
  { name: "Ibadan", latMin: 7.3, latMax: 7.5, lngMin: 3.8, lngMax: 4.0 },
  { name: "Benin City", latMin: 6.3, latMax: 6.4, lngMin: 5.5, lngMax: 5.7 },
  { name: "Kaduna", latMin: 10.5, latMax: 10.7, lngMin: 7.3, lngMax: 7.5 },
  { name: "Enugu", latMin: 6.4, latMax: 6.5, lngMin: 7.4, lngMax: 7.6 },
  { name: "Owerri", latMin: 5.4, latMax: 5.5, lngMin: 7.0, lngMax: 7.1 },
  { name: "Uyo", latMin: 4.9, latMax: 5.1, lngMin: 7.9, lngMax: 8.0 },
  { name: "Calabar", latMin: 4.9, latMax: 5.1, lngMin: 8.2, lngMax: 8.4 },
  { name: "Warri", latMin: 5.5, latMax: 5.6, lngMin: 5.7, lngMax: 5.8 },
  { name: "Jos", latMin: 9.8, latMax: 9.9, lngMin: 8.8, lngMax: 8.9 },
  { name: "Ilorin", latMin: 8.4, latMax: 8.5, lngMin: 4.5, lngMax: 4.6 },
];

function matchCityByCoords(lat: number, lng: number): string | null {
  for (const city of cityGeoBounds) {
    if (lat >= city.latMin && lat <= city.latMax && lng >= city.lngMin && lng <= city.lngMax) {
      return city.name;
    }
  }
  return null;
}

export default function Header() {
  const { user, logout } = useAuthStore();
  const unreadNotificationCount = useNotificationStore((s) => s.unreadNotificationCount);
  const unreadMessageCount = useNotificationStore((s) => s.unreadMessageCount);
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [detectingLocation, setDetectingLocation] = useState(false);
  const totalUnread = unreadNotificationCount + unreadMessageCount;

  // Debounce header search (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const matched = matchCityByCoords(position.coords.latitude, position.coords.longitude);
        if (matched) {
          setSelectedCity(matched);
        }
        setDetectingLocation(false);
      },
      () => {
        setDetectingLocation(false);
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      detectLocation();
    }, 0);
    return () => clearTimeout(timer);
  }, [detectLocation]);


  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFFFF] border-b border-[#E5E7EB]">
      {/* Desktop Header */}
      <div className="hidden md:flex h-16 items-center gap-3 px-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href={user ? "/dashboard" : "/browse"} className="flex items-center gap-2 shrink-0">
          <div className="h-9 w-9 rounded-full bg-[#0D8A5C] flex items-center justify-center">
            <span className="text-white font-bold text-sm">PA</span>
          </div>
          <span className="font-bold text-xl text-[#0D8A5C]">PostAll</span>
        </Link>

        {/* City Selector + Detect Location */}
        <div className="flex items-center gap-1">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-[140px] h-9 text-[#374151] border-[#E5E7EB]">
              <SelectValue placeholder="Select city" />
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
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-[#9CA3AF] hover:text-[#0D8A5C]"
            onClick={detectLocation}
            disabled={detectingLocation}
            title="Detect my location"
            aria-label="Detect my location"
          >
            {detectingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl relative" role="search">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <Input
              placeholder="Search tasks, services, items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="pl-9 h-10 bg-[#F3F4F6] border-[#F3F4F6] rounded-full focus-visible:ring-[#0D8A5C]/20"
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  saveRecentSearch(searchQuery.trim());
                  window.location.href = `/browse?q=${encodeURIComponent(searchQuery.trim())}`;
                  setSearchFocused(false);
                }
              }}
              autoComplete="off"
            />
          </div>
          <SearchSuggestions
            query={debouncedSearch}
            isOpen={searchFocused}
            onClose={() => setSearchFocused(false)}
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Auth Buttons - Show for unauthenticated users */}
          {!user && (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-[#374151] hover:text-[#0D8A5C]">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-[#0D8A5C] hover:bg-[#0D8A5C]/90 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Logged-in user controls */}
          {user && (
            <>
              {/* Home Button */}
              <Link
                href="/dashboard"
                className="p-2 rounded-full hover:bg-[#F3F4F6] transition-colors"
                aria-label="Home"
              >
                <Home className="h-5 w-5 text-[#6B7280] hover:text-[#0D8A5C]" />
              </Link>

              {/* Notification Bell */}
              <Link
                href="/notifications"
                className="relative p-2 rounded-full hover:bg-[#F3F4F6] transition-colors"
                aria-label={`Notifications${totalUnread > 0 ? ` (${totalUnread} unread)` : ""}`}
              >
                <Bell className="h-5 w-5 text-[#6B7280] hover:text-[#374151]" />
                {totalUnread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center px-1 ring-2 ring-white">
                    {totalUnread > 99 ? '99+' : totalUnread}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* Hamburger Menu Button */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-[#9CA3AF] hover:text-[#374151]"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-4 mt-8">
                {/* Marketplace Links - Updated without autos/housing */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[#9CA3AF] px-2">Marketplace</p>
                  {[
                    { href: "/jobs", label: "Jobs & Careers" },
                    { href: "/services", label: "Services" },
                    { href: "/deals", label: "Deals & Promos" },
                    { href: "/events", label: "Events" },
                    { href: "/stores", label: "Stores" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-[#374151] hover:bg-[#F3F4F6] transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Categories */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[#9CA3AF] px-2">Categories</p>
                  {categories.slice(0, 4).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/browse/${cat.id}`}
                      className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-[#374151] hover:bg-[#F3F4F6] transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <Link href="/browse" onClick={() => setMobileOpen(false)} className="block text-sm text-[#0D8A5C] px-3 py-1 hover:underline">
                    View all categories →
                  </Link>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4 border-t border-[#E5E7EB]">
                  <Link href="/post-task" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full gap-2 bg-[#0D8A5C] hover:bg-[#0D8A5C]/90">
                      <CirclePlus className="h-4 w-4" />
                      Post a Task
                    </Button>
                  </Link>
                  <Link href="/find-work" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full gap-2 border-[#E5E7EB]">
                      <Search className="h-4 w-4" />
                      Find Work
                    </Button>
                  </Link>

                  {user ? (
                    <>
                      <div className="space-y-1 pt-2 border-t border-[#E5E7EB]">
                        <p className="text-sm font-medium text-[#9CA3AF] px-2">Account</p>
                        <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start text-[#374151]">
                            <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                          </Button>
                        </Link>
                        <Link href="/dashboard/messages" onClick={() => setMobileOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start text-[#374151]">
                            Messages
                          </Button>
                        </Link>
                        <Link href="/favorites" onClick={() => setMobileOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start text-[#374151]">
                            <Heart className="h-4 w-4 mr-2" /> Favorites
                          </Button>
                        </Link>
                        <Link href="/notifications" onClick={() => setMobileOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start text-[#374151]">
                            <Bell className="h-4 w-4 mr-2" /> Notifications
                          </Button>
                        </Link>
                        <Link href="/dashboard/profile" onClick={() => setMobileOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start text-[#374151]">
                            <User className="h-4 w-4 mr-2" /> Profile
                          </Button>
                        </Link>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-[#E5E7EB]"
                        onClick={() => {
                          logout();
                          setMobileOpen(false);
                          toast.success('Signed out successfully');
                        }}
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full border-[#E5E7EB]">Log In</Button>
                      </Link>
                      <Link href="/register" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full bg-[#0D8A5C] hover:bg-[#0D8A5C]/90">Sign Up</Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Language Selector in Drawer */}
                <div className="flex items-center justify-between px-2 pt-2 border-t border-[#E5E7EB]">
                  <span className="text-sm font-medium text-[#9CA3AF]">Language</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2 text-[#374151]">
                        <Languages className="h-4 w-4" />
                        {locales.find((l) => l.code === useLanguageStore.getState().locale)?.name ?? "English"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      {locales.map((l) => (
                        <DropdownMenuItem
                          key={l.code}
                          onClick={() => {
                            useLanguageStore.getState().setLocale(l.code);
                            toast.success(`Language changed to ${l.name}`);
                          }}
                          className={useLanguageStore.getState().locale === l.code ? "bg-[#F0FDF4] font-medium" : ""}
                        >
                          <span className="mr-2">{l.flag}</span>
                          <span>{l.name}</span>
                          {useLanguageStore.getState().locale === l.code && (
                            <Check className="ml-auto h-3.5 w-3.5 text-[#0D8A5C]" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex md:hidden h-14 items-center gap-2 px-4">
        {/* Logo */}
        <Link href={user ? "/dashboard" : "/browse"} className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-full bg-[#0D8A5C] flex items-center justify-center">
            <span className="text-white font-bold text-xs">PA</span>
          </div>
          <span className="font-bold text-lg text-[#0D8A5C]">PostAll</span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Auth Buttons - Show for unauthenticated users */}
        {!user && (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-[#374151] text-xs">
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-[#0D8A5C] hover:bg-[#0D8A5C]/90 text-white text-xs">
                Sign Up
              </Button>
            </Link>
          </div>
        )}

        {/* Logged-in user controls */}
        {user && (
          <>
            {/* Home Button */}
            <Link
              href="/dashboard"
              className="p-2 rounded-full hover:bg-[#F3F4F6] transition-colors"
              aria-label="Home"
            >
              <Home className="h-5 w-5 text-[#6B7280]" />
            </Link>
          </>
        )}

        {/* Search Icon (mobile) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-[#9CA3AF] hover:text-[#374151]"
          aria-label="Search"
          onClick={() => {
            window.location.href = '/browse';
          }}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Hamburger Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-[#9CA3AF] hover:text-[#374151]"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-4 mt-8">
              {/* City Selector */}
              <div className="flex items-center gap-1">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="flex-1 text-[#374151] border-[#E5E7EB]">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city.name} value={city.name}>
                        {city.name}, {city.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-[#9CA3AF] hover:text-[#0D8A5C]"
                  onClick={detectLocation}
                  disabled={detectingLocation}
                  title="Detect my location"
                  aria-label="Detect my location"
                >
                  {detectingLocation ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Search */}
              <div className="relative" role="search">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <Input
                  placeholder="Search..."
                  className="pl-9 h-10 bg-[#F3F4F6] border-[#F3F4F6] rounded-full"
                  aria-label="Search"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      const q = e.currentTarget.value.trim();
                      saveRecentSearch(q);
                      window.location.href = `/browse?q=${encodeURIComponent(q)}`;
                      setMobileOpen(false);
                    }
                  }}
                />
              </div>

              {/* Marketplace Links - Updated without autos/housing */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#9CA3AF] px-2">Marketplace</p>
                {[
                  { href: "/jobs", label: "Jobs & Careers" },
                  { href: "/services", label: "Services" },
                  { href: "/deals", label: "Deals & Promos" },
                  { href: "/events", label: "Events" },
                  { href: "/stores", label: "Stores" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-[#374151] hover:bg-[#F3F4F6] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Categories */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#9CA3AF] px-2">Categories</p>
                {categories.slice(0, 4).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/browse/${cat.id}`}
                    className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-[#374151] hover:bg-[#F3F4F6] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link href="/browse" onClick={() => setMobileOpen(false)} className="block text-sm text-[#0D8A5C] px-3 py-1 hover:underline">
                  View all categories →
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-[#E5E7EB]">
                <Link href="/post-task" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full gap-2 bg-[#0D8A5C] hover:bg-[#0D8A5C]/90">
                    <CirclePlus className="h-4 w-4" />
                    Post a Task
                  </Button>
                </Link>
                <Link href="/find-work" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full gap-2 border-[#E5E7EB]">
                    <Search className="h-4 w-4" />
                    Find Work
                  </Button>
                </Link>

                {user ? (
                  <>
                    <div className="space-y-1 pt-2 border-t border-[#E5E7EB]">
                      <p className="text-sm font-medium text-[#9CA3AF] px-2">Account</p>
                      <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-[#374151]">
                          <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                        </Button>
                      </Link>
                      <Link href="/dashboard/messages" onClick={() => setMobileOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-[#374151]">
                          Messages
                        </Button>
                      </Link>
                      <Link href="/favorites" onClick={() => setMobileOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-[#374151]">
                          <Heart className="h-4 w-4 mr-2" /> Favorites
                        </Button>
                      </Link>
                      <Link href="/notifications" onClick={() => setMobileOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-[#374151]">
                          <Bell className="h-4 w-4 mr-2" /> Notifications
                        </Button>
                      </Link>
                      <Link href="/dashboard/profile" onClick={() => setMobileOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-[#374151]">
                          <User className="h-4 w-4 mr-2" /> Profile
                        </Button>
                      </Link>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-[#E5E7EB]"
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                        toast.success('Signed out successfully');
                      }}
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full border-[#E5E7EB]">Log In</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-[#0D8A5C] hover:bg-[#0D8A5C]/90">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Language Selector in Mobile Drawer */}
              <div className="flex items-center justify-between px-2 pt-2 border-t border-[#E5E7EB]">
                <span className="text-sm font-medium text-[#9CA3AF]">Language</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 text-[#374151]">
                      <Languages className="h-4 w-4" />
                      {locales.find((l) => l.code === useLanguageStore.getState().locale)?.name ?? "English"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    {locales.map((l) => (
                      <DropdownMenuItem
                        key={l.code}
                        onClick={() => {
                          useLanguageStore.getState().setLocale(l.code);
                          toast.success(`Language changed to ${l.name}`);
                        }}
                        className={useLanguageStore.getState().locale === l.code ? "bg-[#F0FDF4] font-medium" : ""}
                      >
                        <span className="mr-2">{l.flag}</span>
                        <span>{l.name}</span>
                        {useLanguageStore.getState().locale === l.code && (
                          <Check className="ml-auto h-3.5 w-3.5 text-[#0D8A5C]" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
