import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client;
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !key) return null;
  _client = createClient(url, key);
  return _client;
}

// Ensures an anonymous Supabase session exists before making auth-gated queries.
// On the first visit one POST /auth/v1/token round-trip fires (~100 ms);
// afterwards the JWT is in localStorage and getSession() returns instantly.
export async function getAuthenticatedSupabase(): Promise<SupabaseClient | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    const { error } = await sb.auth.signInAnonymously();
    if (error) {
      // Anonymous auth not yet enabled in the Supabase dashboard.
      // Return the client anyway — queries still work until migration 002 is applied.
      console.warn('[supabase] Anonymous sign-in failed (enable it in Auth → Providers → Anonymous):', error.message);
    }
  }
  return sb;
}
