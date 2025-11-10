# GitHub Actions Permission Fix

## Issue

The GitHub Actions workflow was failing with:
```
Permission to tirs/Automotive-database-demo.git denied to github-actions[bot]
fatal: unable to access 'https://github.com/tirs/Automotive-database-demo.git/': The requested URL returned error: 403
```

## Solution

Added `permissions: contents: write` to the workflow job. This grants the GitHub Actions bot permission to write to the repository, which is required to push to the `gh-pages` branch.

## Alternative: Disable GitHub Pages Workflow

Since you're already successfully deployed on Netlify, you can disable the GitHub Pages workflow if you don't need it:

1. Go to your repository on GitHub
2. Click "Settings" > "Actions" > "General"
3. Under "Workflow permissions", ensure "Read and write permissions" is selected
4. Or simply delete/disable the `.github/workflows/deploy.yml` file if you don't need GitHub Pages

## Repository Settings Check

If the workflow still fails, check:

1. **Repository Settings** > **Actions** > **General**
2. Under **"Workflow permissions"**, select:
   - "Read and write permissions" (recommended)
   - Or "Read repository contents and packages permissions" with explicit token

3. **Repository Settings** > **Pages**
   - Ensure GitHub Pages is enabled
   - Source should be set to "gh-pages" branch

## Note

Since you're using Netlify for deployment, the GitHub Pages workflow is optional. You can:
- Keep it for redundancy (deploy to both Netlify and GitHub Pages)
- Remove it if you only need Netlify deployment

