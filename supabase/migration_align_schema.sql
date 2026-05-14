-- =====================================================
-- Migration: Align Schema with Code
-- 
-- Applies changes so the database matches what the
-- TypeScript codebase expects.
--
-- Run this in Supabase SQL Editor AFTER the base schema.
-- =====================================================

-- =====================================================
-- 1. Document & clean up the `properties` table
-- =====================================================

-- The codebase expects ALL feature data inside the
-- `features` JSONB column with this structure:
--
--   features: {
--     "house_types":        ["duplex", "bungalow", …],   -- HouseType[]
--     "bedroom_category":   "3" | "4" | "5_plus",        -- BedroomCategory
--     "land_size_unit":     "sqm" | "acres" | "plots",   -- LandSizeUnit
--     "bedrooms":           4,                            -- number (legacy)
--     "bathrooms":          3,                            -- number (legacy)
--     "land_size":          600,                          -- number (legacy)
--     "additional_features": ["Pool", "Garden", …]       -- string[]
--   }

-- Deprecated standalone columns: bedrooms, bathrooms, land_size_sqm
-- (kept for backward compatibility; the code reads from features JSONB,
--  but these columns may still hold legacy data)
--
-- To drop them once legacy data is migrated:
--   ALTER TABLE properties DROP COLUMN IF EXISTS bedrooms;
--   ALTER TABLE properties DROP COLUMN IF EXISTS bathrooms;
--   ALTER TABLE properties DROP COLUMN IF EXISTS land_size_sqm;

-- Add GIN index on features JSONB for efficient contains/overlaps queries
CREATE INDEX IF NOT EXISTS idx_properties_features ON properties USING GIN (features);

-- =====================================================
-- 2. BLOG_POSTS TABLE (missing from base schema)
-- =====================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'market-insights', 'buyers-guide', 'sellers-tips',
    'investment', 'legal-finance', 'neighborhood'
  )),
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- Blog posts updated_at trigger
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Everyone can read published posts
CREATE POLICY "Published posts are viewable by everyone"
  ON blog_posts FOR SELECT
  USING (status = 'published' OR author_id = auth.uid());

-- Authors can insert their own posts
CREATE POLICY "Authors can insert posts"
  ON blog_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Authors can update their own posts
CREATE POLICY "Authors can update their own posts"
  ON blog_posts FOR UPDATE
  USING (auth.uid() = author_id);

-- Authors can delete their own posts
CREATE POLICY "Authors can delete their own posts"
  ON blog_posts FOR DELETE
  USING (auth.uid() = author_id);

-- Admins can do everything
CREATE POLICY "Admins can do everything with blog posts"
  ON blog_posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- 3. UPDATE TRIGGER to set proper JSONB defaults
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, whatsapp_number, seller_type, company_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'seller'),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp_number', ''),
    COALESCE(NEW.raw_user_meta_data->>'seller_type', 'individual'),
    NEW.raw_user_meta_data->>'company_name'
  )
  ON CONFLICT (id) DO UPDATE SET
    seller_type     = COALESCE(EXCLUDED.seller_type, profiles.seller_type),
    company_name    = COALESCE(EXCLUDED.company_name, profiles.company_name),
    whatsapp_number = CASE
      WHEN EXCLUDED.whatsapp_number = '' THEN profiles.whatsapp_number
      ELSE EXCLUDED.whatsapp_number
    END;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. SAMPLE DATA (features JSONB structure demo)
-- =====================================================

-- Sample house property with rich features
-- INSERT INTO properties (seller_id, title, description, property_type, price_min, price_max, state, lga, city, features)
-- VALUES (
--   '<UUID>',
--   '4 Bedroom Duplex in Lekki',
--   'Beautiful modern duplex with pool, parking, and 24/7 security in the heart of Lekki Phase 1.',
--   'house',
--   75000000,
--   85000000,
--   'Lagos',
--   'Eti-Osa',
--   'Lekki Phase 1',
--   '{
--     "house_types": ["duplex"],
--     "bedroom_category": "4",
--     "bedrooms": 4,
--     "bathrooms": 3,
--     "additional_features": ["Swimming Pool", "Parking Space", "24/7 Security"]
--   }'::jsonb
-- );

-- Sample land property with land-specific features
-- INSERT INTO properties (seller_id, title, description, property_type, price_min, state, lga, city, features)
-- VALUES (
--   '<UUID>',
--   '2 Plots of Land in Ajah',
--   'Prime development land in fast-growing Ajah area. Fenced, documented, and ready for construction.',
--   'land',
--   25000000,
--   'Lagos',
--   'Eti-Osa',
--   'Ajah',
--   '{
--     "land_size": 600,
--     "land_size_unit": "sqm",
--     "additional_features": ["Fenced", "Documented", "Dry Land"]
--   }'::jsonb
-- );

-- =====================================================
-- 5. VERIFICATION
-- =====================================================

-- Check properties table structure
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'properties'
ORDER BY ordinal_position;
