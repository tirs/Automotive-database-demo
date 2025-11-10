# Analytics Setup - Track Visitors

This guide will help you set up visitor tracking for your deployed application.

## Option 1: Google Analytics (Recommended - Free)

### Step 1: Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring"
4. Create an account name (e.g., "Automotive Database")
5. Set up a property:
   - Property name: "Automotive Database Demo"
   - Reporting time zone: Your timezone
   - Currency: Your currency
6. Choose "Web" as the platform
7. Enter your website URL:
   - Primary: `https://automotive-supabase-schema.netlify.app`
   - Or: `https://tirs.github.io/Automotive-database-demo`
8. Click "Create stream"
9. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 2: Add to Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** > **Environment variables**
4. Add new variable:
   - **Key:** `REACT_APP_GA_MEASUREMENT_ID`
   - **Value:** Your Measurement ID (e.g., `G-XXXXXXXXXX`)
5. Click **"Save"**
6. Go to **Deploys** > **Trigger deploy** > **"Clear cache and deploy site"**

### Step 3: Add to GitHub Actions (for GitHub Pages)

1. Go to your repository: https://github.com/tirs/Automotive-database-demo
2. Click **Settings** > **Secrets and variables** > **Actions**
3. Click **"New repository secret"**
4. Add:
   - **Name:** `REACT_APP_GA_MEASUREMENT_ID`
   - **Value:** Your Measurement ID (e.g., `G-XXXXXXXXXX`)
5. Click **"Add secret"**
6. The next push will automatically include it

### Step 4: View Analytics

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Click **"Reports"** in the left sidebar
4. View:
   - **Realtime:** See current visitors
   - **Overview:** See visitor statistics
   - **Engagement:** See how users interact
   - **Demographics:** See user information

## Option 2: Netlify Analytics (Netlify Only)

If you're using Netlify, you can also use their built-in analytics:

1. Go to Netlify dashboard
2. Select your site
3. Click **"Analytics"** in the left sidebar
4. Enable Netlify Analytics (may require paid plan)

**Note:** Netlify Analytics is available on paid plans, while Google Analytics is free.

## Option 3: Simple Page View Counter

For a simple solution, you could also:
- Use a service like [GoatCounter](https://www.goatcounter.com/) (free, privacy-friendly)
- Use [Plausible Analytics](https://plausible.io/) (paid, privacy-focused)
- Use [Umami](https://umami.is/) (self-hosted, free)

## What You Can Track

With Google Analytics, you can see:
- **Total visitors** and unique visitors
- **Page views** per page
- **Session duration** (how long visitors stay)
- **Bounce rate** (visitors who leave quickly)
- **Traffic sources** (where visitors come from)
- **Device types** (desktop, mobile, tablet)
- **Geographic location** of visitors
- **Real-time visitors** (who's on your site right now)

## Privacy Note

Google Analytics collects visitor data. Make sure to:
- Add a privacy policy to your site
- Comply with GDPR if you have EU visitors
- Consider using privacy-focused alternatives if needed

## Quick Start Checklist

- [ ] Create Google Analytics account
- [ ] Get Measurement ID (G-XXXXXXXXXX)
- [ ] Add to Netlify environment variables
- [ ] Add to GitHub Secrets (for GitHub Pages)
- [ ] Redeploy your site
- [ ] Verify tracking is working (check Realtime in GA)
- [ ] Set up custom reports if needed

## Verify It's Working

1. After deploying, visit your site
2. Go to Google Analytics > Reports > Realtime
3. You should see yourself as a visitor within 30 seconds
4. If you see your visit, tracking is working!

## Troubleshooting

**Not seeing data:**
- Wait 24-48 hours for data to appear (Realtime works immediately)
- Check that the Measurement ID is correct
- Verify environment variables are set
- Clear browser cache and visit the site again
- Check browser console for errors (F12)

**Data not updating:**
- Make sure you redeployed after adding the environment variable
- Verify the variable name is exactly: `REACT_APP_GA_MEASUREMENT_ID`
- Check that ad blockers aren't blocking Google Analytics

