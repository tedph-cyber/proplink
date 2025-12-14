# Phase 1 Implementation Guide

**Goal:** Build the public marketplace where users can browse properties without authentication.

---

## Overview

Phase 1 creates the core browsing experience:
- Homepage with featured/recent properties
- Property listing page with grid layout
- Individual property detail pages
- WhatsApp contact integration

---

## Prerequisites

✅ Phase 0 completed
✅ Supabase project created
✅ Database tables created (see `SUPABASE_SETUP.md`)
✅ `.env.local` configured

---

## Tasks Breakdown

### 1. Property Listing Page (`/properties`)

**File:** `app/(public)/properties/page.tsx`

**Features:**
- Fetch all properties from Supabase
- Display in responsive grid (3 columns on desktop, 1 on mobile)
- Show property cards with:
  - Cover image (first image from media)
  - Title
  - Price or price range
  - Location (City, State)
  - Property type badge

**Components to Create:**
- `components/properties/property-card.tsx`
- `components/properties/property-grid.tsx`

**Sample Query:**
```typescript
const { data: properties } = await supabase
  .from('properties')
  .select(`
    *,
    property_media (*)
  `)
  .order('created_at', { ascending: false })
```

---

### 2. Property Detail Page (`/properties/[id]`)

**File:** `app/(public)/properties/[id]/page.tsx`

**Features:**
- Fetch single property with all media and seller info
- Image gallery (with navigation)
- Video embed if available
- Full property details
- Features list
- Location information
- WhatsApp contact button
- Breadcrumb navigation

**Components to Create:**
- `components/properties/image-gallery.tsx`
- `components/properties/property-details.tsx`
- `components/properties/contact-button.tsx`

**Sample Query:**
```typescript
const { data: property } = await supabase
  .from('properties')
  .select(`
    *,
    property_media (*),
    profiles (*)
  `)
  .eq('id', id)
  .single()
```

---

### 3. Homepage Updates

**File:** `app/page.tsx`

**Add:**
- "Featured Properties" section (latest 6 properties)
- Property stats (total listings)
- Reuse `PropertyCard` component

---

### 4. Components to Build

#### PropertyCard
```typescript
interface PropertyCardProps {
  property: Property & {
    property_media?: PropertyMedia[]
  }
}
```

- Clickable card linking to detail page
- Responsive image with Next.js Image
- Price formatting with formatPriceRange()
- Location display
- Property type badge

#### ImageGallery
- Main large image display
- Thumbnail navigation
- Keyboard navigation (arrow keys)
- Mobile swipe support (optional)

#### ContactButton
- WhatsApp icon + text
- Opens WhatsApp with pre-filled message
- Use `generateWhatsAppLink()` from utils

---

### 5. Data Fetching Strategy

**Use Server Components (default):**
- Better SEO
- No loading states needed
- Faster initial page load

**Example:**
```typescript
export default async function PropertiesPage() {
  const supabase = await createClient()
  const { data: properties } = await supabase
    .from('properties')
    .select('*, property_media(*)')
    .order('created_at', { ascending: false })

  return <PropertyGrid properties={properties || []} />
}
```

---

### 6. Image Handling

**For Property Images:**
- Images stored in Supabase Storage
- URLs returned from database
- Use Next.js `<Image>` component
- Add placeholder/blur for loading

**Next.js Config:**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}
```

---

### 7. Metadata & SEO

Add dynamic metadata for property pages:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await fetchProperty(params.id)
  
  return {
    title: `${property.title} | PropLink`,
    description: truncateText(property.description, 160),
    openGraph: {
      images: [property.property_media[0]?.url],
    },
  }
}
```

---

### 8. Error Handling

**Handle:**
- Property not found (404)
- Database errors
- No properties available (empty state)

**Example:**
```typescript
if (!property) {
  notFound() // Next.js 404 page
}

if (error) {
  return <ErrorMessage message="Failed to load properties" />
}
```

---

### 9. Loading States

**For Server Components:**
- Create `loading.tsx` files
- Show skeleton UI while data loads

**Example:** `app/(public)/properties/loading.tsx`
```typescript
export default function Loading() {
  return <PropertyGridSkeleton />
}
```

---

### 10. Styling Guidelines

**Card Design:**
- Border radius: `rounded-lg`
- Shadow: `shadow-md hover:shadow-lg`
- Transition: `transition-shadow duration-300`

**Image Aspect Ratio:**
- Cards: `aspect-[4/3]`
- Detail page main: `aspect-[16/9]`
- Thumbnails: `aspect-square`

**Responsive Breakpoints:**
- Mobile: 1 column
- Tablet (md): 2 columns
- Desktop (lg): 3 columns

---

## Testing Checklist

Before considering Phase 1 complete:

- [ ] Properties page loads without errors
- [ ] Property cards display correctly
- [ ] Images load and display properly
- [ ] Property detail page shows all information
- [ ] WhatsApp button generates correct link
- [ ] Mobile responsive (test on small screen)
- [ ] No console errors
- [ ] SEO metadata is correct
- [ ] Empty state displays when no properties
- [ ] 404 page for invalid property IDs

---

## Sample Data for Testing

Run this SQL to add test properties:

```sql
-- Insert test profile
INSERT INTO profiles (id, role, seller_type, whatsapp_number)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'seller', 'individual', '2348012345678');

-- Insert test properties
INSERT INTO properties (
  seller_id, title, description, property_type,
  price_min, price_max, country, state, lga, city, features
) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    '4 Bedroom Duplex in Lekki',
    'Beautiful 4 bedroom duplex with modern finishes...',
    'house',
    75000000,
    NULL,
    'Nigeria',
    'Lagos',
    'Lekki',
    'Lekki Phase 1',
    '{"bedrooms": 4, "bathrooms": 3, "additional_features": ["Swimming Pool", "Parking Space", "Generator"]}'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    '2 Plots of Land in Ajah',
    'Prime land for sale in a fast-developing area...',
    'land',
    25000000,
    30000000,
    'Nigeria',
    'Lagos',
    'Eti-Osa',
    'Ajah',
    '{"land_size": 600, "land_size_unit": "sqm", "additional_features": ["Fenced", "Documented"]}'::jsonb
  );
```

---

## File Checklist

Create these files for Phase 1:

- [ ] `app/(public)/properties/page.tsx`
- [ ] `app/(public)/properties/[id]/page.tsx`
- [ ] `app/(public)/properties/loading.tsx`
- [ ] `app/(public)/properties/[id]/loading.tsx`
- [ ] `components/properties/property-card.tsx`
- [ ] `components/properties/property-grid.tsx`
- [ ] `components/properties/image-gallery.tsx`
- [ ] `components/properties/property-details.tsx`
- [ ] `components/properties/contact-button.tsx`
- [ ] `components/ui/badge.tsx`
- [ ] `components/ui/skeleton.tsx`

---

## Next Steps After Phase 1

Once Phase 1 is complete and tested:
- Move to **Phase 2: Authentication & Seller Accounts**
- Implement login/register
- Create seller dashboard
- Enable profile management

---

**Ready to start Phase 1?** Follow this guide step by step and test each component as you build!
