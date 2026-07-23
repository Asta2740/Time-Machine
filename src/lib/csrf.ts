import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { env } from "./env";

const CSRF_COOKIE = "invite_csrf";

function sign(token: string): string {
  return createHmac("sha256", env.adminSessionSecret).update(token).digest("hex");
}

/**
 * Issues a CSRF token bound to this browser via an httpOnly cookie
 * (the signature) alongside a readable token double-submitted by the
 * client on POST requests.
 */
export function ensureCsrfToken(): string {
  const store = cookies();
  const existing = store.get(CSRF_COOKIE)?.value;
  if (existing) {
    const [token] = existing.split(".");
    return token;
  }

  const token = randomBytes(24).toString("hex");
  const signature = sign(token);
  store.set(CSRF_COOKIE, `${token}.${signature}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 2,
  });
  return token;
}

export function verifyCsrfToken(submittedToken: string | null): boolean {
  if (!submittedToken) return false;
  const cookieValue = cookies().get(CSRF_COOKIE)?.value;
  if (!cookieValue) return false;

  const [token, signature] = cookieValue.split(".");
  if (!token || !signature) return false;
  if (token !== submittedToken) return false;

  const expected = sign(token);
  const a = Buffer.from(signature, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
