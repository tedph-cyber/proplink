-- =====================================================
-- Migration: Create Storage Buckets
--
-- Creates the buckets the codebase expects for property
-- media uploads and sets public read + auth write.
--
-- Run this in Supabase SQL Editor after base schema.
-- =====================================================

-- =====================================================
-- 1. Storage buckets
-- =====================================================

-- Property images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']::text[];

-- Property videos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-videos',
  'property-videos',
  true,
  52428800, -- 50MB (videos need more room)
  ARRAY['video/mp4', 'video/webm', 'video/quicktime']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/quicktime']::text[];

-- =====================================================
-- 2. Storage RLS Policies
-- =====================================================

-- Allow public read access to both buckets
CREATE POLICY "Public can view property images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

CREATE POLICY "Public can view property videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-videos');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'property-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can upload videos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'property-videos'
    AND auth.role() = 'authenticated'
  );

-- Allow users to delete their own uploads (by matching file owner)
CREATE POLICY "Users can delete their own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'property-images'
    AND auth.uid() = owner
  );

CREATE POLICY "Users can delete their own videos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'property-videos'
    AND auth.uid() = owner
  );

-- Allow admins to manage all files
CREATE POLICY "Admins can manage all images"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'property-images'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all videos"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'property-videos'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- 3. File path structure (documentation)
-- =====================================================
--
-- The codebase stores files at:
--   property-media/{propertyId}/{timestamp}-{index}.{ext}
--
-- Example:
--   property-media/abc-123-def/1700000000-0.jpg
--
-- The media_url column in property_media stores the
-- full public URL returned by getPublicUrl().
-- =====================================================
