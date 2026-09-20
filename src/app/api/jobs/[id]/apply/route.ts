// POST /api/jobs/[id]/apply — submit an application
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticate, MINI_APP_URL } from "@/lib/auth";
import { sendMessage } from "@/lib/telegram";
import { JobStatus, ApplicationStatus } from "@prisma/client";
import { t } from "@/lib/i18n";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const job = await db.job.findUnique({
    where: { id },
    include: { employer: true },
  });
  if (!job || job.status !== JobStatus.APPROVED) {
    return NextResponse.json({ error: "Job not available" }, { status: 404 });
  }

  // Check if positions already filled (when positionsAvailable is set)
  if (job.positionsAvailable !== null && job.filledPositions >= job.positionsAvailable) {
    return NextResponse.json(
      { error: "This job has been closed — all positions have been filled." },
      { status: 400 }
    );
  }

  // MANDATORY: student must have complete profile (national ID + university ID + grade report)
  if (!user.profileComplete) {
    const missing: string[] = [];
    if (!user.nationalIdNumber || !user.nationalIdImage) missing.push("National ID");
    if (!user.universityIdNumber || !user.universityIdImage) missing.push("University/College ID");
    if (!user.lastSemesterGradeImage) missing.push("Last semester grade report");
    return NextResponse.json(
      {
        error: `Profile incomplete. Please add: ${missing.join(", ")}.`,
        profileIncomplete: true,
        missing,
      },
      { status: 403 }
    );
  }

  // Already applied?
  const existing = await db.application.findUnique({
    where: { jobId_userId: { jobId: job.id, userId: user.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "You've already applied to this job." }, { status: 409 });
  }

  const body = await request.json().catch(() => ({}));
  const message = (body.message ?? "").toString().trim().slice(0, 1000);

  const application = await db.application.create({
    data: {
      jobId: job.id,
      userId: user.id,
      message: message || null,
      status: ApplicationStatus.PENDING,
    },
  });

  // Forward to employer's Telegram if possible
  if (job.employer && job.employer.telegramId) {
    const lang = (job.employer.language ?? "en") as "en" | "am" | "or";
    const text = t(lang, "botApplyForwarded", {
      title: job.title,
      name: user.fullName ?? ((`${user.firstName ?? ""} ${user.lastName ?? ""}`).trim() || "—"),
      university: user.university ?? "—",
      field: user.fieldOfStudy ?? "—",
      phone: user.phone ?? "—",
      message: message || "—",
      cv: user.cvUrl ?? "—",
    });
    await sendMessage({
      chatId: job.employer.telegramId,
      text,
      replyMarkup: {
        inline_keyboard: [[
          { text: "View profile in app", web_app: { url: `${MINI_APP_URL}?startapp=applications` } },
        ]],
      },
    });
  }

  return NextResponse.json({ application });
}
