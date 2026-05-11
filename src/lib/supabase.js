// src/lib/supabase.js
// -----------------------------------------------------------
// Initialize the Supabase client once.
// Import `supabase` from this file wherever you need to
// read or write data, or manage authentication.
//
// Make sure your .env file has:
//   VITE_SUPABASE_URL=https://yourproject.supabase.co
//   VITE_SUPABASE_ANON_KEY=your-anon-key
// -----------------------------------------------------------

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn(
    '[MediaVault] Missing Supabase env vars. ' +
    'Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
