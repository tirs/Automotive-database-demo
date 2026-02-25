-- Add image_url columns for vehicle and vehicle_model
-- Run this migration before seeding vehicle data with images

-- Add image_url to vehicle_model (model-level images - same for all vehicles of that model)
ALTER TABLE vehicle_model 
ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Add image_url to vehicle (individual vehicle images - overrides model image if set)
ALTER TABLE vehicle 
ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

COMMENT ON COLUMN vehicle_model.image_url IS 'URL to model image - used when vehicle has no individual image';
COMMENT ON COLUMN vehicle.image_url IS 'URL to vehicle image - overrides model image when set';
