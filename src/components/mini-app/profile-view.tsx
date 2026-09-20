"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, GraduationCap, Building2, Bell, Save, BadgeCheck, Clock, XCircle, Send, FileText, Upload, X } from "lucide-react";
import { type Lang, type UserState } from "@/lib/client/types";
import { t, LANGS } from "@/lib/i18n";
import { haptic } from "@/hooks/use-telegram";
import { toast } from "sonner";

interface Props {
  lang: Lang;
  initData: string;
  user: UserState | null;
  onUserUpdated: (u: UserState) => void;
  tg: unknown;
}

export default function ProfileView({ lang, initData, user, onUserUpdated, tg }: Props) {
  const [form, setForm] = useState({
    fullName: user?.fullName ?? "",
    phone: user?.phone ?? "",
    university: user?.university ?? "",
    fieldOfStudy: user?.fieldOfStudy ?? "",
    year: user?.year ?? "",
    bio: user?.bio ?? "",
    cvUrl: user?.cvUrl ?? "",
    companyName: user?.companyName ?? "",
    companyTelegram: user?.companyTelegram ?? "",
    alertSubjects: user?.alertSubjects ?? "",
    alertLocations: user?.alertLocations ?? "",
    language: user?.language ?? lang,
    // Mandatory documents
    nationalIdNumber: user?.nationalIdNumber ?? "",
    nationalIdImage: user?.nationalIdImage ?? "",
    universityIdNumber: user?.universityIdNumber ?? "",
    universityIdImage: user?.universityIdImage ?? "",
    lastSemesterGradeImage: user?.lastSemesterGradeImage ?? "",
  });
  const [saving, setSaving] = useState(false);

  // Verification form state
  const [verifyForm, setVerifyForm] = useState({
    companyName: user?.companyName ?? "",
    contactTelegram: user?.companyTelegram ?? "",
    proofUrl: "",
    note: "",
  });
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [verifySubmitting, setVerifySubmitting] = useState(false);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  // Document upload handler (uses image compression)
  const handleDocumentUpload = async (field: "nationalIdImage" | "universityIdImage" | "lastSemesterGradeImage", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    haptic(tg as never, "light");
    try {
      const { compressImage } = await import("@/lib/client/compress-image");
      const dataUrl = await compressImage(file);
      update(field, dataUrl);
    } catch (err) {
      haptic(tg as never, "error");
      toast.error(err instanceof Error ? err.message : "Failed to upload image.");
    }
  };

  const removeDocument = (field: "nationalIdImage" | "universityIdImage" | "lastSemesterGradeImage") => {
    haptic(tg as never, "light");
    update(field, "");
  };

  const save = async () => {
    haptic(tg as never, "medium");
    setSaving(true);
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (initData) headers["x-telegram-init-data"] = initData;
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers,
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      haptic(tg as never, "success");
      toast.success(t(lang, "profileSaved"));
      if (data.user) onUserUpdated(data.user);
    } catch {
      haptic(tg as never, "error");
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const submitVerification = async () => {
    if (!verifyForm.companyName.trim() || !verifyForm.contactTelegram.trim()) {
      toast.error("Company name and Telegram contact are required.");
      return;
    }
    haptic(tg as never, "medium");
    setVerifySubmitting(true);
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (initData) headers["x-telegram-init-data"] = initData;
      const res = await fetch("/api/verify", {
        method: "POST",
        headers,
        body: JSON.stringify(verifyForm),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error ?? "Failed");
      }
      haptic(tg as never, "success");
      toast.success(t(lang, "verifyPending"));
      setShowVerifyForm(false);
      // Refresh user
      const meRes = await fetch("/api/me", { headers });
      if (meRes.ok) {
        const me = await meRes.json();
        if (me.user) onUserUpdated(me.user);
      }
    } catch (e) {
      haptic(tg as never, "error");
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setVerifySubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        {t(lang, "applyLoginFirst")}
      </div>
    );
  }

  const roleLabel = user.isAdmin
    ? t(lang, "profileRoleAdmin")
    : user.role === "EMPLOYER"
    ? t(lang, "profileRoleEmployer")
    : t(lang, "profileRoleStudent");

  return (
    <div className="flex flex-col gap-3 px-3 pb-24 pt-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg shrink-0">
          {(user.fullName ?? user.firstName ?? "?").slice(0, 1).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold truncate">{user.fullName ?? user.firstName ?? "—"}</h1>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-[10px] h-5">{roleLabel}</Badge>
            {user.verification === "APPROVED" && (
              <Badge variant="secondary" className="text-[10px] h-5 bg-blue-100 text-blue-700">
                <BadgeCheck className="h-3 w-3 mr-0.5" />
                {t(lang, "verifyApproved").split("✅")[0].trim()}
              </Badge>
            )}
            {user.verification === "PENDING" && (
              <Badge variant="secondary" className="text-[10px] h-5 bg-amber-100 text-amber-700">
                <Clock className="h-3 w-3 mr-0.5" />
                {t(lang, "appsStatusPending")}
              </Badge>
            )}
            {user.verification === "REJECTED" && (
              <Badge variant="secondary" className="text-[10px] h-5 bg-red-100 text-red-700">
                <XCircle className="h-3 w-3 mr-0.5" />
                {t(lang, "appsStatusRejected")}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Language picker */}
      <Card className="p-3">
        <Label className="text-xs font-medium mb-1.5 block">Language / ቋንቋ / Afaan</Label>
        <Select value={form.language} onValueChange={(v) => update("language", v)}>
          <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
          <SelectContent>
            {LANGS.map((l) => <SelectItem key={l.code} value={l.code}>{l.native} ({l.label})</SelectItem>)}
          </SelectContent>
        </Select>
      </Card>

      {/* Verification status / CTA */}
      {user.verification !== "APPROVED" && !showVerifyForm && (
        <Card className="p-4 border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col gap-3">
          <div className="flex items-start gap-2">
            <Building2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold">{t(lang, "verifyTitle")}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{t(lang, "verifySubtitle")}</p>
            </div>
          </div>
          <Button size="sm" onClick={() => { haptic(tg as never, "light"); setShowVerifyForm(true); }}>
            {t(lang, "postVerifyCta")}
          </Button>
        </Card>
      )}

      {showVerifyForm && (
        <Card className="p-4 flex flex-col gap-3 border-blue-500/40">
          <h3 className="text-sm font-semibold">{t(lang, "verifyTitle")}</h3>
          <div className="flex flex-col gap-1">
            <Label className="text-xs font-medium">{t(lang, "verifyCompany")} *</Label>
            <Input value={verifyForm.companyName} onChange={(e) => setVerifyForm((f) => ({ ...f, companyName: e.target.value }))} className="h-10" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs font-medium">{t(lang, "verifyContact")} *</Label>
            <Input value={verifyForm.contactTelegram} onChange={(e) => setVerifyForm((f) => ({ ...f, contactTelegram: e.target.value }))} placeholder="@username" className="h-10" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs font-medium">{t(lang, "verifyProof")} · {t(lang, "optional")}</Label>
            <Input value={verifyForm.proofUrl} onChange={(e) => setVerifyForm((f) => ({ ...f, proofUrl: e.target.value }))} placeholder="https://..." className="h-10" />
            <p className="text-[11px] text-muted-foreground">{t(lang, "verifyProofHint")}</p>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs font-medium">{t(lang, "verifyNote")} · {t(lang, "optional")}</Label>
            <Textarea value={verifyForm.note} onChange={(e) => setVerifyForm((f) => ({ ...f, note: e.target.value }))} rows={2} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowVerifyForm(false)} disabled={verifySubmitting}>
              {t(lang, "cancel")}
            </Button>
            <Button size="sm" className="flex-1" onClick={submitVerification} disabled={verifySubmitting}>
              <Send className="h-3.5 w-3.5 mr-1.5" />
              {verifySubmitting ? "..." : t(lang, "verifySubmit")}
            </Button>
          </div>
        </Card>
      )}

      {/* Student / personal info */}
      <Card className="p-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold flex items-center gap-1.5">
          <User className="h-4 w-4 text-muted-foreground" />
          {t(lang, "profileTitle")}
        </h3>
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium">{t(lang, "profileFullName")}</Label>
          <Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className="h-10" />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium">{t(lang, "profilePhone")}</Label>
          <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+2519..." className="h-10" />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium">{t(lang, "profileBio")}</Label>
          <Textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} rows={2} placeholder={t(lang, "profileBioHint")} />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium">{t(lang, "profileCv")} · {t(lang, "optional")}</Label>
          <Input value={form.cvUrl} onChange={(e) => update("cvUrl", e.target.value)} placeholder="https://drive.google.com/..." className="h-10" />
          <p className="text-[11px] text-muted-foreground">{t(lang, "profileCvHint")}</p>
        </div>
      </Card>

      {/* University info */}
      <Card className="p-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold flex items-center gap-1.5">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
          {t(lang, "profileUniversity")}
        </h3>
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium">{t(lang, "profileUniversity")}</Label>
          <Input value={form.university} onChange={(e) => update("university", e.target.value)} placeholder="Haramaya University" className="h-10" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label className="text-xs font-medium">{t(lang, "profileField")}</Label>
            <Input value={form.fieldOfStudy} onChange={(e) => update("fieldOfStudy", e.target.value)} placeholder="Computer Science" className="h-10" />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs font-medium">{t(lang, "profileYear")}</Label>
            <Input type="number" min={1} max={6} value={form.year} onChange={(e) => update("year", e.target.value)} placeholder="3" className="h-10" />
          </div>
        </div>
      </Card>

      {/* Required Documents — MANDATORY for students to apply */}
      <Card className={`p-4 flex flex-col gap-3 ${user?.profileComplete ? "" : "border-amber-500/40"}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Required Documents
          </h3>
          {user?.profileComplete ? (
            <Badge variant="secondary" className="text-[10px] h-5 bg-green-100 text-green-700">✓ Complete</Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px] h-5 bg-amber-100 text-amber-700">Required to apply</Badge>
          )}
        </div>
        {!user?.profileComplete && (
          <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded">
            ⚠ You cannot apply to any job until all 3 documents are uploaded.
          </p>
        )}

        {/* National ID */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium">National ID (Fayda / Kebele) *</Label>
          <Input
            value={form.nationalIdNumber}
            onChange={(e) => update("nationalIdNumber", e.target.value)}
            placeholder="e.g. 1234-5678-9012"
            className="h-10"
          />
          {form.nationalIdImage ? (
            <div className="relative">
              <img src={form.nationalIdImage} alt="National ID" className="w-full rounded-lg border border-border max-h-48 object-contain bg-muted/30" />
              <Button size="sm" variant="destructive" className="absolute top-2 right-2 h-7 px-2" onClick={() => removeDocument("nationalIdImage")}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-border rounded-lg p-3 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs font-medium">Upload ID card photo</span>
              <span className="text-[10px] text-muted-foreground">PNG/JPEG, will be auto-compressed</span>
              <input type="file" accept="image/png,image/jpeg" onChange={(e) => handleDocumentUpload("nationalIdImage", e)} className="hidden" />
            </label>
          )}
        </div>

        {/* University ID */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium">University / College ID *</Label>
          <Input
            value={form.universityIdNumber}
            onChange={(e) => update("universityIdNumber", e.target.value)}
            placeholder="e.g. HU/1234/22"
            className="h-10"
          />
          {form.universityIdImage ? (
            <div className="relative">
              <img src={form.universityIdImage} alt="University ID" className="w-full rounded-lg border border-border max-h-48 object-contain bg-muted/30" />
              <Button size="sm" variant="destructive" className="absolute top-2 right-2 h-7 px-2" onClick={() => removeDocument("universityIdImage")}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-border rounded-lg p-3 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs font-medium">Upload student ID photo</span>
              <span className="text-[10px] text-muted-foreground">PNG/JPEG, will be auto-compressed</span>
              <input type="file" accept="image/png,image/jpeg" onChange={(e) => handleDocumentUpload("universityIdImage", e)} className="hidden" />
            </label>
          )}
        </div>

        {/* Last semester grade report */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium">Last Semester Grade Report *</Label>
          {form.lastSemesterGradeImage ? (
            <div className="relative">
              <img src={form.lastSemesterGradeImage} alt="Grade report" className="w-full rounded-lg border border-border max-h-48 object-contain bg-muted/30" />
              <Button size="sm" variant="destructive" className="absolute top-2 right-2 h-7 px-2" onClick={() => removeDocument("lastSemesterGradeImage")}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-border rounded-lg p-3 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs font-medium">Upload grade report photo</span>
              <span className="text-[10px] text-muted-foreground">PNG/JPEG, will be auto-compressed</span>
              <input type="file" accept="image/png,image/jpeg" onChange={(e) => handleDocumentUpload("lastSemesterGradeImage", e)} className="hidden" />
            </label>
          )}
        </div>
      </Card>

      {/* Alerts */}
      <Card className="p-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold flex items-center gap-1.5">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {t(lang, "profileAlerts")}
        </h3>
        <p className="text-xs text-muted-foreground">{t(lang, "profileAlertsHint")}</p>
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium">{t(lang, "profileAlertSubjects")}</Label>
          <Input value={form.alertSubjects} onChange={(e) => update("alertSubjects", e.target.value)} placeholder="Math, Physics" className="h-10" />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium">{t(lang, "profileAlertLocations")}</Label>
          <Input value={form.alertLocations} onChange={(e) => update("alertLocations", e.target.value)} placeholder="Harar, Remote" className="h-10" />
        </div>
      </Card>

      <Button size="lg" className="h-12 text-base font-medium" onClick={save} disabled={saving}>
        <Save className="h-4 w-4 mr-2" />
        {saving ? "..." : t(lang, "profileSave")}
      </Button>
    </div>
  );
}
