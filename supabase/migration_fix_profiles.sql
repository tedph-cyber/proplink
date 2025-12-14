-- Migration: Fix missing profiles and add auto-creation trigger
-- Run this if you have users without profiles

-- =====================================================
-- PART 1: Create profiles for existing auth users
-- =====================================================

-- Check which users don't have profiles
DO $$
DECLARE
  user_record RECORD;
  created_count INTEGER := 0;
BEGIN
  FOR user_record IN 
    SELECT au.id, au.email 
    FROM auth.users au
    LEFT JOIN public.profiles p ON p.id = au.id
    WHERE p.id IS NULL
  LOOP
    -- Create missing profile with default values
    INSERT INTO public.profiles (id, role, whatsapp_number, company_name)
    VALUES (
      user_record.id,
      'seller',
      '', -- User needs to update this
      user_record.email -- Use email as temporary company name
    );
    
    created_count := created_count + 1;
    RAISE NOTICE 'Created profile for user: % (ID: %)', user_record.email, user_record.id;
  END LOOP;
  
  IF created_count = 0 THEN
    RAISE NOTICE 'No missing profiles found. All users have profiles.';
  ELSE
    RAISE NOTICE 'Created % profile(s) for existing users.', created_count;
  END IF;
END $$;

-- =====================================================
-- PART 2: Add automatic profile creation trigger
-- =====================================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, whatsapp_number, company_name, seller_type)
  VALUES (
    NEW.id,
    'seller',
    COALESCE(NEW.raw_user_meta_data->>'whatsapp_number', ''),
    COALESCE(NEW.raw_user_meta_data->>'company_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'seller_type', 'individual')
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

RAISE NOTICE 'Auto-profile creation trigger installed successfully!';

-- =====================================================
-- PART 3: Verify the setup
-- =====================================================

-- Show all users and their profiles
SELECT 
  au.id,
  au.email,
  au.created_at as user_created,
  p.role,
  p.company_name,
  p.whatsapp_number,
  p.created_at as profile_created,
  CASE 
    WHEN p.id IS NULL THEN '❌ Missing Profile'
    ELSE '✅ Has Profile'
  END as status
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
ORDER BY au.created_at DESC;
