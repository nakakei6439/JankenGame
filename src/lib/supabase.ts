import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://phgjsoetqljtfdklvnou.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZ2pzb2V0cWxqdGZka2x2bm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MzYzNzIsImV4cCI6MjA1OTUxMjM3Mn0.PBD9BPqtbA6X_ew7lMpL2dO8rDjvsDjVXOOjGpquoX8';

export const supabase = createClient(supabaseUrl, supabaseKey); 