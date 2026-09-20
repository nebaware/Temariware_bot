"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { CheckCircle2, XCircle, Users, FileText, Clock, BadgeCheck, ShieldAlert, CreditCard, Settings as SettingsIcon, Image as ImageIcon } from "lucide-react";
import { type Lang, type UserState } from "@/lib/client/types";
import { t } from "@/lib/i18n";
import { haptic } from "@/hooks/use-telegram";
import { toast } from "sonner";

interface Props {
  lang: Lang;
  initData: string;
  user: UserState | null;
  tg: unknown;
}

interface PendingJob {
  id: string;
  title: string;
  description: string;
  subjects: string;
  location: string | null;
  salary: string | null;
  hoursPerWeek: string | null;
  genderPref: string | null;
  gradeLevel: string | null;
  languageReq: string | null;
  deadline: string | null;
  contactTelegram: string | null;
  positionsAvailable: number | null;
  paymentScreenshot: string | null;
  paymentStatus: string;
  status: string;
  createdAt: string;
  employer: {
    id: string;
    companyName: string | null;
    companyTelegram: string | null;
    username: string | null;
    firstName: string | null;
    verification: string;
  };
}

interface VerificationReq {
  id: string;
  companyName: string;
  contactTelegram: string;
  proofUrl: string | null;
  note: string | null;
  createdAt: string;
  user: {
    id: string;
    telegramId: string;
    username: string | null;
    firstName: string | null;
  };
}

interface PendingPayment {
  id: string;
  status: string;
  createdAt: string;
  message: string | null;
  paymentScreenshot: string | null;
  job: {
    id: string;
    title: string;
    positionsAvailable: number | null;
    filledPositions: number;
    employerId: string;
  };
  user: {
    id: string;
    telegramId: string;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    fullName: string | null;
    phone: string | null;
    university: string | null;
    fieldOfStudy: string | null;
    year: number | null;
  };
}

interface Settings {
  jobPostFee: number;
  applicationFee: number;
  paymentInstructions: string;
  telebirrNumber: string | null;
  cbeAccount: string | null;
  chapaEnabled: boolean;
}

