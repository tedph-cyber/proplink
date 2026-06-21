'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { MapPin, SlidersHorizontal, Check } from 'lucide-react'
import { NIGERIAN_STATES } from '@/lib/constants'
import styles from '@/styles/properties.module.css'

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'new-builds', label: 'New Builds' },
  { value: 'houses-rent', label: 'Houses & Apartments For Rent' },
  { value: 'houses-sale', label: 'Houses & Apartments For Sale' },
  { value: 'short-let', label: 'Short Let' },
  { value: 'land-rent', label: 'Land & Plots for Rent' },
  { value: 'land-sale', label: 'Land & Plots For Sale' },
  { value: 'event-centres', label: 'Event Centres, Venues & Workstations' },
  { value: 'commercial-rent', label: 'Commercial Property For Rent' },
  { value: 'commercial-sale', label: 'Commercial Property For Sale' },
] as const

const CATEGORY_TO_TYPE: Record<string, string | undefined> = {
  'new-builds': 'house',
  'houses-rent': 'house',
  'houses-sale': 'house',
  'short-let': 'house',
  'land-rent': 'land',
  'land-sale': 'land',
  'event-centres': 'house',
  'commercial-rent': 'house',
  'commercial-sale': 'house',
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
] as const

interface PropertiesToolbarProps {
  currentType?: string
  currentState?: string
  currentSort: string
  verifiedOnly?: boolean
}

export function PropertiesToolbar({ currentType, currentState, currentSort, verifiedOnly = false }: PropertiesToolbarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const buildHref = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([k, v]) => {
        if (!v || v === 'all') {
          params.delete(k)
        } else {
          params.set(k, v)
        }
      })
      const qs = params.toString()
      return `/properties${qs ? `?${qs}` : ''}`
    },
    [searchParams]
  )

  const handleCategory = (val: string) => {
    const type = val === 'all' ? undefined : CATEGORY_TO_TYPE[val]
    router.push(buildHref({ type, cat: val === 'all' ? undefined : val }))
  }

  const handleState = (val: string) => {
    router.push(buildHref({ state: val || undefined }))
  }

  const handleVerified = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.has('verified')) {
      params.delete('verified')
    } else {
      params.set('verified', 'true')
    }
    const qs = params.toString()
    router.push(`/properties${qs ? `?${qs}` : ''}`)
  }

  const handleSort = (val: string) => {
    router.push(buildHref({ sort: val === 'newest' ? undefined : val }))
  }

  const activeCat = searchParams.get('cat') || 'all'

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarInner}>
        <div className={styles.searchRow}>
          <div className={styles.stateSel}>
            <MapPin size={17} />
            <select
              value={currentState || ''}
              onChange={(e) => handleState(e.target.value)}
            >
              <option value="">All states · Nigeria</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button
            className={`${styles.filterBtn} ${searchParams.has('verified') ? styles.on : ''}`}
            onClick={handleVerified}
          >
            <Check size={17} />
            <span>Verified only</span>
          </button>

          <div className={styles.sort}>
            <SlidersHorizontal size={16} />
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Sort</span>
            <select value={currentSort} onChange={(e) => handleSort(e.target.value)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.cats}>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              className={`${styles.catChip} ${activeCat === c.value ? styles.active : ''}`}
              onClick={() => handleCategory(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
