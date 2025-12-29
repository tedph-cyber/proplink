'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara'
]

export function PropertySearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || '')
  const [state, setState] = useState(searchParams.get('state') || '')
  const [lga, setLga] = useState(searchParams.get('lga') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Update form when URL params change
    setSearchQuery(searchParams.get('q') || '')
    setPropertyType(searchParams.get('type') || '')
    setState(searchParams.get('state') || '')
    setLga(searchParams.get('lga') || '')
    setCity(searchParams.get('city') || '')
    setMinPrice(searchParams.get('minPrice') || '')
    setMaxPrice(searchParams.get('maxPrice') || '')
    setSortBy(searchParams.get('sort') || 'newest')
  }, [searchParams])

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()

    const params = new URLSearchParams()
    
    if (searchQuery) params.set('q', searchQuery)
    if (propertyType) params.set('type', propertyType)
    if (state) params.set('state', state)
    if (lga) params.set('lga', lga)
    if (city) params.set('city', city)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (sortBy && sortBy !== 'newest') params.set('sort', sortBy)

    router.push(`/properties?${params.toString()}`)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setPropertyType('')
    setState('')
    setLga('')
    setCity('')
    setMinPrice('')
    setMaxPrice('')
    setSortBy('newest')
    router.push('/properties')
  }

  const hasActiveFilters = searchQuery || propertyType || state || lga || city || minPrice || maxPrice || (sortBy && sortBy !== 'newest')

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search properties by title, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <Button type="submit">Search</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          {hasActiveFilters && (
            <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-[var(--primary)] text-xs text-white font-semibold">
              {[searchQuery, propertyType, state, lga, city, minPrice, maxPrice, sortBy !== 'newest' && sortBy].filter(Boolean).length}
            </span>
          )}
        </Button>
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-lg)] animate-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
              >
                <option value="">All Types</option>
                <option value="house">House</option>
                <option value="land">Land</option>
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
              >
                <option value="">All States</option>
                {NIGERIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* LGA */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                LGA
              </label>
              <Input
                type="text"
                placeholder="e.g., Eti-Osa"
                value={lga}
                onChange={(e) => setLga(e.target.value)}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                City/Area
              </label>
              <Input
                type="text"
                placeholder="e.g., Lekki"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Min Price (₦)
              </label>
              <Input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Max Price (₦)
              </label>
              <Input
                type="number"
                placeholder="No limit"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => handleSearch()} className="flex-1">
              Apply Filters
            </Button>
            {hasActiveFilters && (
              <Button onClick={handleClearFilters} variant="outline">
                Clear All
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && !showFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm text-[var(--primary)] border border-[var(--primary)]/20">
              Search: "{searchQuery}"
              <button
                onClick={() => {
                  setSearchQuery('')
                  handleSearch()
                }}
                className="hover:text-[var(--destructive)] transition-colors font-bold"
              >
                ×
              </button>
            </span>
          )}
          {propertyType && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm text-[var(--primary)] border border-[var(--primary)]/20 capitalize">
              {propertyType}
              <button
                onClick={() => {
                  setPropertyType('')
                  handleSearch()
                }}
                className="hover:text-[var(--destructive)] transition-colors font-bold"
              >
                ×
              </button>
            </span>
          )}
          {state && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm text-[var(--primary)] border border-[var(--primary)]/20">
              {state}
              <button
                onClick={() => {
                  setState('')
                  handleSearch()
                }}
                className="hover:text-[var(--destructive)] transition-colors font-bold"
              >
                ×
              </button>
            </span>
          )}
          {lga && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm text-[var(--primary)] border border-[var(--primary)]/20">
              LGA: {lga}
              <button
                onClick={() => {
                  setLga('')
                  handleSearch()
                }}
                className="hover:text-[var(--destructive)] transition-colors font-bold"
              >
                ×
              </button>
            </span>
          )}
          {city && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm text-[var(--primary)] border border-[var(--primary)]/20">
              City: {city}
              <button
                onClick={() => {
                  setCity('')
                  handleSearch()
                }}
                className="hover:text-[var(--destructive)] transition-colors font-bold"
              >
                ×
              </button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm text-[var(--primary)] border border-[var(--primary)]/20">
              Price: ₦{minPrice || '0'} - ₦{maxPrice || '∞'}
              <button
                onClick={() => {
                  setMinPrice('')
                  setMaxPrice('')
                  handleSearch()
                }}
                className="hover:text-[var(--destructive)] transition-colors font-bold"
              >
                ×
              </button>
            </span>
          )}
          {sortBy && sortBy !== 'newest' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm text-[var(--primary)] border border-[var(--primary)]/20">
              Sort: {sortBy === 'oldest' ? 'Oldest First' : sortBy === 'price-asc' ? 'Price Low-High' : 'Price High-Low'}
              <button
                onClick={() => {
                  setSortBy('newest')
                  handleSearch()
                }}
                className="hover:text-[var(--destructive)] transition-colors font-bold"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
