// This script ensures that environment variables are properly set up for builds
const fs = require('fs');
const path = require('path');

// Default fallback values for build time (not used in production)
const defaultValues = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://placeholder-for-build.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'placeholder-key-for-build-only',
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'placeholder-key-for-build-only',
  CLERK_SECRET_KEY: 'placeholder-key-for-build-only',
  VERCEL_BUILD_STEP: 'true',
  SKIP_STATIC_GENERATION: 'true'
};

// Function to ensure environment variables are set
function setupEnv() {
  console.log('Setting up environment variables for build...');
  
  // Set SKIP_STATIC_GENERATION to true to prevent static generation
  process.env.SKIP_STATIC_GENERATION = 'true';
  console.log('SKIP_STATIC_GENERATION set to true for build');
  
  // Check if we're in a Vercel environment
  const isVercel = !!process.env.VERCEL;
  if (isVercel) {
    console.log('Running in Vercel environment');
    
    // In Vercel, we don't need to create .env files, just ensure process.env has values
    const requiredVars = Object.keys(defaultValues);
    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        console.log(`Setting default value for ${varName} in Vercel environment (build only)`);
        process.env[varName] = defaultValues[varName];
      }
    });
    
    return; // Exit early for Vercel
  }
  
  // Local environment handling
  // Check if .env file exists
  const envPath = path.join(process.cwd(), '.env');
  const envProductionPath = path.join(process.cwd(), '.env.production');
  
  if (!fs.existsSync(envProductionPath) && fs.existsSync(envPath)) {
    console.log('Copying .env to .env.production');
    fs.copyFileSync(envPath, envProductionPath);
  }
  
  // Ensure all required environment variables are set
  const requiredVars = Object.keys(defaultValues);
  
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
      console.warn(`Warning: ${varName} is not set in the environment or .env files, using default fallback`);
      envVars[varName] = defaultValues[varName];
      updated = true;
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
