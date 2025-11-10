// Build script for Netlify that ensures PUBLIC_URL is empty
// This temporarily modifies package.json to remove homepage field for Netlify builds

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Save original homepage
const originalHomepage = packageJson.homepage;

// Remove homepage for Netlify build (root deployment)
delete packageJson.homepage;

// Write modified package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log('Building for Netlify with PUBLIC_URL="" (homepage removed)');

try {
  // Set environment variables
  process.env.PUBLIC_URL = '';
  process.env.INLINE_RUNTIME_CHUNK = 'false';

  // Run build
  execSync('react-scripts build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      PUBLIC_URL: '',
      INLINE_RUNTIME_CHUNK: 'false'
    }
  });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  // Restore original package.json on error
  packageJson.homepage = originalHomepage;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  process.exit(1);
}

// Restore original package.json
packageJson.homepage = originalHomepage;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
console.log('Restored package.json homepage field');

