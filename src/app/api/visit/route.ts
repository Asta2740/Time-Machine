import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { extractTrustedIp, ipForStorage } from "@/lib/ip";
import { classifyDevice } from "@/lib/device";
import { sanitizeSessionId, sanitizeShortString } from "@/lib/sanitize";
import { ensureCsrfToken } from "@/lib/csrf";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const sessionId = sanitizeSessionId(body?.sessionId);
  const test = body?.test === true;

  if (!sessionId) {
    return NextResponse.json({ ok: false, error: "invalid_session" }, { status: 400 });
  }

  const ip = extractTrustedIp(request.headers);
  const rateLimitKey = ip ?? "unknown";
  const rl = checkRateLimit(`visit:${rateLimitKey}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds ?? 60) } }
    );
  }

  const csrfToken = ensureCsrfToken();

  if (!test) {
    const userAgent = sanitizeShortString(request.headers.get("user-agent"), 500) ?? "";
    const referrer = sanitizeShortString(body?.referrer, 500);
    const device = classifyDevice(userAgent);
    const { ip_hash, ip_full } = ipForStorage(ip);

    try {
      const supabase = getSupabaseAdmin();
      await supabase.from("visits").insert({
        session_id: sessionId,
        device_category: device,
        user_agent: userAgent,
        referrer,
        ip_hash,
        ip_full,
      });
    } catch {
      // Visit logging is best-effort; never block the experience on it.
    }
  }

  return NextResponse.json({ ok: true, csrfToken });
}
