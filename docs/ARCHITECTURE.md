# StrongTower Holdings Architecture Overview

## 📂 Complete Folder Structure

```
StrongTower Holdings/
│
├── 📱 app/                          # Next.js App Router
│   ├── (public)/                    # Public routes (no auth required)
│   │   ├── properties/
│   │   │   ├── page.tsx            # → /properties (listing)
│   │   │   └── [id]/
│   │   │       └── page.tsx        # → /properties/[id] (detail)
│   │   └── layout.tsx              # Layout for public routes
│   │
│   ├── (auth)/                      # Auth routes
│   │   ├── login/
│   │   │   └── page.tsx            # → /login
│   │   ├── register/
│   │   │   └── page.tsx            # → /register
│   │   └── layout.tsx              # Centered layout for auth
│   │
│   ├── dashboard/                   # Seller dashboard
│   │   └── page.tsx                # → /dashboard
│   │
│   ├── admin/                       # Admin panel
│   │   └── page.tsx                # → /admin
│   │
│   ├── layout.tsx                   # Root layout (Header + Footer)
│   ├── page.tsx                     # → / (homepage)
│   └── globals.css                  # Global styles
│
├── 🎨 components/                   # React components
│   ├── layout/                      # Layout components
│   │   ├── header.tsx              # Navigation header
│   │   └── footer.tsx              # Site footer
│   │
│   ├── ui/                          # Reusable UI components
│   │   ├── button.tsx              # Button component
│   │   └── input.tsx               # Input component
│   │
│   └── properties/                  # Property-specific (Phase 1+)
│       ├── property-card.tsx
│       ├── property-grid.tsx
│       ├── image-gallery.tsx
│       └── contact-button.tsx
│
├── 📚 lib/                          # Utility functions
│   ├── supabase/                    # Supabase clients
│   │   ├── client.ts               # Client-side
│   │   ├── server.ts               # Server-side
│   │   └── proxy.ts           # Session management
│   │
│   ├── types.ts                     # TypeScript definitions
│   └── utils.ts                     # Helper functions
│
├── 📝 docs/                         # Documentation
│   ├── SUPABASE_SETUP.md
│   └── PHASE_1_GUIDE.md
│
├── 🌐 public/                       # Static assets
│
├── ⚙️ Configuration Files
│   ├── .env.local                   # Environment variables (local)
│   ├── .env.example                 # Environment template
│   ├── proxy.ts                # Next.js proxy
│   ├── next.config.ts               # Next.js config
│   ├── tailwind.config.ts           # Tailwind config
│   ├── tsconfig.json                # TypeScript config
│   ├── package.json                 # Dependencies
│   └── README.md                    # Project documentation
│
└── 🔒 .gitignore                    # Git ignore rules
```

---

## 🔄 Data Flow

### Public Pages (Phase 1)
```
User visits /properties
    ↓
Server Component fetches data
    ↓
Supabase (Server Client)
    ↓
Database Query (RLS applied)
    ↓
Data returned to component
    ↓
HTML rendered on server
    ↓
Sent to browser
```

### Authenticated Actions (Phase 2+)
```
User submits form
    ↓
Server Action
    ↓
proxy validates session
    ↓
Supabase (Server Client)
    ↓
Database Mutation (RLS applied)
    ↓
Response to client
    ↓
Revalidate/redirect
```

---

## 🗄️ Database Schema

```
┌─────────────────┐
│   auth.users    │ (Supabase Auth)
└────────┬────────┘
         │
         │ 1:1
         ↓
┌─────────────────┐
│    profiles     │
├─────────────────┤
│ id (FK)         │
│ role            │
│ seller_type     │
│ company_name    │
│ whatsapp_number │
└────────┬────────┘
         │
         │ 1:N
         ↓
┌─────────────────┐
│   properties    │
├─────────────────┤
│ id              │
│ seller_id (FK)  │
│ title           │
│ description     │
│ property_type   │
│ price_min       │
│ price_max       │
│ location...     │
│ features        │
└────────┬────────┘
         │
         │ 1:N
         ↓
┌─────────────────┐
│ property_media  │
├─────────────────┤
│ id              │
│ property_id (FK)│
│ media_type      │
│ url             │
│ display_order   │
└─────────────────┘
```

---

## 🔐 Security Model

### Row Level Security (RLS)

**profiles:**
- ✅ SELECT: Everyone (public data)
- ✅ INSERT: Authenticated users (own profile)
- ✅ UPDATE: Owner only

