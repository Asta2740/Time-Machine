import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { extractTrustedIp } from "@/lib/ip";
import { sanitizeSessionId } from "@/lib/sanitize";
import { verifyCsrfToken } from "@/lib/csrf";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const VALID_SCENES = new Set(["opening", "prediction", "reveal", "decision", "yes", "no"]);

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  if (!verifyCsrfToken(body.csrfToken)) {
    return NextResponse.json({ ok: false, error: "invalid_csrf" }, { status: 403 });
  }

  const ip = extractTrustedIp(request.headers);
  const rateLimitKey = ip ?? "unknown";
  const rl = checkRateLimit(`event:${rateLimitKey}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds ?? 60) } }
    );
  }

  const sessionId = sanitizeSessionId(body.sessionId);
  const scene = typeof body.scene === "string" && VALID_SCENES.has(body.scene) ? body.scene : null;
  const test = body.test === true;

  if (!sessionId || !scene) {
    return NextResponse.json({ ok: false, error: "invalid_fields" }, { status: 400 });
  }

  if (!test) {
    try {
      const supabase = getSupabaseAdmin();
      await supabase.from("page_events").insert({ session_id: sessionId, scene });
    } catch {
      // Best-effort — never block the experience on analytics.
    }
  }

  return NextResponse.json({ ok: true });
}
