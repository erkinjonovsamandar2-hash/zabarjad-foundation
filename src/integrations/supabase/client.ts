import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "❌ [Supabase] Missing env vars: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is undefined.\n" +
    "   → If running locally: restart the dev server (Vite reads .env on startup, not hot-reload).\n" +
    "   → If running on Lovable/Vercel/etc: add these vars in the platform's environment settings."
  );
}

// In development the Vite proxy routes /_sb/* → Supabase, so all requests
// stay on the same origin (localhost:8080). This bypasses CORS/iframe sandbox
// restrictions in Lovable's preview. In production requests go directly.
const effectiveUrl =
  import.meta.env.DEV
    ? `${window.location.origin}/_sb`
    : (SUPABASE_URL ?? "https://placeholder.supabase.co");

export const supabase = createClient<Database>(
  effectiveUrl,
  SUPABASE_ANON_KEY ?? "placeholder",
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);