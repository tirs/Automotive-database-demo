# Deploy Sample Data to Supabase

## Quick Guide

The GitHub Actions workflow now automatically deploys `sample_data_enhancements.sql` when you push changes to it.

## Option 1: Automatic Deployment (Recommended)

### When you push changes to sample data files:

1. **Make changes to `sample_data_enhancements.sql`**
2. **Commit and push:**
   ```bash
   git add sample_data_enhancements.sql
   git commit -m "Update sample data"
   git push origin main
   ```
3. **GitHub Actions will automatically:**
   - Deploy the schema (if needed)
   - Deploy `sample_data.sql` (if changed)
   - Deploy `sample_data_enhancements.sql` (if changed)

## Option 2: Manual Trigger

### Deploy sample data manually:

1. **Go to GitHub Actions tab**
2. **Select "Deploy Database to Supabase (Simple)"**
3. **Click "Run workflow"**
4. **Check "Include sample data?" (default: true)**
5. **Click "Run workflow"**

This will deploy:
- ✅ `schema.sql`
- ✅ `schema_enhancements.sql`
- ✅ `sample_data.sql`
- ✅ `sample_data_enhancements.sql`

## Option 3: Complete Control Workflow

For more control, use the "Deploy Complete Database" workflow:

1. **Go to Actions tab**
2. **Select "Deploy Complete Database (Schema + Data)"**
3. **Click "Run workflow"**
4. **Choose:**
   - Deploy schema files? (default: true)
   - Deploy sample data files? (default: true)
5. **Click "Run workflow"**

## Verify Deployment

After deployment, check:

1. **Supabase Dashboard** → **Table Editor**
2. **Check tables have data:**
   - `accident` table should have records
   - `warranty` table should have records
   - `insurance_policy` table should have records
   - etc.

3. **Check workflow logs:**
   - Go to Actions tab
   - Click on the workflow run
   - Look for "✓ Enhanced sample data deployment completed"

## Troubleshooting

### Sample data not deploying?

**Check:**
- ✅ `SUPABASE_DB_URL` secret is set in GitHub
- ✅ File `sample_data_enhancements.sql` exists in repository
- ✅ Workflow is running (check Actions tab)
- ✅ No errors in workflow logs

### "Duplicate key" errors?

This is normal! The workflow ignores duplicate key errors, so:
- ✅ Existing data is preserved
- ✅ New data is added
- ✅ No errors if data already exists

### Want to force re-deploy?

If you want to clear and re-deploy:

1. **Option A:** Delete data in Supabase SQL Editor first
2. **Option B:** Modify the sample data file slightly and push again

## Current Status

✅ **Workflow configured** - Ready to deploy sample data
✅ **Automatic trigger** - Deploys when `sample_data_enhancements.sql` changes
✅ **Manual trigger** - Available in Actions tab
✅ **Error handling** - Ignores duplicate keys gracefully

## Next Steps

1. **If you haven't deployed yet:**
   - Go to Actions tab
   - Run "Deploy Database to Supabase (Simple)" manually
   - Check "Include sample data?" = true

2. **If you want to update sample data:**
   - Edit `sample_data_enhancements.sql`
   - Commit and push
   - Workflow will auto-deploy

3. **Verify in Supabase:**
   - Check Table Editor
   - Verify records exist in new tables

---

**Your sample data will now deploy automatically!** 🚀

