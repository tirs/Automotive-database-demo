-- Sample Data for Enhanced Database Tables
-- Run this after schema_enhancements.sql and sample_data.sql

-- ============================================================================
-- WARRANTY DATA
-- ============================================================================

INSERT INTO warranty (id, vehicle_id, warranty_type, provider_name, start_date, end_date, mileage_limit, coverage_description, claim_count) VALUES
('w001-8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'factory', 'Toyota', '2020-03-15', '2025-03-15', 60000, 'Bumper-to-bumper warranty covering all major components', 0),
('w001-8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'factory', 'Tesla', '2019-06-20', '2024-06-20', 50000, 'Battery and drive unit warranty', 1),
('w001-8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 'extended', 'Ford Extended Care', '2021-01-10', '2026-01-10', 100000, 'Extended powertrain and comprehensive coverage', 0),
('w001-8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', 'factory', 'BMW', '2018-09-05', '2023-09-05', 50000, 'New vehicle limited warranty', 2);

INSERT INTO warranty_claim (id, warranty_id, service_record_id, claim_date, claim_amount, claim_status, description) VALUES
('wc01-8400-e29b-41d4-a716-446655440001', 'w001-8400-e29b-41d4-a716-446655440002', NULL, '2022-05-15', 1200.00, 'approved', 'Battery diagnostic and software update covered under warranty'),
('wc01-8400-e29b-41d4-a716-446655440002', 'w001-8400-e29b-41d4-a716-446655440004', NULL, '2020-11-20', 850.00, 'paid', 'Engine sensor replacement'),
('wc01-8400-e29b-41d4-a716-446655440003', 'w001-8400-e29b-41d4-a716-446655440004', NULL, '2021-08-10', 450.00, 'paid', 'Transmission fluid leak repair');

-- ============================================================================
-- INSURANCE DATA
-- ============================================================================

INSERT INTO insurance_policy (id, vehicle_id, insurance_company, policy_number, policy_type, start_date, end_date, premium_amount, deductible, coverage_limits, agent_name, agent_phone, agent_email) VALUES
('i001-8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'State Farm', 'SF-2020-123456', 'full_coverage', '2023-01-15', '2024-01-15', 1200.00, 500.00, '{"liability": "100000/300000", "comprehensive": "actual_cash_value", "collision": "actual_cash_value"}', 'John Agent', '555-3001', 'john.agent@statefarm.com'),
('i001-8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'Geico', 'GC-2019-789012', 'comprehensive', '2023-06-01', '2024-06-01', 1800.00, 1000.00, '{"liability": "250000/500000", "comprehensive": "replacement_cost", "collision": "replacement_cost"}', 'Sarah Broker', '555-3002', 'sarah@geico.com'),
('i001-8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 'Progressive', 'PR-2021-345678', 'full_coverage', '2023-01-10', '2024-01-10', 1500.00, 750.00, '{"liability": "100000/300000", "comprehensive": "actual_cash_value", "collision": "actual_cash_value"}', 'Mike Insurance', '555-3003', 'mike@progressive.com'),
('i001-8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', 'Allstate', 'AL-2018-901234', 'full_coverage', '2023-09-01', '2024-09-01', 1400.00, 500.00, '{"liability": "100000/300000", "comprehensive": "actual_cash_value", "collision": "actual_cash_value"}', 'Lisa Rep', '555-3004', 'lisa@allstate.com');

INSERT INTO insurance_claim (id, insurance_policy_id, vehicle_id, claim_date, claim_number, incident_type, claim_amount, claim_status, description) VALUES
('ic01-8400-e29b-41d4-a716-446655440001', 'i001-8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', '2021-03-20', 'AL-CL-2021-001', 'accident', 3500.00, 'paid', 'Rear-end collision, bumper and trunk damage'),
('ic01-8400-e29b-41d4-a716-446655440002', 'i001-8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '2022-11-15', 'SF-CL-2022-045', 'vandalism', 1200.00, 'approved', 'Keyed paint damage on driver side');

-- ============================================================================
-- INSPECTION DATA
-- ============================================================================

INSERT INTO inspection (id, vehicle_id, inspection_type, inspection_date, expiration_date, mileage_at_inspection, inspector_name, inspection_station, passed, notes, certificate_number) VALUES
('in01-8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'state', '2023-01-10', '2025-01-10', 45000, 'Robert Inspector', 'CA State Inspection Station #45', true, 'All systems passed', 'CA-INSP-2023-001234'),
('in01-8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'emissions', '2023-06-15', '2025-06-15', 32000, 'Jennifer Tester', 'CA Emissions Testing Center', true, 'Emissions within acceptable limits', 'CA-EM-2023-005678'),
('in01-8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 'state', '2023-01-05', '2025-01-05', 28000, 'David Checker', 'WA State Inspection', true, 'Vehicle in excellent condition', 'WA-INSP-2023-009012'),
('in01-8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', 'safety', '2022-09-01', '2024-09-01', 55000, 'Lisa Examiner', 'Premium Motors Service', true, 'Safety inspection completed', 'SAFE-2022-003456');

-- ============================================================================
-- ACCIDENT DATA
-- ============================================================================

INSERT INTO accident (id, vehicle_id, accident_date, location, accident_type, severity, description, other_party_vehicle_vin, other_party_name, other_party_insurance, other_party_phone, police_report_number, damage_estimate) VALUES
('ac01-8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440004', '2021-03-20 14:30:00', 'Highway 101, Los Angeles, CA', 'collision', 'moderate', 'Rear-end collision at traffic light', '1HGBH41JXMN109188', 'Jane Doe', 'Progressive Insurance', '555-4001', 'LAPD-2021-12345', 3500.00),
('ac01-8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', '2022-11-15 20:00:00', 'Parking lot, San Francisco, CA', 'vandalism', 'minor', 'Keyed paint damage on driver side doors', NULL, 'Unknown', NULL, NULL, 'SFPD-2022-67890', 1200.00);

INSERT INTO damage_record (id, accident_id, vehicle_id, damage_location, damage_type, severity, repair_cost, repair_date, repair_shop, notes) VALUES
('dr01-8400-e29b-41d4-a716-446655440001', 'ac01-8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440004', 'rear_bumper', 'dent', 'moderate', 1200.00, '2021-04-05', 'Premium Motors Service', 'Bumper replacement and paint'),
('dr01-8400-e29b-41d4-a716-446655440002', 'ac01-8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440004', 'trunk_lid', 'dent', 'moderate', 800.00, '2021-04-05', 'Premium Motors Service', 'Trunk lid repair'),
('dr01-8400-e29b-41d4-a716-446655440003', 'ac01-8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440004', 'rear_quarter_panel', 'scratch', 'minor', 500.00, '2021-04-05', 'Premium Motors Service', 'Paint touch-up'),
('dr01-8400-e29b-41d4-a716-446655440004', 'ac01-8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', 'driver_door', 'scratch', 'minor', 600.00, '2022-12-01', 'Downtown Auto Service', 'Paint repair and clear coat'),
('dr01-8400-e29b-41d4-a716-446655440005', 'ac01-8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', 'rear_door', 'scratch', 'minor', 600.00, '2022-12-01', 'Downtown Auto Service', 'Paint repair and clear coat');

-- ============================================================================
-- FINANCING DATA
-- ============================================================================

INSERT INTO financing (id, vehicle_id, financing_type, lender_name, account_number, loan_amount, interest_rate, monthly_payment, start_date, end_date, remaining_balance, payment_frequency) VALUES
('fi01-8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'loan', 'Toyota Financial Services', 'TFS-2020-001234', 25000.00, 3.5, 450.00, '2020-03-15', '2025-03-15', 12000.00, 'monthly'),
('fi01-8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'loan', 'Tesla Financing', 'TSLA-2019-005678', 40000.00, 2.9, 750.00, '2019-06-20', '2024-06-20', 15000.00, 'monthly'),
('fi01-8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 'loan', 'Ford Credit', 'FC-2021-009012', 35000.00, 4.2, 650.00, '2021-01-10', '2026-01-10', 28000.00, 'monthly'),
('fi01-8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', 'cash', NULL, NULL, 38000.00, 0, 0, '2018-09-05', NULL, 0, NULL);

INSERT INTO payment (id, financing_id, payment_date, payment_amount, payment_method, payment_status, due_date, late_fee, notes) VALUES
('pa01-8400-e29b-41d4-a716-446655440001', 'fi01-8400-e29b-41d4-a716-446655440001', '2023-12-15', 450.00, 'bank_transfer', 'completed', '2023-12-15', 0, 'Monthly payment'),
('pa01-8400-e29b-41d4-a716-446655440002', 'fi01-8400-e29b-41d4-a716-446655440001', '2023-11-15', 450.00, 'bank_transfer', 'completed', '2023-11-15', 0, 'Monthly payment'),
('pa01-8400-e29b-41d4-a716-446655440003', 'fi01-8400-e29b-41d4-a716-446655440002', '2023-12-20', 750.00, 'credit_card', 'completed', '2023-12-20', 0, 'Monthly payment'),
('pa01-8400-e29b-41d4-a716-446655440004', 'fi01-8400-e29b-41d4-a716-446655440003', '2023-12-10', 650.00, 'bank_transfer', 'completed', '2023-12-10', 0, 'Monthly payment'),
('pa01-8400-e29b-41d4-a716-446655440005', 'fi01-8400-e29b-41d4-a716-446655440001', '2024-01-15', 450.00, 'bank_transfer', 'pending', '2024-01-15', 0, 'Upcoming payment');

-- ============================================================================
-- LOCATION DATA
-- ============================================================================

INSERT INTO vehicle_location (id, vehicle_id, latitude, longitude, address, recorded_at, location_type) VALUES
('vl01-8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 34.0522, -118.2437, '123 Main Street, Los Angeles, CA 90001', CURRENT_TIMESTAMP, 'current'),
('vl01-8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 37.7749, -122.4194, '456 Oak Avenue, San Francisco, CA 94102', CURRENT_TIMESTAMP, 'current'),
('vl01-8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 47.6062, -122.3321, '789 Pine Road, Seattle, WA 98101', CURRENT_TIMESTAMP, 'current');

INSERT INTO trip (id, vehicle_id, start_location, end_location, start_time, end_time, distance_miles, fuel_consumed, purpose) VALUES
('tr01-8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'Los Angeles, CA', 'San Diego, CA', '2023-12-01 08:00:00', '2023-12-01 11:30:00', 120.5, 4.2, 'business'),
('tr01-8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'San Francisco, CA', 'Palo Alto, CA', '2023-12-05 09:00:00', '2023-12-05 10:15:00', 35.2, 0, 'business'),
('tr01-8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 'Seattle, WA', 'Tacoma, WA', '2023-12-10 07:30:00', '2023-12-10 08:45:00', 32.8, 1.8, 'personal');

-- ============================================================================
-- RECALL DATA
-- ============================================================================

INSERT INTO recall (id, vehicle_model_id, manufacturer_id, recall_number, recall_date, title, description, affected_year_range, affected_vin_range, severity, remedy_description, status) VALUES
('rc01-8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '23V-123', '2023-03-15', 'Airbag Sensor Recall', 'Potential issue with airbag sensor that may not deploy in certain crash scenarios', '2020-2022', NULL, 'high', 'Replace airbag sensor module at authorized dealer', 'open'),
('rc01-8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', '23V-456', '2023-06-20', 'Battery Management Software Update', 'Software update required for battery management system', '2019-2021', NULL, 'medium', 'Free software update at Tesla service center', 'open'),
('rc01-8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '23V-789', '2023-08-10', 'Brake Line Inspection', 'Potential brake line corrosion in certain models', '2021-2022', NULL, 'high', 'Inspect and replace brake lines if necessary', 'open');

INSERT INTO vehicle_recall_status (id, vehicle_id, recall_id, status, notification_date, service_date, completion_date, notes) VALUES
('vrs01-8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'rc01-8400-e29b-41d4-a716-446655440001', 'scheduled', '2023-03-20', '2024-01-15', NULL, 'Scheduled for service next month'),
('vrs01-8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'rc01-8400-e29b-41d4-a716-446655440002', 'completed', '2023-06-25', '2023-07-10', '2023-07-10', 'Software update completed successfully'),
('vrs01-8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 'rc01-8400-e29b-41d4-a716-446655440003', 'notified', '2023-08-15', NULL, NULL, 'Owner notified, awaiting scheduling');

-- ============================================================================
-- FUEL RECORD DATA
-- ============================================================================

INSERT INTO fuel_record (id, vehicle_id, fuel_date, fuel_type, gallons, cost_per_gallon, total_cost, odometer_reading, gas_station, location) VALUES
('fr01-8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '2023-12-01', 'gasoline', 12.5, 4.25, 53.13, 45000, 'Shell', '123 Main St, Los Angeles, CA'),
('fr01-8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', '2023-12-15', 'gasoline', 11.8, 4.30, 50.74, 45200, 'Chevron', '456 Oak Ave, Los Angeles, CA'),
('fr01-8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', '2023-12-05', 'gasoline', 18.2, 4.20, 76.44, 28000, 'BP', '789 Pine Rd, Seattle, WA'),
('fr01-8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440002', '2023-12-10', 'electric', 0, 0.15, 8.50, 32000, 'Tesla Supercharger', '100 Electric Ave, San Francisco, CA');

-- ============================================================================
-- DOCUMENT DATA
-- ============================================================================

INSERT INTO vehicle_document (id, vehicle_id, document_type, document_name, file_url, file_size, mime_type, issue_date, expiration_date, notes, uploaded_by) VALUES
('vd01-8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'title', 'Vehicle Title - 1HGBH41JXMN109186', 'https://example.com/documents/title-001.pdf', 245760, 'application/pdf', '2020-03-15', NULL, 'Original vehicle title', 'System'),
('vd01-8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', 'registration', 'CA Registration 2024', 'https://example.com/documents/reg-001.pdf', 189440, 'application/pdf', '2023-12-01', '2024-12-01', 'Current registration', 'System'),
('vd01-8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440002', 'title', 'Vehicle Title - 5YJ3E1EA1KF123456', 'https://example.com/documents/title-002.pdf', 245760, 'application/pdf', '2019-06-20', NULL, 'Original vehicle title', 'System'),
('vd01-8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440003', 'bill_of_sale', 'Bill of Sale - F-150', 'https://example.com/documents/bill-003.pdf', 156672, 'application/pdf', '2021-01-10', NULL, 'Purchase documentation', 'System');

-- ============================================================================
-- APPRAISAL DATA
-- ============================================================================

INSERT INTO vehicle_appraisal (id, vehicle_id, appraisal_date, appraised_value, appraisal_type, appraiser_name, appraiser_company, condition_rating, mileage_at_appraisal, notes) VALUES
('ap01-8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '2023-11-01', 22000.00, 'trade_in', 'John Appraiser', 'AutoValue Appraisals', 'good', 45000, 'Vehicle in good condition, minor wear'),
('ap01-8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', '2023-10-15', 35000.00, 'private_sale', 'Sarah Valuer', 'CarValue Experts', 'excellent', 32000, 'Well-maintained, low mileage'),
('ap01-8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', '2023-12-01', 38000.00, 'insurance', 'Mike Assessor', 'Insurance Appraisal Services', 'excellent', 28000, 'Recent model, excellent condition'),
('ap01-8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', '2023-09-20', 25000.00, 'trade_in', 'Lisa Evaluator', 'Trade-In Specialists', 'good', 55000, 'Good condition, some wear expected for age');

