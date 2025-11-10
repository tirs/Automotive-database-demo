# How to Enable GitHub Pages

## Step-by-Step Instructions

### Step 1: Go to Repository Settings

1. Go to your repository: https://github.com/tirs/Automotive-database-demo
2. Click on **"Settings"** (top menu bar, next to "Insights")

### Step 2: Navigate to Pages

1. In the left sidebar, scroll down and click **"Pages"**
2. You'll see the GitHub Pages configuration

### Step 3: Configure Pages Source

1. Under **"Source"**, select:
   - **Branch:** `gh-pages`
   - **Folder:** `/ (root)`
2. Click **"Save"**

### Step 4: Wait for Deployment

- GitHub Pages will be enabled
- Your site will be available at: `https://tirs.github.io/Automotive-database-demo/`
- It may take a few minutes to become active

## Verify Deployment

1. **Check the gh-pages branch exists:**
   - Go to your repository
   - Click on the branch dropdown (usually shows "main")
   - Look for "gh-pages" branch
   - If it exists, the workflow deployed successfully

2. **Check Actions:**
   - Go to the "Actions" tab
   - Look for the latest workflow run
   - Should show "green checkmark" if successful

3. **Check Pages Settings:**
   - Settings > Pages
   - Should show "Your site is live at..." after configuration

## Troubleshooting

### If gh-pages branch doesn't exist:

The GitHub Actions workflow might not have run yet or failed. Check:
1. Go to "Actions" tab
2. Look for workflow runs
3. If there are failures, check the logs

### If Pages still doesn't work:

1. Make sure the workflow completed successfully
2. Wait 5-10 minutes after enabling Pages
3. Clear browser cache
4. Try accessing in incognito mode

## Alternative: Manual Setup

If the workflow isn't working, you can manually enable Pages:

1. Settings > Pages
2. Source: Select "Deploy from a branch"
3. Branch: Select `gh-pages` and `/ (root)`
4. Save

Then manually create the gh-pages branch with your build files.

## Note

Since you're already on Netlify, GitHub Pages is optional. You can:
- Use both (redundancy)
- Use only Netlify (simpler)
- Disable the GitHub Actions workflow if you don't need Pages

