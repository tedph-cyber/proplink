'use client'

import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  NIGERIAN_STATES,
  STATE_LGA_MAPPING_SIMPLIFIED,
  HOUSE_TYPES,
  BEDROOM_CATEGORIES,
  LAND_SIZE_UNITS,
} from '@/lib/constants'

export function HomepageSearch() {
  const router = useRouter()

  // Tier 1 (always visible)
  const [propertyType, setPropertyType] = useState('')
  const [state, setState] = useState('')

  // Tier 2 (expandable)
  const [showMore, setShowMore] = useState(false)
  const [lga, setLga] = useState('')
  const [city, setCity] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [houseTypes, setHouseTypes] = useState<string[]>([])
  const [bedroomCategory, setBedroomCategory] = useState('')
  const [landSizeUnit, setLandSizeUnit] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const availableLGAs = useMemo(
    () => (state ? STATE_LGA_MAPPING_SIMPLIFIED[state] || [] : []),
    [state]
  )

  const tier2ActiveCount = [lga, city, minPrice, maxPrice, bedroomCategory, landSizeUnit, sortBy !== 'newest' && sortBy]
    .filter(Boolean).length + houseTypes.length

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    const params = new URLSearchParams()
    if (propertyType) params.set('type', propertyType)
    if (state) params.set('state', state)
    if (lga) params.set('lga', lga)
    if (city) params.set('city', city)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (houseTypes.length > 0) params.set('houseTypes', houseTypes.join(','))
    if (bedroomCategory) params.set('bedroom', bedroomCategory)
    if (landSizeUnit) params.set('landUnit', landSizeUnit)
    if (sortBy && sortBy !== 'newest') params.set('sort', sortBy)
    router.push(`/properties?${params.toString()}`)
  }

  const handleClearTier2 = () => {
    setLga('')
    setCity('')
    setMinPrice('')
    setMaxPrice('')
    setHouseTypes([])
    setBedroomCategory('')
    setLandSizeUnit('')
    setSortBy('newest')
  }

  const selectClass =
    'w-full rounded-lg border border-[var(--border)] bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-[var(--foreground)] focus:border-[#0568fd] focus:outline-none focus:ring-1 focus:ring-[#0568fd] transition-all'

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl">
      <div className="backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
        {/* Tier 1 — always visible */}
        <div className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
                Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => {
                  setPropertyType(e.target.value)
                  if (e.target.value !== 'house') { setHouseTypes([]); setBedroomCategory('') }
                  if (e.target.value !== 'land') setLandSizeUnit('')
                }}
                className={selectClass}
              >
                <option value="">All Types</option>
                <option value="house">House</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
                State
              </label>
              <select
                value={state}
                onChange={(e) => { setState(e.target.value); setLga('') }}
                className={selectClass}
              >
                <option value="">All States</option>
                {NIGERIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2 sm:gap-2">
              <Button type="submit" className="flex items-center gap-2 px-5 h-[38px] rounded-lg bg-gradient-to-r from-[#0568fd] to-[#5247c8] hover:opacity-90 transition-opacity text-white border-0">
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </Button>
              <button
                type="button"
                onClick={() => setShowMore(!showMore)}
                className="flex items-center gap-1.5 h-[38px] px-3 rounded-lg border border-[var(--border)] bg-white/70 dark:bg-white/5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors whitespace-nowrap"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden xs:inline">Filters</span>
                {tier2ActiveCount > 0 && (
                  <span className="flex items-center justify-center h-4 w-4 rounded-full bg-[#0568fd] text-[10px] font-bold text-white">
                    {tier2ActiveCount}
                  </span>
                )}
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Tier 2 — expandable */}
        <AnimatePresence>
          {showMore && (
            <motion.div
              key="expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="border-t border-[var(--border)] p-4 sm:p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* LGA */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
                      Local Government
                    </label>
                    {state && availableLGAs.length > 0 ? (
                      <select
                        value={lga}
                        onChange={(e) => setLga(e.target.value)}
                        className={selectClass}
                      >
                        <option value="">All LGAs</option>
                        {availableLGAs.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        type="text"
                        placeholder={state ? 'Type LGA...' : 'Select state first'}
                        value={lga}
                        onChange={(e) => setLga(e.target.value)}
                        disabled={!state}
                        className="h-[38px]"
                      />
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
                      City / Area
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Lekki"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="h-[38px]"
                    />
                  </div>

                  {/* Min Price */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
                      Min Price (₦)
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="h-[38px]"
                    />
                  </div>

                  {/* Max Price */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
                      Max Price (₦)
                    </label>
                    <Input
                      type="number"
                      placeholder="No limit"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="h-[38px]"
                    />
                  </div>

                  {/* Bedrooms — house only */}
                  {propertyType === 'house' && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
                        Bedrooms
                      </label>
                      <select
                        value={bedroomCategory}
                        onChange={(e) => setBedroomCategory(e.target.value)}
                        className={selectClass}
                      >
                        <option value="">Any</option>
                        {BEDROOM_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Land size unit — land only */}
                  {propertyType === 'land' && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
                        Land Size Unit
                      </label>
                      <select
                        value={landSizeUnit}
                        onChange={(e) => setLandSizeUnit(e.target.value)}
                        className={selectClass}
                      >
                        <option value="">Any Unit</option>
                        {LAND_SIZE_UNITS.map((unit) => (
                          <option key={unit.value} value={unit.value}>{unit.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Sort */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1.5">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={selectClass}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* House Types — house only */}
                {propertyType === 'house' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                      House Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {HOUSE_TYPES.map((type) => {
                        const active = houseTypes.includes(type.value)
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() =>
                              setHouseTypes(active
                                ? houseTypes.filter((t) => t !== type.value)
                                : [...houseTypes, type.value]
                              )
                            }
                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                              active
                                ? 'bg-[#0568fd] text-white border-[#0568fd]'
                                : 'bg-white dark:bg-zinc-800 text-[var(--foreground)] border-[var(--border)] hover:border-[#0568fd]'
                            }`}
                          >
                            {type.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Footer actions */}
                <div className="flex items-center justify-between pt-1">
                  {tier2ActiveCount > 0 ? (
                    <button
                      type="button"
                      onClick={handleClearTier2}
                      className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-colors"
                    >
                      <X className="w-3 h-3" />
                      Clear filters
                    </button>
                  ) : (
                    <span />
                  )}
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-[#0568fd] to-[#5247c8] text-white border-0 hover:opacity-90"
                  >
                    Apply & Search
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  )
}
