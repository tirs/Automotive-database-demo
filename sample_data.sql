-- Sample Data Insertion Script
-- This script demonstrates the database relationships with realistic sample data

-- Insert Manufacturers
INSERT INTO manufacturer (id, name, country, founded_year, headquarters, website) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Toyota', 'Japan', 1937, 'Toyota City, Aichi, Japan', 'https://www.toyota.com'),
('550e8400-e29b-41d4-a716-446655440002', 'Ford', 'USA', 1903, 'Dearborn, Michigan, USA', 'https://www.ford.com'),
('550e8400-e29b-41d4-a716-446655440003', 'BMW', 'Germany', 1916, 'Munich, Germany', 'https://www.bmw.com'),
('550e8400-e29b-41d4-a716-446655440004', 'Tesla', 'USA', 2003, 'Austin, Texas, USA', 'https://www.tesla.com');

-- Insert Vehicle Models
INSERT INTO vehicle_model (id, manufacturer_id, name, year_start, year_end, vehicle_type) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Camry', 1982, NULL, 'sedan'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'RAV4', 1994, NULL, 'SUV'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'F-150', 1975, NULL, 'truck'),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Mustang', 1964, NULL, 'coupe'),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', '3 Series', 1975, NULL, 'sedan'),
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', 'Model 3', 2017, NULL, 'sedan'),
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', 'Model Y', 2020, NULL, 'SUV');

-- Insert Owners
INSERT INTO owner (id, first_name, last_name, email, phone, address_line1, city, state, postal_code, country, owner_type) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'John', 'Smith', 'john.smith@email.com', '555-0101', '123 Main Street', 'Los Angeles', 'CA', '90001', 'USA', 'individual'),
('770e8400-e29b-41d4-a716-446655440002', 'Sarah', 'Johnson', 'sarah.johnson@email.com', '555-0102', '456 Oak Avenue', 'San Francisco', 'CA', '94102', 'USA', 'individual'),
('770e8400-e29b-41d4-a716-446655440003', 'Mike', 'Williams', 'mike.williams@email.com', '555-0103', '789 Pine Road', 'Seattle', 'WA', '98101', 'USA', 'individual'),
('770e8400-e29b-41d4-a716-446655440004', 'ABC', 'Fleet Services', 'fleet@abcservices.com', '555-0200', '1000 Corporate Blvd', 'Dallas', 'TX', '75201', 'USA', 'fleet'),
('770e8400-e29b-41d4-a716-446655440005', 'Premier', 'Auto Dealership', 'info@premierauto.com', '555-0300', '2000 Auto Mall Drive', 'Phoenix', 'AZ', '85001', 'USA', 'dealership');

