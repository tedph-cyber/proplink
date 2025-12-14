# Fixing Foreign Key Constraint Error

## Error Message
```
insert or update on table "properties" violates foreign key constraint "properties_seller_id_fkey"
```

## Root Cause
This error occurs when trying to insert a property with a `seller_id` that doesn't exist in the `profiles` table. This happens when:

1. User registered but their profile wasn't created
2. The profile creation failed during registration
3. User was created directly in Supabase Auth without a profile

## Quick Fix (Run These Scripts)

### Step 1: Fix Existing Users Without Profiles

Go to **Supabase Dashboard → SQL Editor** and run:

```sql
-- Create profiles for existing auth users who don't have one
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
    INSERT INTO public.profiles (id, role, whatsapp_number, company_name)
    VALUES (
      user_record.id,
      'seller',
      '',
      user_record.email
    );
    
    created_count := created_count + 1;
  END LOOP;
  
  RAISE NOTICE 'Created % profile(s)', created_count;
END $$;
```

### Step 2: Add Automatic Profile Creation

This ensures future users automatically get a profile:

```sql
-- Create function to auto-create profiles
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

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Step 3: Make WhatsApp Number Optional

```sql
-- Allow empty whatsapp_number (user can update later)
ALTER TABLE profiles 
ALTER COLUMN whatsapp_number DROP NOT NULL;

ALTER TABLE profiles 
ALTER COLUMN whatsapp_number SET DEFAULT '';
```

## Verification

Check if all users now have profiles:

```sql
-- Show users with/without profiles
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN p.id IS NULL THEN '❌ Missing'
    ELSE '✅ Has Profile'
  END as profile_status,
  p.company_name,
  p.whatsapp_number
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
ORDER BY au.created_at DESC;
```

**Expected:** All users should show "✅ Has Profile"

## Alternative: Run Complete Migration

Or simply run the complete migration script:

**File:** `/supabase/migration_fix_profiles.sql`

This script does all three steps above automatically.

## Testing After Fix

1. **Test Existing User:**
   ```sql
   -- Check your user ID
   SELECT id FROM auth.users WHERE email = 'your-email@example.com';
   
   -- Verify profile exists
   SELECT * FROM profiles WHERE id = 'your-user-id';
   ```

2. **Test New Registration:**
   - Register a new user via the UI
   - Check that profile is auto-created
   - Try adding a property - should work!

3. **Test Property Creation:**
   ```sql
   -- This should now work
   INSERT INTO properties (
     seller_id, title, description, property_type,
     price_min, country, state, status
   ) VALUES (
     'your-user-id',
     'Test Property',
     'Test Description',
     'house',
     1000000,
     'Nigeria',
     'Lagos',
     'active'
   );
   ```

## Why This Happened

The registration flow in `/app/(auth)/register/page.tsx` creates the profile manually:

```typescript
const { error: profileError } = await supabase.from('profiles').insert({
  id: authData.user.id,
  role: 'seller',
  seller_type: sellerType,
  company_name: companyName,
  whatsapp_number: whatsappNumber,
})
```

However, if this fails (network issue, validation error, etc.), the user gets created in `auth.users` but no profile is created. The **automatic trigger** prevents this issue.

## Prevention

With the trigger in place:
- ✅ Every new user automatically gets a profile
- ✅ Even if the manual insert fails, trigger creates a backup
- ✅ No more foreign key constraint errors
- ✅ Users can update whatsapp_number later if needed

## Still Having Issues?

### Check if trigger is active:
```sql
SELECT 
  trigger_name, 
  event_manipulation, 
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

Should return: `on_auth_user_created` trigger

### Manually create a missing profile:
```sql
INSERT INTO profiles (id, role, whatsapp_number, company_name)
VALUES (
  'user-id-here',
  'seller',
  '',
  'User Name'
);
```

### Delete and recreate user (last resort):
```sql
-- Delete user (cascades to profile and properties)
DELETE FROM auth.users WHERE id = 'user-id-here';

-- Re-register through the UI
-- Trigger will auto-create profile
```

---

## Summary

✅ **Problem:** Foreign key constraint - seller_id doesn't exist  
✅ **Cause:** User without profile trying to create property  
✅ **Solution:** Run migration to create missing profiles + add trigger  
✅ **Prevention:** Trigger auto-creates profiles for new users  

**Run the migration scripts and you're all set!** 🚀
