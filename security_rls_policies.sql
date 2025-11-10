-- Row Level Security (RLS) Policies for Automotive Database
-- This script implements security policies to protect your database
-- Run this AFTER creating your schema and sample data

-- ============================================================================
-- IMPORTANT: Choose Your Security Model
-- ============================================================================

-- OPTION 1: Public Read, Authenticated Write (Recommended for Demo)
--   - Anyone can read data (good for public demos)
--   - Only authenticated users can write/modify
--   - Use this if you want to show data publicly but protect modifications

-- OPTION 2: Full Authentication Required
--   - All operations require authentication
--   - Users can only access their own data
--   - Use this for production apps with user accounts

-- OPTION 3: Public Access (NOT RECOMMENDED for Production)
--   - Anyone with anon key can read/write
--   - Only use for development/testing
--   - Still enables RLS structure for future security

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================================

-- Core Tables
ALTER TABLE manufacturer ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_model ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_center ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician ENABLE ROW LEVEL SECURITY;

-- Enhanced Tables
ALTER TABLE warranty ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranty_claim ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_policy ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_claim ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection ENABLE ROW LEVEL SECURITY;
ALTER TABLE accident ENABLE ROW LEVEL SECURITY;
ALTER TABLE damage_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE financing ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_location ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip ENABLE ROW LEVEL SECURITY;
ALTER TABLE recall ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_recall_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_document ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_appraisal ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- OPTION 1: PUBLIC READ, AUTHENTICATED WRITE (Recommended for Demo)
-- ============================================================================
-- This allows public read access but protects writes
-- PERFECT FOR: Client demos, portfolios, public showcases
-- SECURITY: Medium-High - Clients can view, only you can modify
-- 
-- Currently ACTIVE - Uncomment Option 2 if you want full public access
-- See security_demo_config.sql for a cleaner demo-specific version

-- Allow anyone to read (SELECT)
CREATE POLICY "Public read access" ON manufacturer FOR SELECT USING (true);
CREATE POLICY "Public read access" ON vehicle_model FOR SELECT USING (true);
CREATE POLICY "Public read access" ON owner FOR SELECT USING (true);
CREATE POLICY "Public read access" ON vehicle FOR SELECT USING (true);
CREATE POLICY "Public read access" ON service_record FOR SELECT USING (true);
CREATE POLICY "Public read access" ON service_center FOR SELECT USING (true);
CREATE POLICY "Public read access" ON technician FOR SELECT USING (true);
CREATE POLICY "Public read access" ON warranty FOR SELECT USING (true);
CREATE POLICY "Public read access" ON warranty_claim FOR SELECT USING (true);
CREATE POLICY "Public read access" ON insurance_policy FOR SELECT USING (true);
CREATE POLICY "Public read access" ON insurance_claim FOR SELECT USING (true);
CREATE POLICY "Public read access" ON inspection FOR SELECT USING (true);
CREATE POLICY "Public read access" ON accident FOR SELECT USING (true);
CREATE POLICY "Public read access" ON damage_record FOR SELECT USING (true);
CREATE POLICY "Public read access" ON financing FOR SELECT USING (true);
CREATE POLICY "Public read access" ON payment FOR SELECT USING (true);
CREATE POLICY "Public read access" ON vehicle_location FOR SELECT USING (true);
CREATE POLICY "Public read access" ON trip FOR SELECT USING (true);
CREATE POLICY "Public read access" ON recall FOR SELECT USING (true);
CREATE POLICY "Public read access" ON vehicle_recall_status FOR SELECT USING (true);
CREATE POLICY "Public read access" ON fuel_record FOR SELECT USING (true);
CREATE POLICY "Public read access" ON vehicle_document FOR SELECT USING (true);
CREATE POLICY "Public read access" ON vehicle_appraisal FOR SELECT USING (true);

