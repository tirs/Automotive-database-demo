# Netlify Deployment - Quick Start

## Deploy in 5 Minutes

### Step 1: Push to GitHub
```powershell
.\deploy-to-github.ps1
```

### Step 2: Deploy to Netlify

1. **Go to Netlify:** https://netlify.com
2. **Sign up/Login** with GitHub
3. **Click:** "Add new site" → "Import an existing project"
4. **Select** your GitHub repository
5. **Configure Build Settings:**
   - Click "Show advanced" or "Change options"
   - **Base directory:** `demo` (Important)
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
6. **Add Environment Variables:**
   - Click "New variable"
   - Add: `REACT_APP_SUPABASE_URL` = your Supabase URL
   - Add: `REACT_APP_SUPABASE_ANON_KEY` = your Supabase key
7. **Click:** "Deploy site"

### Step 3: Wait & Share!

- Build takes 2-5 minutes
- Your app will be live at: `https://your-site.netlify.app`
- Share the URL with clients!

---

## Configuration Files Ready

- `demo/netlify.toml` - Build configuration
- `demo/public/_redirects` - Routing support

---

## Need More Details?

See **[NETLIFY_DEPLOY.md](NETLIFY_DEPLOY.md)** for:
- Detailed step-by-step instructions
- Troubleshooting guide
- Custom domain setup
- Auto-deployment info

---

## That's It!

Your app is now live and accessible to anyone with the URL!

