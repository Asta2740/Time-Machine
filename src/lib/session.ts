const SESSION_KEY = "invite_session_id";

/** Client-side session/page identifier, persisted for this browser tab session only. */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    // sessionStorage unavailable (privacy mode, etc.) — fall back to a per-load id.
    return crypto.randomUUID();
  }
}
