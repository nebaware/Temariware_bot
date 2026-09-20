"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BadgeCheck, AlertCircle, Send, Upload, X, CreditCard, Loader2 } from "lucide-react";
import { type Lang, type UserState } from "@/lib/client/types";
import { t } from "@/lib/i18n";
import { haptic } from "@/hooks/use-telegram";
import { toast } from "sonner";

interface Props {
  lang: Lang;
  initData: string;
  user: UserState | null;
  onVerifyNeeded: () => void;
  onPosted: () => void;
  tg: unknown;
}

interface Settings {
  jobPostFee: number;
  applicationFee: number;
  paymentInstructions: string;
  telebirrNumber: string | null;
  cbeAccount: string | null;
  chapaEnabled: boolean;
}

const JOB_TYPES = [
  { value: "TUTORING", labelKey: "jobTypeTutoring" },
  { value: "FREELANCE", labelKey: "jobTypeFreelance" },
  { value: "PART_TIME", labelKey: "jobTypePartTime" },
  { value: "FULL_TIME", labelKey: "jobTypeFullTime" },
  { value: "INTERNSHIP", labelKey: "jobTypeInternship" },
  { value: "REMOTE", labelKey: "jobTypeRemote" },
] as const;

const EMPTY = {
  title: "", description: "", subjects: "", gradeLevel: "", location: "",
  workType: "TUTORING", salary: "", hoursPerWeek: "", genderPref: "any",
  languageReq: "", deadline: "", contactTelegram: "",
  positionsAvailable: "1", // default to single hire
  applicationFee: "", // empty = use global default
  paymentScreenshot: "",
};

