# Troubleshooting: Sample Data Not Showing in Frontend

## Problem
GitHub Actions shows green checkmarks, but the frontend shows empty data for enhancement tables (warranties, accidents, insurance, etc.).

## Quick Fix

### Step 1: Check Workflow Logs

1. Go to **GitHub Actions** tab
2. Click on the latest workflow run
3. Expand **"Deploy Sample Data"** step
4. Look for:
   - ✅ "Running sample_data_enhancements.sql..."
   - ✅ Any ERROR messages (not just "duplicate key")
   - ✅ "✓ Enhanced sample data deployment completed"

5. Expand **"Verify Tables and Data"** step
6. Check the record counts:
   - Warranty records: Should be > 0
   - Accident records: Should be > 0
   - Insurance records: Should be > 0

### Step 2: Common Issues

#### Issue 1: Foreign Key Errors
**Symptom:** Errors about vehicle_id not existing

**Solution:** Base sample data must be deployed first
```bash
# Make sure sample_data.sql ran successfully first
# The enhancement data depends on vehicles from sample_data.sql
```

#### Issue 2: Data Already Exists
**Symptom:** "duplicate key" errors (this is OK, but data might not be visible)

**Solution:** Check if data actually exists:
1. Go to Supabase Dashboard
2. Open Table Editor
3. Check `warranty`, `accident`, `insurance_policy` tables
4. If empty, the INSERTs failed silently

#### Issue 3: Workflow Not Running Sample Data Step
**Symptom:** "Deploy Sample Data" step is skipped

**Solution:** Manually trigger with sample data enabled:
1. Go to Actions → "Deploy Database to Supabase (Simple)"
2. Click "Run workflow"
3. Check "Include sample data?" = true
4. Run

## Manual Deployment (If Workflow Fails)

### Option 1: Supabase SQL Editor

1. Go to Supabase Dashboard
2. Click **SQL Editor**
3. Copy entire `sample_data_enhancements.sql` file
4. Paste and run
5. Check for errors (they'll be visible here)

### Option 2: Check Dependencies

The sample data requires:
- ✅ `schema_enhancements.sql` must be run first (creates tables)
- ✅ `sample_data.sql` must be run first (creates vehicles/owners)

**Order:**
1. `schema.sql`
2. `schema_enhancements.sql`
3. `sample_data.sql`
4. `sample_data_enhancements.sql`

## Verify Data Exists

### In Supabase Dashboard:

1. **Table Editor** → Check these tables:
   - `warranty` (should have 4 records)
   - `accident` (should have 2 records)
   - `insurance_policy` (should have 4 records)
   - `inspection` (should have 4 records)
   - `fuel_record` (should have 4 records)
   - etc.

2. **SQL Editor** → Run:
   ```sql
   SELECT COUNT(*) FROM warranty;
   SELECT COUNT(*) FROM accident;
   SELECT COUNT(*) FROM insurance_policy;
   ```

### In Frontend:

1. Go to **Warranties** page - should show 4 warranties
2. Go to **Accidents** page - should show 2 accidents
3. Go to **Insurance** page - should show 4 policies

## Force Re-Deploy

If data is missing:

1. **Option A: Clear and Re-deploy**
   ```sql
   -- In Supabase SQL Editor, run:
   TRUNCATE TABLE warranty, accident, insurance_policy, inspection, financing, recall, fuel_record, vehicle_document, vehicle_appraisal CASCADE;
   ```
   Then re-run the workflow

2. **Option B: Update File to Trigger**
   - Add a comment to `sample_data_enhancements.sql`
   - Commit and push
   - Workflow will re-run

## Check Workflow Output

The updated workflow now shows:
- ✅ Full SQL output (not filtered)
- ✅ Record count verification
- ✅ Warnings if no data found

**Look for these in logs:**
```
Warranty records: 4
Accident records: 2
Insurance records: 4
✓ Sample data verification successful!
```

If you see:
```
Warranty records: 0
Accident records: 0
⚠ WARNING: No sample data found in enhancement tables!
```

Then the INSERTs failed - check the full SQL output above for errors.

## Next Steps

1. **Run the workflow manually** with sample data enabled
2. **Check the "Verify Tables and Data" step** for record counts
3. **If counts are 0**, check the "Deploy Sample Data" step for errors
4. **If still empty**, deploy manually via Supabase SQL Editor

---

**The workflow now has better error reporting - check the logs!**

