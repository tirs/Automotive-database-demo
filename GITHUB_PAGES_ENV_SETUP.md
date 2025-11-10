# Setting Up Environment Variables for GitHub Pages

GitHub Pages uses GitHub Actions to build and deploy your site. Environment variables need to be set as **GitHub Secrets** in your repository.

## Steps to Add Secrets

1. **Go to your GitHub repository**
   - Navigate to: `https://github.com/YOUR_USERNAME/Automotive-database-demo`

2. **Open Settings**
   - Click on the **Settings** tab (top menu)

3. **Navigate to Secrets**
   - In the left sidebar, click **Secrets and variables**
   - Then click **Actions**

4. **Add New Secrets**
   - Click **New repository secret**
   - Add the following secrets one by one:

   ### Secret 1: REACT_APP_SUPABASE_URL
   - **Name:** `REACT_APP_SUPABASE_URL`
   - **Value:** Your Supabase project URL
     - Get this from: https://app.supabase.com/project/_/settings/api
     - Example: `https://xxxxxxxxxxxxx.supabase.co`

   ### Secret 2: REACT_APP_SUPABASE_ANON_KEY
   - **Name:** `REACT_APP_SUPABASE_ANON_KEY`
   - **Value:** Your Supabase anon/public key
     - Get this from: https://app.supabase.com/project/_/settings/api
     - This is the `anon` `public` key (safe for client-side use)

   ### Secret 3: REACT_APP_GA_MEASUREMENT_ID (Optional)
   - **Name:** `REACT_APP_GA_MEASUREMENT_ID`
   - **Value:** Your Google Analytics Measurement ID
     - Example: `G-MP3D4D91GB`

5. **Trigger a New Build**
   - After adding the secrets, push a new commit to the `main` branch
   - Or manually trigger the workflow:
     - Go to **Actions** tab
     - Click on **Deploy to GitHub Pages** workflow
     - Click **Run workflow** → **Run workflow**

## Verify Secrets Are Set

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. You should see:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   - `REACT_APP_GA_MEASUREMENT_ID` (optional)

## How It Works

The GitHub Actions workflow (`.github/workflows/deploy.yml`) uses these secrets during the build process:

```yaml
env:
  REACT_APP_SUPABASE_URL: ${{ secrets.REACT_APP_SUPABASE_URL }}
  REACT_APP_SUPABASE_ANON_KEY: ${{ secrets.REACT_APP_SUPABASE_ANON_KEY }}
  REACT_APP_GA_MEASUREMENT_ID: ${{ secrets.REACT_APP_GA_MEASUREMENT_ID }}
```

These environment variables are injected into the React build, making them available to your app.

## Troubleshooting

### "Supabase client not initialized" error
- Verify secrets are set correctly in GitHub
- Check that secret names match exactly (case-sensitive)
- Ensure you've pushed a new commit after adding secrets
- Check the GitHub Actions build logs for any errors

### Build succeeds but app shows error
- Clear your browser cache
- Check the browser console (F12) for specific error messages
- Verify the Supabase URL and key are correct

### Secrets not appearing in build
- Make sure you're using the correct repository
- Verify the workflow file (`.github/workflows/deploy.yml`) exists
- Check that the workflow is running on the `main` branch

## Security Note

- `REACT_APP_SUPABASE_ANON_KEY` is safe to expose in client-side code (it's designed for public use)
- Never commit these values directly in your code
- Always use GitHub Secrets for sensitive values

