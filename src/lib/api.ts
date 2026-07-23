"use client";

import { Answer } from "@/types";

export async function logVisit(sessionId: string, test: boolean): Promise<{ csrfToken: string } | null> {
  try {
    const res = await fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        referrer: typeof document !== "undefined" ? document.referrer : "",
        test,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { csrfToken: data.csrfToken };
  } catch {
    return null;
  }
}

export async function submitResponse(params: {
  answer: Answer;
  sessionId: string;
  chosenDate: string;
  csrfToken: string;
  test: boolean;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...params,
        referrer: typeof document !== "undefined" ? document.referrer : "",
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data?.error ?? "request_failed" };
    return { ok: true };
  } catch {
    return { ok: false, error: "network_error" };
  }
}
