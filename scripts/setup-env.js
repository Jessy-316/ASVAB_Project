// This script ensures that environment variables are properly set up for builds
const fs = require('fs');
const path = require('path');

// Function to ensure environment variables are set
function setupEnv() {
  console.log('Setting up environment variables for build...');
  
  // Check if .env file exists
  const envPath = path.join(process.cwd(), '.env');
  const envProductionPath = path.join(process.cwd(), '.env.production');
  
  if (!fs.existsSync(envProductionPath) && fs.existsSync(envPath)) {
    console.log('Copying .env to .env.production');
    fs.copyFileSync(envPath, envProductionPath);
  }
  
  // Ensure all required environment variables are set
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
  ];
  
  // Read the existing .env.production file if it exists
  let envVars = {};
  if (fs.existsSync(envProductionPath)) {
    const envContent = fs.readFileSync(envProductionPath, 'utf-8');
    const lines = envContent.split('\n');
    lines.forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (key && value) {
          envVars[key] = value;
        }
      }
    });
  }
  
  // Add any missing environment variables
  let updated = false;
  requiredVars.forEach(varName => {
    if (!process.env[varName] && !envVars[varName]) {
      console.warn(`Warning: ${varName} is not set in the environment or .env files`);
    } else if (!envVars[varName] && process.env[varName]) {
      // Copy from process.env to .env.production
      envVars[varName] = process.env[varName];
      updated = true;
    }
  });
  
  // Write updated .env.production
  if (updated) {
    const newContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    fs.writeFileSync(envProductionPath, newContent);
    console.log('Updated .env.production with missing variables');
  }
  
  console.log('Environment setup complete');
}

// Run the setup
setupEnv(); 
