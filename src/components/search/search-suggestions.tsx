"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, TrendingUp, Clock, X, ArrowRight } from "lucide-react"
import { categories } from "@/lib/constants"

interface SearchSuggestion {
  type: "category" | "recent" | "trending" | "query"
  text: string
  href: string
}

const TRENDING_SEARCHES = [
  "Plumber in Lagos",
  "Toyota Camry 2023",
  "Apartment for rent Lekki",
  "Freelance web developer",
  "iPhone 15 Pro Max",
  "Generator repair",
  "Moving service",
  "Event photographer",
  "Land for sale Abuja",
  "AC repair",
]

const STORAGE_KEY = "postall-recent-searches"

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRecentSearch(term: string) {
  if (!term.trim()) return
  try {
    const existing = getRecentSearches()
    const filtered = existing.filter((s) => s.toLowerCase() !== term.toLowerCase())
    filtered.unshift(term)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, 8)))
  } catch {
    // ignore storage errors
  }
}

function clearRecentSearches() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function SearchSuggestions({
  query,
  isOpen,
  onClose,
  onSelect,
}: {
  query: string
  isOpen: boolean
  onClose: () => void
  onSelect?: (suggestion: SearchSuggestion) => void
}) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  // Read recent searches from localStorage on every render (client-side only)
  const recentSearches = useMemo(() => getRecentSearches(), [isOpen])

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [isOpen, onClose])

  const suggestions = useMemo<SearchSuggestion[]>(() => {
    const results: SearchSuggestion[] = []
    const q = query.toLowerCase().trim()

    if (q) {
      // Filter trending that match
      const matchingTrending = TRENDING_SEARCHES.filter((t) =>
        t.toLowerCase().includes(q)
      )
      matchingTrending.slice(0, 3).forEach((t) => {
        results.push({ type: "trending", text: t, href: `/browse?q=${encodeURIComponent(t)}` })
      })

      // Filter categories that match
      const matchingCategories = categories.filter(
        (c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
      )
      matchingCategories.slice(0, 3).forEach((c) => {
        results.push({ type: "category", text: c.name, href: `/browse/${c.id}` })
      })

      // Filter recent that match
      const matchingRecent = recentSearches.filter((s) =>
        s.toLowerCase().includes(q)
      )
      matchingRecent.slice(0, 2).forEach((s) => {
        results.push({ type: "recent", text: s, href: `/browse?q=${encodeURIComponent(s)}` })
      })

      // If nothing matched, show a "search for" suggestion
      if (results.length === 0) {
        results.push({
          type: "query",
          text: query.trim(),
          href: `/browse?q=${encodeURIComponent(query.trim())}`,
        })
      }
    } else {
      // When no query: show recent + trending + categories
      recentSearches.slice(0, 4).forEach((s) => {
        results.push({ type: "recent", text: s, href: `/browse?q=${encodeURIComponent(s)}` })
      })

      TRENDING_SEARCHES.slice(0, 5).forEach((t) => {
        results.push({ type: "trending", text: t, href: `/browse?q=${encodeURIComponent(t)}` })
      })

      categories.slice(0, 4).forEach((c) => {
        results.push({ type: "category", text: c.name, href: `/browse/${c.id}` })
      })
    }

    return results
  }, [query, recentSearches])

  const handleClick = useCallback(
    (suggestion: SearchSuggestion) => {
      saveRecentSearch(suggestion.text)
      if (onSelect) {
        onSelect(suggestion)
      } else {
        router.push(suggestion.href)
      }
      onClose()
    },
    [router, onClose, onSelect]
  )

  const handleClearRecent = useCallback(() => {
    clearRecentSearches()
  }, [])

  if (!isOpen || suggestions.length === 0) return null

  // Group suggestions
  const recentItems = suggestions.filter((s) => s.type === "recent")
  const trendingItems = suggestions.filter((s) => s.type === "trending")
  const categoryItems = suggestions.filter((s) => s.type === "category")
  const queryItems = suggestions.filter((s) => s.type === "query")

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 right-0 mt-2 z-50 bg-popover text-popover-foreground rounded-xl shadow-2xl shadow-black/10 border border-border overflow-hidden max-h-[60vh] overflow-y-auto"
    >
      {/* Recent Searches */}
      {recentItems.length > 0 && (
        <div>
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Recent Searches
            </span>
            <button
              onClick={handleClearRecent}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          </div>
          {recentItems.map((item) => (
            <button
              key={`recent-${item.text}`}
              onClick={() => handleClick(item)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors text-left group"
            >
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="flex-1 text-sm truncate">{item.text}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Trending */}
      {trendingItems.length > 0 && (
        <div>
          <div className="px-4 pt-3 pb-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              {query ? "Matching Suggestions" : "Trending Searches"}
            </span>
          </div>
          {trendingItems.map((item) => (
            <button
              key={`trending-${item.text}`}
              onClick={() => handleClick(item)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors text-left group"
            >
              <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="flex-1 text-sm truncate">{highlightMatch(item.text, query)}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Categories */}
      {categoryItems.length > 0 && (
        <div>
          <div className="px-4 pt-3 pb-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5" />
              Categories
            </span>
          </div>
          {categoryItems.map((item) => (
            <button
              key={`cat-${item.text}`}
              onClick={() => handleClick(item)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors text-left group"
            >
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="flex-1 text-sm truncate">{highlightMatch(item.text, query)}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Query fallback (search for...) */}
      {queryItems.length > 0 && (
        <div className="border-t border-border">
          <button
            key={`query-${queryItems[0].text}`}
            onClick={() => handleClick(queryItems[0])}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors text-left group bg-muted/50"
          >
            <Search className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="flex-1 text-sm">
              Search for <strong>&quot;{queryItems[0].text}&quot;</strong>
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </button>
        </div>
      )}
    </div>
  )
}

/** Highlights matching portion of text in emerald bold */
function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text
  const lower = text.toLowerCase()
  const q = query.toLowerCase().trim()
  const idx = lower.indexOf(q)
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
        {text.slice(idx, idx + q.length)}
      </span>
      {text.slice(idx + q.length)}
    </>
  )
}

export { saveRecentSearch, getRecentSearches, STORAGE_KEY }
