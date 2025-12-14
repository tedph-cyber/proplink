# Database Migration Guide - Adding Status Column

## Issue
The `status` column was missing from the `properties` table in the database, causing errors when trying to query properties.

## Solution

### For NEW Installations (Fresh Database)

Simply run the updated `schema.sql` file in Supabase SQL Editor:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `/supabase/schema.sql`
5. Paste and click **Run**

The schema now includes:
- ✅ `status` column (active/sold/inactive) with default 'active'
- ✅ `bedrooms` column (INTEGER, nullable)
- ✅ `bathrooms` column (INTEGER, nullable)
- ✅ `land_size_sqm` column (NUMERIC, nullable)
- ✅ `lga` and `city` are now nullable (optional)
- ✅ `media_url` instead of `url` in property_media table
- ✅ Index on status for better query performance

---

### For EXISTING Installations (Database Already Setup)

Run the migration script to add the missing column:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `/supabase/migration_add_status.sql`
5. Paste and click **Run**

This migration will:
- ✅ Add `status` column if it doesn't exist
- ✅ Add `bedrooms`, `bathrooms`, `land_size_sqm` columns
- ✅ Make `lga` and `city` nullable
- ✅ Rename `url` to `media_url` in property_media
- ✅ Set default values for existing rows
- ✅ Create necessary indexes

---

## What Changed

### Properties Table Structure

**Before:**
```sql
properties (
  id, seller_id, title, description, property_type,
  price_min, price_max, country, state, lga, city,
  features (JSONB), created_at, updated_at
)
```

**After:**
```sql
properties (
  id, seller_id, title, description, property_type,
  price_min, price_max, country, state, lga, city,
  status,           -- NEW: 'active' | 'sold' | 'inactive'
  bedrooms,         -- NEW: INTEGER (for houses)
  bathrooms,        -- NEW: INTEGER (for houses)
  land_size_sqm,    -- NEW: NUMERIC (for land)
  features (JSONB), created_at, updated_at
)
```

### Property Media Table

**Changed:**
- `url` → `media_url` (column renamed for consistency)

---

## Verification

After running the migration, verify the changes:

```sql
-- Check if status column exists
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'properties' 
AND column_name IN ('status', 'bedrooms', 'bathrooms', 'land_size_sqm');

-- Check existing properties have status
SELECT id, title, status FROM properties LIMIT 5;

-- Verify property_media column name
SELECT column_name 
FROM information_schema.columns
WHERE table_name = 'property_media' 
AND column_name = 'media_url';
```

Expected output:
- `status` column exists with type `text`
- All existing properties have `status = 'active'`
- `property_media` has `media_url` column

---

## Application Changes

The following pages now properly use the `status` field:

### 1. Dashboard - My Properties (`/dashboard/properties`)
```tsx
<Badge variant={
  property.status === 'active' ? 'success' : 
  property.status === 'sold' ? 'warning' : 
  'default'
}>
  {property.status}
</Badge>
```

### 2. Property Upload Form (`/dashboard/properties/new`)
```tsx
<select name="status">
  <option value="active">Active</option>
  <option value="sold">Sold</option>
  <option value="inactive">Inactive</option>
</select>
```

### 3. Property Edit Page (`/dashboard/properties/[id]/edit`)
- Pre-fills current status
- Allows sellers to update status

### 4. Public Properties Page (`/properties`)
```tsx
.eq('status', 'active') // Only show active properties
```

### 5. Admin Panel
- Can see all properties regardless of status
- Can change status of any property

---

## Property Status Values

| Status | Meaning | Visible to Public? |
|--------|---------|-------------------|
| `active` | Property is available for sale | ✅ Yes |
| `sold` | Property has been sold | ❌ No |
| `inactive` | Temporarily hidden by seller | ❌ No |

---

## Database Indexes

For optimal query performance, these indexes are created:

```sql
-- Status filtering (commonly used)
CREATE INDEX idx_properties_status ON properties(status);

-- Combined queries
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_location ON properties(country, state, city);
CREATE INDEX idx_properties_created ON properties(created_at DESC);
CREATE INDEX idx_properties_price ON properties(price_min, price_max);
```

---

## Troubleshooting

### Error: "column 'status' does not exist"
**Solution:** Run the migration script in Supabase SQL Editor

### Error: "column 'url' does not exist in property_media"
**Solution:** The migration renames `url` to `media_url`. Run the migration script.

### Error: "null value in column 'lga' violates not-null constraint"
**Solution:** The migration makes `lga` and `city` nullable. Run the migration script.

### Properties not showing on public page
**Check:** Ensure properties have `status = 'active'`
```sql
UPDATE properties SET status = 'active' WHERE status IS NULL;
```

---

## Testing Checklist

After migration:

- [ ] Create a new property → should have status='active' by default
- [ ] View My Properties page → status badge shows correctly
- [ ] Edit a property → can change status
- [ ] Set property to 'sold' → disappears from public listing
- [ ] Set property to 'active' → appears on public listing
- [ ] Admin can see all properties regardless of status
- [ ] Search/filter works with active properties only

---

## Summary

✅ **Schema Updated** - status column added to properties table
✅ **Migration Script Created** - for existing databases
✅ **Application Compatible** - all pages use status correctly
✅ **Indexes Added** - for query performance
✅ **Data Integrity** - constraints and defaults in place

Run the appropriate script (schema.sql for new or migration_add_status.sql for existing) and you're all set!
