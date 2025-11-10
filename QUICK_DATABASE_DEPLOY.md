# Quick Database Deployment Guide

## Option 1: GitHub Actions (Automatic) ⚡

### Setup (One Time)

1. **Get Supabase Connection String**:
   - Go to Supabase Dashboard → Settings → Database
   - Copy the **URI** connection string
   - Format: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

2. **Add GitHub Secret**:
   - GitHub Repo → Settings → Secrets and variables → Actions
   - New secret: `SUPABASE_DB_URL`
   - Paste your connection string

3. **Done!** Now every push to schema files auto-deploys.

### Manual Trigger

- Go to **Actions** tab
- Select **Deploy Database to Supabase (Simple)**
- Click **Run workflow**

---

## Option 2: Supabase SQL Editor (Manual) 📝

1. Go to Supabase Dashboard
2. Click **SQL Editor**
3. Copy and paste `schema.sql` → Run
4. Copy and paste `schema_enhancements.sql` → Run
5. (Optional) Run sample data scripts

---

## Option 3: Supabase CLI (Local) 💻

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy schema
supabase db push
```

---

## Which Method to Use?

- **GitHub Actions**: Best for automation and CI/CD
- **SQL Editor**: Quickest for one-time setup
- **Supabase CLI**: Best for local development

---

## Troubleshooting

**Connection errors?**
- Verify connection string format
- Check password is correct
- Ensure Supabase project is active

**Tables already exist?**
- This is normal - workflow handles it gracefully
- To reset: Drop tables manually first

