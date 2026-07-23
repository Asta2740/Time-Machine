import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { env } from "@/lib/env";

export const runtime = "nodejs";

/**
 * Deletes visit/response rows older than the configured retention window.
 * Intended to be invoked on a daily schedule by Vercel Cron (see
 * vercel.json), authenticated via a bearer secret — never expose this
 * route publicly without the secret check below.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${env.cleanupSecret}`;

  if (authHeader !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.rpc("purge_old_rows", {
    retention_days: env.retentionDays,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "purge_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, retentionDays: env.retentionDays });
}
