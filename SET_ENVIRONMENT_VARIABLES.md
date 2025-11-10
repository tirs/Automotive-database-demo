# Set Environment Variables in Netlify

## Critical: Your app needs these environment variables to work!

The app is currently showing errors because Supabase environment variables are not set in Netlify.

## Quick Fix Steps

### Step 1: Get Your Supabase Credentials

1. Go to your Supabase project: https://app.supabase.com/
2. Select your project
3. Go to **Settings** > **API**
4. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### Step 2: Add to Netlify

1. Go to **Netlify Dashboard**: https://app.netlify.com/
2. Select your site: **automotive-supabase-schema**
3. Go to **Site settings** > **Environment variables**
4. Click **"Add a variable"**

**Add Variable 1:**
- **Key:** `REACT_APP_SUPABASE_URL`
- **Value:** Your Supabase Project URL (e.g., `https://xxxxx.supabase.co`)
- Click **"Save"**

**Add Variable 2:**
- **Key:** `REACT_APP_SUPABASE_ANON_KEY`
- **Value:** Your Supabase anon/public key (e.g., `eyJhbGc...`)
- Click **"Save"**

### Step 3: Redeploy

1. After adding variables, go to **Deploys** tab
2. Click **"Trigger deploy"** > **"Clear cache and deploy site"**
3. Wait 2-3 minutes for deployment
4. Your app should now work!

## Optional: Google Analytics

If you want analytics tracking:

1. Get your Google Analytics Measurement ID (format: `G-XXXXXXXXXX`)
2. Add to Netlify environment variables:
   - **Key:** `REACT_APP_GA_MEASUREMENT_ID`
   - **Value:** Your GA Measurement ID
3. Redeploy

## Verify It's Working

After redeploying:
1. Visit: https://automotive-supabase-schema.netlify.app/
2. The app should load without errors
3. You should see the dashboard with data (if you have data in Supabase)

## Troubleshooting

**Still seeing errors?**
- Verify the environment variable names are exactly:
  - `REACT_APP_SUPABASE_URL` (not `SUPABASE_URL`)
  - `REACT_APP_SUPABASE_ANON_KEY` (not `SUPABASE_KEY`)
- Make sure you clicked "Save" after adding each variable
- Clear browser cache after redeploy
- Check Netlify build logs for any errors

**Getting "placeholder.supabase.co" errors?**
- This means environment variables are not set
- Follow Step 2 above to add them
- Make sure to redeploy after adding

## For GitHub Pages

If you also want GitHub Pages to work:

1. Go to your repository: https://github.com/tirs/Automotive-database-demo
2. Click **Settings** > **Secrets and variables** > **Actions**
3. Add the same two secrets:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
4. The next GitHub Actions run will use them

