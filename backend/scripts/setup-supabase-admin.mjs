import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

let envVars = {};
try {
  const envContent = readFileSync('.env.local', 'utf-8');
  envContent.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
} catch {
  // It's acceptable when .env.local is not present; rely on process.env instead.
}

const supabaseUrl = envVars.SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = envVars.SUPABASE_ADMIN_EMAIL || process.env.SUPABASE_ADMIN_EMAIL;
const adminPassword = envVars.SUPABASE_ADMIN_PASSWORD || process.env.SUPABASE_ADMIN_PASSWORD;

if (!supabaseUrl || !serviceRoleKey || !adminEmail || !adminPassword) {
  console.error(
    'Missing required environment variables. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ADMIN_EMAIL, and SUPABASE_ADMIN_PASSWORD.'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function setupAdmin() {
  try {
    const { error: signUpError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
    });

    if (signUpError) {
      if (signUpError.message.includes('User already registered')) {
        console.log('Admin user already exists.');
      } else {
        console.error('Failed to create admin user:', signUpError.message);
      }
    } else {
      console.log('Admin user created successfully.');
    }

    console.log('Run scripts/setup-supabase-admin.sql in Supabase SQL editor and ensure SUPABASE_ADMIN_EMAILS is set.');
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
}

setupAdmin();

// After running the above, attempt to seed the `public.admins` table for the created admin user.
async function seedAdminInTable() {
  try {
    // Try to find the user by email
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers? await supabase.auth.admin.listUsers() : { data: null, error: null };
    // The above may not be available depending on supabase-js version; fallback to a users select via SQL
    if (usersError) throw usersError;

    // Fallback approach: query auth.users via SQL
    const { data: fetchedUsers, error: sqlError } = await supabase.rpc('pg_catalog.pg_get_userbyid');
    // If rpc is unavailable, skip automatic seeding and instruct the user.
    console.log('Please run the SQL migration scripts and manually insert the admin user into public.admins if needed.');
  } catch (err) {
    // Do not fail on seeding; this is a best-effort step
    console.log('Seeding of public.admins not performed automatically. You can insert the admin row with SQL.');
  }
}

// Do not auto-run seeding to avoid breaking environments; expose the helper for manual invocation if desired.
