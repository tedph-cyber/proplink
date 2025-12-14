-- Migration Script: Add status column and update properties table
-- Run this if you already have an existing database

-- Add status column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'properties' AND column_name = 'status'
  ) THEN
    ALTER TABLE properties 
    ADD COLUMN status TEXT NOT NULL CHECK (status IN ('active', 'sold', 'inactive')) DEFAULT 'active';
    
    -- Add index for status
    CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
    
    RAISE NOTICE 'Status column added successfully';
  ELSE
    RAISE NOTICE 'Status column already exists';
  END IF;
END $$;

-- Make lga and city nullable (they were NOT NULL before)
DO $$ 
BEGIN
  ALTER TABLE properties 
  ALTER COLUMN lga DROP NOT NULL;
  
  ALTER TABLE properties 
  ALTER COLUMN city DROP NOT NULL;
  
  RAISE NOTICE 'LGA and City columns are now nullable';
END $$;

-- Add bedrooms, bathrooms, land_size_sqm columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'properties' AND column_name = 'bedrooms'
  ) THEN
    ALTER TABLE properties ADD COLUMN bedrooms INTEGER;
    RAISE NOTICE 'Bedrooms column added';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'properties' AND column_name = 'bathrooms'
  ) THEN
    ALTER TABLE properties ADD COLUMN bathrooms INTEGER;
    RAISE NOTICE 'Bathrooms column added';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'properties' AND column_name = 'land_size_sqm'
  ) THEN
    ALTER TABLE properties ADD COLUMN land_size_sqm NUMERIC;
    RAISE NOTICE 'Land size column added';
  END IF;
END $$;

-- Rename url to media_url in property_media table if needed
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'property_media' AND column_name = 'url'
  ) THEN
    ALTER TABLE property_media RENAME COLUMN url TO media_url;
    RAISE NOTICE 'Renamed url to media_url in property_media';
  ELSE
    RAISE NOTICE 'Column media_url already exists or url does not exist';
  END IF;
END $$;

-- Set country default if column exists but no default
ALTER TABLE properties 
ALTER COLUMN country SET DEFAULT 'Nigeria';

-- Update existing rows to set status if they don't have one
UPDATE properties 
SET status = 'active' 
WHERE status IS NULL;

-- Make whatsapp_number nullable in profiles table
DO $$ 
BEGIN
  ALTER TABLE profiles 
  ALTER COLUMN whatsapp_number DROP NOT NULL;
  
  ALTER TABLE profiles 
  ALTER COLUMN whatsapp_number SET DEFAULT '';
  
  RAISE NOTICE 'WhatsApp number is now optional in profiles';
END $$;

RAISE NOTICE 'Migration completed successfully!';
