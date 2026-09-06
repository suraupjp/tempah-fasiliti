import { createClient } from '@supabase/supabase-js';

// Nilai ini akan dimasukkan melalui Cloudflare Environment Variables nanti.
// Ia tidak akan di-hardcode di dalam source code untuk keselamatan.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);