export default function PostJobView({ lang, initData, user, onVerifyNeeded, onPosted, tg }: Props) {
  const [form, setForm] = useState({ ...EMPTY });
  const [submitting, setSubmitting] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);

  // Fetch settings on mount
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
      .catch(() => {});
  }, []);

  const canPost = user?.verification === "APPROVED" || user?.isAdmin;

  if (!canPost) {
    return (
      <div className="flex flex-col gap-3 px-3 pb-24 pt-3">
        <Card className="p-5 flex flex-col items-center text-center gap-3">
          <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <p className="text-sm text-muted-foreground">{t(lang, "postVerifyFirst")}</p>
          <Button onClick={() => { haptic(tg as never, "medium"); onVerifyNeeded(); }}>
            {t(lang, "postVerifyCta")}
          </Button>
        </Card>
      </div>
    );
  }

  const update = (field: keyof typeof EMPTY, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

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
    reader.onload = () => {
      setForm((f) => ({ ...f, paymentScreenshot: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const removeScreenshot = () => {
    haptic(tg as never, "light");
    setForm((f) => ({ ...f, paymentScreenshot: "" }));
  };

  const submit = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.subjects.trim()) {
      haptic(tg as never, "error");
      toast.error("Please fill title, description, and subjects.");
      return;
    }
    if (settings && settings.jobPostFee > 0 && !form.paymentScreenshot) {
      haptic(tg as never, "error");
      toast.error(`Payment screenshot required (job post fee: ${settings.jobPostFee} ETB).`);
      return;
    }
    haptic(tg as never, "medium");
    setSubmitting(true);
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (initData) headers["x-telegram-init-data"] = initData;
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error ?? "Failed to post job");
      }
      haptic(tg as never, "success");
      toast.success("Job submitted! An admin will review your payment & content shortly.");
      setForm({ ...EMPTY });
      onPosted();
    } catch (e) {
      haptic(tg as never, "error");
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 px-3 pb-24 pt-3">
      <div className="flex items-center gap-2 mb-1">
        <BadgeCheck className="h-5 w-5 text-blue-500" />
        <span className="text-xs font-medium text-muted-foreground">
          {user?.companyName ?? user?.firstName} · {t(lang, "profileRoleEmployer")}
        </span>
      </div>
      <h1 className="text-xl font-bold leading-tight">{t(lang, "postTitle")}</h1>
      <p className="text-sm text-muted-foreground">{t(lang, "postSubtitle")}</p>

      {/* Fee notice */}
      {settings && settings.jobPostFee > 0 && (
        <Card className="p-3 border-blue-500/40 bg-blue-50/50 dark:bg-blue-950/20 flex items-start gap-2">
          <CreditCard className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-blue-700 dark:text-blue-400">
              Job posting fee: {settings.jobPostFee} ETB
            </p>
            <p className="text-muted-foreground mt-1 whitespace-pre-line">
              {settings.paymentInstructions}
            </p>
            <p className="mt-1 text-blue-700 dark:text-blue-400">
              Upload your payment screenshot below — admin will approve & publish your job.
            </p>
          </div>
        </Card>
      )}

      <Card className="p-4 flex flex-col gap-3.5">
        <Field label={t(lang, "postJobTitle")} hint={t(lang, "postJobTitleHint")} required>
          <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder={t(lang, "postJobTitleHint")} className="h-10" />
        </Field>

        <Field label={t(lang, "postDescription")} hint={t(lang, "postDescriptionHint")} required>
          <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} placeholder={t(lang, "postDescriptionHint")} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t(lang, "postSubjects")} hint={t(lang, "postSubjectsHint")} required>
            <Input value={form.subjects} onChange={(e) => update("subjects", e.target.value)} placeholder="Math, Physics" className="h-10" />
          </Field>
          <Field label={t(lang, "postGrade")} hint={t(lang, "postGradeHint")}>
            <Input value={form.gradeLevel} onChange={(e) => update("gradeLevel", e.target.value)} placeholder="Grade 5" className="h-10" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t(lang, "postLocation")} hint={t(lang, "postLocationHint")}>
            <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Harar" className="h-10" />
          </Field>
          <Field label={t(lang, "postWorkType")}>
            <Select value={form.workType} onValueChange={(v) => update("workType", v)}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {JOB_TYPES.map((ty) => <SelectItem key={ty.value} value={ty.value}>{t(lang, ty.labelKey)}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t(lang, "postSalary")} hint={t(lang, "postSalaryHint")}>
            <Input value={form.salary} onChange={(e) => update("salary", e.target.value)} placeholder="3000 ETB" className="h-10" />
          </Field>
          <Field label={t(lang, "postHours")} hint={t(lang, "postHoursHint")}>
            <Input value={form.hoursPerWeek} onChange={(e) => update("hoursPerWeek", e.target.value)} placeholder="4 days/week" className="h-10" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t(lang, "postGender")}>
            <Select value={form.genderPref} onValueChange={(v) => update("genderPref", v)}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{t(lang, "postGenderAny")}</SelectItem>
                <SelectItem value="male">{t(lang, "postGenderMale")}</SelectItem>
                <SelectItem value="female">{t(lang, "postGenderFemale")}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label={t(lang, "postLanguageReq")} hint={t(lang, "postLanguageReqHint")}>
            <Input value={form.languageReq} onChange={(e) => update("languageReq", e.target.value)} placeholder="Afan Oromo" className="h-10" />
          </Field>
        </div>

        {/* NEW: Positions available */}
        <Field label="Positions available" hint="How many people do you want to hire? Job auto-closes when this is reached.">
          <Input
            type="number"
            min={1}
            max={100}
            value={form.positionsAvailable}
            onChange={(e) => update("positionsAvailable", e.target.value)}
            placeholder="1"
            className="h-10"
          />
        </Field>

        {/* NEW: Per-job application fee (employer-set based on location/skill) */}
        <Field
          label="Application fee (ETB)"
          hint={`Leave empty to use global default (${settings?.applicationFee ?? 25} ETB). Set 0 for free. Set custom amount based on location/difficulty.`}
        >
          <Input
            type="number"
            min={0}
            step={5}
            value={form.applicationFee}
            onChange={(e) => update("applicationFee", e.target.value)}
            placeholder={String(settings?.applicationFee ?? 25)}
            className="h-10"
          />
          <p className="text-[10px] text-muted-foreground mt-1">
            Students pay this only when you accept them. Vary by location — e.g. Addis Ababa: 50, Harar: 25, Remote: 0.
          </p>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label={t(lang, "postDeadline")}>
            <Input type="date" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} className="h-10" />
          </Field>
          <Field label={t(lang, "postContact")} hint={t(lang, "postContactHint")}>
            <Input value={form.contactTelegram} onChange={(e) => update("contactTelegram", e.target.value)} placeholder={user?.companyTelegram ?? "@username"} className="h-10" />
          </Field>
        </div>
      </Card>

      {/* NEW: Payment screenshot upload */}
      {settings && settings.jobPostFee > 0 && (
        <Card className="p-4 flex flex-col gap-3">
          <div>
            <Label className="text-xs font-medium flex items-center gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              Payment screenshot *
            </Label>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Upload a screenshot of your {settings.jobPostFee} ETB payment confirmation.
            </p>
          </div>

          {form.paymentScreenshot ? (
            <div className="relative">
              <img
                src={form.paymentScreenshot}
                alt="Payment screenshot"
                className="w-full rounded-lg border border-border max-h-64 object-contain bg-muted/30"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 h-8 px-2"
                onClick={removeScreenshot}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium">Tap to upload screenshot</span>
              <span className="text-xs text-muted-foreground">PNG or JPEG, max 1MB</span>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleScreenshotUpload}
                className="hidden"
              />
            </label>
          )}
        </Card>
      )}

      <Button size="lg" className="h-12 text-base font-medium" onClick={submit} disabled={submitting}>
        {submitting ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting…</>
        ) : (
          <><Send className="h-4 w-4 mr-2" />{t(lang, "postSubmit")}</>
        )}
      </Button>
    </div>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs font-medium">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
        {hint && <span className="text-muted-foreground font-normal ml-1">· {hint}</span>}
      </Label>
      {children}
    </div>
  );
}
