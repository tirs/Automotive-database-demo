-- Seed script: Add vehicle model images and extra models
-- Run in order: 1) schema.sql 2) sample_data.sql 3) migrations/add_vehicle_images.sql 4) this script
-- For 10K-1M vehicles: node scripts/seedVehicles.js [count]

-- Additional manufacturers for variety
INSERT INTO manufacturer (id, name, country, founded_year, headquarters, website) VALUES
('550e8400-e29b-41d4-a716-446655440005', 'Honda', 'Japan', 1948, 'Tokyo, Japan', 'https://www.honda.com'),
('550e8400-e29b-41d4-a716-446655440006', 'Chevrolet', 'USA', 1911, 'Detroit, Michigan, USA', 'https://www.chevrolet.com'),
('550e8400-e29b-41d4-a716-446655440007', 'Mercedes-Benz', 'Germany', 1926, 'Stuttgart, Germany', 'https://www.mercedes-benz.com'),
('550e8400-e29b-41d4-a716-446655440008', 'Audi', 'Germany', 1909, 'Ingolstadt, Germany', 'https://www.audi.com'),
('550e8400-e29b-41d4-a716-446655440009', 'Lamborghini', 'Italy', 1963, 'Sant''Agata Bolognese, Italy', 'https://www.lamborghini.com')
ON CONFLICT (name) DO NOTHING;

-- Additional vehicle models with images (2024-2025 latest)
INSERT INTO vehicle_model (manufacturer_id, name, year_start, year_end, vehicle_type, image_url)
SELECT m.id, v.name, v.year_start, NULL, v.vehicle_type, v.image_url FROM (VALUES
  ('Toyota', 'Corolla', 1966, 'sedan', 'https://images.pexels.com/photos/112452/pexels-photo-112452.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Toyota', 'Highlander', 2000, 'SUV', 'https://images.pexels.com/photos/909907/pexels-photo-909907.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Honda', 'Civic', 1972, 'sedan', 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Honda', 'Accord', 1976, 'sedan', 'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Honda', 'CR-V', 1995, 'SUV', 'https://images.pexels.com/photos/3752193/pexels-photo-3752193.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Ford', 'Explorer', 1990, 'SUV', 'https://images.pexels.com/photos/733745/pexels-photo-733745.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Ford', 'Bronco', 1965, 'SUV', 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Chevrolet', 'Silverado', 1998, 'truck', 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Chevrolet', 'Equinox', 2004, 'SUV', 'https://images.pexels.com/photos/112452/pexels-photo-112452.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Tesla', 'Model S', 2012, 'sedan', 'https://images.pexels.com/photos/15089585/pexels-photo-15089585.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Tesla', 'Model X', 2015, 'SUV', 'https://images.pexels.com/photos/15089585/pexels-photo-15089585.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Tesla', 'Cybertruck', 2023, 'truck', 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Lamborghini', 'Aventador', 2011, 'coupe', 'https://images.pexels.com/photos/39501/lamborghini-brno-racing-car-automobiles-39501.jpeg?auto=compress&cs=tinysrgb&w=600')
) AS v(mfr, name, year_start, vehicle_type, image_url)
JOIN manufacturer m ON m.name = v.mfr
ON CONFLICT (manufacturer_id, name, year_start) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Update existing vehicle_models with image_url (for models that don't have it in INSERT)
UPDATE vehicle_model SET image_url = 'https://images.pexels.com/photos/112452/pexels-photo-112452.jpeg?auto=compress&cs=tinysrgb&w=600' WHERE name = 'Camry' AND image_url IS NULL;
UPDATE vehicle_model SET image_url = 'https://images.pexels.com/photos/909907/pexels-photo-909907.jpeg?auto=compress&cs=tinysrgb&w=600' WHERE name = 'RAV4' AND image_url IS NULL;
UPDATE vehicle_model SET image_url = 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=600' WHERE name = 'F-150' AND image_url IS NULL;
UPDATE vehicle_model SET image_url = 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600' WHERE name = 'Mustang' AND image_url IS NULL;
UPDATE vehicle_model SET image_url = 'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=600' WHERE name = '3 Series' AND image_url IS NULL;
UPDATE vehicle_model SET image_url = 'https://images.pexels.com/photos/15089585/pexels-photo-15089585.jpeg?auto=compress&cs=tinysrgb&w=600' WHERE name = 'Model 3' AND image_url IS NULL;
UPDATE vehicle_model SET image_url = 'https://images.pexels.com/photos/15089585/pexels-photo-15089585.jpeg?auto=compress&cs=tinysrgb&w=600' WHERE name = 'Model Y' AND image_url IS NULL;

-- Lamborghini Aventador (orange hero image)
UPDATE vehicle_model SET image_url = 'https://images.pexels.com/photos/39501/lamborghini-brno-racing-car-automobiles-39501.jpeg?auto=compress&cs=tinysrgb&w=600' WHERE name = 'Aventador' AND image_url IS NULL;
