# Quick Start Guide - PropLink

Get PropLink running locally in under 10 minutes!

---

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)
- Git (optional, for version control)

---

## Step 1: Clone/Download Project

```bash
# If using Git
git clone <your-repo-url>
cd proplink

# Or download and extract the ZIP file
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages (~2 minutes).

---

## Step 3: Set Up Supabase

### 3.1 Create Supabase Project

1. Go to https://app.supabase.com
2. Click **New Project**
3. Choose organization (or create one)
4. Enter project details:
   - **Name**: PropLink (or your choice)
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to you
5. Click **Create new project** (takes ~2 minutes)

### 3.2 Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open `supabase/schema.sql` from your local project
4. Copy the entire contents
5. Paste into Supabase SQL Editor
6. Click **Run** (or press Ctrl/Cmd + Enter)

You should see: "Success. No rows returned"

### 3.3 Create Storage Buckets

1. In Supabase dashboard, go to **Storage**
2. Click **Create a new bucket**
3. Create first bucket:
   - **Name**: `property-images`
   - **Public bucket**: ✅ Check this
   - Click **Create bucket**
4. Repeat for second bucket:
   - **Name**: `property-videos`
   - **Public bucket**: ✅ Check this

### 3.4 Set Bucket Policies

For each bucket (`property-images` and `property-videos`):

1. Click on the bucket name
2. Go to **Policies** tab
3. Click **New Policy**
4. Choose **For full customization**
5. Enter:
   - **Policy name**: `Public Access`
   - **Allowed operation**: `SELECT`
   - **Target roles**: `public`
   - **USING expression**: `true`
6. Click **Review** then **Save policy**

---

## Step 4: Configure Environment Variables

1. Create `.env.local` file in project root:

```bash
touch .env.local
```

2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Get these values:**
- Supabase Dashboard → Settings → API
- Copy **Project URL** → Paste as `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon/public key** → Paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Step 5: Start Development Server

```bash
npm run dev
```

You should see:

```
  ▲ Next.js 16.0.10
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 2.3s
```

---

## Step 6: Test the Application

### Homepage
Open http://localhost:3000 in your browser.

You should see:
- PropLink homepage
- Hero section with search
- Featured properties section (empty initially)

### Register Account
1. Click **Get Started Now** or **Register** in header
2. Fill in:
   - Email: `seller@example.com`
   - Password: `password123` (min 6 characters)
   - Company Name: `Test Properties Ltd`
   - Seller Type: `Individual`
   - WhatsApp: `+2348012345678`
3. Click **Register**
4. You'll be redirected to dashboard

### Add Test Property
1. In dashboard, click **Add New Property**
2. Fill in form:
   - **Title**: `Beautiful 3-Bedroom House in Lekki`
   - **Description**: `Spacious and modern home with great amenities`
   - **Property Type**: `House`
   - **State**: `Lagos`
   - **LGA**: `Eti-Osa`
   - **City**: `Lekki`
   - **Min Price**: `50000000` (50 million)
   - **Max Price**: Leave empty for negotiable
   - **Bedrooms**: `3`
   - **Bathrooms**: `4`
3. Upload 1-2 test images (any images work for testing)
4. Click **Submit Property**

### Browse Property
1. Go to http://localhost:3000/properties
2. You should see your test property
3. Click on it to view details
4. Test WhatsApp button (opens WhatsApp web/app)

### Test Search
1. On properties page, type "Lekki" in search
2. Click **Search**
3. Property should appear in results
4. Try filters (type, location, price)
5. Test sorting options

---

## Step 7: Create Admin Account (Optional)

To access the admin panel:

1. Open Supabase SQL Editor
2. Run this query (replace with your email):

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'seller@example.com';
```

3. Log out and log back in
4. You'll see "Admin Panel" link in header (purple)
5. Click it to access admin dashboard

---

## ✅ Verification Checklist

- [ ] Homepage loads without errors
- [ ] Can register a new account
- [ ] Redirected to dashboard after registration
- [ ] Can add a property with images
- [ ] Property appears on /properties page
- [ ] Property detail page shows all info
- [ ] WhatsApp button opens correctly
- [ ] Search finds properties
- [ ] Filters work correctly
- [ ] Can edit a property
- [ ] Can delete a property
- [ ] Admin panel accessible (if admin role set)

---

## 🔧 Troubleshooting

### "Cannot connect to Supabase"
- Check `.env.local` file exists
- Verify credentials are correct
- Ensure no trailing spaces in env vars
- Restart dev server: `Ctrl+C` then `npm run dev`

### "No properties showing"
- Add a test property (see Step 6)
- Check property status is "Active"
- Verify database schema was run correctly

### "Images not uploading"
- Check storage buckets exist (`property-images`, `property-videos`)
- Verify buckets are public
- Ensure bucket policies allow SELECT
- Check file size (keep under 5MB for testing)

### "Can't access admin panel"
- Verify admin role set in database
- Log out and log back in
- Check proxy.ts exists in project root (handles route protection)

### TypeScript errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Build errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🚀 Next Steps

Now that you have PropLink running locally:

1. **Explore Features**: Try all functionality
2. **Customize Design**: Edit components in `/components`
3. **Add Test Data**: Create multiple properties, sellers
4. **Test Edge Cases**: Empty states, long text, many images
5. **Deploy**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md) when ready

---

## 📚 Further Reading

- **Full Features**: See [FEATURES.md](./FEATURES.md)
- **Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Project Structure**: See [README.md](./README.md)

---

## 💡 Development Tips

### Hot Reload
Changes to files automatically refresh the browser. If not working:
```bash
# Restart dev server
Ctrl+C
npm run dev
```

### View Database
- Supabase Dashboard → Table Editor
- See all tables: profiles, properties, property_media

### Check Logs
- **Browser Console**: Right-click → Inspect → Console tab
- **Terminal**: Watch for errors in dev server output
- **Supabase Logs**: Dashboard → Logs Explorer

### Database Queries
Test queries in Supabase SQL Editor:
```sql
-- See all sellers
SELECT * FROM profiles WHERE role = 'seller';

-- See all properties with sellers
SELECT 
  p.*,
  pr.company_name as seller_name
FROM properties p
JOIN profiles pr ON p.seller_id = pr.id;

-- Count properties by state
SELECT state, COUNT(*) 
FROM properties 
GROUP BY state 
ORDER BY COUNT(*) DESC;
```

---

## 🎯 Common Tasks

### Add More Test Properties
Use the dashboard UI or SQL:
```sql
INSERT INTO properties (
  seller_id, 
  title, 
  description, 
  property_type, 
  state, 
  lga, 
  city, 
  price_min, 
  bedrooms, 
  bathrooms, 
  status
) VALUES (
  'your-user-id-here',
  'Luxury Villa',
  'Stunning property with pool',
  'house',
  'Lagos',
  'Lekki',
  'Phase 1',
  100000000,
  5,
  6,
  'active'
);
```

### Reset Database
Drop all tables and re-run schema.sql:
```sql
DROP TABLE IF EXISTS property_media CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```
Then run the full schema again.

### Change Admin User
```sql
-- Remove admin from current
UPDATE profiles SET role = 'seller' WHERE role = 'admin';

-- Add to new user
UPDATE profiles SET role = 'admin' WHERE email = 'new-admin@example.com';
```

---

## ✨ You're All Set!

PropLink is now running locally. Happy developing! 🎉

**Time to complete**: ~10 minutes  
**Difficulty**: Easy

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md).
