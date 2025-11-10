# Deploy Your Demo App - Make it Live!

This guide will help you deploy your React demo app so clients can access it online without running it on their computers.

**Note:** Supabase doesn't host React apps directly. Use Vercel or Netlify for hosting while keeping Supabase as your database. This is the recommended approach.

## Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest & Free)

Vercel is the easiest way to deploy React apps. It's free and takes 2 minutes.

#### Steps:

1. **Push to GitHub** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to: https://vercel.com
   - Sign up/login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Create React App
     - **Root Directory**: `demo` (important!)
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`
   
3. **Add Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add:
     - `REACT_APP_SUPABASE_URL` = your Supabase URL
     - `REACT_APP_SUPABASE_ANON_KEY` = your Supabase anon key
   - Click "Save"

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at: `https://your-project.vercel.app`

5. **Done!**
   - Share the URL with clients
   - Every time you push to GitHub, Vercel auto-deploys

---

### Option 2: Netlify (Also Great & Free) - RECOMMENDED FOR YOU

**See [NETLIFY_DEPLOY.md](NETLIFY_DEPLOY.md) for detailed step-by-step instructions.**

Quick steps:

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to: https://netlify.com
   - Sign up/login with GitHub
   - Click "Add new site" > "Import an existing project"
   - Select your GitHub repository
   - Configure:
     - **Base directory**: `demo` ⚠️ Important!
     - **Build command**: `npm run build`
     - **Publish directory**: `build` (relative to demo folder)

3. **Add Environment Variables**
   - Go to Site settings > Environment variables
   - Add:
     - `REACT_APP_SUPABASE_URL` = your Supabase URL
     - `REACT_APP_SUPABASE_ANON_KEY` = your Supabase anon key

4. **Deploy**
   - Click "Deploy site"
   - Your app will be live at: `https://random-name.netlify.app`
   - You can customize the domain name

**Configuration files are already set up:**
- ✅ `demo/netlify.toml` - Netlify configuration
- ✅ `demo/public/_redirects` - SPA routing support

---

### Option 3: GitHub Pages (Free but More Setup)

1. **Install gh-pages**
   ```bash
   cd demo
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   Add these to your `package.json`:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages**
   - Go to your repo on GitHub
   - Settings > Pages
   - Source: `gh-pages` branch
   - Your app will be at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

---

## Important: Environment Variables

**For all deployment methods**, you need to set environment variables:

- `REACT_APP_SUPABASE_URL` - Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` - Your Supabase anon/public key

**Never commit `.env` file to GitHub!** Use the hosting platform's environment variable settings instead.

---

## Quick Start: Vercel (Recommended)

### Step-by-Step:

1. **Make sure your code is on GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Go to Vercel**
   - Visit: https://vercel.com
   - Click "Sign Up" (use GitHub)

3. **Import Project**
   - Click "Add New Project"
   - Select your repository
   - Configure:
     - Framework: Create React App
     - Root Directory: `demo`
     - Build Command: `npm run build`
     - Output Directory: `build`

4. **Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     REACT_APP_SUPABASE_URL = https://xxxxx.supabase.co
     REACT_APP_SUPABASE_ANON_KEY = eyJhbGc...
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Copy your live URL!

---

## After Deployment

### Your App Will Be Live At:
- **Vercel**: `https://your-project.vercel.app`
- **Netlify**: `https://your-project.netlify.app`
- **GitHub Pages**: `https://username.github.io/repo-name`

### Share With Clients:
Just send them the URL! They can:
- View the dashboard
- Browse vehicles, owners, service records
- Click rows to see details
- Edit data (if they have access)

### Auto-Deployment:
- Every time you push to GitHub, the app automatically redeploys
- No manual steps needed after initial setup

---

## Troubleshooting

### Build Fails
- Check that `demo/package.json` has correct build scripts
- Verify environment variables are set
- Check build logs in deployment platform

### App Works But No Data
- Verify Supabase environment variables are correct
- Check Supabase Row Level Security (RLS) policies
- Make sure database has data

### Routing Issues (404 on refresh)
- Vercel: `vercel.json` handles this automatically
- Netlify: `netlify.toml` handles this automatically
- GitHub Pages: May need additional configuration

---

## Security Note

**Important:** The anon key is safe to use in frontend apps. Supabase RLS (Row Level Security) should be configured for production to control data access.

For demo purposes, you can temporarily disable RLS, but for production, set up proper policies.

---

## Next Steps

1. Deploy using one of the methods above
2. Test the live URL
3. Share with clients
4. Celebrate! 

Your automotive database demo is now accessible to anyone with the URL!

