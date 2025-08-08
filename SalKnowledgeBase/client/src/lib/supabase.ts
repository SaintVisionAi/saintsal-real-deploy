// Supabase configuration - will be integrated when package is available
const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

export { supabaseConfig }