"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { MapPin, Briefcase, Inbox, Users, Phone, GraduationCap, FileText, MessageSquare, ExternalLink, BadgeCheck, Clock, Upload, X, CheckCircle2, XCircle, CreditCard, Loader2 } from "lucide-react";
import { type Lang } from "@/lib/client/types";
import { t } from "@/lib/i18n";
import { haptic } from "@/hooks/use-telegram";
import { toast } from "sonner";

interface MyApplication {
  id: string;
  status: "PENDING" | "ACCEPTED" | "PAYMENT_PENDING" | "HIRED" | "REJECTED" | "CLOSED";
  createdAt: string;
  message: string | null;
  paymentScreenshot: string | null;
  paymentStatus: string;
  paymentRejectionReason: string | null;
  job: {
    id: string;
    title: string;
    location: string | null;
    salary: string | null;
    subjects: string;
    gradeLevel: string | null;
    workType: string;
    status: string;
    deadline: string | null;
    positionsAvailable: number | null;
    filledPositions: number;
    applicationFee: number | null;
    employer: {
      companyName: string | null;
      companyTelegram: string | null;
      verification: string;
    };
  };
}

interface ApplicantApplication {
  id: string;
  status: "PENDING" | "ACCEPTED" | "PAYMENT_PENDING" | "HIRED" | "REJECTED" | "CLOSED";
  createdAt: string;
  message: string | null;
  paymentScreenshot: string | null;
  paymentStatus: string;
  job: {
    id: string;
    title: string;
    location: string | null;
    salary: string | null;
    subjects: string;
    gradeLevel: string | null;
    workType: string;
    positionsAvailable: number | null;
    filledPositions: number;
    status: string;
    applicationFee: number | null;
  };
  user: {
    id: string;
    telegramId: string;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    fullName: string | null;
    phone: string | null;
    photoUrl: string | null;
    university: string | null;
    fieldOfStudy: string | null;
    year: number | null;
    bio: string | null;
    cvUrl: string | null;
    language: string;
    // Mandatory documents (visible to employer)
    nationalIdNumber: string | null;
    nationalIdImage: string | null;
    universityIdNumber: string | null;
    universityIdImage: string | null;
    lastSemesterGradeImage: string | null;
    profileComplete: boolean;
  };
}

interface Props {
  lang: Lang;
  initData: string;
  onSelectJob: (jobId: string) => void;
  tg: unknown;
  isEmployer: boolean;
}

interface Settings {
  jobPostFee: number;
  applicationFee: number;
  paymentInstructions: string;
}

// Get effective fee for a job: per-job override if set, otherwise global default
function getFeeForJob(job: { applicationFee?: number | null }, settings: Settings): number {
  return job.applicationFee !== null && job.applicationFee !== undefined ? job.applicationFee : settings.applicationFee;
}

const statusColor: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  ACCEPTED: "bg-blue-100 text-blue-700",
  PAYMENT_PENDING: "bg-purple-100 text-purple-700",
  HIRED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  CLOSED: "bg-gray-200 text-gray-700",
};

const statusLabel = (s: string, lang: Lang) => {
  const map: Record<string, { en: string; am: string; or: string }> = {
    PENDING: { en: "Pending", am: "በመጠበቅ", or: "Eeggata" },
    ACCEPTED: { en: "Accepted — pay to confirm", am: "ተቀባይነት አግኝቷል", or: "Fudhatame" },
    PAYMENT_PENDING: { en: "Payment verifying", am: "ክፍያ በመገምገም", or: "Kaffaltii qabiyyee" },
    HIRED: { en: "Hired ✓", am: "ተቀጠረ", or: "Hoogganaa" },
    REJECTED: { en: "Not selected", am: "አልተመረጠም", or: "Hin filatamne" },
    CLOSED: { en: "Position closed", am: "ቦታ ተዘግቷል", or: "Iddoon cufame" },
  };
  return map[s]?.[lang] ?? s;
};

