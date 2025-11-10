# GitHub Pages White Page Fix

## Problem

GitHub Pages was showing a white page because:
1. React Router needs a basename for subdirectory deployment
2. GitHub Pages serves from a subdirectory (`/Automotive-database-demo/`)
3. Missing routing configuration for Single Page App (SPA)

## Solution Applied

### 1. Added Basename to Router

Updated `demo/src/App.js` to use basename:
```javascript
const basename = process.env.PUBLIC_URL || '';
<Router basename={basename}>
```

### 2. Set Homepage in package.json

Added homepage field:
```json
"homepage": "https://tirs.github.io/Automotive-database-demo"
```

### 3. Added PUBLIC_URL to Build

Updated `.github/workflows/deploy.yml`:
```yaml
env:
  PUBLIC_URL: /Automotive-database-demo
```

### 4. Added 404.html for Routing

Created `demo/public/404.html` with redirect script for GitHub Pages SPA routing.

### 5. Added Routing Script to index.html

Added script to handle GitHub Pages routing in `demo/public/index.html`.

## Verify Environment Variables

Make sure these are set in GitHub repository secrets:
1. Go to repository Settings > Secrets and variables > Actions
2. Add/verify:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

If these are missing, the app will show a white page because it can't connect to Supabase.

## After Deployment

1. Wait for GitHub Actions to complete (2-5 minutes)
2. Clear browser cache
3. Visit: https://tirs.github.io/Automotive-database-demo/
4. The app should now load correctly

## Troubleshooting

If still seeing white page:
1. Check browser console for errors (F12)
2. Verify environment variables are set in GitHub Secrets
3. Check GitHub Actions logs for build errors
4. Try incognito/private window
5. Wait a few minutes for GitHub Pages to update

