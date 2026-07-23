"use client";

import { useRouter } from "next/navigation";
import { AdminStats } from "@/types";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-800">{value}</p>
    </div>
  );
}

export function AdminDashboard({ stats }: { stats: AdminStats }) {
  const router = useRouter();
  const mostRecent = stats.recent[0];

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-800">Invitation results</h1>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Log out
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total visits" value={stats.totalVisits} />
          <StatCard label="Yes responses" value={stats.yesCount} />
          <StatCard label="No responses" value={stats.noCount} />
          <StatCard
            label="Most recent answer"
            value={mostRecent ? mostRecent.answer.toUpperCase() : "—"}
          />
        </div>

        {mostRecent && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-sm text-slate-600">
            <p className="mb-1 font-medium text-slate-700">Most recent response</p>
            <p>Answered: {mostRecent.createdAtCairo} (Africa/Cairo)</p>
            <p>Device: {mostRecent.deviceCategory}</p>
            <p>IP: {mostRecent.maskedIp}</p>
          </div>
        )}

        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-3 py-2">Answer</th>
                <th className="px-3 py-2">Date chosen</th>
                <th className="px-3 py-2">Timestamp (UTC)</th>
                <th className="px-3 py-2">Timestamp (Cairo)</th>
                <th className="px-3 py-2">Device</th>
                <th className="px-3 py-2">IP</th>
                <th className="px-3 py-2">Browser</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recent.map((row) => (
                <tr key={row.id}>
                  <td className="px-3 py-2 font-medium text-slate-700">{row.answer}</td>
                  <td className="px-3 py-2 text-slate-500">{row.chosenDate ?? "—"}</td>
                  <td className="px-3 py-2 text-slate-500">{row.createdAtUtc}</td>
                  <td className="px-3 py-2 text-slate-500">{row.createdAtCairo}</td>
                  <td className="px-3 py-2 text-slate-500">{row.deviceCategory}</td>
                  <td className="px-3 py-2 text-slate-500">{row.maskedIp}</td>
                  <td className="px-3 py-2 max-w-[220px] truncate text-slate-500" title={row.userAgent}>
                    {row.userAgent}
                  </td>
                </tr>
              ))}
              {stats.recent.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-slate-400">
                    No responses yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h2 className="mt-8 mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          All visits (including those who never answered)
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-3 py-2">Answered?</th>
                <th className="px-3 py-2">Timestamp (UTC)</th>
                <th className="px-3 py-2">Timestamp (Cairo)</th>
                <th className="px-3 py-2">Device</th>
                <th className="px-3 py-2">IP</th>
                <th className="px-3 py-2">Referrer</th>
                <th className="px-3 py-2">Browser</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recentVisits.map((row) => (
                <tr key={row.id}>
                  <td className="px-3 py-2 text-slate-700">{row.answered ? "Yes" : "—"}</td>
                  <td className="px-3 py-2 text-slate-500">{row.createdAtUtc}</td>
                  <td className="px-3 py-2 text-slate-500">{row.createdAtCairo}</td>
                  <td className="px-3 py-2 text-slate-500">{row.deviceCategory}</td>
                  <td className="px-3 py-2 text-slate-500">{row.maskedIp}</td>
                  <td className="px-3 py-2 max-w-[160px] truncate text-slate-500" title={row.referrer ?? ""}>
                    {row.referrer || "direct"}
                  </td>
                  <td className="px-3 py-2 max-w-[220px] truncate text-slate-500" title={row.userAgent}>
                    {row.userAgent}
                  </td>
                </tr>
              ))}
              {stats.recentVisits.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-slate-400">
                    No visits recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
