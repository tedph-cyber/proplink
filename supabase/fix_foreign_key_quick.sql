-- ALL-IN-ONE FIX: Foreign Key Constraint Error
-- Run this single script to fix everything

-- =====================================================
-- 1. Make whatsapp_number optional
-- =====================================================
ALTER TABLE profiles ALTER COLUMN whatsapp_number DROP NOT NULL;
ALTER TABLE profiles ALTER COLUMN whatsapp_number SET DEFAULT '';

-- =====================================================
-- 2. Create profiles for users who don't have one
-- =====================================================
INSERT INTO public.profiles (id, role, whatsapp_number, company_name, seller_type)
SELECT 
  au.id,
  'seller',
  '',
  au.email,
  'individual'
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL;

-- =====================================================
-- 3. Add automatic profile creation trigger
-- =====================================================
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
    RAISE WARNING 'Error creating profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 4. Verification
-- =====================================================
-- Show results
SELECT 
  COUNT(*) FILTER (WHERE p.id IS NOT NULL) as users_with_profiles,
  COUNT(*) FILTER (WHERE p.id IS NULL) as users_without_profiles,
  COUNT(*) as total_users
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id;

-- Done!
SELECT '✅ Fix complete! All users should now have profiles.' as status;