export default function ApplicationsView({ lang, initData, onSelectJob, tg, isEmployer }: Props) {
  const [tab, setTab] = useState<"mine" | "applicants">(isEmployer ? "applicants" : "mine");
  const [myApps, setMyApps] = useState<MyApplication[]>([]);
  const [applicantApps, setApplicantApps] = useState<ApplicantApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings | null>(null);

  const [viewingApplicant, setViewingApplicant] = useState<ApplicantApplication | null>(null);

  // Payment upload state (for student)
  const [payingAppId, setPayingAppId] = useState<string | null>(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const fetchApps = async () => {
    setLoading(true);
    const headers: HeadersInit = {};
    if (initData) headers["x-telegram-init-data"] = initData;
    try {
      const [mineRes, applicantsRes, setRes] = await Promise.all([
        fetch("/api/applications", { headers }),
        isEmployer ? fetch("/api/employer/applications", { headers }) : Promise.resolve(null),
        fetch("/api/settings"),
      ]);
      if (mineRes.ok) {
        const data = await mineRes.json();
        setMyApps(data.applications ?? []);
      }
      if (applicantsRes && applicantsRes.ok) {
        const data = await applicantsRes.json();
        setApplicantApps(data.applications ?? []);
      }
      if (setRes.ok) {
        const data = await setRes.json();
        setSettings(data.settings);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG or JPEG).");
      return;
    }
    if (file.size > 1_000_000) {
      toast.error("Image too large. Please use one under 1MB.");
      return;
    }
    haptic(tg as never, "light");
    const reader = new FileReader();
    reader.onload = () => setPaymentScreenshot(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submitPayment = async (appId: string) => {
    if (!paymentScreenshot) {
      toast.error("Please upload your payment screenshot first.");
      return;
    }
    haptic(tg as never, "medium");
    setUploading(true);
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (initData) headers["x-telegram-init-data"] = initData;
      const res = await fetch(`/api/applications/${appId}/pay`, {
        method: "POST",
        headers,
        body: JSON.stringify({ paymentScreenshot }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error ?? "Failed");
      }
      haptic(tg as never, "success");
      toast.success("Payment uploaded! Admin will review and confirm your hire.");
      setPayingAppId(null);
      setPaymentScreenshot("");
      fetchApps();
    } catch (e) {
      haptic(tg as never, "error");
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setUploading(false);
    }
  };

  const acceptApplicant = async (appId: string) => {
    haptic(tg as never, "medium");
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (initData) headers["x-telegram-init-data"] = initData;
    const res = await fetch(`/api/applications/${appId}/accept`, {
      method: "POST", headers, body: JSON.stringify({}),
    });
    if (res.ok) {
      haptic(tg as never, "success");
      toast.success("Applicant accepted! They've been notified to pay the confirmation fee.");
      fetchApps();
    } else {
      haptic(tg as never, "error");
      const e = await res.json().catch(() => ({}));
      toast.error(e.error ?? "Failed");
    }
  };

  const rejectApplicant = async (appId: string) => {
    haptic(tg as never, "medium");
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (initData) headers["x-telegram-init-data"] = initData;
    const res = await fetch(`/api/applications/${appId}/reject`, {
      method: "POST", headers, body: JSON.stringify({}),
    });
    if (res.ok) {
      haptic(tg as never, "success");
      toast.success("Applicant rejected — they've been notified.");
      fetchApps();
    } else {
      haptic(tg as never, "error");
      toast.error("Failed");
    }
  };

  // Render
  if (!isEmployer) {
    return (
      <div className="flex flex-col gap-3 px-3 pb-24 pt-3">
        <h1 className="text-xl font-bold">{t(lang, "appsTitle")}</h1>
        {loading ? (
          <div className="flex flex-col gap-2.5">{[1, 2, 3].map((i) => <Card key={i} className="p-4"><Skeleton className="h-5 w-3/4 mb-2" /><Skeleton className="h-3 w-1/2" /></Card>)}</div>
        ) : myApps.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground flex flex-col items-center gap-3">
            <Inbox className="h-8 w-8 opacity-40" />
            <p className="text-sm">{t(lang, "appsEmpty")}</p>
          </Card>
        ) : (
          <StudentApplicationList
            apps={myApps}
            lang={lang}
            settings={settings}
            onSelectJob={onSelectJob}
            tg={tg}
            payingAppId={payingAppId}
            setPayingAppId={setPayingAppId}
            paymentScreenshot={paymentScreenshot}
            setPaymentScreenshot={setPaymentScreenshot}
            handleScreenshotUpload={handleScreenshotUpload}
            submitPayment={submitPayment}
            uploading={uploading}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-3 pb-24 pt-3">
      <h1 className="text-xl font-bold">{t(lang, "appsTitle")}</h1>
      <Tabs value={tab} onValueChange={(v) => { haptic(tg as never, "light"); setTab(v as typeof tab); }}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="applicants" className="text-xs">
            <Users className="h-3.5 w-3.5 mr-1.5" />Applicants
            {applicantApps.length > 0 && <span className="ml-1.5 inline-flex items-center justify-center min-w-[16px] h-4 text-[10px] font-bold rounded-full bg-blue-500 text-white">{applicantApps.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="mine" className="text-xs"><Inbox className="h-3.5 w-3.5 mr-1.5" />{t(lang, "appsTitle")}</TabsTrigger>
        </TabsList>

        <TabsContent value="applicants" className="mt-3">
          {loading ? (
            <div className="flex flex-col gap-2.5">{[1, 2, 3].map((i) => <Card key={i} className="p-4"><Skeleton className="h-5 w-3/4 mb-2" /><Skeleton className="h-3 w-1/2" /></Card>)}</div>
          ) : applicantApps.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground flex flex-col items-center gap-3">
              <Users className="h-8 w-8 opacity-40" />
              <p className="text-sm">No applicants yet. When students apply to your jobs, they'll appear here with their full profile.</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-2.5">
              {applicantApps.map((a) => {
                const name = a.user.fullName ?? [a.user.firstName, a.user.lastName].filter(Boolean).join(" ") ?? "Applicant";
                return (
                  <Card key={a.id} className="p-4 flex flex-col gap-2">
                    <div className="flex items-start gap-3 cursor-pointer" onClick={() => { haptic(tg as never, "light"); setViewingApplicant(a); }}>
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold">{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <h3 className="font-semibold text-[15px] leading-tight truncate">{name}</h3>
                          <Badge variant="secondary" className={`text-[10px] h-5 shrink-0 ${statusColor[a.status] ?? ""}`}>{statusLabel(a.status, lang)}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mb-1">Applied to: <span className="font-medium text-foreground">{a.job.title}</span></p>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                          {a.user.university && <span className="inline-flex items-center gap-0.5"><GraduationCap className="h-3 w-3" />{a.user.university}</span>}
                          {a.user.fieldOfStudy && <span>· {a.user.fieldOfStudy}</span>}
                          {a.user.year && <span>· Year {a.user.year}</span>}
                          {a.job.positionsAvailable && <span>· {a.job.filledPositions}/{a.job.positionsAvailable} hired</span>}
                        </div>
                      </div>
                    </div>

                    {/* Employer actions */}
                    {(a.status === "PENDING") && (
                      <div className="flex gap-2 mt-1">
                        <Button size="sm" className="flex-1 h-8 bg-green-600 hover:bg-green-700" onClick={() => acceptApplicant(a.id)}>
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />Accept
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 h-8 text-destructive border-destructive/40 hover:bg-destructive/5" onClick={() => rejectApplicant(a.id)}>
                          <XCircle className="h-3.5 w-3.5 mr-1" />Reject
                        </Button>
                      </div>
                    )}
                    {a.status === "ACCEPTED" && (
                      <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">✓ Accepted — waiting for student to pay confirmation fee</p>
                    )}
                    {a.status === "PAYMENT_PENDING" && (
                      <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">⏳ Student paid — admin is verifying</p>
                    )}
                    {a.status === "HIRED" && (
                      <p className="text-xs text-green-700 dark:text-green-400 mt-1">✓ Hired</p>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mine" className="mt-3">
          {loading ? (
            <div className="flex flex-col gap-2.5">{[1, 2, 3].map((i) => <Card key={i} className="p-4"><Skeleton className="h-5 w-3/4 mb-2" /><Skeleton className="h-3 w-1/2" /></Card>)}</div>
          ) : myApps.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground flex flex-col items-center gap-3">
              <Inbox className="h-8 w-8 opacity-40" />
              <p className="text-sm">{t(lang, "appsEmpty")}</p>
            </Card>
          ) : (
            <StudentApplicationList
              apps={myApps}
              lang={lang}
              settings={settings}
              onSelectJob={onSelectJob}
              tg={tg}
              payingAppId={payingAppId}
              setPayingAppId={setPayingAppId}
              paymentScreenshot={paymentScreenshot}
              setPaymentScreenshot={setPaymentScreenshot}
              handleScreenshotUpload={handleScreenshotUpload}
              submitPayment={submitPayment}
              uploading={uploading}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Applicant profile sheet */}
      <Sheet open={!!viewingApplicant} onOpenChange={(o) => { if (!o) setViewingApplicant(null); }}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] overflow-y-auto">
          {viewingApplicant && (
            <>
              <SheetHeader>
                <SheetTitle className="text-base flex items-center gap-2">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold">
                      {(viewingApplicant.user.fullName ?? viewingApplicant.user.firstName ?? "A").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {viewingApplicant.user.fullName ?? [viewingApplicant.user.firstName, viewingApplicant.user.lastName].filter(Boolean).join(" ") ?? "Applicant"}
                </SheetTitle>
              </SheetHeader>
              <div className="p-4 flex flex-col gap-3">
                <Card className="p-3 bg-muted/50">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">Applied to</p>
                  <p className="text-sm font-semibold">{viewingApplicant.job.title}</p>
                  {viewingApplicant.job.location && <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><MapPin className="h-3 w-3" />{viewingApplicant.job.location}</p>}
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <Badge variant="secondary" className={`text-[10px] h-5 ${statusColor[viewingApplicant.status] ?? ""}`}>{statusLabel(viewingApplicant.status, lang)}</Badge>
                    <span className="text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(viewingApplicant.createdAt).toLocaleDateString()}</span>
                  </div>
                </Card>

                <div className="flex flex-wrap gap-2">
                  {viewingApplicant.user.phone && (
                    <Button size="sm" variant="outline" className="h-9" onClick={() => { haptic(tg as never, "light"); if (typeof window !== "undefined") window.open(`tel:${viewingApplicant.user.phone!}`, "_blank"); }}>
                      <Phone className="h-3.5 w-3.5 mr-1.5" />{viewingApplicant.user.phone}
                    </Button>
                  )}
                  {viewingApplicant.user.username && (
                    <Button size="sm" variant="outline" className="h-9" onClick={() => { haptic(tg as never, "light"); if (typeof window !== "undefined") window.open(`https://t.me/${viewingApplicant.user.username}`, "_blank"); }}>
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />@{viewingApplicant.user.username}
                    </Button>
                  )}
                  {viewingApplicant.user.cvUrl && (
                    <Button size="sm" variant="outline" className="h-9" onClick={() => { haptic(tg as never, "light"); if (typeof window !== "undefined") window.open(viewingApplicant.user.cvUrl!, "_blank"); }}>
                      <FileText className="h-3.5 w-3.5 mr-1.5" />CV
                    </Button>
                  )}
                </div>

                {(viewingApplicant.user.university || viewingApplicant.user.fieldOfStudy || viewingApplicant.user.year) && (
                  <div>
                    <h4 className="text-xs font-semibold flex items-center gap-1.5 mb-1.5 text-muted-foreground"><GraduationCap className="h-3.5 w-3.5" />Education</h4>
                    <div className="text-sm space-y-0.5">
                      {viewingApplicant.user.university && <p>{viewingApplicant.user.university}</p>}
                      {viewingApplicant.user.fieldOfStudy && <p className="text-muted-foreground">{viewingApplicant.user.fieldOfStudy}{viewingApplicant.user.year ? ` · Year ${viewingApplicant.user.year}` : ""}</p>}
                    </div>
                  </div>
                )}

                {viewingApplicant.user.bio && (
                  <div>
                    <h4 className="text-xs font-semibold flex items-center gap-1.5 mb-1.5 text-muted-foreground"><MessageSquare className="h-3.5 w-3.5" />About</h4>
                    <p className="text-sm text-muted-foreground">{viewingApplicant.user.bio}</p>
                  </div>
                )}

                {viewingApplicant.message && (
                  <div>
                    <h4 className="text-xs font-semibold flex items-center gap-1.5 mb-1.5 text-muted-foreground"><MessageSquare className="h-3.5 w-3.5" />Their message to you</h4>
                    <p className="text-sm italic bg-muted/50 p-3 rounded-lg">“{viewingApplicant.message}”</p>
                  </div>
                )}

                {/* Mandatory documents — National ID, University ID, Grade Report */}
                <div>
                  <h4 className="text-xs font-semibold flex items-center gap-1.5 mb-2 text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    Required Documents
                    {viewingApplicant.user.profileComplete ? (
                      <Badge variant="secondary" className="text-[10px] h-5 bg-green-100 text-green-700 ml-auto">✓ Verified</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] h-5 bg-amber-100 text-amber-700 ml-auto">Incomplete</Badge>
                    )}
                  </h4>
                  <div className="flex flex-col gap-3">
                    {/* National ID */}
                    <div className="flex flex-col gap-1">
                      <p className="text-[11px] font-medium text-muted-foreground">
                        National ID {viewingApplicant.user.nationalIdNumber ? `· ${viewingApplicant.user.nationalIdNumber}` : "· (no number)"}
                      </p>
                      {viewingApplicant.user.nationalIdImage ? (
                        <img src={viewingApplicant.user.nationalIdImage} alt="National ID" className="w-full rounded-lg border border-border max-h-56 object-contain bg-muted/30" />
                      ) : (
                        <p className="text-xs text-amber-700 dark:text-amber-400 italic">Not uploaded</p>
                      )}
                    </div>
                    {/* University ID */}
                    <div className="flex flex-col gap-1">
                      <p className="text-[11px] font-medium text-muted-foreground">
                        University ID {viewingApplicant.user.universityIdNumber ? `· ${viewingApplicant.user.universityIdNumber}` : "· (no number)"}
                      </p>
                      {viewingApplicant.user.universityIdImage ? (
                        <img src={viewingApplicant.user.universityIdImage} alt="University ID" className="w-full rounded-lg border border-border max-h-56 object-contain bg-muted/30" />
                      ) : (
                        <p className="text-xs text-amber-700 dark:text-amber-400 italic">Not uploaded</p>
                      )}
                    </div>
                    {/* Grade Report */}
                    <div className="flex flex-col gap-1">
                      <p className="text-[11px] font-medium text-muted-foreground">Last semester grade report</p>
                      {viewingApplicant.user.lastSemesterGradeImage ? (
                        <img src={viewingApplicant.user.lastSemesterGradeImage} alt="Grade report" className="w-full rounded-lg border border-border max-h-56 object-contain bg-muted/30" />
                      ) : (
                        <p className="text-xs text-amber-700 dark:text-amber-400 italic">Not uploaded</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <SheetFooter>
                <Button variant="outline" onClick={() => { haptic(tg as never, "light"); setViewingApplicant(null); }}>{t(lang, "close")}</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Reusable student application list (used in both standalone and tabbed views)
function StudentApplicationList({
  apps, lang, settings, onSelectJob, tg, payingAppId, setPayingAppId,
  paymentScreenshot, setPaymentScreenshot, handleScreenshotUpload, submitPayment, uploading,
}: {
  apps: MyApplication[];
  lang: Lang;
  settings: Settings | null;
  onSelectJob: (jobId: string) => void;
  tg: unknown;
  payingAppId: string | null;
  setPayingAppId: (id: string | null) => void;
  paymentScreenshot: string;
  setPaymentScreenshot: (s: string) => void;
  handleScreenshotUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitPayment: (appId: string) => void;
  uploading: boolean;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {apps.map((a) => (
        <Card key={a.id} className="p-4 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2 mb-1.5 cursor-pointer" onClick={() => { haptic(tg as never, "light"); onSelectJob(a.job.id); }}>
            <h3 className="font-semibold text-[15px] leading-snug flex-1">{a.job.title}</h3>
            <Badge variant="secondary" className={`text-[10px] h-5 ${statusColor[a.status] ?? ""}`}>{statusLabel(a.status, lang)}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-2 cursor-pointer" onClick={() => { haptic(tg as never, "light"); onSelectJob(a.job.id); }}>
            <span>{a.job.employer.companyName ?? "—"}</span>
            {a.job.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{a.job.location}</span>}
            {a.job.positionsAvailable && <span>· {a.job.filledPositions}/{a.job.positionsAvailable} hired</span>}
          </div>
          {a.message && <p className="text-xs text-muted-foreground line-clamp-2 italic">“{a.message}”</p>}

          {/* Payment rejection reason */}
          {a.status === "ACCEPTED" && a.paymentStatus === "REJECTED" && a.paymentRejectionReason && (
            <p className="text-xs text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-2 rounded">
              ❌ Payment rejected: {a.paymentRejectionReason}. Please re-upload.
            </p>
          )}

          {/* Accept → Pay flow */}
          {a.status === "ACCEPTED" && settings && (
            payingAppId === a.id ? (
              <div className="flex flex-col gap-2 mt-1">
                <p className="text-xs font-medium">Pay {getFeeForJob(a.job, settings)} ETB to confirm your spot</p>
                <p className="text-[11px] text-muted-foreground whitespace-pre-line">{settings.paymentInstructions}</p>
                {paymentScreenshot ? (
                  <div className="relative">
                    <img src={paymentScreenshot} alt="Payment" className="w-full rounded-lg border border-border max-h-48 object-contain bg-muted/30" />
                    <Button size="sm" variant="destructive" className="absolute top-2 right-2 h-7 px-2" onClick={() => setPaymentScreenshot("")}><X className="h-3 w-3" /></Button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs font-medium">Upload payment screenshot</span>
                    <span className="text-[10px] text-muted-foreground">PNG or JPEG, max 1MB</span>
                    <input type="file" accept="image/png,image/jpeg" onChange={handleScreenshotUpload} className="hidden" />
                  </label>
                )}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => { setPayingAppId(null); setPaymentScreenshot(""); }}>Cancel</Button>
                  <Button size="sm" className="flex-1" onClick={() => submitPayment(a.id)} disabled={uploading || !paymentScreenshot}>
                    {uploading ? <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />Uploading…</> : <><CreditCard className="h-3.5 w-3.5 mr-1" />Submit payment</>}
                  </Button>
                </div>
              </div>
            ) : (
              <Button size="sm" className="mt-1" onClick={() => { haptic(tg as never, "light"); setPayingAppId(a.id); }}>
                <CreditCard className="h-3.5 w-3.5 mr-1.5" />Pay {getFeeForJob(a.job, settings)} ETB to confirm
              </Button>
            )
          )}
        </Card>
      ))}
    </div>
  );
}
