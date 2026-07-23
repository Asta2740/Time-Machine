import "server-only";
import { getSupabaseAdmin } from "./supabaseAdmin";
import { maskIp } from "./ip";
import { toCairoTimeString } from "./time";
import { AdminResponseRow, AdminStats, AdminVisitRow } from "@/types";

function displayIp(row: { ip_hash: string | null; ip_full: string | null }): string {
  if (row.ip_full) return maskIp(row.ip_full);
  if (row.ip_hash) return `sha256:${row.ip_hash.slice(0, 12)}…`;
  return "unknown";
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = getSupabaseAdmin();

  const [
    { count: totalVisits },
    { count: yesCount },
    { count: noCount },
    { data: recentRows },
    { data: recentVisitRows },
    { data: answeredSessionRows },
  ] = await Promise.all([
    supabase.from("visits").select("*", { count: "exact", head: true }),
    supabase
      .from("responses")
      .select("*", { count: "exact", head: true })
      .eq("answer", "yes")
      .eq("is_test", false),
    supabase
      .from("responses")
      .select("*", { count: "exact", head: true })
      .eq("answer", "no")
      .eq("is_test", false),
    supabase
      .from("responses")
      .select(
        "id, answer, created_at_utc, created_at_cairo, device_category, user_agent, chosen_date, session_id, ip_hash, ip_full"
      )
      .eq("is_test", false)
      .order("created_at_utc", { ascending: false })
      .limit(20),
    supabase
      .from("visits")
      .select("id, session_id, created_at, device_category, user_agent, referrer, ip_hash, ip_full")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase.from("responses").select("session_id").eq("is_test", false),
  ]);

  const answeredSessionIds = new Set((answeredSessionRows ?? []).map((r) => r.session_id));

  const recent: AdminResponseRow[] = (recentRows ?? []).map((row) => ({
    id: row.id,
    answer: row.answer,
    createdAtUtc: row.created_at_utc,
    createdAtCairo: row.created_at_cairo,
    deviceCategory: row.device_category,
    maskedIp: displayIp(row),
    userAgent: row.user_agent ?? "unknown",
    chosenDate: row.chosen_date,
    sessionId: row.session_id,
  }));

  const recentVisits: AdminVisitRow[] = (recentVisitRows ?? []).map((row) => ({
    id: row.id,
    createdAtUtc: row.created_at,
    createdAtCairo: toCairoTimeString(new Date(row.created_at)),
    deviceCategory: row.device_category,
    maskedIp: displayIp(row),
    userAgent: row.user_agent ?? "unknown",
    referrer: row.referrer,
    sessionId: row.session_id,
    answered: answeredSessionIds.has(row.session_id),
  }));

  return {
    totalVisits: totalVisits ?? 0,
    yesCount: yesCount ?? 0,
    noCount: noCount ?? 0,
    recent,
    recentVisits,
  };
}
