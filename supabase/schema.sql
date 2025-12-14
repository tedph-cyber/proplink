-- PropLink Database Schema
-- Run this in Supabase SQL Editor to set up all tables and policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('seller', 'admin')) DEFAULT 'seller',
  seller_type TEXT CHECK (seller_type IN ('individual', 'agent', 'developer')),
  company_name TEXT,
  whatsapp_number TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PROPERTIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('house', 'land')),
  price_min NUMERIC NOT NULL CHECK (price_min >= 0),
  price_max NUMERIC CHECK (price_max IS NULL OR price_max >= price_min),
  country TEXT NOT NULL DEFAULT 'Nigeria',
  state TEXT NOT NULL,
  lga TEXT,
  city TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'sold', 'inactive')) DEFAULT 'active',
  bedrooms INTEGER,
  bathrooms INTEGER,
  land_size_sqm NUMERIC,
  features JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PROPERTY MEDIA TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS property_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_properties_seller ON properties(seller_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(country, state, city);
CREATE INDEX IF NOT EXISTS idx_properties_created ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price_min, price_max);
CREATE INDEX IF NOT EXISTS idx_property_media_property ON property_media(property_id, display_order);

-- =====================================================
-- TRIGGER FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGER FOR AUTOMATIC PROFILE CREATION
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, whatsapp_number)
  VALUES (
    NEW.id,
    'seller',
    COALESCE(NEW.raw_user_meta_data->>'whatsapp_number', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_media ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Properties Policies
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

-- Property Media Policies
CREATE POLICY "Property media is viewable by everyone"
  ON property_media FOR SELECT
  USING (true);

CREATE POLICY "Property owners can insert media"
  ON property_media FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_media.property_id
      AND properties.seller_id = auth.uid()
    )
  );

CREATE POLICY "Property owners can delete media"
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

-- =====================================================
-- SAMPLE DATA FOR TESTING (Optional - Comment out for production)
-- =====================================================

-- Create a test seller profile
-- Note: You'll need to replace this UUID with an actual auth user ID
-- INSERT INTO profiles (id, role, seller_type, whatsapp_number)
-- VALUES ('00000000-0000-0000-0000-000000000001', 'seller', 'individual', '2348012345678');

-- Sample properties
-- INSERT INTO properties (seller_id, title, description, property_type, price_min, country, state, lga, city, features)
-- VALUES 
--   ('00000000-0000-0000-0000-000000000001', '4 Bedroom Duplex in Lekki', 'Beautiful modern duplex with swimming pool and parking space', 'house', 75000000, 'Nigeria', 'Lagos', 'Eti-Osa', 'Lekki Phase 1', '{"bedrooms": 4, "bathrooms": 3, "additional_features": ["Swimming Pool", "Parking Space", "24/7 Security"]}'::jsonb),
--   ('00000000-0000-0000-0000-000000000001', '2 Plots of Land in Ajah', 'Prime land for sale in fast-developing area', 'land', 25000000, 'Nigeria', 'Lagos', 'Eti-Osa', 'Ajah', '{"land_size": 600, "land_size_unit": "sqm", "additional_features": ["Fenced", "Documented", "Dry Land"]}'::jsonb);
