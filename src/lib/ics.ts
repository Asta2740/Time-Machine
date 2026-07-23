import { DateOption, INVITE_CONFIG } from "./config";

function parseTimeTo24h(time: string): { hour: number; minute: number } {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return { hour: 19, minute: 0 };
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  return { hour, minute };
}

function toFloatingIcsDate(isoDate: string, hour: number, minute: number): string {
  const [y, m, d] = isoDate.split("-");
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  return `${y}${m}${d}T${hh}${mm}00`;
}

function addMinutes(isoDate: string, hour: number, minute: number, durationMinutes: number) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const start = new Date(y, m - 1, d, hour, minute);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  return {
    hour: end.getHours(),
    minute: end.getMinutes(),
    isoDate: `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(
      end.getDate()
    ).padStart(2, "0")}`,
  };
}

function escapeIcsText(value: string): string {
  return value.replace(/[\\,;]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");
}

/** Builds a downloadable .ics file (as a string) for the chosen date option. */
export function buildIcsContent(dateOption: DateOption): string {
  const { hour, minute } = parseTimeTo24h(INVITE_CONFIG.time);
  const dtStart = toFloatingIcsDate(dateOption.isoDate, hour, minute);
  const end = addMinutes(dateOption.isoDate, hour, minute, INVITE_CONFIG.eventDurationMinutes);
  const dtEnd = toFloatingIcsDate(end.isoDate, end.hour, end.minute);
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
  const uid = `sushi-date-${dateOption.isoDate}-${Math.random().toString(36).slice(2)}@invite`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sushi Date Invite//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(INVITE_CONFIG.eventTitle)}`,
    `LOCATION:${escapeIcsText(INVITE_CONFIG.location)}`,
    `DESCRIPTION:${escapeIcsText(
      `${INVITE_CONFIG.myName} is taking ${INVITE_CONFIG.herName} for sushi. Arrive hungry.`
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
  link.download = "sushi-date-at-oak-bay.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
