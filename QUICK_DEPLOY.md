# Quick Deploy Guide - Get Your App Live in 5 Minutes

## Prerequisites
- Your code pushed to GitHub
- Supabase project set up with schema deployed

## Deploy to Vercel (Easiest Method)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your repository
5. Configure:
   - **Root Directory**: `demo`
   - **Framework**: Create React App (auto-detected)
6. Add Environment Variables:
   - `REACT_APP_SUPABASE_URL` = your Supabase URL
   - `REACT_APP_SUPABASE_ANON_KEY` = your Supabase key
7. Click "Deploy"

### Step 3: Share Your URL
Your app will be live at: `https://your-project.vercel.app`

That's it! Share this URL with clients.

---

## Deploy to Netlify (Your Choice!)

**See [NETLIFY_DEPLOY.md](NETLIFY_DEPLOY.md) for complete step-by-step guide.**

Quick steps:

1. Go to https://netlify.com
2. Sign up with GitHub
3. "Add new site" > "Import an existing project"
4. Select repository
5. **Important Settings:**
   - Base directory: `demo` ⚠️
   - Build command: `npm run build`
   - Publish directory: `demo/build`
6. Add environment variables:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
7. Click "Deploy site"
8. Your app will be live at: `https://your-site.netlify.app`

**Configuration files already ready:**
- ✅ `demo/netlify.toml` configured
- ✅ `demo/public/_redirects` for routing

---

## What Clients Will See

Once deployed, clients can:
- Access your app from any browser
- View dashboard with statistics
- Browse vehicles, owners, service records
- Click rows to see detailed information
- Edit data (if configured)

No installation or setup required on their end!

---

## Auto-Deployment

After initial setup:
- Every GitHub push = automatic redeploy
- No manual steps needed
- Always up-to-date

---

## Need Help?

See `DEPLOYMENT.md` for detailed instructions and troubleshooting.

