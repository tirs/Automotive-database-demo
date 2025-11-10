# GitHub CI/CD Database Deployment Setup

This guide explains how to set up automatic database deployment to Supabase using GitHub Actions.

## Overview

GitHub Actions will automatically deploy your database schema to Supabase whenever you push changes to `schema.sql` or `schema_enhancements.sql`.

## Setup Instructions

### Step 1: Get Supabase Database Connection String

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **Settings** → **Database**
3. Scroll down to **Connection string**
4. Select **URI** format
5. Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)

**Important**: Replace `[YOUR-PASSWORD]` with your actual database password.

### Step 2: Add GitHub Secret

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secret:

   **Name:** `SUPABASE_DB_URL`
   
   **Value:** Your full connection string from Step 1
   
   Example: `postgresql://postgres:your_password_here@db.xxxxx.supabase.co:5432/postgres`

### Step 3: Verify Workflow File

The workflow file `.github/workflows/deploy-database-simple.yml` is already created and will:
- Run automatically when you push changes to schema files
- Can be manually triggered from the Actions tab
- Deploy both `schema.sql` and `schema_enhancements.sql`
- Verify the deployment was successful

## How It Works

### Automatic Deployment

The workflow triggers when:
- You push changes to `schema.sql` or `schema_enhancements.sql` on the `main` branch
- You manually trigger it from the Actions tab

### What Gets Deployed

1. **Base Schema** (`schema.sql`) - Original 9 tables
2. **Schema Enhancements** (`schema_enhancements.sql`) - 10 new tables

### Deployment Process

1. GitHub Actions checks out your code
2. Installs PostgreSQL client
3. Connects to your Supabase database
4. Executes SQL files in order
5. Verifies tables were created
6. Reports success/failure

## Manual Trigger

To manually trigger database deployment:

1. Go to **Actions** tab in GitHub
2. Select **Deploy Database to Supabase (Simple)**
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow**

## Deploying Sample Data

To also deploy sample data automatically, you have two options:

### Option 1: Include in Commit Message

Add `[deploy-data]` to your commit message:
```bash
git commit -m "Update schema [deploy-data]"
```

### Option 2: Manual Workflow Trigger

1. Go to Actions → Deploy Database to Supabase
2. Click "Run workflow"
3. The workflow will detect and deploy sample data

## Troubleshooting

### Error: "Connection refused"

- Verify your `SUPABASE_DB_URL` secret is correct
- Check that your Supabase project is active
- Ensure the password in the connection string is correct

### Error: "Table already exists"

- This is normal if tables already exist
- The workflow continues even if some objects exist
- To reset, manually drop tables in Supabase SQL Editor first

### Error: "Permission denied"

- Verify your database password is correct
- Check that the connection string format is correct
- Ensure your Supabase project allows external connections

### Tables Not Created

- Check the Actions logs for specific SQL errors
- Verify SQL syntax is correct
- Check Supabase logs in the dashboard

## Security Notes

- ✅ The `SUPABASE_DB_URL` secret is encrypted and only accessible during workflow runs
- ✅ Secrets are never exposed in logs
- ✅ Only repository collaborators can view/use secrets
- ⚠️ Never commit connection strings directly in code

## Alternative: Using Supabase CLI

If you prefer using Supabase CLI instead of direct psql:

1. Install Supabase CLI locally
2. Link your project: `supabase link --project-ref your-project-ref`
3. Use `supabase db push` command

However, the GitHub Actions approach is more automated and doesn't require local setup.

## Workflow Files

- `.github/workflows/deploy-database-simple.yml` - Simple, recommended approach
- `.github/workflows/deploy-database.yml` - Advanced with more options

## Next Steps

1. Add the `SUPABASE_DB_URL` secret to your repository
2. Push a commit that modifies `schema.sql` or `schema_enhancements.sql`
3. Check the Actions tab to see the deployment run
4. Verify tables in your Supabase dashboard

## Testing

To test the workflow:

1. Make a small change to `schema.sql` (add a comment)
2. Commit and push
3. Go to Actions tab
4. Watch the workflow run
5. Check Supabase to verify tables

---

**Your database will now automatically deploy on every schema change!** 🚀

