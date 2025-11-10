# Deploy to Netlify - Step by Step Guide

This guide will walk you through deploying your React demo app to Netlify.

## Prerequisites

 Your code pushed to GitHub  
 Supabase database set up with schema deployed  
 Supabase URL and anon key ready

---

## Step 1: Push Code to GitHub

If you haven't already, push your code to GitHub:

```powershell
# Run the helper script
.\deploy-to-github.ps1

# OR manually:
git init
git add .
git commit -m "Ready for Netlify deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## Step 2: Deploy to Netlify

### 2.1 Sign Up / Login

1. Go to **https://netlify.com**
2. Click **"Sign up"** or **"Log in"**
3. Choose **"Sign up with GitHub"** (recommended)
4. Authorize Netlify to access your GitHub repositories

### 2.2 Create New Site

1. In Netlify dashboard, click **"Add new site"**
2. Select **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify (if prompted)
5. Select your repository from the list

### 2.3 Configure Build Settings

**Important:** Set these values:

- **Base directory:** `demo`
- **Build command:** `npm run build`
- **Publish directory:** `demo/build`

**How to set:**
1. Click **"Show advanced"** or **"Change options"**
2. Under **"Base directory"**, enter: `demo`
3. Under **"Build command"**, enter: `npm run build`
4. Under **"Publish directory"**, enter: `demo/build`

### 2.4 Add Environment Variables

Before deploying, add your Supabase credentials:

1. Click **"New variable"** or **"Add a variable"**
2. Add these two variables:

   **Variable 1:**
   - **Key:** `REACT_APP_SUPABASE_URL`
   - **Value:** Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)

   **Variable 2:**
   - **Key:** `REACT_APP_SUPABASE_ANON_KEY`
   - **Value:** Your Supabase anon/public key

3. Click **"Deploy site"**

---

## Step 3: Wait for Deployment

1. Netlify will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Build your app (`npm run build`)
   - Deploy to CDN

2. This takes **2-5 minutes** typically

3. You'll see build logs in real-time

---

## Step 4: Your App is Live!

Once deployment completes:

1. **Your live URL:** `https://random-name-12345.netlify.app`
   - Netlify generates a random name
   - You can customize it later

2. **Test your app:**
   - Open the URL in a browser
   - Verify it connects to Supabase
   - Test viewing and editing data

---

## Step 5: Customize Domain (Optional)

### Change Site Name

1. Go to **Site settings** > **Change site name**
2. Enter your preferred name
3. Your new URL: `https://your-name.netlify.app`

### Add Custom Domain

1. Go to **Domain settings**
2. Click **"Add custom domain"**
3. Enter your domain name
4. Follow DNS configuration instructions

---

## Auto-Deployment

**Every time you push to GitHub:**
- Netlify automatically rebuilds and redeploys
- No manual steps needed
- Always up-to-date!

---

## Troubleshooting

### Build Fails

**Error: "Build command failed"**
- Check that `demo/package.json` has `"build": "react-scripts build"`
- Verify Node.js version (Netlify uses Node 18 by default)
- Check build logs for specific errors

**Error: "Module not found"**
- Make sure all dependencies are in `demo/package.json`
- Run `npm install` locally to verify

### App Works But No Data

**Issue: Blank screen or no data loading**
- Verify environment variables are set correctly
- Check Supabase URL and key in Netlify settings
- Ensure Supabase database has data
- Check browser console for errors

**Solution:**
1. Go to **Site settings** > **Environment variables**
2. Verify both variables are set
3. Click **"Trigger deploy"** > **"Clear cache and deploy site"**

### Routing Issues (404 on Refresh)

**Issue: Getting 404 when refreshing pages**
- This is handled by `demo/public/_redirects` file
- Netlify should detect it automatically
- If not working, verify the file exists

**Solution:**
- The `_redirects` file is already in `demo/public/`
- Netlify should handle it automatically
- If issues persist, check Netlify's redirect rules

### Environment Variables Not Working

**Issue: Variables not being used**
- Make sure variable names start with `REACT_APP_`
- Redeploy after adding variables
- Clear cache and redeploy

**Solution:**
1. Go to **Site settings** > **Environment variables**
2. Verify variable names are exactly:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
3. Click **"Trigger deploy"** > **"Clear cache and deploy site"**

### Secrets Scanning Error

**Issue: "Secrets scanning found secrets in build"**
- Netlify detects Supabase keys in the compiled JavaScript
- This is **expected** - React bundles `REACT_APP_*` variables into the build
- The anon key is **safe to expose** (designed for frontend use)

**Solution:**
The `netlify.toml` file is already configured to omit these keys from scanning:
```toml
SECRETS_SCAN_OMIT_KEYS = "REACT_APP_SUPABASE_URL,REACT_APP_SUPABASE_ANON_KEY"
```

If you still see the error:
1. Make sure `demo/netlify.toml` has the `SECRETS_SCAN_OMIT_KEYS` setting
2. Push the updated `netlify.toml` to GitHub
3. Redeploy on Netlify

**Alternative:** Add in Netlify UI:
1. Go to **Site settings** > **Environment variables**
2. Add: `SECRETS_SCAN_OMIT_KEYS` = `REACT_APP_SUPABASE_URL,REACT_APP_SUPABASE_ANON_KEY`
3. Redeploy

**Note:** The Supabase anon key is safe to expose in frontend code. It's protected by Row Level Security (RLS) policies in Supabase.

---

## Netlify Configuration Files

Your project already includes:

1. **`demo/netlify.toml`** - Netlify configuration
   - Build settings
   - Redirect rules
   - Node version

2. **`demo/public/_redirects`** - SPA routing
   - Handles React Router
   - Prevents 404 errors

These are already configured and ready to use!

---

## Quick Checklist

Before deploying, make sure:

- [ ] Code is pushed to GitHub
- [ ] `demo/netlify.toml` exists
- [ ] `demo/public/_redirects` exists
- [ ] Supabase URL ready
- [ ] Supabase anon key ready
- [ ] Base directory set to `demo`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `demo/build`
- [ ] Environment variables added

---

## Next Steps After Deployment

1. **Test thoroughly:**
   - View dashboard
   - Browse vehicles, owners, service records
   - Test edit functionality
   - Verify data saves to Supabase

2. **Share with clients:**
   - Send them the Netlify URL
   - No installation needed!

3. **Monitor:**
   - Check Netlify dashboard for build status
   - View analytics (if enabled)
   - Monitor function logs (if using)

---

## Support

If you encounter issues:

1. Check Netlify build logs
2. Check browser console for errors
3. Verify Supabase connection
4. Review this guide's troubleshooting section

---

## Summary

 **Deploy to Netlify in 5 steps:**
1. Push to GitHub
2. Sign up/login to Netlify
3. Import repository
4. Set base directory to `demo`
5. Add environment variables and deploy!

Your app will be live at: `https://your-site.netlify.app`

**Congratulations!** Your automotive database demo is now accessible to anyone with the URL!

