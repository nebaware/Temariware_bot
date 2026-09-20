// POST /api/applications/[id]/accept — employer accepts an applicant
// Triggers a payment request notification to the student
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticate, MINI_APP_URL } from "@/lib/auth";
import { sendMessage } from "@/lib/telegram";
import { ApplicationStatus, JobStatus } from "@prisma/client";
import { t, type Lang } from "@/lib/i18n";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const application = await db.application.findUnique({
    where: { id },
    include: { job: true },
  });
  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  // Only the job's employer (or admin) can accept
  if (application.job.employerId !== user.id && !user.isAdmin) {
    return NextResponse.json({ error: "Only the employer can accept applicants" }, { status: 403 });
  }

  // Don't accept if job is already closed
  if (application.job.status === JobStatus.CLOSED) {
    return NextResponse.json({ error: "This job is closed." }, { status: 400 });
  }

  // Don't accept if already accepted/hired
  if (application.status === ApplicationStatus.ACCEPTED || application.status === ApplicationStatus.HIRED) {
    return NextResponse.json({ error: "Already accepted" }, { status: 400 });
  }

  // Get fee: per-job override if set, otherwise global default
  const settings = await db.setting.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", jobPostFee: 50, applicationFee: 25 },
  });
  const fee = application.job.applicationFee !== null ? application.job.applicationFee : settings.applicationFee;

  await db.application.update({
    where: { id },
    data: {
      status: ApplicationStatus.ACCEPTED,
      acceptedAt: new Date(),
    },
  });

  // Notify the applicant
  const applicant = await db.user.findUnique({ where: { id: application.userId } });
  if (applicant?.telegramId) {
    const lang = (applicant.language ?? "en") as Lang;
    const text =
      `🎉 *You've been accepted!*\n\n` +
      `The employer has accepted your application for:\n\n*${application.job.title}*\n\n` +
      (fee > 0
        ? `To confirm your spot, please pay the confirmation fee of *${fee} ETB*.\n\n` +
          `💵 Payment instructions:\n${settings.paymentInstructions}\n\n` +
          `After payment, open the app → My applications → tap this job → "Upload payment proof".`
        : `No payment required — you're all set!`) +
      `\n\nTap below to open the app 👇`;

    await sendMessage({
      chatId: applicant.telegramId,
      text,
      replyMarkup: {
        inline_keyboard: [[
          { text: lang === "am" ? "አፕ ክፈት" : lang === "or" ? "Appii bani" : "Open app", web_app: { url: `${MINI_APP_URL}?startapp=applications` } },
        ]],
      },
    });
  }

  return NextResponse.json({ ok: true, fee });
}
