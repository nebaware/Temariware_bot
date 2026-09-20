// Client-side parser for Telegram Mini App start_param.
import type { View } from "./types";

export function parseStartParam(startParam: string | null): {
  view?: View;
  jobId?: string;
} {
  if (!startParam) return {};
  if (startParam.startsWith("job_")) return { view: "job", jobId: startParam.slice(4) };
  if (startParam === "post") return { view: "post" };
  if (startParam === "admin") return { view: "admin" };
  if (startParam === "applications") return { view: "applications" };
  if (startParam === "profile") return { view: "profile" };
  return {};
}
