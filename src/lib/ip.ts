import { createHash } from "crypto";
import { env } from "./env";

/**
 * Extracts the client IP from trusted, platform-set proxy headers only.
 * Never trust an IP value supplied in the request body.
 *
 * On Vercel, `x-forwarded-for` is set by the edge network and the first
 * entry is the original client. We never read a client-supplied header.
 */
export function extractTrustedIp(headers: Headers): string | null {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return null;
}

/**
 * Produces the value that should actually be stored, honoring
 * STORE_FULL_IP. Defaults to a salted SHA-256 hash so raw IPs never
 * touch the database unless explicitly enabled.
 */
export function ipForStorage(ip: string | null): {
  ip_hash: string | null;
  ip_full: string | null;
} {
  if (!ip) return { ip_hash: null, ip_full: null };

  if (env.storeFullIp) {
    return { ip_hash: null, ip_full: ip };
  }

  const hash = createHash("sha256").update(env.ipHashSalt).update(ip).digest("hex");
  return { ip_hash: hash, ip_full: null };
}

/** Masks an IP for admin-page display, e.g. 203.0.113.42 -> 203.0.113.xxx */
export function maskIp(ip: string): string {
  if (ip.includes(".")) {
    const parts = ip.split(".");
    if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
  }
  if (ip.includes(":")) {
    const parts = ip.split(":");
    return parts.slice(0, 3).join(":") + ":xxxx:xxxx:xxxx:xxxx";
  }
  return "hidden";
}
