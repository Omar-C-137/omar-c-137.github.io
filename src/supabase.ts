import { createClient } from '@supabase/supabase-js';

// Load Supabase credentials from environment variables
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || 'https://smctblcoeqtnbgwzsihv.supabase.co';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Lazy initialization of the Supabase client
let supabaseClientInstance: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!isSupabaseConfigured) {
    return null;
  }
  
  if (!supabaseClientInstance) {
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  
  return supabaseClientInstance;
}
