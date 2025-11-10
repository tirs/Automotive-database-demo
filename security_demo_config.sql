-- Security Configuration for Client Demo
-- This is the RECOMMENDED configuration for a public demo/portfolio
-- Allows clients to view all data, but protects against unauthorized modifications

-- ============================================================================
-- STEP 1: ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================================

ALTER TABLE manufacturer ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_model ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_center ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician ENABLE ROW LEVEL SECURITY;
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
-- STEP 2: ALLOW PUBLIC READ ACCESS (Clients can view everything)
-- ============================================================================

-- Anyone can read all data (perfect for demos)
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

-- ============================================================================
-- STEP 3: PROTECT WRITES (Choose ONE option below)
-- ============================================================================

-- OPTION A: NO WRITES ALLOWED (Safest for Demo)
-- Prevents anyone from modifying data - even you
-- Use this if you only want clients to VIEW the demo
-- Uncomment the lines below:

/*
CREATE POLICY "No writes allowed" ON manufacturer FOR INSERT WITH CHECK (false);
CREATE POLICY "No writes allowed" ON manufacturer FOR UPDATE USING (false);
CREATE POLICY "No writes allowed" ON manufacturer FOR DELETE USING (false);
-- Repeat for all tables...
*/

-- OPTION B: AUTHENTICATED WRITES ONLY (Recommended)
-- Only logged-in users can modify data
-- You can log in to make changes, but clients cannot
-- This is the DEFAULT and is already active below:

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
-- VERIFICATION
-- ============================================================================

-- Check RLS is enabled
SELECT 
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

-- Check policies are created
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

