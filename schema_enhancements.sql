-- Automotive Database Schema Enhancements
-- Additional tables to enrich the database functionality
-- Run this after the base schema.sql

-- ============================================================================
-- WARRANTY MANAGEMENT
-- ============================================================================

CREATE TABLE warranty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
    warranty_type VARCHAR(50) NOT NULL, -- factory, extended, third_party
    provider_name VARCHAR(200),
    start_date DATE NOT NULL,
    end_date DATE,
    mileage_limit INTEGER,
    coverage_description TEXT,
    claim_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_warranty_vehicle ON warranty(vehicle_id);
CREATE INDEX idx_warranty_end_date ON warranty(end_date);

CREATE TABLE warranty_claim (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warranty_id UUID NOT NULL REFERENCES warranty(id) ON DELETE CASCADE,
    service_record_id UUID REFERENCES service_record(id),
    claim_date DATE NOT NULL,
    claim_amount DECIMAL(12,2),
    claim_status VARCHAR(50) DEFAULT 'pending', -- pending, approved, denied, paid
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_warranty_claim_warranty ON warranty_claim(warranty_id);
CREATE INDEX idx_warranty_claim_status ON warranty_claim(claim_status);

-- ============================================================================
-- INSURANCE MANAGEMENT
-- ============================================================================

CREATE TABLE insurance_policy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
    insurance_company VARCHAR(200) NOT NULL,
    policy_number VARCHAR(100) NOT NULL,
    policy_type VARCHAR(50), -- liability, full_coverage, comprehensive
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    premium_amount DECIMAL(12,2),
    deductible DECIMAL(12,2),
    coverage_limits JSONB, -- Store coverage details as JSON
    agent_name VARCHAR(200),
    agent_phone VARCHAR(20),
    agent_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_insurance_policy_vehicle ON insurance_policy(vehicle_id);
CREATE INDEX idx_insurance_policy_end_date ON insurance_policy(end_date);

CREATE TABLE insurance_claim (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    insurance_policy_id UUID NOT NULL REFERENCES insurance_policy(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicle(id),
    claim_date DATE NOT NULL,
    claim_number VARCHAR(100),
    incident_type VARCHAR(100), -- accident, theft, vandalism, natural_disaster
    claim_amount DECIMAL(12,2),
    claim_status VARCHAR(50) DEFAULT 'filed', -- filed, under_review, approved, denied, paid
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_insurance_claim_policy ON insurance_claim(insurance_policy_id);
CREATE INDEX idx_insurance_claim_vehicle ON insurance_claim(vehicle_id);
CREATE INDEX idx_insurance_claim_status ON insurance_claim(claim_status);

-- ============================================================================
-- VEHICLE INSPECTIONS & EMISSIONS
-- ============================================================================

CREATE TABLE inspection (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
    inspection_type VARCHAR(50) NOT NULL, -- state, emissions, safety, pre_purchase
    inspection_date DATE NOT NULL,
    expiration_date DATE,
    mileage_at_inspection INTEGER,
    inspector_name VARCHAR(200),
    inspection_station VARCHAR(200),
    passed BOOLEAN NOT NULL,
    notes TEXT,
    certificate_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inspection_vehicle ON inspection(vehicle_id);
CREATE INDEX idx_inspection_expiration ON inspection(expiration_date);
CREATE INDEX idx_inspection_type ON inspection(inspection_type);

-- ============================================================================
-- VEHICLE ACCIDENTS & DAMAGE HISTORY
-- ============================================================================

CREATE TABLE accident (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
    accident_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(500),
    accident_type VARCHAR(100), -- collision, single_vehicle, hit_and_run
    severity VARCHAR(50), -- minor, moderate, severe, total_loss
    description TEXT,
    other_party_vehicle_vin VARCHAR(17),
    other_party_name VARCHAR(200),
    other_party_insurance VARCHAR(200),
    other_party_phone VARCHAR(20),
    police_report_number VARCHAR(100),
    damage_estimate DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_accident_vehicle ON accident(vehicle_id);
CREATE INDEX idx_accident_date ON accident(accident_date);

CREATE TABLE damage_record (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    accident_id UUID REFERENCES accident(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
    damage_location VARCHAR(200), -- front_bumper, rear_door, windshield, etc.
    damage_type VARCHAR(100), -- dent, scratch, crack, paint_damage
    severity VARCHAR(50),
    repair_cost DECIMAL(12,2),
    repair_date DATE,
    repair_shop VARCHAR(200),
    before_photo_url VARCHAR(500),
    after_photo_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_damage_record_vehicle ON damage_record(vehicle_id);
CREATE INDEX idx_damage_record_accident ON damage_record(accident_id);

-- ============================================================================
-- VEHICLE FINANCING & LOANS
-- ============================================================================

CREATE TABLE financing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
    financing_type VARCHAR(50) NOT NULL, -- loan, lease, cash, trade_in
    lender_name VARCHAR(200),
    account_number VARCHAR(100),
    loan_amount DECIMAL(12,2),
    interest_rate DECIMAL(5,2),
    monthly_payment DECIMAL(12,2),
    start_date DATE NOT NULL,
    end_date DATE,
    remaining_balance DECIMAL(12,2),
    payment_frequency VARCHAR(20) DEFAULT 'monthly', -- monthly, biweekly
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_financing_vehicle ON financing(vehicle_id);
CREATE INDEX idx_financing_end_date ON financing(end_date);

CREATE TABLE payment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    financing_id UUID NOT NULL REFERENCES financing(id) ON DELETE CASCADE,
    payment_date DATE NOT NULL,
    payment_amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50), -- check, credit_card, bank_transfer
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, completed, late, missed
    due_date DATE,
    late_fee DECIMAL(12,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_financing ON payment(financing_id);
CREATE INDEX idx_payment_date ON payment(payment_date);
CREATE INDEX idx_payment_status ON payment(payment_status);

-- ============================================================================
-- VEHICLE LOCATION & GPS TRACKING
-- ============================================================================

CREATE TABLE vehicle_location (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    address VARCHAR(500),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    location_type VARCHAR(50) DEFAULT 'current' -- current, service, accident, sale
);

CREATE INDEX idx_vehicle_location_vehicle ON vehicle_location(vehicle_id);
CREATE INDEX idx_vehicle_location_recorded ON vehicle_location(recorded_at);

CREATE TABLE trip (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
    start_location VARCHAR(500),
    end_location VARCHAR(500),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    distance_miles DECIMAL(10,2),
    fuel_consumed DECIMAL(10,2),
    purpose VARCHAR(100), -- business, personal, service
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trip_vehicle ON trip(vehicle_id);
CREATE INDEX idx_trip_start_time ON trip(start_time);

-- ============================================================================
-- RECALLS & SAFETY NOTICES
-- ============================================================================

CREATE TABLE recall (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_model_id UUID REFERENCES vehicle_model(id),
    manufacturer_id UUID REFERENCES manufacturer(id),
    recall_number VARCHAR(100) NOT NULL,
    recall_date DATE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    affected_year_range VARCHAR(50),
    affected_vin_range VARCHAR(200),
    severity VARCHAR(50) DEFAULT 'medium', -- low, medium, high, critical
    remedy_description TEXT,
    status VARCHAR(50) DEFAULT 'open', -- open, resolved, closed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recall_model ON recall(vehicle_model_id);
CREATE INDEX idx_recall_manufacturer ON recall(manufacturer_id);
CREATE INDEX idx_recall_status ON recall(status);

CREATE TABLE vehicle_recall_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
    recall_id UUID NOT NULL REFERENCES recall(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'notified', -- notified, scheduled, completed, declined
    notification_date DATE,
    service_date DATE,
    completion_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(vehicle_id, recall_id)
);

CREATE INDEX idx_vehicle_recall_status_vehicle ON vehicle_recall_status(vehicle_id);
CREATE INDEX idx_vehicle_recall_status_recall ON vehicle_recall_status(recall_id);
CREATE INDEX idx_vehicle_recall_status_status ON vehicle_recall_status(status);

-- ============================================================================
-- FUEL & MAINTENANCE COSTS
-- ============================================================================

CREATE TABLE fuel_record (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
    fuel_date DATE NOT NULL,
    fuel_type VARCHAR(50) DEFAULT 'gasoline', -- gasoline, diesel, electric, hybrid
    gallons DECIMAL(10,3),
    cost_per_gallon DECIMAL(10,2),
    total_cost DECIMAL(12,2),
    odometer_reading INTEGER,
    gas_station VARCHAR(200),
    location VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fuel_record_vehicle ON fuel_record(vehicle_id);
CREATE INDEX idx_fuel_record_date ON fuel_record(fuel_date);

-- ============================================================================
-- VEHICLE DOCUMENTS
-- ============================================================================

CREATE TABLE vehicle_document (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- title, registration, bill_of_sale, insurance_card
    document_name VARCHAR(200) NOT NULL,
    file_url VARCHAR(500),
    file_size INTEGER,
    mime_type VARCHAR(100),
    issue_date DATE,
    expiration_date DATE,
    notes TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    uploaded_by VARCHAR(200) -- Could reference a user table in the future
);

CREATE INDEX idx_vehicle_document_vehicle ON vehicle_document(vehicle_id);
CREATE INDEX idx_vehicle_document_type ON vehicle_document(document_type);
CREATE INDEX idx_vehicle_document_expiration ON vehicle_document(expiration_date);

-- ============================================================================
-- VEHICLE APPRAISALS & VALUATION
-- ============================================================================

CREATE TABLE vehicle_appraisal (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
    appraisal_date DATE NOT NULL,
    appraised_value DECIMAL(12,2) NOT NULL,
    appraisal_type VARCHAR(50), -- trade_in, private_sale, insurance, tax
    appraiser_name VARCHAR(200),
    appraiser_company VARCHAR(200),
    condition_rating VARCHAR(50), -- excellent, good, fair, poor
    mileage_at_appraisal INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicle_appraisal_vehicle ON vehicle_appraisal(vehicle_id);
CREATE INDEX idx_vehicle_appraisal_date ON vehicle_appraisal(appraisal_date);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_warranty_updated_at BEFORE UPDATE ON warranty
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warranty_claim_updated_at BEFORE UPDATE ON warranty_claim
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurance_policy_updated_at BEFORE UPDATE ON insurance_policy
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurance_claim_updated_at BEFORE UPDATE ON insurance_claim
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inspection_updated_at BEFORE UPDATE ON inspection
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accident_updated_at BEFORE UPDATE ON accident
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_damage_record_updated_at BEFORE UPDATE ON damage_record
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financing_updated_at BEFORE UPDATE ON financing
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_updated_at BEFORE UPDATE ON payment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recall_updated_at BEFORE UPDATE ON recall
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_recall_status_updated_at BEFORE UPDATE ON vehicle_recall_status
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fuel_record_updated_at BEFORE UPDATE ON fuel_record
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_appraisal_updated_at BEFORE UPDATE ON vehicle_appraisal
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE warranty IS 'Tracks vehicle warranties including factory, extended, and third-party warranties';
COMMENT ON TABLE warranty_claim IS 'Records warranty claims and their status';
COMMENT ON TABLE insurance_policy IS 'Stores insurance policy information for vehicles';
COMMENT ON TABLE insurance_claim IS 'Tracks insurance claims and their processing status';
COMMENT ON TABLE inspection IS 'Records vehicle inspections including state, emissions, and safety inspections';
COMMENT ON TABLE accident IS 'Documents vehicle accidents and incidents';
COMMENT ON TABLE damage_record IS 'Records specific damage details and repairs';
COMMENT ON TABLE financing IS 'Tracks vehicle financing including loans and leases';
COMMENT ON TABLE payment IS 'Records financing payments and payment history';
COMMENT ON TABLE vehicle_location IS 'Stores vehicle location data for GPS tracking';
COMMENT ON TABLE trip IS 'Logs vehicle trips for mileage and usage tracking';
COMMENT ON TABLE recall IS 'Stores manufacturer recalls and safety notices';
COMMENT ON TABLE vehicle_recall_status IS 'Tracks recall status for individual vehicles';
COMMENT ON TABLE fuel_record IS 'Records fuel purchases and consumption';
COMMENT ON TABLE vehicle_document IS 'Stores digital copies of vehicle documents';
COMMENT ON TABLE vehicle_appraisal IS 'Tracks vehicle appraisals and valuations over time';

