import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(2);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function run() {
  try {
    const table = process.argv[2] || 'contact';
    console.log('Checking table:', table);
    const { data, error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.error('Health check failed:', error.message || error);
      process.exit(1);
    }
    console.log('Health check OK. Rows result:', data);
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

run();
