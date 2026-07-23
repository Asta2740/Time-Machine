export type Answer = "yes" | "no";
export type DeviceCategory = "mobile" | "tablet" | "desktop";

export interface RespondRequestBody {
  answer: Answer;
  sessionId: string;
  chosenDate: string; // ISO date of the option she picked
  csrfToken: string;
  referrer?: string | null;
  test?: boolean;
}

export interface RespondResponseBody {
  ok: boolean;
  error?: string;
}

export interface AdminStats {
  totalVisits: number;
  yesCount: number;
  noCount: number;
  recent: AdminResponseRow[];
  recentVisits: AdminVisitRow[];
}

export interface AdminResponseRow {
  id: string;
  answer: Answer;
  createdAtUtc: string;
  createdAtCairo: string;
  deviceCategory: DeviceCategory;
  maskedIp: string;
  userAgent: string;
  chosenDate: string | null;
  sessionId: string;
}

/** Every page load, including visitors who never answered yes/no. */
export interface AdminVisitRow {
  id: string;
  createdAtUtc: string;
  createdAtCairo: string;
  deviceCategory: DeviceCategory;
  maskedIp: string;
  userAgent: string;
  referrer: string | null;
  sessionId: string;
  answered: boolean;
}
