import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { env } from "./env";

const ADMIN_COOKIE = "invite_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 4; // 4 hours

function sign(payload: string): string {
  return createHmac("sha256", env.adminSessionSecret).update(payload).digest("hex");
}

export function createAdminSessionCookie(): { name: string; value: string; maxAge: number } {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `admin.${expiresAt}`;
  const signature = sign(payload);
  return {
    name: ADMIN_COOKIE,
    value: `${payload}.${signature}`,
    maxAge: SESSION_TTL_MS / 1000,
  };
}

export function isAdminAuthenticated(): boolean {
  const cookieValue = cookies().get(ADMIN_COOKIE)?.value;
  if (!cookieValue) return false;

  const lastDot = cookieValue.lastIndexOf(".");
  if (lastDot === -1) return false;
  const payload = cookieValue.slice(0, lastDot);
  const signature = cookieValue.slice(lastDot + 1);

  const expected = sign(payload);
  const a = Buffer.from(signature, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const [, expiresAtRaw] = payload.split(".");
  const expiresAt = parseInt(expiresAtRaw, 10);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}

export const ADMIN_COOKIE_NAME = ADMIN_COOKIE;

export function verifyAdminPassword(candidate: string): boolean {
  const expected = env.adminPassword;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
