# Deployment Guide - PropLink

This guide covers deploying PropLink to production on Vercel with Supabase.

---

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase project (created in Phase 0)
- Node.js 18+ installed locally

---

## 1. Prepare Supabase for Production

### 1.1 Run Database Schema
In your Supabase project dashboard:

1. Navigate to **SQL Editor**
2. Open `/supabase/schema.sql` from your local project
3. Copy and paste the entire schema into the SQL Editor
4. Click **Run** to execute

This creates all tables, RLS policies, and constraints.

### 1.2 Configure Storage Buckets

1. Go to **Storage** in Supabase dashboard
2. Create two public buckets:
   - `property-images` (public)
   - `property-videos` (public)

For each bucket:
- Click on the bucket name
- Go to **Policies** tab
- Add policy for public SELECT access:
  ```sql
  CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'property-images');
  ```
  (Repeat for `property-videos`)

### 1.3 Create Admin User

After deployment, create an admin account:

1. Register a normal account through the UI
2. In Supabase SQL Editor, run:
   ```sql
   UPDATE profiles
   SET role = 'admin'
   WHERE email = 'your-admin-email@example.com';
   ```

---

## 2. Deploy to Vercel

### 2.1 Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - PropLink v1.0"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/proplink.git
git branch -M main
git push -u origin main
```

### 2.2 Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New Project**
3. Import your GitHub repository (`proplink`)
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

### 2.3 Add Environment Variables

In Vercel project settings, add these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from:
- Supabase Dashboard → Settings → API

### 2.4 Deploy

Click **Deploy** and wait for the build to complete (~2-3 minutes).

---

## 3. Post-Deployment Configuration

### 3.1 Update Supabase Auth Settings

In Supabase Dashboard → Authentication → URL Configuration:

1. Add your Vercel domain to **Site URL**:
   ```
   https://your-app.vercel.app
   ```

2. Add redirect URLs to **Redirect URLs**:
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/**
   ```

### 3.2 Custom Domain (Optional)

In Vercel:
1. Go to **Settings → Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Supabase redirect URLs to include custom domain

---

## 4. Testing Checklist

After deployment, test these critical flows:

- [ ] Homepage loads correctly
- [ ] Browse all properties page works
- [ ] Property detail page displays properly
- [ ] WhatsApp contact link works (opens WhatsApp)
- [ ] User registration creates account
- [ ] Login redirects to dashboard
- [ ] Property upload works with media
- [ ] Property edit/delete functions
- [ ] Admin panel accessible (after creating admin user)
- [ ] Search and filters work correctly
- [ ] Mobile responsive design looks good

---

## 5. Production Optimizations

### 5.1 Enable Caching

In Vercel dashboard → Settings → Functions:
- Set **Regions** to regions closest to your users (e.g., Lagos, Nigeria → Frankfurt for Africa)

### 5.2 Monitor Performance

Use Vercel Analytics:
1. Go to **Analytics** tab
2. Enable **Web Analytics**
3. Monitor Core Web Vitals

### 5.3 Set Up Error Tracking (Optional)

Integrate Sentry for error monitoring:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## 6. Scaling Considerations

### For High Traffic:

1. **Supabase**: Upgrade to Pro plan ($25/month) for:
   - More database connections
   - Better performance
   - Automatic backups

2. **Vercel**: Hobby plan is free, but Pro ($20/month) offers:
   - More bandwidth
   - Better support
   - Password protection for staging

3. **CDN**: Images are served through Supabase CDN automatically

---

## 7. Maintenance Tasks

### Regular Updates:
```bash
# Update dependencies monthly
npm update
npm audit fix

# Test locally
npm run build
npm run dev

# Deploy
git add .
git commit -m "Update dependencies"
git push
```

### Database Backups:
- Supabase Pro includes automatic daily backups
- Free tier: Manual SQL exports via dashboard

### Monitoring:
- Check Vercel deployment logs weekly
- Monitor Supabase database size (free tier: 500MB)
- Review error logs in Supabase Logs Explorer

---

## 8. Troubleshooting

### Build Fails on Vercel
- Check build logs for TypeScript errors
- Ensure all environment variables are set
- Verify Node.js version matches local (check `.nvmrc`)

### Supabase Connection Issues
- Verify environment variables are correct
- Check Supabase project is not paused (free tier pauses after inactivity)
- Confirm RLS policies are properly configured

### Images Not Loading
- Verify storage buckets are public
- Check bucket names match code (`property-images`, `property-videos`)
- Confirm storage policies allow public SELECT

---

## 9. Cost Estimate

**Free Tier (Suitable for MVP/Testing):**
- Vercel: Free (Hobby plan)
- Supabase: Free (up to 500MB database, 1GB storage)
- **Total: $0/month**

**Production (Recommended for Real Traffic):**
- Vercel: $20/month (Pro)
- Supabase: $25/month (Pro)
- Custom domain: ~$10-15/year
- **Total: ~$45/month + domain**

---

## 10. Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **GitHub Issues:** (Your repository issues page)

---

## Success! 🎉

Your PropLink marketplace is now live and ready to connect property sellers with buyers across Nigeria!

**Next Steps:**
1. Share your URL with beta testers
2. Gather feedback and iterate
3. Market to property sellers and buyers
4. Monitor analytics and optimize
