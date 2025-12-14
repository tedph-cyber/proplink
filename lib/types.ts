/**
 * Core TypeScript types for PropLink
 * Phase 0 - Foundation types
 */

// ==================== Auth & User Types ====================

export type UserRole = 'seller' | 'admin'
export type SellerType = 'individual' | 'agent' | 'developer'

export interface Profile {
  id: string
  role: UserRole
  seller_type?: SellerType
  company_name?: string | null
  whatsapp_number: string
  created_at: string
}

// ==================== Property Types ====================

export type PropertyType = 'house' | 'land'

export interface PropertyFeatures {
  bedrooms?: number
  bathrooms?: number
  land_size?: number
  land_size_unit?: 'sqm' | 'sqft' | 'acres' | 'hectares'
  additional_features?: string[]
}

export interface Property {
  id: string
  seller_id: string
  title: string
  description: string
  property_type: PropertyType
  price_min: number
  price_max?: number | null
  country: string
  state: string
  lga: string | null
  city: string | null
  features: PropertyFeatures
  status: 'active' | 'sold' | 'inactive'
  created_at: string
  updated_at?: string
  
  // Relations (populated on fetch)
  seller?: Profile
  media?: PropertyMedia[]
}

export interface PropertyMedia {
  id: string
  property_id: string
  media_type: 'image' | 'video'
  media_url: string
  display_order?: number
  created_at: string
}

// ==================== Location Types ====================

export interface LocationHierarchy {
  country: string
  state: string
  lga: string
  city: string
}

// ==================== Filter & Search Types ====================

export interface PropertyFilters {
  property_type?: PropertyType
  price_min?: number
  price_max?: number
  country?: string
  state?: string
  lga?: string
  city?: string
  sort_by?: 'newest' | 'price_low' | 'price_high'
}

// ==================== Database Types (Supabase) ====================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      properties: {
        Row: Property
        Insert: Omit<Property, 'id' | 'created_at'>
        Update: Partial<Omit<Property, 'id' | 'created_at'>>
      }
      property_media: {
        Row: PropertyMedia
        Insert: Omit<PropertyMedia, 'id' | 'created_at'>
        Update: Partial<Omit<PropertyMedia, 'id' | 'created_at'>>
      }
    }
  }
}
