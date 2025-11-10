# Netlify White Page - Quick Fix

## Most Common Cause: Missing Environment Variables

If your Netlify site shows a white page, it's almost always because **environment variables are not set**.

## Immediate Fix

### Step 1: Check Netlify Environment Variables

1. Go to **Netlify Dashboard**: https://app.netlify.com/
2. Select your site: **automotive-supabase-schema**
3. Click **Site settings** > **Environment variables**
4. Verify these exist:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

### Step 2: If Missing, Add Them

1. Click **"Add a variable"**
2. Add **REACT_APP_SUPABASE_URL**:
   - **Key:** `REACT_APP_SUPABASE_URL`
   - **Value:** Your Supabase URL (e.g., `https://xxxxx.supabase.co`)
   - Click **"Save"**

3. Add **REACT_APP_SUPABASE_ANON_KEY**:
   - **Key:** `REACT_APP_SUPABASE_ANON_KEY`
   - **Value:** Your Supabase anon key (starts with `eyJ...`)
   - Click **"Save"**

### Step 3: Redeploy

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** > **"Clear cache and deploy site"**
3. Wait 2-3 minutes

### Step 4: Test

1. Visit: https://automotive-supabase-schema.netlify.app/
2. Clear browser cache (Ctrl+Shift+Delete)
3. The app should now load!

## Get Your Supabase Credentials

1. Go to: https://app.supabase.com/
2. Select your project
3. Go to **Settings** > **API**
4. Copy:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## Check Browser Console

If still white page:

1. Open site: https://automotive-supabase-schema.netlify.app/
2. Press **F12** (Developer Tools)
3. Go to **Console** tab
4. Look for error messages
5. Share the errors for help

## Common Errors

**"Missing Supabase environment variables"**
- Environment variables not set in Netlify
- Fix: Add them (see Step 2 above)

**"Supabase client not initialized"**
- Same as above
- Fix: Add environment variables

**"Failed to load resource: net::ERR_NAME_NOT_RESOLVED"**
- Trying to connect to placeholder.supabase.co
- Fix: Environment variables not set

**"Unexpected token '<'"**
- JavaScript files loading HTML instead
- Fix: Usually resolves after setting environment variables and redeploying

## Verify Variables Are Set

After adding variables, check:

1. Go to **Site settings** > **Environment variables**
2. You should see:
   - `REACT_APP_SUPABASE_URL` = `https://xxxxx.supabase.co`
   - `REACT_APP_SUPABASE_ANON_KEY` = `eyJ...`

3. If you see them, trigger a new deploy
4. Wait for deployment to complete
5. Clear browser cache and try again

## Still Not Working?

1. Check Netlify build logs for errors
2. Check browser console (F12) for JavaScript errors
3. Verify Supabase project is active
4. Verify database schema is deployed
5. Try incognito/private window

## Summary

**99% of white page issues are caused by missing environment variables.**

Fix: Add `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` to Netlify, then redeploy.

