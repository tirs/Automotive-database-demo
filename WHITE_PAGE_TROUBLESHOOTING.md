# White Page Troubleshooting Guide

If your Netlify site is showing a white page, follow these steps:

## Quick Checks

### 1. Check Browser Console

1. Open your site: https://automotive-supabase-schema.netlify.app/
2. Press **F12** (or right-click > Inspect)
3. Go to **Console** tab
4. Look for red error messages
5. Share the errors to diagnose the issue

### 2. Verify Environment Variables

Make sure these are set in Netlify:

1. Go to **Netlify Dashboard** > Your Site > **Site settings** > **Environment variables**
2. Verify these exist:
   - `REACT_APP_SUPABASE_URL` - Your Supabase project URL
   - `REACT_APP_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `REACT_APP_GA_MEASUREMENT_ID` - (Optional) Your Google Analytics ID

3. If missing, add them and **redeploy**

### 3. Check Netlify Build Logs

1. Go to **Netlify Dashboard** > Your Site > **Deploys**
2. Click on the latest deploy
3. Check for build errors
4. Look for any red error messages

### 4. Common Issues

#### Issue: Missing Environment Variables
**Symptom:** White page, console shows "Missing Supabase environment variables"

**Fix:**
1. Add environment variables in Netlify
2. Trigger a new deploy

#### Issue: Supabase Connection Error
**Symptom:** White page, console shows connection errors

**Fix:**
1. Verify Supabase URL and key are correct
2. Check Supabase project is active
3. Verify database schema is deployed

#### Issue: JavaScript Error
**Symptom:** White page, console shows JavaScript errors

**Fix:**
1. Check the error message
2. Verify all dependencies are installed
3. Check for syntax errors in code

#### Issue: Build Failed
**Symptom:** No recent successful deploy

**Fix:**
1. Check build logs
2. Fix any build errors
3. Redeploy

## Manual Verification Steps

### Step 1: Check if HTML is Loading

1. Right-click on the white page
2. Select "View Page Source"
3. You should see HTML content
4. If you see HTML but white page, it's a JavaScript issue

### Step 2: Check Network Tab

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Refresh the page
4. Check if JavaScript files are loading (status 200)
5. Look for failed requests (status 404, 500, etc.)

### Step 3: Test Supabase Connection

1. Open browser console (F12)
2. Type: `localStorage.getItem('supabase')`
3. Check for any Supabase-related errors

## Quick Fixes

### Fix 1: Clear Cache and Redeploy

1. In Netlify: **Deploys** > **Trigger deploy** > **"Clear cache and deploy site"**
2. Wait for deployment
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try again

### Fix 2: Verify Environment Variables

Run this in browser console after page loads:
```javascript
console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('Supabase Key:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
```

### Fix 3: Check Supabase Project

1. Go to your Supabase dashboard
2. Verify project is active
3. Check API settings for correct URL and key
4. Verify database tables exist

## Still Not Working?

1. **Check the exact error** in browser console
2. **Share the error message** for specific help
3. **Verify Netlify build** completed successfully
4. **Check environment variables** are set correctly
5. **Try incognito/private window** to rule out cache issues

## Contact Information

If you need help:
- Check Netlify build logs
- Check browser console errors
- Verify environment variables
- Share specific error messages

