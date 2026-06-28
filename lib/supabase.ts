import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://smctblcoeqtnbgwzsihv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtY3RibGNvZXF0bmJnd3pzaWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0OTA0MzQsImV4cCI6MjA5ODA2NjQzNH0.k0ECev5mUAg1mwsuM9KJ9bOVxtb6ajC1XNECFaXjF8o';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
