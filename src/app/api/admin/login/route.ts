import { NextRequest, NextResponse } from "next/server";
import { createAdminSessionCookie, verifyAdminPassword } from "@/lib/adminAuth";
import { checkRateLimit } from "@/lib/rateLimit";
import { extractTrustedIp } from "@/lib/ip";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const ip = extractTrustedIp(request.headers) ?? "unknown";
  const rl = checkRateLimit(`admin-login:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!password || !verifyAdminPassword(password)) {
    return NextResponse.json({ ok: false, error: "invalid_password" }, { status: 401 });
  }

  const cookie = createAdminSessionCookie();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookie.name, cookie.value, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: cookie.maxAge,
  });
  return response;
}
