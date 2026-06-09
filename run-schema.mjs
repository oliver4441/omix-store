import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://xmdyovfcjogkarwxiyhb.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZHlvdmZjam9na2Fyd3hpeWhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc3MTA5OCwiZXhwIjoyMDk2MzQ3MDk4fQ.UE7J8vudqhSyprUrSyvn-35iJhSr0lckmfi1s0vnPhk';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const sql = fs.readFileSync('/home/oliver/omix-store/supabase/schema.sql', 'utf8');

// Split SQL into individual statements
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

async function runSchema() {
  console.log(`Executing ${statements.length} SQL statements...`);
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i].trim();
    if (!stmt || stmt.startsWith('--')) continue;
    
    try {
      const { error } = await supabase.rpc('exec_sql', { query: stmt });
      if (error) {
        // Try direct query approach
        const { error: err2 } = await supabase.from('__raw__').select('*').limit(0);
        console.log(`Statement ${i+1}: ${error.message}`);
      } else {
        console.log(`Statement ${i+1}: OK`);
      }
    } catch (e) {
      console.log(`Statement ${i+1}: ${e.message}`);
    }
  }
}

// Alternative: use the SQL endpoint directly via fetch
async function runViaFetch() {
  console.log('Trying direct SQL execution via Management API...');
  
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql })
  });
  
  const result = await response.text();
  console.log('Result:', result);
}

runViaFetch().catch(console.error);
