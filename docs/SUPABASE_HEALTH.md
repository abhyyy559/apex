Supabase health-check

Script: `backend/scripts/supabase-health.mjs`

Command used (PowerShell):

$env:SUPABASE_URL='https://xdeyzxwnsklrpkkerrox.supabase.co'; \
$env:SUPABASE_SERVICE_ROLE_KEY='<service-role-key>'; \
node ./backend/scripts/supabase-health.mjs contact

Outcome:
- The script connected to Supabase but failed querying the `contact` table.
- Error: "Could not find the table 'public.contact' in the schema cache"

Interpretation & next steps:
- Connection/auth succeeded (service role key accepted).
- The requested table (`contact`) does not exist in the `public` schema, or the table name differs.

Recommendations:
- Confirm the correct table name in your Supabase project, or create the `contact` table.
 - Re-run the script with a table name that exists: `node ./backend/scripts/supabase-health.mjs <existing_table>`
- Keep the `SUPABASE_SERVICE_ROLE_KEY` secret and only set it in server environments.

If you'd like, I can:
- Create a simple migration SQL to create a `contact` table schema used by the app.
- Re-run the health check against a different table you specify.
