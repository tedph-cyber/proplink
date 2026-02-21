'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { NIGERIAN_STATES, STATE_LGA_MAPPING_SIMPLIFIED, HOUSE_TYPES, BEDROOM_CATEGORIES, LAND_SIZE_UNITS } from '@/lib/constants'
import { getHouseTypeLabel, getBedroomLabel, getLandSizeUnitDisplay } from '@/lib/utils'

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
  const [houseTypes, setHouseTypes] = useState<string[]>(
    searchParams.get('houseTypes') ? searchParams.get('houseTypes')!.split(',') : []
  )
  const [bedroomCategory, setBedroomCategory] = useState(searchParams.get('bedroom') || '')
  const [landSizeUnit, setLandSizeUnit] = useState(searchParams.get('landUnit') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const [showFilters, setShowFilters] = useState(false)

  // Get LGAs for selected state
  const availableLGAs = useMemo(() => {
    return state ? (STATE_LGA_MAPPING_SIMPLIFIED[state] || []) : []
  }, [state])

  useEffect(() => {
    // Update form when URL params change
    setSearchQuery(searchParams.get('q') || '')
    setPropertyType(searchParams.get('type') || '')
    setState(searchParams.get('state') || '')
    setLga(searchParams.get('lga') || '')
    setCity(searchParams.get('city') || '')
    setMinPrice(searchParams.get('minPrice') || '')
    setMaxPrice(searchParams.get('maxPrice') || '')
    setHouseTypes(searchParams.get('houseTypes') ? searchParams.get('houseTypes')!.split(',') : [])
    setBedroomCategory(searchParams.get('bedroom') || '')
    setLandSizeUnit(searchParams.get('landUnit') || '')
    setSortBy(searchParams.get('sort') || 'newest')
  }, [searchParams])

  const handleSearch = (e?: React.FormEvent, overrides?: Partial<{
    searchQuery: string
    propertyType: string
    state: string
    lga: string
    city: string
    minPrice: string
    maxPrice: string
    houseTypes: string[]
    bedroomCategory: string
    landSizeUnit: string
    sortBy: string
  }>) => {
    e?.preventDefault()

    // Use overrides if provided, otherwise use current state
    const values = {
      searchQuery: overrides?.searchQuery ?? searchQuery,
      propertyType: overrides?.propertyType ?? propertyType,
      state: overrides?.state ?? state,
      lga: overrides?.lga ?? lga,
      city: overrides?.city ?? city,
      minPrice: overrides?.minPrice ?? minPrice,
      maxPrice: overrides?.maxPrice ?? maxPrice,
      houseTypes: overrides?.houseTypes ?? houseTypes,
      bedroomCategory: overrides?.bedroomCategory ?? bedroomCategory,
      landSizeUnit: overrides?.landSizeUnit ?? landSizeUnit,
      sortBy: overrides?.sortBy ?? sortBy,
    }

    const params = new URLSearchParams()
    
    if (values.searchQuery) params.set('q', values.searchQuery)
    if (values.propertyType) params.set('type', values.propertyType)
    if (values.state) params.set('state', values.state)
    if (values.lga) params.set('lga', values.lga)
    if (values.city) params.set('city', values.city)
    if (values.minPrice) params.set('minPrice', values.minPrice)
    if (values.maxPrice) params.set('maxPrice', values.maxPrice)
    if (values.houseTypes.length > 0) params.set('houseTypes', values.houseTypes.join(','))
    if (values.bedroomCategory) params.set('bedroom', values.bedroomCategory)
    if (values.landSizeUnit) params.set('landUnit', values.landSizeUnit)
    if (values.sortBy && values.sortBy !== 'newest') params.set('sort', values.sortBy)

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
    setHouseTypes([])
    setBedroomCategory('')
    setLandSizeUnit('')
    setSortBy('newest')
    router.push('/properties')
  }

  const hasActiveFilters = searchQuery || propertyType || state || lga || city || minPrice || maxPrice || houseTypes.length > 0 || bedroomCategory || landSizeUnit || (sortBy && sortBy !== 'newest')

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
                onChange={(e) => {
                  setPropertyType(e.target.value)
                  if (e.target.value !== 'house') setHouseTypes([])
                  if (e.target.value !== 'house') setBedroomCategory('')
                  if (e.target.value !== 'land') setLandSizeUnit('')
                }}
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
                onChange={(e) => {
                  setState(e.target.value)
                  setLga('')
                }}
                className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
              >
                <option value="">All States</option>
                {NIGERIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* LGA - Dynamic based on State */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Local Government
              </label>
              {state && availableLGAs.length > 0 ? (
                <select
                  value={lga}
                  onChange={(e) => setLga(e.target.value)}
                  className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
                >
                  <option value="">All LGAs</option>
                  {availableLGAs.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              ) : (
                <Input
                  type="text"
                  placeholder={state ? 'No LGAs available' : 'Select state first'}
                  value={lga}
                  onChange={(e) => setLga(e.target.value)}
                  disabled={!state}
                />
              )}
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

            {/* House Types - Only for houses */}
            {propertyType === 'house' && (
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  House Type
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {HOUSE_TYPES.map(type => (
                    <label key={type.value} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={houseTypes.includes(type.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setHouseTypes([...houseTypes, type.value])
                          } else {
                            setHouseTypes(houseTypes.filter(t => t !== type.value))
                          }
                        }}
                        className="rounded border-[var(--border)] text-[var(--primary)]"
                      />
                      <span className="ml-2 text-sm text-[var(--foreground)]">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Bedroom Category - Only for houses */}
            {propertyType === 'house' && (
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Bedrooms
                </label>
                <select
                  value={bedroomCategory}
                  onChange={(e) => setBedroomCategory(e.target.value)}
                  className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
                >
                  <option value="">Any</option>
                  {BEDROOM_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Land Size Unit - Only for lands */}
            {propertyType === 'land' && (
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Land Size Unit
                </label>
                <select
                  value={landSizeUnit}
                  onChange={(e) => setLandSizeUnit(e.target.value)}
                  className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
                >
                  <option value="">Any Unit</option>
                  {LAND_SIZE_UNITS.map(unit => (
                    <option key={unit.value} value={unit.value}>{unit.label}</option>
                  ))}
                </select>
              </div>
            )}

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
                  handleSearch(undefined, { searchQuery: '' })
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
                  handleSearch(undefined, { propertyType: '' })
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
                  handleSearch(undefined, { state: '' })
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
                  handleSearch(undefined, { lga: '' })
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
                  handleSearch(undefined, { city: '' })
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
                  handleSearch(undefined, { minPrice: '', maxPrice: '' })
                }}
                className="hover:text-[var(--destructive)] transition-colors font-bold"
              >
                ×
              </button>
            </span>
          )}
          {houseTypes.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm text-[var(--primary)] border border-[var(--primary)]/20">
              Types: {houseTypes.map(getHouseTypeLabel).join(', ')}
              <button
                onClick={() => {
                  setHouseTypes([])
                  handleSearch(undefined, { houseTypes: [] })
                }}
                className="hover:text-[var(--destructive)] transition-colors font-bold"
              >
                ×
              </button>
            </span>
          )}
          {bedroomCategory && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm text-[var(--primary)] border border-[var(--primary)]/20">
              {getBedroomLabel(bedroomCategory)}
              <button
                onClick={() => {
                  setBedroomCategory('')
                  handleSearch(undefined, { bedroomCategory: '' })
                }}
                className="hover:text-[var(--destructive)] transition-colors font-bold"
              >
                ×
              </button>
            </span>
          )}
          {landSizeUnit && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm text-[var(--primary)] border border-[var(--primary)]/20">
              Unit: {getLandSizeUnitDisplay(landSizeUnit).label}
              <button
                onClick={() => {
                  setLandSizeUnit('')
                  handleSearch(undefined, { landSizeUnit: '' })
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
                  handleSearch(undefined, { sortBy: 'newest' })
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