export default function AdminView({ lang, initData, user, tg }: Props) {
  const [tab, setTab] = useState<"jobs" | "verify" | "payments" | "settings" | "stats">("jobs");
  const [pending, setPending] = useState<PendingJob[]>([]);
  const [verifs, setVerifs] = useState<VerificationReq[]>([]);
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [stats, setStats] = useState<{ totalUsers: number; totalJobs: number; pendingJobs: number; approvedJobs: number; totalApps: number } | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const [rejecting, setRejecting] = useState<{ kind: "job" | "verify" | "payment"; id: string; title: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Settings form
  const [settingsForm, setSettingsForm] = useState<Settings>({
    jobPostFee: 50, applicationFee: 25,
    paymentInstructions: "Send payment via Telebirr to: 0911 23 45 67\nThen upload the screenshot below.",
    telebirrNumber: "", cbeAccount: "", chapaEnabled: false,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const headers: HeadersInit = {};
    if (initData) headers["x-telegram-init-data"] = initData;
    try {
      const [p, v, s, pays, set] = await Promise.all([
        fetch("/api/admin?view=pending", { headers }).then((r) => r.json()),
        fetch("/api/admin?view=verifications", { headers }).then((r) => r.json()),
        fetch("/api/admin?view=stats", { headers }).then((r) => r.json()),
        fetch("/api/admin?view=payments", { headers }).then((r) => r.json()),
        fetch("/api/settings").then((r) => r.json()),
      ]);
      setPending(p.jobs ?? []);
      setVerifs(v.requests ?? []);
      setStats(s.stats ?? null);
      setPayments(pays.applications ?? []);
      const sData = set.settings;
      if (sData) {
        setSettings(sData);
        setSettingsForm(sData);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (user?.isAdmin) fetchAll();
  }, [user?.isAdmin]);

  if (!user?.isAdmin) {
    return (
      <div className="p-6 text-center text-muted-foreground flex flex-col items-center gap-2">
        <ShieldAlert className="h-8 w-8 opacity-40" />
        {t(lang, "botNotAdmin")}
      </div>
    );
  }

  const approveJob = async (id: string) => {
    haptic(tg as never, "medium");
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (initData) headers["x-telegram-init-data"] = initData;
    const res = await fetch(`/api/admin/jobs/${id}`, {
      method: "POST", headers, body: JSON.stringify({ action: "approve" }),
    });
    if (res.ok) {
      const data = await res.json();
      haptic(tg as never, "success");
      toast.success(`Approved! Broadcast: ${data.broadcastCount ?? 0} subscribers, channel: ${data.channelPosted ? "yes" : "no"}`);
      setPending((p) => p.filter((j) => j.id !== id));
    } else {
      haptic(tg as never, "error");
      toast.error("Failed to approve");
    }
  };

  const rejectJob = async () => {
    if (!rejecting || rejecting.kind !== "job") return;
    haptic(tg as never, "medium");
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (initData) headers["x-telegram-init-data"] = initData;
    const res = await fetch(`/api/admin/jobs/${rejecting.id}`, {
      method: "POST", headers, body: JSON.stringify({ action: "reject", reason: rejectReason }),
    });
    if (res.ok) {
      haptic(tg as never, "success");
      toast.success("Job rejected");
      setPending((p) => p.filter((j) => j.id !== rejecting.id));
      setRejecting(null);
      setRejectReason("");
    } else {
      haptic(tg as never, "error");
      toast.error("Failed");
    }
  };

  const approveVerify = async (id: string) => {
    haptic(tg as never, "medium");
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (initData) headers["x-telegram-init-data"] = initData;
    const res = await fetch(`/api/admin/verify/${id}`, {
      method: "POST", headers, body: JSON.stringify({ action: "approve" }),
    });
    if (res.ok) {
      haptic(tg as never, "success");
      toast.success("Verification approved");
      setVerifs((v) => v.filter((r) => r.id !== id));
    } else {
      haptic(tg as never, "error");
      toast.error("Failed");
    }
  };

  const rejectVerify = async () => {
    if (!rejecting || rejecting.kind !== "verify") return;
    haptic(tg as never, "medium");
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (initData) headers["x-telegram-init-data"] = initData;
    const res = await fetch(`/api/admin/verify/${rejecting.id}`, {
      method: "POST", headers, body: JSON.stringify({ action: "reject", reason: rejectReason }),
    });
    if (res.ok) {
      haptic(tg as never, "success");
      toast.success("Verification rejected");
      setVerifs((v) => v.filter((r) => r.id !== rejecting.id));
      setRejecting(null);
      setRejectReason("");
    }
  };

  const approvePayment = async (id: string) => {
    haptic(tg as never, "medium");
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (initData) headers["x-telegram-init-data"] = initData;
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: "POST", headers, body: JSON.stringify({ action: "approve" }),
    });
    if (res.ok) {
      const data = await res.json();
      haptic(tg as never, "success");
      toast.success(
        data.autoClosed
          ? "Payment approved — applicant hired! Job auto-closed (positions filled)."
          : "Payment approved — applicant hired!"
      );
      setPayments((p) => p.filter((pmt) => pmt.id !== id));
    } else {
      haptic(tg as never, "error");
      toast.error("Failed");
    }
  };

  const rejectPayment = async () => {
    if (!rejecting || rejecting.kind !== "payment") return;
    haptic(tg as never, "medium");
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (initData) headers["x-telegram-init-data"] = initData;
    const res = await fetch(`/api/admin/applications/${rejecting.id}`, {
      method: "POST", headers, body: JSON.stringify({ action: "reject", reason: rejectReason }),
    });
    if (res.ok) {
      haptic(tg as never, "success");
      toast.success("Payment rejected — student can re-upload");
      setPayments((p) => p.filter((pmt) => pmt.id !== rejecting.id));
      setRejecting(null);
      setRejectReason("");
    }
  };

  const saveSettings = async () => {
    haptic(tg as never, "medium");
    setSavingSettings(true);
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (initData) headers["x-telegram-init-data"] = initData;
      const res = await fetch("/api/settings", {
        method: "PATCH", headers, body: JSON.stringify(settingsForm),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
      haptic(tg as never, "success");
      toast.success("Settings saved!");
    } catch {
      haptic(tg as never, "error");
      toast.error("Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 px-3 pb-24 pt-3">
      <h1 className="text-xl font-bold">{t(lang, "adminTitle")}</h1>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="grid grid-cols-5 w-full text-[10px]">
          <TabsTrigger value="jobs">
            <Clock className="h-3 w-3 mr-0.5" />
            {pending.length > 0 && <span className="ml-1 inline-flex items-center justify-center min-w-[14px] h-3.5 text-[9px] font-bold rounded-full bg-destructive text-white">{pending.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="h-3 w-3 mr-0.5" />
            {payments.length > 0 && <span className="ml-1 inline-flex items-center justify-center min-w-[14px] h-3.5 text-[9px] font-bold rounded-full bg-destructive text-white">{payments.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="verify">
            <BadgeCheck className="h-3 w-3 mr-0.5" />
            {verifs.length > 0 && <span className="ml-1 inline-flex items-center justify-center min-w-[14px] h-3.5 text-[9px] font-bold rounded-full bg-destructive text-white">{verifs.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="settings"><SettingsIcon className="h-3 w-3" /></TabsTrigger>
          <TabsTrigger value="stats"><FileText className="h-3 w-3" /></TabsTrigger>
        </TabsList>

        {/* Pending jobs */}
        <TabsContent value="jobs" className="mt-3">
          {loading ? (
            <div className="flex flex-col gap-2.5">{[1, 2].map((i) => <Card key={i} className="p-4"><Skeleton className="h-5 w-3/4 mb-2" /><Skeleton className="h-3 w-1/2" /></Card>)}</div>
          ) : pending.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground text-sm">{t(lang, "adminNoJobs")}</Card>
          ) : (
            <div className="flex flex-col gap-2.5">
              {pending.map((job) => (
                <Card key={job.id} className="p-4 flex flex-col gap-3">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-[15px]">{job.title}</h3>
                      {job.status === "PENDING_PAYMENT" && (
                        <Badge variant="secondary" className="text-[10px] h-5 bg-amber-100 text-amber-700">Payment</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      by {job.employer.companyName ?? job.employer.firstName ?? "—"}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-line">{job.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {job.subjects.split(",").map((s, i) => <Badge key={i} variant="secondary" className="text-[10px] h-5">{s.trim()}</Badge>)}
                      {job.location && <Badge variant="secondary" className="text-[10px] h-5">{job.location}</Badge>}
                      {job.salary && <Badge variant="secondary" className="text-[10px] h-5">{job.salary}</Badge>}
                      {job.positionsAvailable && <Badge variant="secondary" className="text-[10px] h-5">Hiring: {job.positionsAvailable}</Badge>}
                    </div>
                  </div>

                  {/* Payment screenshot */}
                  {job.paymentScreenshot && (
                    <div>
                      <Label className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1 mb-1">
                        <ImageIcon className="h-3 w-3" />Payment screenshot
                      </Label>
                      <img src={job.paymentScreenshot} alt="Payment" className="w-full rounded-lg border border-border max-h-64 object-contain bg-muted/30" />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => approveJob(job.id)}>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />{t(lang, "adminApprove")}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-destructive border-destructive/40 hover:bg-destructive/5"
                      onClick={() => setRejecting({ kind: "job", id: job.id, title: job.title })}>
                      <XCircle className="h-3.5 w-3.5 mr-1" />{t(lang, "adminReject")}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Payments */}
        <TabsContent value="payments" className="mt-3">
          {loading ? (
            <div className="flex flex-col gap-2.5">{[1, 2].map((i) => <Card key={i} className="p-4"><Skeleton className="h-5 w-3/4 mb-2" /><Skeleton className="h-3 w-1/2" /></Card>)}</div>
          ) : payments.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground text-sm">
              <CreditCard className="h-8 w-8 mx-auto opacity-40 mb-2" />
              No pending payments. When students upload payment after being accepted, they'll appear here.
            </Card>
          ) : (
            <div className="flex flex-col gap-2.5">
              {payments.map((pmt) => {
                const name = pmt.user.fullName ?? [pmt.user.firstName, pmt.user.lastName].filter(Boolean).join(" ") ?? "Applicant";
                return (
                  <Card key={pmt.id} className="p-4 flex flex-col gap-3">
                    <div>
                      <h3 className="font-semibold text-[15px]">{name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Applied to: <span className="font-medium text-foreground">{pmt.job.title}</span>
                      </p>
                      {pmt.user.university && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {pmt.user.university}{pmt.user.fieldOfStudy ? ` · ${pmt.user.fieldOfStudy}` : ""}{pmt.user.year ? ` · Year ${pmt.user.year}` : ""}
                        </p>
                      )}
                      {pmt.user.phone && (
                        <p className="text-xs text-muted-foreground mt-0.5">📞 {pmt.user.phone}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Positions: {pmt.job.filledPositions}/{pmt.job.positionsAvailable ?? "∞"}
                      </p>
                    </div>
                    {pmt.paymentScreenshot && (
                      <img src={pmt.paymentScreenshot} alt="Payment" className="w-full rounded-lg border border-border max-h-64 object-contain bg-muted/30" />
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => approvePayment(pmt.id)}>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />Approve & hire
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-destructive border-destructive/40 hover:bg-destructive/5"
                        onClick={() => setRejecting({ kind: "payment", id: pmt.id, title: name })}>
                        <XCircle className="h-3.5 w-3.5 mr-1" />Reject
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Verifications */}
        <TabsContent value="verify" className="mt-3">
          {loading ? (
            <div className="flex flex-col gap-2.5">{[1, 2].map((i) => <Card key={i} className="p-4"><Skeleton className="h-5 w-3/4 mb-2" /><Skeleton className="h-3 w-1/2" /></Card>)}</div>
          ) : verifs.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground text-sm">{t(lang, "adminNoVerify")}</Card>
          ) : (
            <div className="flex flex-col gap-2.5">
              {verifs.map((r) => (
                <Card key={r.id} className="p-4 flex flex-col gap-3">
                  <div>
                    <h3 className="font-semibold text-[15px]">{r.companyName}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.contactTelegram} · by @{r.user.username ?? r.user.firstName ?? "—"}</p>
                    {r.note && <p className="text-xs mt-2 italic text-muted-foreground">“{r.note}”</p>}
                    {r.proofUrl && <a href={r.proofUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline mt-1 inline-block">View proof →</a>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => approveVerify(r.id)}>
                      <BadgeCheck className="h-3.5 w-3.5 mr-1" />{t(lang, "adminApprove")}
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-destructive border-destructive/40 hover:bg-destructive/5"
                      onClick={() => setRejecting({ kind: "verify", id: r.id, title: r.companyName })}>
                      <XCircle className="h-3.5 w-3.5 mr-1" />{t(lang, "adminReject")}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="mt-3">
          <Card className="p-4 flex flex-col gap-3.5">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Payment Fees</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label className="text-xs font-medium">Job post fee (ETB)</Label>
                <Input
                  type="number" min={0} step={5}
                  value={settingsForm.jobPostFee}
                  onChange={(e) => setSettingsForm((f) => ({ ...f, jobPostFee: Number(e.target.value) }))}
                  className="h-10"
                />
                <p className="text-[10px] text-muted-foreground">Employer pays this to post a job. 0 = free.</p>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs font-medium">Application fee (ETB)</Label>
                <Input
                  type="number" min={0} step={5}
                  value={settingsForm.applicationFee}
                  onChange={(e) => setSettingsForm((f) => ({ ...f, applicationFee: Number(e.target.value) }))}
                  className="h-10"
                />
                <p className="text-[10px] text-muted-foreground">Student pays this only when accepted. 0 = free.</p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs font-medium">Payment instructions (shown to payers)</Label>
              <Textarea
                value={settingsForm.paymentInstructions}
                onChange={(e) => setSettingsForm((f) => ({ ...f, paymentInstructions: e.target.value }))}
                rows={3}
                placeholder="Telebirr: 0911 23 45 67&#10;CBE: 1234567890"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label className="text-xs font-medium">Telebirr number (optional)</Label>
                <Input
                  value={settingsForm.telebirrNumber ?? ""}
                  onChange={(e) => setSettingsForm((f) => ({ ...f, telebirrNumber: e.target.value }))}
                  className="h-10"
                  placeholder="0912345678"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs font-medium">CBE account (optional)</Label>
                <Input
                  value={settingsForm.cbeAccount ?? ""}
                  onChange={(e) => setSettingsForm((f) => ({ ...f, cbeAccount: e.target.value }))}
                  className="h-10"
                  placeholder="1000123456789"
                />
              </div>
            </div>

            <Button onClick={saveSettings} disabled={savingSettings}>
              {savingSettings ? "Saving…" : "Save settings"}
            </Button>
            <p className="text-[11px] text-muted-foreground text-center">
              Chapa integration coming soon — for now, payments are verified by screenshot upload.
            </p>
          </Card>
        </TabsContent>

        {/* Stats */}
        <TabsContent value="stats" className="mt-3">
          {!stats ? (
            <div className="flex flex-col gap-2.5">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              <StatCard icon={<Users className="h-4 w-4" />} label={t(lang, "adminTotalUsers")} value={stats.totalUsers} />
              <StatCard icon={<FileText className="h-4 w-4" />} label={t(lang, "adminTotalJobs")} value={stats.totalJobs} />
              <StatCard icon={<Clock className="h-4 w-4" />} label={t(lang, "adminPendingJobs")} value={stats.pendingJobs} urgent />
              <StatCard icon={<CheckCircle2 className="h-4 w-4" />} label={t(lang, "adminApprovedJobs")} value={stats.approvedJobs} />
              <StatCard icon={<FileText className="h-4 w-4" />} label={t(lang, "adminTotalApps")} value={stats.totalApps} />
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Reject sheet */}
      <Sheet open={!!rejecting} onOpenChange={(o) => { if (!o) { setRejecting(null); setRejectReason(""); } }}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle className="text-base">{t(lang, "adminRejectReason")}</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-2">{rejecting?.title}</p>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="e.g. Payment not received, screenshot unclear, prohibited content..."
            />
          </div>
          <SheetFooter className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => { setRejecting(null); setRejectReason(""); }}>{t(lang, "cancel")}</Button>
            <Button variant="destructive" className="flex-1"
              onClick={() => {
                if (rejecting?.kind === "job") rejectJob();
                else if (rejecting?.kind === "verify") rejectVerify();
                else if (rejecting?.kind === "payment") rejectPayment();
              }}>
              {t(lang, "adminReject")}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function StatCard({ icon, label, value, urgent }: { icon: React.ReactNode; label: string; value: number; urgent?: boolean }) {
  return (
    <Card className={`p-4 flex flex-col gap-1.5 ${urgent && value > 0 ? "border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20" : ""}`}>
      <span className="text-muted-foreground">{icon}</span>
      <span className={`text-2xl font-bold ${urgent && value > 0 ? "text-amber-600" : ""}`}>{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </Card>
  );
}
