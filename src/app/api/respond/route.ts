import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { extractTrustedIp, ipForStorage } from "@/lib/ip";
import { classifyDevice } from "@/lib/device";
import { sanitizeAnswer, sanitizeSessionId, sanitizeShortString } from "@/lib/sanitize";
import { verifyCsrfToken } from "@/lib/csrf";
import { checkRateLimit } from "@/lib/rateLimit";
import { toCairoTimeString } from "@/lib/time";
import { INVITE_CONFIG } from "@/lib/config";

export const runtime = "nodejs";

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
  const rl = checkRateLimit(`respond:${rateLimitKey}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds ?? 60) } }
    );
  }

  const answer = sanitizeAnswer(body.answer);
  const sessionId = sanitizeSessionId(body.sessionId);
  const isTest = body.test === true;

  if (!answer || !sessionId) {
    return NextResponse.json({ ok: false, error: "invalid_fields" }, { status: 400 });
  }

  const chosenDateRaw = sanitizeShortString(body.chosenDate, 10);
  const validDates = INVITE_CONFIG.dateOptions.map((d) => d.isoDate);
  const chosenDate = chosenDateRaw && validDates.includes(chosenDateRaw) ? chosenDateRaw : null;

  // Test mode previews the full flow without touching the database.
  if (isTest) {
    return NextResponse.json({ ok: true, test: true });
  }

  const userAgent = sanitizeShortString(request.headers.get("user-agent"), 500) ?? "";
  const referrer = sanitizeShortString(body.referrer, 500);
  const device = classifyDevice(userAgent);
  const { ip_hash, ip_full } = ipForStorage(ip);
  const now = new Date();

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("responses").insert({
    session_id: sessionId,
    answer,
    chosen_date: chosenDate,
    created_at_utc: now.toISOString(),
    created_at_cairo: toCairoTimeString(now),
    device_category: device,
    user_agent: userAgent,
    referrer,
    ip_hash,
    ip_full,
    is_test: false,
  });

  if (error) {
    // Unique violation means this session already submitted — treat as
    // an idempotent success so the UI doesn't show a confusing error for
    // an accidental double-submit.
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, alreadyRecorded: true });
    }
    return NextResponse.json({ ok: false, error: "storage_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
