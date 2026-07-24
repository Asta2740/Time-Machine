/**
 * ============================================================
 *  EDIT THIS FILE to customize the invitation.
 *  Every name, date, time, venue, and score lives here.
 * ============================================================
 */

export interface DateOption {
  /** Full weekday name, must match the calendar date below. */
  day: string;
  /** Human-readable date shown in the UI. */
  label: string;
  /** ISO date (YYYY-MM-DD), used for the .ics file and validation. */
  isoDate: string;
}

export const INVITE_CONFIG = {
  // ---- People -------------------------------------------------
  herName: "Rowan" as string, // [HER_NAME]
  myName: "Youssef" as string, // [MY_NAME]

  // ---- Venue -----------------------------------------------------
  // No fixed time — that gets worked out with her directly once she
  // says yes, so the calendar event is added as an all-day placeholder.
  location: "Oak Bay" as string,

  // ---- Selectable date options -----------------------------------
  // She picks one of these in-page, or opens the calendar to pick any
  // other day if none of these work. All four are validated below.
  dateOptions: [
    { day: "Saturday", label: "Saturday, July 25, 2026", isoDate: "2026-07-25" },
    { day: "Sunday", label: "Sunday, July 26, 2026", isoDate: "2026-07-26" },
    { day: "Monday", label: "Monday, July 27, 2026", isoDate: "2026-07-27" },
    { day: "Tuesday", label: "Tuesday, July 28, 2026", isoDate: "2026-07-28" },
  ] as DateOption[],

  // ---- The football prediction bit ------------------------------
  prediction: { home: "Spain", away: "Argentina", homeScore: 2, awayScore: 1 },
  actual: { home: "Spain", away: "Argentina", homeScore: 1, awayScore: 0 },

  // ---- Calendar event ---------------------------------------------
  eventTitle: "Sushi Night at Oak Bay",
} as const;

/**
 * Validates that every configured date option's weekday actually matches
 * its calendar date. Throws at module-load time so a bad config never
 * ships silently.
 */
function assertWeekdaysMatch(options: readonly DateOption[]) {
  for (const opt of options) {
    const [y, m, d] = opt.isoDate.split("-").map(Number);
    const computed = new Date(Date.UTC(y, m - 1, d));
    const weekday = computed.toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "UTC",
    });
    if (weekday !== opt.day) {
      throw new Error(
        `Config error: ${opt.isoDate} is a ${weekday}, not a ${opt.day}. ` +
          `Fix INVITE_CONFIG.dateOptions in src/lib/config.ts.`
      );
    }
  }
}

assertWeekdaysMatch(INVITE_CONFIG.dateOptions);
