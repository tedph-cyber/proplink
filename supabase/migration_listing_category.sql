-- Add listing_category column to properties table
-- Stores the specific listing category slug (e.g. 'houses-rent', 'land-sale', 'new-builds')
-- property_type ('house' | 'land') is derived from listing_category

ALTER TABLE properties ADD COLUMN IF NOT EXISTS listing_category text;

CREATE INDEX IF NOT EXISTS idx_properties_listing_category ON properties(listing_category);
