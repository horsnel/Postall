'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import { SearchSuggestions, saveRecentSearch } from '@/components/search/search-suggestions'

export function HeroSearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      saveRecentSearch(query.trim())
      router.push(`/browse?q=${encodeURIComponent(query.trim())}`)
      setIsFocused(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full relative" role="search" aria-label="Search marketplace">
      <div className="flex items-center bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden ring-1 ring-[#E5E7EB]">
        <div className="flex items-center pl-5 text-muted-foreground">
          <Search className="h-5 w-5" aria-hidden="true" />
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search items, tasks, services, jobs..."
          className="flex-1 h-14 md:h-16 px-4 py-4 text-base md:text-lg text-[#374151] placeholder:text-[#9CA3AF] bg-transparent border-0 outline-none"
          autoComplete="off"
          aria-label="Search items, tasks, services, jobs"
        />
        <div className="hidden sm:flex items-center pl-3 pr-1 border-l border-border">
          <MapPin className="h-4 w-4 text-[#9CA3AF]" aria-hidden="true" />
        </div>
        <button
          type="submit"
          className="m-2 bg-[#0D8A5C] hover:bg-[#086B43] active:bg-[#064E35] text-white font-semibold px-4 sm:px-6 md:px-8 h-10 md:h-12 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#0D8A5C]/25 text-sm whitespace-nowrap press-effect"
        >
          Search
        </button>
      </div>
      <SearchSuggestions
        query={debouncedQuery}
        isOpen={isFocused}
        onClose={() => setIsFocused(false)}
      />
    </form>
  )
}
