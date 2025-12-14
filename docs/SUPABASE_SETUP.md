# Supabase Setup Guide for PropLink

This guide walks you through setting up Supabase for PropLink Phase 1 and beyond.

---

## Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Choose your organization
4. Configure:
   - **Project Name:** proplink (or your choice)
   - **Database Password:** Generate a strong password (save it!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier is fine for development

5. Wait for project creation (~2 minutes)

---

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Project Settings** (gear icon)
2. Click **API** in the left sidebar
3. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under Project API keys)

4. Update your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Step 3: Create Database Tables (Phase 1+)

Open the **SQL Editor** in Supabase and run this script:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('seller', 'admin')) DEFAULT 'seller',
  seller_type TEXT CHECK (seller_type IN ('individual', 'company')),
  company_name TEXT,
  whatsapp_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Properties Table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('house', 'land')),
  price_min NUMERIC NOT NULL CHECK (price_min >= 0),
  price_max NUMERIC CHECK (price_max >= price_min),
  country TEXT NOT NULL,
  state TEXT NOT NULL,
  lga TEXT NOT NULL,
  city TEXT NOT NULL,
  features JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Property Media Table
CREATE TABLE property_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_seller ON properties(seller_id);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_location ON properties(country, state, city);
CREATE INDEX idx_properties_created ON properties(created_at DESC);
CREATE INDEX idx_property_media_property ON property_media(property_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to properties table
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## Step 4: Set Up Row Level Security (RLS)

Run this SQL to enable security policies:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_media ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Properties policies
CREATE POLICY "Properties are viewable by everyone"
  ON properties FOR SELECT
  USING (true);

CREATE POLICY "Sellers can insert their own properties"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own properties"
  ON properties FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own properties"
  ON properties FOR DELETE
  USING (auth.uid() = seller_id);

CREATE POLICY "Admins can do everything with properties"
  ON properties FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Property Media policies
CREATE POLICY "Property media is viewable by everyone"
  ON property_media FOR SELECT
  USING (true);

CREATE POLICY "Sellers can insert media for their properties"
  ON property_media FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_media.property_id
      AND properties.seller_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can delete media for their properties"
  ON property_media FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_media.property_id
      AND properties.seller_id = auth.uid()
    )
  );

CREATE POLICY "Admins can do everything with media"
  ON property_media FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

---

## Step 5: Set Up Storage (Phase 3)

1. Go to **Storage** in Supabase dashboard
2. Click "Create new bucket"
3. Create bucket named `property-images`
   - **Public bucket:** Yes (images need to be publicly accessible)
4. Create bucket named `property-videos`
   - **Public bucket:** Yes

### Storage Policies

Run this SQL for storage policies:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images' OR bucket_id = 'property-videos');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('property-images', 'property-videos')
  AND auth.role() = 'authenticated'
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id IN ('property-images', 'property-videos')
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## Step 6: Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (enabled by default)
3. Optional: Configure email templates under **Email Templates**

### Email Templates (Optional)
- Customize confirmation email
- Customize password reset email
- Add your branding

---

## Step 7: Create First Admin User (Optional)

After creating your account through the app, run this SQL to make yourself admin:

```sql
-- Replace 'your-user-id' with your actual user ID
UPDATE profiles
SET role = 'admin'
WHERE id = 'your-user-id';
```

To find your user ID:
1. Go to **Authentication** → **Users**
2. Copy your user ID

---

## Testing Your Setup

### Test Database Connection

Create a test page to verify the connection:

```typescript
// app/test/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function TestPage() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('properties')
    .select('count')
    .single()
  
  return (
    <div className="p-8">
      <h1>Supabase Connection Test</h1>
      {error ? (
        <p className="text-red-500">Error: {error.message}</p>
      ) : (
        <p className="text-green-500">✅ Connected! Properties count: {data?.count || 0}</p>
      )}
    </div>
  )
}
```

Visit `/test` to verify the connection.

---

## Common Issues

### Issue: "relation does not exist"
- **Solution:** Run the table creation SQL again

### Issue: "new row violates row-level security policy"
- **Solution:** Check RLS policies are created correctly

### Issue: "Invalid API key"
- **Solution:** Verify `.env.local` has correct values

### Issue: "CORS error"
- **Solution:** Check that `NEXT_PUBLIC_` prefix is used for env vars

---

## Production Checklist

Before deploying to production:

- [ ] Database tables created
- [ ] RLS policies enabled
- [ ] Storage buckets created
- [ ] Email templates customized
- [ ] Environment variables set in Vercel
- [ ] Test authentication flow
- [ ] Test property upload
- [ ] Verify admin access

---

## Useful Supabase Features

### Database Backups
- Go to **Database** → **Backups**
- Free tier: Daily backups for 7 days

### API Documentation
- **Settings** → **API** → **API Docs**
- Auto-generated docs for your schema

### Logs
- **Logs** section shows queries, errors, and function logs

---

## Next Steps

1. Complete database setup (tables + RLS)
2. Test connection with test page
3. Start implementing Phase 1 features
4. Add sample property data for testing

---

**Need Help?**
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com/)
- [Supabase GitHub](https://github.com/supabase/supabase)
