export type DeviceCategory = "mobile" | "tablet" | "desktop";

/**
 * Coarse, privacy-friendly device classification from the user-agent
 * string only. No client hints, no fingerprinting.
 */
export function classifyDevice(userAgent: string | null): DeviceCategory {
  if (!userAgent) return "desktop";
  const ua = userAgent.toLowerCase();

  if (/ipad|tablet|kindle|playbook|silk/.test(ua) && !/mobile/.test(ua)) {
    return "tablet";
  }
  if (/mobi|iphone|ipod|android.*mobile|windows phone/.test(ua)) {
    return "mobile";
  }
  if (/android/.test(ua)) {
    return "tablet";
  }
  return "desktop";
}