-- Insert Vehicles
INSERT INTO vehicle (id, vin, vehicle_model_id, owner_id, year, color, mileage, license_plate, registration_state, purchase_date, purchase_price, current_value, status) VALUES
('880e8400-e29b-41d4-a716-446655440001', '1HGBH41JXMN109186', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 2020, 'Silver', 45000, 'ABC1234', 'CA', '2020-03-15', 28000.00, 22000.00, 'active'),
('880e8400-e29b-41d4-a716-446655440002', '5YJ3E1EA1KF123456', '660e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440002', 2019, 'Red', 32000, 'XYZ5678', 'CA', '2019-06-20', 45000.00, 35000.00, 'active'),
('880e8400-e29b-41d4-a716-446655440003', '1FTFW1ET5MFC12345', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', 2021, 'Black', 28000, 'TRK9012', 'WA', '2021-01-10', 42000.00, 38000.00, 'active'),
('880e8400-e29b-41d4-a716-446655440004', 'WBA3A5C58EF123456', '660e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440001', 2018, 'Blue', 55000, 'BMW3456', 'CA', '2018-09-05', 38000.00, 25000.00, 'active'),
('880e8400-e29b-41d4-a716-446655440005', '1HGBH41JXMN109187', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440004', 2022, 'White', 15000, 'FLE7890', 'TX', '2022-02-14', 32000.00, 28000.00, 'active'),
('880e8400-e29b-41d4-a716-446655440006', '5YJ3E1EA1KF123457', '660e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440002', 2021, 'Black', 25000, 'TES2468', 'CA', '2021-11-30', 55000.00, 48000.00, 'active');

-- Insert Service Centers
INSERT INTO service_center (id, name, address_line1, city, state, postal_code, country, phone, email, website) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Downtown Auto Service', '500 Service Street', 'Los Angeles', 'CA', '90001', 'USA', '555-1001', 'service@downtownauto.com', 'https://www.downtownauto.com'),
('990e8400-e29b-41d4-a716-446655440002', 'Premium Motors Service', '750 Repair Avenue', 'San Francisco', 'CA', '94102', 'USA', '555-1002', 'info@premiummotors.com', 'https://www.premiummotors.com'),
('990e8400-e29b-41d4-a716-446655440003', 'Quick Fix Auto', '300 Fast Lane', 'Seattle', 'WA', '98101', 'USA', '555-1003', 'contact@quickfix.com', 'https://www.quickfix.com');

-- Insert Technicians
INSERT INTO technician (id, service_center_id, first_name, last_name, email, phone, certification_level, hire_date, status) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'Robert', 'Martinez', 'robert.martinez@downtownauto.com', '555-2001', 'ASE Master Technician', '2018-01-15', 'active'),
('aa0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440001', 'Jennifer', 'Lee', 'jennifer.lee@downtownauto.com', '555-2002', 'ASE Certified', '2019-03-20', 'active'),
('aa0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440002', 'David', 'Brown', 'david.brown@premiummotors.com', '555-2003', 'ASE Master Technician', '2017-06-10', 'active'),
('aa0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440003', 'Lisa', 'Anderson', 'lisa.anderson@quickfix.com', '555-2004', 'ASE Certified', '2020-02-01', 'active');

-- Insert Parts
INSERT INTO part (id, part_number, name, description, manufacturer_name, category, unit_price) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'OIL-FILTER-001', 'Engine Oil Filter', 'Standard oil filter for most vehicles', 'Fram', 'engine', 12.99),
('bb0e8400-e29b-41d4-a716-446655440002', 'BRAKE-PAD-FRONT', 'Front Brake Pads', 'Ceramic front brake pads', 'Akebono', 'brake', 89.99),
('bb0e8400-e29b-41d4-a716-446655440003', 'AIR-FILTER-001', 'Engine Air Filter', 'High-performance air filter', 'K&N', 'engine', 45.99),
('bb0e8400-e29b-41d4-a716-446655440004', 'BATTERY-12V-001', '12V Car Battery', 'Standard 12V automotive battery', 'Interstate', 'electrical', 149.99),
('bb0e8400-e29b-41d4-a716-446655440005', 'SPARK-PLUG-001', 'Spark Plug Set', 'Set of 4 iridium spark plugs', 'NGK', 'engine', 32.99),
('bb0e8400-e29b-41d4-a716-446655440006', 'TIRE-225-60R16', 'All-Season Tire', '225/60R16 all-season tire', 'Michelin', 'tire', 125.00),
('bb0e8400-e29b-41d4-a716-446655440007', 'WIPER-BLADE-001', 'Windshield Wiper Blades', 'Pair of 24" wiper blades', 'Bosch', 'exterior', 28.99),
('bb0e8400-e29b-41d4-a716-446655440008', 'TRANSMISSION-FLUID', 'Automatic Transmission Fluid', '1 quart ATF', 'Valvoline', 'transmission', 18.99);

