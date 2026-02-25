/**
 * Seed script: Add millions of vehicles with latest models and images
 *
 * Usage (run from demo folder):
 *   npm run seed              # Default: 10,000 vehicles
 *   npm run seed -- 50000     # 50,000 vehicles
 *   npm run seed -- 1000000   # 1 million vehicles
 *
 * Requires: REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in .env
 * Run migrations/add_vehicle_images.sql first
 */

// Load .env from demo folder
try {
  require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
} catch (_) {}
const { createClient } = require('@supabase/supabase-js');

const BATCH_SIZE = 500;
const VIN_CHARS = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789'; // No I, O, Q per VIN spec

function generateVIN() {
  let vin = '';
  for (let i = 0; i < 17; i++) {
    vin += VIN_CHARS[Math.floor(Math.random() * VIN_CHARS.length)];
  }
  return vin;
}

// Model image URLs - maps model name to image
const MODEL_IMAGES = {
  'Camry': 'https://images.pexels.com/photos/112452/pexels-photo-112452.jpeg?auto=compress&cs=tinysrgb&w=600',
  'RAV4': 'https://images.pexels.com/photos/909907/pexels-photo-909907.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Corolla': 'https://images.pexels.com/photos/112452/pexels-photo-112452.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Highlander': 'https://images.pexels.com/photos/909907/pexels-photo-909907.jpeg?auto=compress&cs=tinysrgb&w=600',
  'F-150': 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Mustang': 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Explorer': 'https://images.pexels.com/photos/733745/pexels-photo-733745.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Bronco': 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
  '3 Series': 'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Model 3': 'https://images.pexels.com/photos/15089585/pexels-photo-15089585.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Model Y': 'https://images.pexels.com/photos/15089585/pexels-photo-15089585.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Model S': 'https://images.pexels.com/photos/15089585/pexels-photo-15089585.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Model X': 'https://images.pexels.com/photos/15089585/pexels-photo-15089585.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Civic': 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Accord': 'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=600',
  'CR-V': 'https://images.pexels.com/photos/3752193/pexels-photo-3752193.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Silverado': 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Equinox': 'https://images.pexels.com/photos/112452/pexels-photo-112452.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Cybertruck': 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Aventador': 'https://images.pexels.com/photos/39501/lamborghini-brno-racing-car-automobiles-39501.jpeg?auto=compress&cs=tinysrgb&w=600',
};

const COLORS = ['Black', 'White', 'Silver', 'Gray', 'Blue', 'Red', 'Green', 'Brown', 'Orange', 'Gold'];
const STATES = ['CA', 'TX', 'FL', 'NY', 'WA', 'AZ', 'CO', 'GA', 'IL', 'OH', 'PA', 'NC'];

async function main() {
  const count = parseInt(process.argv[2] || '10000', 10);
  const url = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error('Missing SUPABASE_URL and SUPABASE_SERVICE_KEY (or REACT_APP_SUPABASE_ANON_KEY)');
    process.exit(1);
  }

  const supabase = createClient(url, key);
  const vinSet = new Set();

  console.log(`Fetching vehicle models and owners...`);
  const { data: models } = await supabase.from('vehicle_model').select('id, name, image_url');
  const { data: owners } = await supabase.from('owner').select('id');

  if (!models?.length || !owners?.length) {
    console.error('Run sample_data.sql first to create manufacturers, models, and owners');
    process.exit(1);
  }

  const currentYear = new Date().getFullYear();
  let inserted = 0;
  let errors = 0;

  console.log(`Seeding ${count.toLocaleString()} vehicles (batch size: ${BATCH_SIZE})...`);

  for (let i = 0; i < count; i += BATCH_SIZE) {
    const batch = [];
    const batchSize = Math.min(BATCH_SIZE, count - i);

    for (let j = 0; j < batchSize; j++) {
      let vin;
      do { vin = generateVIN(); } while (vinSet.has(vin));
      vinSet.add(vin);

      const model = models[Math.floor(Math.random() * models.length)];
      const year = currentYear - Math.floor(Math.random() * 8); // 2024 down to 2017
      const owner = owners[Math.floor(Math.random() * owners.length)];
      const mileage = Math.floor(Math.random() * 150000);
      const basePrice = 20000 + Math.floor(Math.random() * 60000);
      const value = Math.round(basePrice * (0.7 - (currentYear - year) * 0.05));

      batch.push({
        vin,
        vehicle_model_id: model.id,
        owner_id: owner.id,
        year,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        mileage,
        license_plate: `${STATES[Math.floor(Math.random() * STATES.length)]}${Math.floor(1000000 + Math.random() * 9000000)}`,
        registration_state: STATES[Math.floor(Math.random() * STATES.length)],
        purchase_price: basePrice,
        current_value: Math.max(5000, value),
        status: Math.random() > 0.1 ? 'active' : 'sold',
        image_url: model.image_url || MODEL_IMAGES[model.name] || null,
      });
    }

    const { error } = await supabase.from('vehicle').upsert(batch, {
      onConflict: 'vin',
      ignoreDuplicates: true,
    });

    if (error) {
      errors += batchSize;
      if (errors < 20) console.error('Batch error:', error.message);
    } else {
      inserted += batchSize;
    }

    if ((i + batchSize) % 5000 === 0 || i + batchSize >= count) {
      console.log(`  Progress: ${Math.min(i + batchSize, count).toLocaleString()} / ${count.toLocaleString()}`);
    }
  }

  console.log(`Done. Inserted: ${inserted.toLocaleString()}, Errors: ${errors}`);
}

main().catch(console.error);
