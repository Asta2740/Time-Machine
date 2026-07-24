import { DateOption } from "./config";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Builds a DateOption from any calendar day she picks, not just the presets. */
export function buildDateOptionFromDate(date: Date): DateOption {
  const isoDate = toIsoDate(date);
  const day = date.toLocaleDateString("en-US", { weekday: "long" });
  const label = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return { day, label, isoDate };
}
