// Shared types and helpers for the Mini App client.

export type Lang = "en" | "am" | "or";

export type View =
  | "home"
  | "job"
  | "post"
  | "applications"
  | "profile"
  | "admin"
  | "verify";

export interface UserState {
  id: string;
  telegramId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  photoUrl: string | null;
  role: "STUDENT" | "EMPLOYER" | "ADMIN";
  language: Lang;
  university: string | null;
  fieldOfStudy: string | null;
  year: number | null;
  fullName: string | null;
  phone: string | null;
  cvUrl: string | null;
  bio: string | null;
  companyName: string | null;
  companyTelegram: string | null;
  verification: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
  isAdmin: boolean;
  alertSubjects: string | null;
  alertLocations: string | null;
  // Mandatory documents
  nationalIdNumber: string | null;
  nationalIdImage: string | null;
  universityIdNumber: string | null;
  universityIdImage: string | null;
  lastSemesterGradeImage: string | null;
  profileComplete: boolean;
}

export interface JobSummary {
  id: string;
  title: string;
  subjects: string;
  gradeLevel: string | null;
  location: string | null;
  workType: "TUTORING" | "FREELANCE" | "PART_TIME" | "FULL_TIME" | "INTERNSHIP" | "REMOTE";
  salary: string | null;
  currency: string;
  hoursPerWeek: string | null;
  genderPref: string | null;
  languageReq: string | null;
  deadline: string | null;
  contactTelegram: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CLOSED" | "EXPIRED" | "PENDING_PAYMENT";
  createdAt: string;
  applicationFee: number | null;
  positionsAvailable: number | null;
  filledPositions: number;
  employer: {
    id: string;
    companyName: string | null;
    companyTelegram: string | null;
    username: string | null;
    firstName: string | null;
    verification: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
  };
  _count: { applications: number };
}

export interface JobDetail extends JobSummary {
  description: string;
  rejectionReason: string | null;
}

export function deadlineText(deadline: string | null, lang: Lang, tFn: (lang: Lang, key: string, vars?: Record<string, string | number>) => string): { text: string; urgent: boolean; expired: boolean } {
  if (!deadline) return { text: tFn(lang, "negotiable"), urgent: false, expired: false };
  const d = new Date(deadline);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (days < 0) return { text: tFn(lang, "expired"), urgent: false, expired: true };
  if (days === 0) return { text: tFn(lang, "today"), urgent: true, expired: false };
  if (days <= 3) return { text: tFn(lang, "daysLeft", { n: days }), urgent: true, expired: false };
  return { text: tFn(lang, "daysLeft", { n: days }), urgent: false, expired: false };
}

export function formatRelativeDate(iso: string, lang: Lang): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (lang === "am") {
    if (mins < 60) return `${mins} ደቂቃ በፊት`;
    if (hrs < 24) return `${hrs} ሰዓት በፊት`;
    if (days < 7) return `${days} ቀን በፊት`;
    return d.toLocaleDateString("am-ET");
  }
  if (lang === "or") {
    if (mins < 60) return `${mins} daqiiqaa dura`;
    if (hrs < 24) return `${hrs} sa'a dura`;
    if (days < 7) return `${days} guyyaa dura`;
    return d.toLocaleDateString("en-US");
  }
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US");
}
