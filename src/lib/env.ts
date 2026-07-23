/**
 * Centralized, validated access to server-only environment variables.
 * Never import this file from a "use client" component.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  get supabaseUrl() {
    return required("SUPABASE_URL");
  },
  get supabaseServiceRoleKey() {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
  get ipHashSalt() {
    return required("IP_HASH_SALT");
  },
  get storeFullIp() {
    return (process.env.STORE_FULL_IP ?? "false").toLowerCase() === "true";
  },
  get adminPassword() {
    return required("ADMIN_PASSWORD");
  },
  get adminSessionSecret() {
    return required("ADMIN_SESSION_SECRET");
  },
  get retentionDays() {
    const raw = process.env.RETENTION_DAYS;
    const parsed = raw ? parseInt(raw, 10) : 30;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 30;
  },
  get cleanupSecret() {
    // Named CRON_SECRET to match Vercel Cron's built-in convention: when
    // this env var is set, Vercel automatically sends
    // `Authorization: Bearer $CRON_SECRET` on scheduled invocations.
    return required("CRON_SECRET");
  },
};
