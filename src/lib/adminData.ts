import "server-only";
import { getSupabaseAdmin } from "./supabaseAdmin";
import { toCairoTimeString } from "./time";
import { AdminResponseRow, AdminSessionRow, AdminStats, AdminVisitRow, Scene } from "@/types";

const SCENES: Scene[] = ["opening", "prediction", "reveal", "decision", "yes", "no"];

// Shows the IP in full whenever STORE_FULL_IP=true populated ip_full — the
// whole point of enabling that setting is to actually see it in the admin
// view, not a masked version. Falls back to a hash preview otherwise.
function displayIp(row: { ip_hash: string | null; ip_full: string | null }): string {
  if (row.ip_full) return row.ip_full;
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
    { data: eventRows },
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
    supabase
      .from("page_events")
      .select("session_id, scene, created_at")
      .eq("is_test", false)
      .order("created_at", { ascending: true })
      .limit(1000),
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

  const sceneFunnel = Object.fromEntries(SCENES.map((s) => [s, 0])) as Record<Scene, number>;
  const sessionScenes = new Map<string, { scenes: Scene[]; seenScenes: Set<Scene>; lastSeenUtc: string }>();

  for (const row of eventRows ?? []) {
    const scene = row.scene as Scene;
    const session: { scenes: Scene[]; seenScenes: Set<Scene>; lastSeenUtc: string } =
      sessionScenes.get(row.session_id) ?? {
        scenes: [],
        seenScenes: new Set<Scene>(),
        lastSeenUtc: row.created_at,
      };
    if (!session.seenScenes.has(scene)) {
      session.seenScenes.add(scene);
      session.scenes.push(scene);
      sceneFunnel[scene] += 1;
    }
    session.lastSeenUtc = row.created_at;
    sessionScenes.set(row.session_id, session);
  }

  const topSessions = Array.from(sessionScenes.entries())
    .map(([sessionId, session]) => ({
      sessionId,
      scenes: session.scenes,
      lastSeenUtc: session.lastSeenUtc,
    }))
    .sort((a, b) => (a.lastSeenUtc < b.lastSeenUtc ? 1 : -1))
    .slice(0, 30);

  const sessionIps = new Map<string, string>();
  if (topSessions.length > 0) {
    const { data: ipRows } = await supabase
      .from("visits")
      .select("session_id, ip_hash, ip_full")
      .in(
        "session_id",
        topSessions.map((s) => s.sessionId)
      );
    for (const row of ipRows ?? []) {
      if (!sessionIps.has(row.session_id)) sessionIps.set(row.session_id, displayIp(row));
    }
  }

  const recentSessions: AdminSessionRow[] = topSessions.map((s) => ({
    ...s,
    ip: sessionIps.get(s.sessionId) ?? "unknown",
  }));

  return {
    totalVisits: totalVisits ?? 0,
    yesCount: yesCount ?? 0,
    noCount: noCount ?? 0,
    recent,
    recentVisits,
    sceneFunnel,
    recentSessions,
  };
}
