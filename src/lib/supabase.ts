import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://phgjsoetqljtfdklvnou.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZ2pzb2V0cWxqdGZka2x2bm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MzYzNzIsImV4cCI6MjA1OTUxMjM3Mn0.PBD9BPqtbA6X_ew7lMpL2dO8rDjvsDjVXOOjGpquoX8';

if (!supabaseKey) {
  throw new Error('Missing REACT_APP_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
}); 