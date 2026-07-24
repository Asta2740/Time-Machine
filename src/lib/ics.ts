import { DateOption, INVITE_CONFIG } from "./config";

function toIcsDateOnly(isoDate: string): string {
  return isoDate.replace(/-/g, "");
}

/** All-day events use an exclusive end date, i.e. the day after. */
function nextDay(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const next = new Date(y, m - 1, d + 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(
    next.getDate()
  ).padStart(2, "0")}`;
}

function escapeIcsText(value: string): string {
  return value.replace(/[\\,;]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");
}

/**
 * Builds a downloadable .ics file (as a string) for the chosen date option.
 * The time isn't fixed yet, so this is an all-day placeholder event rather
 * than a timed one — the actual time gets sorted out with her directly.
 */
export function buildIcsContent(dateOption: DateOption): string {
  const dtStart = toIcsDateOnly(dateOption.isoDate);
  const dtEnd = toIcsDateOnly(nextDay(dateOption.isoDate));
  const now = new Date();
  const dtStamp = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}${String(now.getUTCDate()).padStart(2, "0")}T${String(now.getUTCHours()).padStart(
    2,
    "0"
  )}${String(now.getUTCMinutes()).padStart(2, "0")}${String(now.getUTCSeconds()).padStart(
    2,
    "0"
  )}Z`;
  const uid = `sushi-night-${dateOption.isoDate}-${Math.random().toString(36).slice(2)}@invite`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sushi Night Invite//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${escapeIcsText(INVITE_CONFIG.eventTitle)}`,
    `LOCATION:${escapeIcsText(INVITE_CONFIG.location)}`,
    `DESCRIPTION:${escapeIcsText(
      `${INVITE_CONFIG.myName} is taking ${INVITE_CONFIG.herName} for sushi. Time TBD — arrive hungry.`
    )}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

export function downloadIcsFile(dateOption: DateOption) {
  const content = buildIcsContent(dateOption);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "sushi-night-at-oak-bay.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