**properties:**
- ✅ SELECT: Everyone (public listings)
- ✅ INSERT: Sellers (authenticated)
- ✅ UPDATE/DELETE: Owner or Admin

**property_media:**
- ✅ SELECT: Everyone
- ✅ INSERT/DELETE: Property owner or Admin

---

## 🎨 Component Hierarchy

```
RootLayout
├── Header
│   ├── Logo
│   └── Navigation
│
├── Main Content (varies by route)
│   │
│   ├── Homepage
│   │   ├── Hero Section
│   │   ├── Features Grid
│   │   └── CTA Section
│   │
│   ├── Properties Page
│   │   └── PropertyGrid
│   │       └── PropertyCard × N
│   │
│   ├── Property Detail
│   │   ├── ImageGallery
│   │   ├── PropertyDetails
│   │   └── ContactButton
│   │
│   ├── Auth Pages
│   │   ├── LoginForm
│   │   └── RegisterForm
│   │
│   ├── Dashboard
│   │   ├── PropertyList (seller's)
│   │   └── UploadForm
│   │
│   └── Admin
│       ├── UserManagement
│       └── PropertyModeration
│
└── Footer
    ├── Links
    └── Copyright
```

---

## 🚀 Request Flow Examples

### Example 1: Viewing a Property

```
GET /properties/123
    ↓
proxy.ts (refreshes session)
    ↓
app/(public)/properties/[id]/page.tsx
    ↓
createClient() from server.ts
    ↓
supabase.from('properties').select()
    ↓
RLS policy: "Properties are viewable by everyone"
    ↓
Data returned
    ↓
Server renders HTML
    ↓
Browser receives complete page
```

### Example 2: Creating a Property (Phase 3)

```
POST /api/properties (Server Action)
    ↓
proxy.ts (validates auth)
    ↓
Server Action function
    ↓
createClient() from server.ts
    ↓
supabase.from('properties').insert()
    ↓
RLS policy: "Sellers can insert their own properties"
    ↓
Check: auth.uid() === seller_id
    ↓
Insert successful
    ↓
revalidatePath('/dashboard')
    ↓
Redirect to dashboard
```

---

## 📦 Key Dependencies

| Package | Purpose | Used In |
|---------|---------|---------|
| `next` | Framework | All pages |
| `react` | UI library | All components |
| `@supabase/supabase-js` | DB client | Data fetching |
| `@supabase/ssr` | SSR support | Server components |
| `tailwindcss` | Styling | All UI |
| `typescript` | Type safety | All code |

---

## 🔄 Development Workflow

```
1. Make changes to code
    ↓
2. Next.js auto-reloads (HMR)
    ↓
3. Test in browser
    ↓
4. Check console for errors
    ↓
5. Commit when feature complete
    ↓
6. Push to GitHub
    ↓
7. Vercel auto-deploys
```

---

## 🎯 Phase Progression

```
Phase 0 (Current) ✅
    ↓
Phase 1: Public Marketplace
    ↓
Phase 2: Auth & Profiles
    ↓
Phase 3: Property Upload
    ↓
Phase 4: Admin Panel
    ↓
Phase 5: Search & Filters
    ↓
🎉 Full Production App
```

---

## 🌐 URL Structure

| URL | Component | Access |
|-----|-----------|--------|
| `/` | Homepage | Public |
| `/properties` | Listing page | Public |
| `/properties/[id]` | Property detail | Public |
| `/login` | Login form | Public |
| `/register` | Register form | Public |
| `/dashboard` | Seller dashboard | Sellers only |
| `/dashboard/properties/new` | Upload form | Sellers only |
| `/admin` | Admin panel | Admins only |

---

## 💡 Key Design Decisions

### Why Server Components?
- Better SEO
- Faster initial load
- Direct database access
- Reduced JavaScript bundle

### Why Supabase?
- Built-in authentication
- Row Level Security
- Real-time capabilities (future)
- Easy file storage
- PostgreSQL power

### Why Route Groups?
- Organize files logically
- Different layouts per section
- No URL impact
- Better code organization

### Why TypeScript?
- Catch errors early
- Better IDE support
- Self-documenting code
- Safer refactoring

---

**This architecture supports:**
- ✅ Horizontal scaling
- ✅ SEO optimization
- ✅ Fast performance
- ✅ Easy maintenance
- ✅ Secure by default