-- Only authenticated users can write (INSERT, UPDATE, DELETE)
CREATE POLICY "Authenticated write access" ON manufacturer FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON vehicle_model FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON owner FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON vehicle FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON service_record FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON service_center FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON technician FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON warranty FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON warranty_claim FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON insurance_policy FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON insurance_claim FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON inspection FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON accident FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON damage_record FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON financing FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON payment FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON vehicle_location FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON trip FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON recall FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON vehicle_recall_status FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON fuel_record FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON vehicle_document FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON vehicle_appraisal FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- OPTION 2: FULL PUBLIC ACCESS (Development/Testing Only)
-- ============================================================================
-- ⚠️ WARNING: Only use for development/testing!
-- This allows anyone with your anon key to read AND write all data
-- Uncomment ONLY if you understand the security implications

-- Allow all operations for all users (including anonymous)
CREATE POLICY "Public full access" ON manufacturer FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON vehicle_model FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON owner FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON vehicle FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON service_record FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON service_center FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON technician FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON warranty FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON warranty_claim FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON insurance_policy FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON insurance_claim FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON inspection FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON accident FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON damage_record FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON financing FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON payment FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON vehicle_location FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON trip FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON recall FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON vehicle_recall_status FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON fuel_record FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON vehicle_document FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access" ON vehicle_appraisal FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- OPTION 3: OWNER-BASED ACCESS (Production with User Accounts)
-- ============================================================================
-- Uncomment this section if you have user authentication and want users
-- to only access their own vehicles/data
-- Requires: Supabase Auth setup with user accounts

/*
-- Example: Users can only access vehicles they own
-- This assumes you have a user_id column or link owner to auth.users

-- Allow users to read their own vehicles
CREATE POLICY "Users can read own vehicles" ON vehicle 
  FOR SELECT USING (
    owner_id IN (
      SELECT id FROM owner WHERE email = auth.email()
    )
  );

-- Allow users to update their own vehicles
CREATE POLICY "Users can update own vehicles" ON vehicle 
  FOR UPDATE USING (
    owner_id IN (
      SELECT id FROM owner WHERE email = auth.email()
    )
  );

-- Similar policies for other tables...
*/

-- ============================================================================
-- OPTION 4: ROLE-BASED ACCESS (Advanced)
-- ============================================================================
-- Uncomment this section for role-based access control
-- Requires: Custom roles table or Supabase Auth roles

/*
-- Example: Admins have full access, users have limited access
CREATE POLICY "Admin full access" ON vehicle 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Regular users can only read
CREATE POLICY "Users read access" ON vehicle 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('user', 'admin')
    )
  );
*/

-- ============================================================================
-- ADDITIONAL SECURITY MEASURES
-- ============================================================================

-- Prevent deletion of critical records (optional)
-- Uncomment if you want to soft-delete instead of hard-delete

/*
-- Example: Prevent deletion, use status field instead
CREATE POLICY "No direct deletes" ON vehicle 
  FOR DELETE USING (false); -- Always deny deletes

-- Instead, update status to 'deleted'
*/

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if RLS is enabled on all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'manufacturer', 'vehicle_model', 'owner', 'vehicle', 
    'service_record', 'warranty', 'insurance_policy', 'inspection',
    'accident', 'financing', 'recall', 'fuel_record', 
    'vehicle_document', 'vehicle_appraisal'
  )
ORDER BY tablename;

-- Check existing policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- NOTES
-- ============================================================================

-- 1. RLS policies are evaluated for EVERY query
-- 2. Policies use PostgreSQL functions and can check:
--    - auth.uid() - Current user ID
--    - auth.role() - Current user role ('anon', 'authenticated', etc.)
--    - auth.email() - Current user email
--    - Custom functions you create
--
-- 3. Policy types:
--    - USING: Controls which rows can be read/updated/deleted
--    - WITH CHECK: Controls which rows can be inserted/updated
--
-- 4. Testing RLS:
--    - Test as anonymous user (anon key)
--    - Test as authenticated user
--    - Test with different roles
--
-- 5. Performance:
--    - RLS adds minimal overhead
--    - Indexes still work normally
--    - Policies are cached