-- Insert Service Records
INSERT INTO service_record (id, vehicle_id, service_center_id, technician_id, service_date, service_type, description, mileage_at_service, labor_cost, total_cost, warranty_covered, next_service_due_date, next_service_due_mileage) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '2023-01-15', 'maintenance', 'Regular oil change and tire rotation', 30000, 50.00, 63.99, false, '2023-07-15', 36000),
('cc0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '2023-07-20', 'maintenance', 'Oil change, air filter replacement, and inspection', 36000, 75.00, 121.98, false, '2024-01-20', 42000),
('cc0e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440003', '2023-03-10', 'repair', 'Replaced front brake pads and rotors', 28000, 150.00, 329.97, false, NULL, NULL),
('cc0e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440004', '2023-05-05', 'maintenance', '30,000 mile service: oil change, filter, spark plugs', 30000, 120.00, 203.95, false, '2023-11-05', 36000),
('cc0e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440002', '2023-02-28', 'repair', 'Battery replacement', 50000, 30.00, 179.99, false, NULL, NULL),
('cc0e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440004', '2023-06-12', 'maintenance', 'Oil change and wiper blade replacement', 12000, 45.00, 73.98, false, '2023-12-12', 18000),
('cc0e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440003', '2023-08-15', 'inspection', 'Annual safety inspection', 35000, 25.00, 25.00, false, '2024-08-15', NULL),
('cc0e8400-e29b-41d4-a716-446655440008', '880e8400-e29b-41d4-a716-446655440006', '990e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440003', '2023-04-20', 'maintenance', 'Tire rotation and transmission fluid check', 20000, 40.00, 40.00, true, '2023-10-20', 26000);

-- Insert Service Parts (Junction Table)
INSERT INTO service_part (id, service_record_id, part_id, quantity, unit_price) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', 'cc0e8400-e29b-41d4-a716-446655440001', 'bb0e8400-e29b-41d4-a716-446655440001', 1, 12.99),
('dd0e8400-e29b-41d4-a716-446655440002', 'cc0e8400-e29b-41d4-a716-446655440002', 'bb0e8400-e29b-41d4-a716-446655440001', 1, 12.99),
('dd0e8400-e29b-41d4-a716-446655440003', 'cc0e8400-e29b-41d4-a716-446655440002', 'bb0e8400-e29b-41d4-a716-446655440003', 1, 45.99),
('dd0e8400-e29b-41d4-a716-446655440004', 'cc0e8400-e29b-41d4-a716-446655440003', 'bb0e8400-e29b-41d4-a716-446655440002', 1, 89.99),
('dd0e8400-e29b-41d4-a716-446655440005', 'cc0e8400-e29b-41d4-a716-446655440004', 'bb0e8400-e29b-41d4-a716-446655440001', 1, 12.99),
('dd0e8400-e29b-41d4-a716-446655440006', 'cc0e8400-e29b-41d4-a716-446655440004', 'bb0e8400-e29b-41d4-a716-446655440005', 1, 32.99),
('dd0e8400-e29b-41d4-a716-446655440007', 'cc0e8400-e29b-41d4-a716-446655440005', 'bb0e8400-e29b-41d4-a716-446655440004', 1, 149.99),
('dd0e8400-e29b-41d4-a716-446655440008', 'cc0e8400-e29b-41d4-a716-446655440006', 'bb0e8400-e29b-41d4-a716-446655440001', 1, 12.99),
('dd0e8400-e29b-41d4-a716-446655440009', 'cc0e8400-e29b-41d4-a716-446655440006', 'bb0e8400-e29b-41d4-a716-446655440007', 1, 28.99),
('dd0e8400-e29b-41d4-a716-446655440010', 'cc0e8400-e29b-41d4-a716-446655440008', 'bb0e8400-e29b-41d4-a716-446655440008', 2, 18.99);

-- Example Queries to Verify Data

-- View all vehicles with their owners and models
SELECT 
    v.vin,
    v.year,
    v.color,
    m.name AS manufacturer,
    vm.name AS model,
    o.first_name || ' ' || o.last_name AS owner_name,
    o.owner_type
FROM vehicle v
JOIN vehicle_model vm ON v.vehicle_model_id = vm.id
JOIN manufacturer m ON vm.manufacturer_id = m.id
JOIN owner o ON v.owner_id = o.id
ORDER BY v.year DESC;

-- View service history for a specific vehicle
SELECT 
    v.vin,
    sr.service_date,
    sr.service_type,
    sr.description,
    sr.mileage_at_service,
    sr.total_cost,
    sc.name AS service_center,
    t.first_name || ' ' || t.last_name AS technician
FROM service_record sr
JOIN vehicle v ON sr.vehicle_id = v.id
LEFT JOIN service_center sc ON sr.service_center_id = sc.id
LEFT JOIN technician t ON sr.technician_id = t.id
WHERE v.vin = '1HGBH41JXMN109186'
ORDER BY sr.service_date DESC;

-- View parts used in a service
SELECT 
    sr.service_date,
    sr.description,
    p.part_number,
    p.name AS part_name,
    sp.quantity,
    sp.unit_price,
    sp.total_price
FROM service_part sp
JOIN service_record sr ON sp.service_record_id = sr.id
JOIN part p ON sp.part_id = p.id
WHERE sr.id = 'cc0e8400-e29b-41d4-a716-446655440002'
ORDER BY p.name;

-- Service center revenue summary
SELECT 
    sc.name AS service_center,
    COUNT(sr.id) AS total_services,
    SUM(sr.total_cost) AS total_revenue,
    AVG(sr.total_cost) AS avg_service_cost
FROM service_center sc
LEFT JOIN service_record sr ON sc.id = sr.service_center_id
GROUP BY sc.id, sc.name
ORDER BY total_revenue DESC;

