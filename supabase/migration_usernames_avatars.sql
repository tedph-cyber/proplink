-- =====================================================
-- Migration: Add usernames and avatars to profiles
-- =====================================================

-- Add columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[];

-- Storage RLS for avatars
CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid() = owner
  );

CREATE POLICY "Admins can manage all avatars"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'avatars'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Update trigger to include username from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, whatsapp_number, seller_type, company_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'seller'),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp_number', ''),
    COALESCE(NEW.raw_user_meta_data->>'seller_type', 'individual'),
    NEW.raw_user_meta_data->>'company_name',
    NEW.raw_user_meta_data->>'username'
  )
  ON CONFLICT (id) DO UPDATE SET
    seller_type     = COALESCE(EXCLUDED.seller_type, profiles.seller_type),
    company_name    = COALESCE(EXCLUDED.company_name, profiles.company_name),
    username        = COALESCE(EXCLUDED.username, profiles.username),
    whatsapp_number = CASE
      WHEN EXCLUDED.whatsapp_number = '' THEN profiles.whatsapp_number
      ELSE EXCLUDED.whatsapp_number
    END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
