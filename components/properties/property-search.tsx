'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { NIGERIAN_STATES, STATE_LGA_MAPPING_SIMPLIFIED, HOUSE_TYPES, BEDROOM_CATEGORIES, LAND_SIZE_UNITS } from '@/lib/constants'
import { getHouseTypeLabel, getBedroomLabel, getLandSizeUnitDisplay } from '@/lib/utils'

function Chip({
  children,
  onRemove,
}: {
  children: React.ReactNode
  onRemove: () => void
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm border"
      style={{
        background: 'var(--color-accent-muted)',
        color: 'var(--color-accent)',
        borderColor: 'var(--color-accent-muted)',
      }}
    >
      {children}
      <button
        onClick={onRemove}
        className="hover:opacity-70 transition-opacity font-bold leading-none"
        style={{ color: 'var(--color-accent)' }}
      >
        ×
      </button>
    </span>
  )
}

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

  const availableLGAs = useMemo(() => {
    return state ? (STATE_LGA_MAPPING_SIMPLIFIED[state] || []) : []
  }, [state])

  useEffect(() => {
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

  const selectClass = 'w-full rounded-[var(--radius)] border px-3 py-2 text-sm transition-all'
  const selectStyle: React.CSSProperties = {
    background: 'var(--color-surface)',
    borderColor: 'var(--color-border)',
    color: 'var(--color-text)',
  }

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
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5"
            style={{ color: 'var(--color-text-muted)' }}
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
          variant="ghost"
          onClick={() => setShowFilters(!showFilters)}
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          {hasActiveFilters && (
            <span
              className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full text-xs text-white font-semibold"
              style={{ background: 'var(--color-accent)' }}
            >
              {[searchQuery, propertyType, state, lga, city, minPrice, maxPrice, sortBy !== 'newest' && sortBy].filter(Boolean).length}
            </span>
          )}
        </Button>
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <div
          className="rounded-[var(--radius)] border p-6"
          style={{
            borderColor: 'var(--color-border)',
            background: 'var(--color-surface)',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
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
                className={selectClass}
                style={selectStyle}
              >
                <option value="">All Types</option>
                <option value="house">House</option>
                <option value="land">Land</option>
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                State
              </label>
              <select
                value={state}
                onChange={(e) => {
                  setState(e.target.value)
                  setLga('')
                }}
                className={selectClass}
                style={selectStyle}
              >
                <option value="">All States</option>
                {NIGERIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* LGA */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                Local Government
              </label>
              {state && availableLGAs.length > 0 ? (
                <select
                  value={lga}
                  onChange={(e) => setLga(e.target.value)}
                  className={selectClass}
                  style={selectStyle}
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
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
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
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
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
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                Max Price (₦)
              </label>
              <Input
                type="number"
                placeholder="No limit"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            {/* House Types */}
            {propertyType === 'house' && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
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
                        style={{ accentColor: 'var(--color-accent)' }}
                        className="rounded border"
                      />
                      <span className="ml-2 text-sm" style={{ color: 'var(--color-text)' }}>{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Bedroom Category */}
            {propertyType === 'house' && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                  Bedrooms
                </label>
                <select
                  value={bedroomCategory}
                  onChange={(e) => setBedroomCategory(e.target.value)}
                  className={selectClass}
                  style={selectStyle}
                >
                  <option value="">Any</option>
                  {BEDROOM_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Land Size Unit */}
            {propertyType === 'land' && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                  Land Size Unit
                </label>
                <select
                  value={landSizeUnit}
                  onChange={(e) => setLandSizeUnit(e.target.value)}
                  className={selectClass}
                  style={selectStyle}
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
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={selectClass}
                style={selectStyle}
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
              <Button onClick={handleClearFilters} variant="ghost">
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
            <Chip onRemove={() => {
              setSearchQuery('')
              handleSearch(undefined, { searchQuery: '' })
            }}>
              Search: &quot;{searchQuery}&quot;
            </Chip>
          )}
          {propertyType && (
            <Chip onRemove={() => {
              setPropertyType('')
              handleSearch(undefined, { propertyType: '' })
            }}>
              {propertyType}
            </Chip>
          )}
          {state && (
            <Chip onRemove={() => {
              setState('')
              handleSearch(undefined, { state: '' })
            }}>
              {state}
            </Chip>
          )}
          {lga && (
            <Chip onRemove={() => {
              setLga('')
              handleSearch(undefined, { lga: '' })
            }}>
              LGA: {lga}
            </Chip>
          )}
          {city && (
            <Chip onRemove={() => {
              setCity('')
              handleSearch(undefined, { city: '' })
            }}>
              City: {city}
            </Chip>
          )}
          {(minPrice || maxPrice) && (
            <Chip onRemove={() => {
              setMinPrice('')
              setMaxPrice('')
              handleSearch(undefined, { minPrice: '', maxPrice: '' })
            }}>
              Price: ₦{minPrice || '0'} - ₦{maxPrice || '∞'}
            </Chip>
          )}
          {houseTypes.length > 0 && (
            <Chip onRemove={() => {
              setHouseTypes([])
              handleSearch(undefined, { houseTypes: [] })
            }}>
              Types: {houseTypes.map(getHouseTypeLabel).join(', ')}
            </Chip>
          )}
          {bedroomCategory && (
            <Chip onRemove={() => {
              setBedroomCategory('')
              handleSearch(undefined, { bedroomCategory: '' })
            }}>
              {getBedroomLabel(bedroomCategory)}
            </Chip>
          )}
          {landSizeUnit && (
            <Chip onRemove={() => {
              setLandSizeUnit('')
              handleSearch(undefined, { landSizeUnit: '' })
            }}>
              Unit: {getLandSizeUnitDisplay(landSizeUnit).label}
            </Chip>
          )}
          {sortBy && sortBy !== 'newest' && (
            <Chip onRemove={() => {
              setSortBy('newest')
              handleSearch(undefined, { sortBy: 'newest' })
            }}>
              Sort: {sortBy === 'oldest' ? 'Oldest First' : sortBy === 'price-asc' ? 'Price Low-High' : 'Price High-Low'}
            </Chip>
          )}
        </div>
      )}
    </div>
  )
}
