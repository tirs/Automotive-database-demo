-- Automotive Database Schema
-- Supabase/PostgreSQL DDL Script
-- This script creates a normalized database schema for automotive data management

-- Enable UUID extension for generating unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE ENTITIES
-- ============================================================================

-- Manufacturer Table
-- Stores automotive brand/manufacturer information
CREATE TABLE manufacturer (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    country VARCHAR(100),
    founded_year INTEGER,
    headquarters VARCHAR(200),
    website VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vehicle Model Table
-- Stores vehicle model information linked to manufacturers
CREATE TABLE vehicle_model (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manufacturer_id UUID NOT NULL REFERENCES manufacturer(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    year_start INTEGER,
    year_end INTEGER,
    vehicle_type VARCHAR(50), -- sedan, SUV, truck, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_manufacturer_model UNIQUE (manufacturer_id, name, year_start)
);

-- Owner Table
-- Stores customer or dealership owner information
CREATE TABLE owner (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'USA',
    owner_type VARCHAR(20) NOT NULL DEFAULT 'individual' CHECK (owner_type IN ('individual', 'dealership', 'fleet')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vehicle Table
-- Stores individual vehicle information
CREATE TABLE vehicle (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vin VARCHAR(17) NOT NULL UNIQUE, -- Vehicle Identification Number (17 characters)
    vehicle_model_id UUID NOT NULL REFERENCES vehicle_model(id) ON DELETE RESTRICT,
    owner_id UUID NOT NULL REFERENCES owner(id) ON DELETE RESTRICT,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    color VARCHAR(50),
    mileage INTEGER DEFAULT 0 CHECK (mileage >= 0),
    license_plate VARCHAR(20),
    registration_state VARCHAR(50),
    purchase_date DATE,
    purchase_price DECIMAL(12, 2),
    current_value DECIMAL(12, 2),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'totaled', 'stolen')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service Center Table
-- Stores service center/dealership information
CREATE TABLE service_center (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'USA',
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Technician Table
-- Stores technician/mechanic information
CREATE TABLE technician (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_center_id UUID REFERENCES service_center(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    certification_level VARCHAR(50), -- ASE, Master Technician, etc.
    hire_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service Record Table
-- Stores maintenance and repair service records
CREATE TABLE service_record (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
    service_center_id UUID REFERENCES service_center(id) ON DELETE SET NULL,
    technician_id UUID REFERENCES technician(id) ON DELETE SET NULL,
    service_date DATE NOT NULL,
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('maintenance', 'repair', 'inspection', 'recall', 'warranty')),
    description TEXT,
    mileage_at_service INTEGER CHECK (mileage_at_service >= 0),
    labor_cost DECIMAL(10, 2) DEFAULT 0 CHECK (labor_cost >= 0),
    total_cost DECIMAL(10, 2) DEFAULT 0 CHECK (total_cost >= 0),
    warranty_covered BOOLEAN DEFAULT FALSE,
    next_service_due_date DATE,
    next_service_due_mileage INTEGER CHECK (next_service_due_mileage >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Part Table
-- Stores parts/component information
CREATE TABLE part (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_number VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    manufacturer_name VARCHAR(100), -- Part manufacturer (may differ from vehicle manufacturer)
    category VARCHAR(50), -- engine, transmission, brake, etc.
    unit_price DECIMAL(10, 2) CHECK (unit_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Service Part Junction Table
-- Many-to-many relationship between service records and parts
CREATE TABLE service_part (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_record_id UUID NOT NULL REFERENCES service_record(id) ON DELETE CASCADE,
    part_id UUID NOT NULL REFERENCES part(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_service_part UNIQUE (service_record_id, part_id)
);

-- ============================================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ============================================================================

-- Manufacturer indexes
CREATE INDEX idx_manufacturer_name ON manufacturer(name);

-- Vehicle Model indexes
CREATE INDEX idx_vehicle_model_manufacturer ON vehicle_model(manufacturer_id);
CREATE INDEX idx_vehicle_model_name ON vehicle_model(name);

-- Owner indexes
CREATE INDEX idx_owner_email ON owner(email);
CREATE INDEX idx_owner_type ON owner(owner_type);
CREATE INDEX idx_owner_name ON owner(last_name, first_name);

-- Vehicle indexes
CREATE INDEX idx_vehicle_vin ON vehicle(vin);
CREATE INDEX idx_vehicle_model ON vehicle(vehicle_model_id);
CREATE INDEX idx_vehicle_owner ON vehicle(owner_id);
CREATE INDEX idx_vehicle_year ON vehicle(year);
CREATE INDEX idx_vehicle_status ON vehicle(status);
CREATE INDEX idx_vehicle_license_plate ON vehicle(license_plate);

-- Service Center indexes
CREATE INDEX idx_service_center_name ON service_center(name);
CREATE INDEX idx_service_center_city ON service_center(city, state);

-- Technician indexes
CREATE INDEX idx_technician_service_center ON technician(service_center_id);
CREATE INDEX idx_technician_name ON technician(last_name, first_name);
CREATE INDEX idx_technician_status ON technician(status);

-- Service Record indexes
CREATE INDEX idx_service_record_vehicle ON service_record(vehicle_id);
CREATE INDEX idx_service_record_date ON service_record(service_date);
CREATE INDEX idx_service_record_type ON service_record(service_type);
CREATE INDEX idx_service_record_service_center ON service_record(service_center_id);
CREATE INDEX idx_service_record_technician ON service_record(technician_id);

-- Part indexes
CREATE INDEX idx_part_number ON part(part_number);
CREATE INDEX idx_part_name ON part(name);
CREATE INDEX idx_part_category ON part(category);

-- Service Part indexes
CREATE INDEX idx_service_part_service_record ON service_part(service_record_id);
CREATE INDEX idx_service_part_part ON service_part(part_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMP
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_manufacturer_updated_at BEFORE UPDATE ON manufacturer
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_model_updated_at BEFORE UPDATE ON vehicle_model
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_owner_updated_at BEFORE UPDATE ON owner
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_updated_at BEFORE UPDATE ON vehicle
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_center_updated_at BEFORE UPDATE ON service_center
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technician_updated_at BEFORE UPDATE ON technician
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_record_updated_at BEFORE UPDATE ON service_record
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_part_updated_at BEFORE UPDATE ON part
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE manufacturer IS 'Stores automotive brand and manufacturer information';
COMMENT ON TABLE vehicle_model IS 'Stores vehicle model information linked to manufacturers';
COMMENT ON TABLE owner IS 'Stores customer, dealership, or fleet owner information';
COMMENT ON TABLE vehicle IS 'Stores individual vehicle records with VIN and ownership details';
COMMENT ON TABLE service_center IS 'Stores service center and dealership service location information';
COMMENT ON TABLE technician IS 'Stores technician and mechanic information';
COMMENT ON TABLE service_record IS 'Stores maintenance and repair service history records';
COMMENT ON TABLE part IS 'Stores parts and component information';
COMMENT ON TABLE service_part IS 'Junction table linking service records to parts used (many-to-many relationship)';

COMMENT ON COLUMN vehicle.vin IS 'Vehicle Identification Number - 17 character unique identifier';
COMMENT ON COLUMN vehicle.status IS 'Current status: active, sold, totaled, or stolen';
COMMENT ON COLUMN service_record.service_type IS 'Type of service: maintenance, repair, inspection, recall, or warranty';
COMMENT ON COLUMN service_part.total_price IS 'Calculated field: quantity * unit_price';

