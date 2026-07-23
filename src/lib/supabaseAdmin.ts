import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

let client: SupabaseClient | null = null;

/**
 * Server-only Supabase client using the service role key.
 * This key must NEVER be exposed to the browser — it is only read here,
 * inside server code (API routes / server actions), and is not prefixed
 * with NEXT_PUBLIC_.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
