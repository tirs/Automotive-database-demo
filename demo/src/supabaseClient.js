import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project credentials
// Get these from your Supabase project settings: https://app.supabase.com/project/_/settings/api
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Validate environment variables
const hasValidConfig = supabaseUrl && 
                       supabaseAnonKey && 
                       supabaseUrl !== 'YOUR_SUPABASE_URL' && 
                       supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
                       supabaseUrl !== '' &&
                       supabaseAnonKey !== '';

if (!hasValidConfig) {
  console.error('Missing Supabase environment variables. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY');
  console.error('Current values:', {
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseAnonKey ? 'Set' : 'Missing'
  });
}

// Only create client if we have valid config, otherwise it will fail gracefully
export const supabase = hasValidConfig 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    })
  : null;

