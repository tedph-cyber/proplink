-- =====================================================
-- Migration: Add lat/lng and street to properties
-- =====================================================

ALTER TABLE properties ADD COLUMN IF NOT EXISTS street TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS longitude NUMERIC;

CREATE INDEX IF NOT EXISTS idx_properties_coordinates ON properties(latitude, longitude);
