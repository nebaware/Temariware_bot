"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, MapPin, Briefcase, Clock, Users, GraduationCap, Calendar, Languages, User, Send, CheckCircle2, BadgeCheck, AlertCircle, ExternalLink } from "lucide-react";
import { type JobDetail, type Lang, type UserState, deadlineText } from "@/lib/client/types";
import { t } from "@/lib/i18n";
import { haptic } from "@/hooks/use-telegram";
import { toast } from "sonner";

interface Props {
  jobId: string;
  lang: Lang;
  initData: string;
  user: UserState | null;
  onBack: () => void;
  tg: unknown;
}

export default function JobDetailView({ jobId, lang, initData, user, onBack, tg }: Props) {
  const [job, setJob] = useState<JobDetail | null>(null);
  const [myApplication, setMyApplication] = useState<{ status: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApply, setShowApply] = useState(false);
  const [applyMsg, setApplyMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchJob = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers: HeadersInit = {};
      if (initData) headers["x-telegram-init-data"] = initData;
      const res = await fetch(`/api/jobs/${jobId}`, { headers });
      if (!res.ok) throw new Error("Failed to load job");
      const data = await res.json();
      setJob(data.job);
      setMyApplication(data.myApplication);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const submitApplication = async () => {
    haptic(tg as never, "medium");
    setSubmitting(true);
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (initData) headers["x-telegram-init-data"] = initData;
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers,
        body: JSON.stringify({ message: applyMsg }),
      });
      if (res.status === 409) {
        toast.error(t(lang, "applyAlready"));
        return;
      }
      if (res.status === 403) {
        const e = await res.json().catch(() => ({}));
        if (e.profileIncomplete) {
          haptic(tg as never, "error");
          toast.error(`Profile incomplete. Please add: ${e.missing?.join(", ")}.`);
          // Direct user to profile
          setTimeout(() => {
            const event = new CustomEvent("navigate", { detail: { view: "profile" } });
            window.dispatchEvent(event);
          }, 1500);
          return;
        }
        throw new Error(e.error ?? "Failed");
      }
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error ?? "Failed");
      }
      haptic(tg as never, "success");
      toast.success(t(lang, "applySuccess"));
      setShowApply(false);
      setMyApplication({ status: "PENDING" });
    } catch (e) {
      haptic(tg as never, "error");
      toast.error(e instanceof Error ? e.message : t(lang, "applyError"));
    } finally {
      setSubmitting(false);
    }
  };

  const dl = job ? deadlineText(job.deadline, lang, t) : null;
  const employerName = job?.employer?.companyName ?? job?.employer?.firstName ?? "—";

  return (
    <div className="flex flex-col gap-3 px-3 pb-24 pt-3">
      {/* Header with back button */}
      <div className="flex items-center gap-2 -ml-1">
        <Button variant="ghost" size="sm" className="h-9 px-2" onClick={() => { haptic(tg as never, "light"); onBack(); }}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t(lang, "back")}
        </Button>
      </div>

      {/* "Open in Telegram" banner — shown when user is not authenticated (opened in browser) */}
      {!user && !loading && job && (
        <Card className="p-3 border-blue-500/40 bg-blue-50 dark:bg-blue-950/30 flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                Open in Telegram to apply
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
                You're viewing in a browser. To apply, you need to open this inside Telegram.
              </p>
            </div>
          </div>
          <a
            href="https://t.me/temariwarebot"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button size="sm" className="w-full h-10">
              <ExternalLink className="h-4 w-4 mr-1.5" />
              Open @temariwarebot in Telegram
            </Button>
          </a>
        </Card>
      )}

      {loading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : error ? (
        <Card className="p-4 text-sm text-destructive border-destructive/40">
          {error} — <button className="underline" onClick={fetchJob}>{t(lang, "retry")}</button>
        </Card>
      ) : job ? (
        <>
          {/* Title + badges */}
          <div>
            <div className="flex items-start gap-2 mb-2">
              {dl?.urgent && !dl.expired && (
                <Badge variant="destructive" className="text-[10px] h-5">{t(lang, "badgeUrgent")}</Badge>
              )}
              {dl?.expired && (
                <Badge variant="secondary" className="text-[10px] h-5">{t(lang, "expired")}</Badge>
              )}
            </div>
            <h1 className="text-xl font-bold leading-tight mb-2">{job.title}</h1>

            {/* Employer row */}
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-muted text-xs">
                  {employerName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium truncate">{employerName}</span>
                  {job.employer.verification === "APPROVED" && (
                    <BadgeCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {job.employer.companyTelegram ?? `@${job.employer.username ?? "—"}`}
                </span>
              </div>
            </div>

            {/* Quick facts grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {job.subjects && (
                <Fact icon={<GraduationCap className="h-3.5 w-3.5" />} label={t(lang, "filterSubject")} value={job.subjects} />
              )}
              {job.location && (
                <Fact icon={<MapPin className="h-3.5 w-3.5" />} label={t(lang, "filterLocation")} value={job.location} />
              )}
              <Fact icon={<Briefcase className="h-3.5 w-3.5" />} label={t(lang, "filterType")}
                value={t(lang, `jobType${job.workType.charAt(0)}${job.workType.slice(1).toLowerCase().replace(/_./g, (m) => m.charAt(1).toUpperCase())}`)} />
              {job.salary && (
                <Fact icon={<span className="text-[11px] font-bold">ETB</span>} label={lang === "am" ? "ደመወዝ" : lang === "or" ? "Mindaa" : "Salary"} value={job.salary} />
              )}
              {job.hoursPerWeek && (
                <Fact icon={<Clock className="h-3.5 w-3.5" />} label={t(lang, "jobSchedule")} value={job.hoursPerWeek} />
              )}
              {job.gradeLevel && (
                <Fact icon={<GraduationCap className="h-3.5 w-3.5" />} label={t(lang, "filterGrade")} value={job.gradeLevel} />
              )}
              {job.genderPref && job.genderPref !== "any" && (
                <Fact icon={<User className="h-3.5 w-3.5" />} label={t(lang, "filterGender")} value={job.genderPref === "male" ? t(lang, "postGenderMale") : t(lang, "postGenderFemale")} />
              )}
              {job.languageReq && (
                <Fact icon={<Languages className="h-3.5 w-3.5" />} label={t(lang, "filterLanguage")} value={job.languageReq} />
              )}
              {job.deadline && (
                <Fact icon={<Calendar className="h-3.5 w-3.5" />} label={t(lang, "deadline")} value={dl?.text ?? ""} urgent={dl?.urgent} />
              )}
            </div>
          </div>

          {/* Description */}
          <Card className="p-4">
            <h2 className="text-sm font-semibold mb-2">{t(lang, "jobAbout")}</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{job.description}</p>
          </Card>

          {/* Stats footer */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground px-1">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3" />
              {t(lang, "applicants", { n: job._count.applications })}
            </span>
          </div>

          {/* Apply card */}
          <div className="sticky bottom-16 z-10">
            {job.status === "CLOSED" ? (
              <Card className="p-3 border-gray-400/40 bg-gray-100 dark:bg-gray-900/40 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-gray-600 shrink-0" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  This job is closed — all positions have been filled.
                </span>
              </Card>
            ) : myApplication ? (
              <Card className={`p-3 flex items-center gap-2 ${
                myApplication.status === "HIRED" ? "border-green-500/40 bg-green-50 dark:bg-green-950/30" :
                myApplication.status === "ACCEPTED" ? "border-blue-500/40 bg-blue-50 dark:bg-blue-950/30" :
                myApplication.status === "REJECTED" || myApplication.status === "CLOSED" ? "border-red-500/40 bg-red-50 dark:bg-red-950/30" :
                "border-amber-500/40 bg-amber-50 dark:bg-amber-950/30"
              }`}>
                <CheckCircle2 className={`h-5 w-5 ${
                  myApplication.status === "HIRED" ? "text-green-600" :
                  myApplication.status === "ACCEPTED" ? "text-blue-600" :
                  myApplication.status === "REJECTED" || myApplication.status === "CLOSED" ? "text-red-600" :
                  "text-amber-600"
                }`} />
                <span className="text-sm font-medium">
                  {myApplication.status === "HIRED" ? "🎉 You're hired!" :
                   myApplication.status === "ACCEPTED" ? "✓ Accepted — pay confirmation fee in My applications" :
                   myApplication.status === "PAYMENT_PENDING" ? "⏳ Payment under review" :
                   myApplication.status === "REJECTED" ? "Not selected" :
                   myApplication.status === "CLOSED" ? "Position filled by another applicant" :
                   t(lang, "applied")}
                </span>
              </Card>
            ) : showApply ? (
              <Card className="p-3 flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground">{t(lang, "applyMessageLabel")}</label>
                <Textarea
                  value={applyMsg}
                  onChange={(e) => setApplyMsg(e.target.value)}
                  placeholder={t(lang, "applyMessagePlaceholder")}
                  rows={3}
                  maxLength={1000}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowApply(false)} disabled={submitting}>
                    {t(lang, "cancel")}
                  </Button>
                  <Button size="sm" className="flex-1" onClick={submitApplication} disabled={submitting}>
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    {submitting ? "..." : t(lang, "applyNow")}
                  </Button>
                </div>
              </Card>
            ) : !user ? (
              <Card className="p-3 border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                <span className="text-xs text-amber-800 dark:text-amber-300">{t(lang, "applyLoginFirst")}</span>
              </Card>
            ) : !user.profileComplete ? (
              <Card className="p-3 border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                      Profile incomplete — required documents missing
                    </p>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                      You need to upload National ID, University ID, and grade report before applying.
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => {
                  haptic(tg as never, "medium");
                  const event = new CustomEvent("navigate", { detail: { view: "profile" } });
                  window.dispatchEvent(event);
                }}>
                  Go to Profile →
                </Button>
              </Card>
            ) : (
              <Button
                className="w-full h-12 text-base font-medium rounded-xl"
                onClick={() => { haptic(tg as never, "medium"); setShowApply(true); }}
                disabled={dl?.expired}
              >
                {t(lang, "applyNow")}
              </Button>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

function Fact({ icon, label, value, urgent }: { icon: React.ReactNode; label: string; value: string; urgent?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 p-2 rounded-lg bg-muted/50">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
        {icon}
        {label}
      </span>
      <span className={`text-xs font-medium ${urgent ? "text-destructive" : ""}`}>{value}</span>
    </div>
  );
}
