/**
 * Input sanitization for values that originate from the browser.
 * We use parameterized Supabase queries (which prevents SQL injection by
 * construction), but we still normalize/limit string inputs defensively
 * before they're stored or reflected anywhere.
 */

export function sanitizeAnswer(value: unknown): "yes" | "no" | null {
  if (value === "yes" || value === "no") return value;
  return null;
}

const CONTROL_AND_ANGLE_CHARS = /[\x00-\x1F\x7F<>]/g;

export function sanitizeShortString(value: unknown, maxLength = 200): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, maxLength);
  // Strip control characters and angle brackets to neutralize markup injection
  // in any context this value is later rendered (e.g. admin dashboard).
  return trimmed.replace(CONTROL_AND_ANGLE_CHARS, "");
}

export function sanitizeSessionId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  // Session ids are client-generated UUIDs; enforce the shape strictly.
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(value) ? value : null;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
