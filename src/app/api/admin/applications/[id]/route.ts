// POST /api/admin/applications/[id] — admin approves/rejects applicant payment
// Approve → mark HIRED; if positions filled, auto-close job
// Reject → mark REJECTED with reason
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticate, MINI_APP_URL } from "@/lib/auth";
import { sendMessage } from "@/lib/telegram";
import { ApplicationStatus, JobStatus, PaymentStatus } from "@prisma/client";
import { t, type Lang } from "@/lib/i18n";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const admin = await authenticate(request);
  if (!admin || !admin.isAdmin) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = await request.json();
  const action: "approve" | "reject" = body.action;
  const reason: string | undefined = body.reason;

  const application = await db.application.findUnique({
    where: { id },
    include: { job: true, user: true },
  });
  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (application.status !== ApplicationStatus.PAYMENT_PENDING) {
    return NextResponse.json(
      { error: "Application is not awaiting payment review" },
      { status: 400 }
    );
  }

  if (action === "approve") {
    // Mark as HIRED
    await db.application.update({
      where: { id },
      data: {
        status: ApplicationStatus.HIRED,
        paymentStatus: PaymentStatus.APPROVED,
        paymentReviewedBy: admin.id,
        paymentReviewedAt: new Date(),
        hiredAt: new Date(),
      },
    });
    await db.payment.updateMany({
      where: { applicationId: application.id, type: "APPLICATION" },
      data: {
        status: PaymentStatus.APPROVED,
        reviewedBy: admin.id,
        reviewedAt: new Date(),
      },
    });

    // Increment filledPositions on job
    const updatedJob = await db.job.update({
      where: { id: application.jobId },
      data: { filledPositions: { increment: 1 } },
    });

    // Auto-close if positions filled
    let autoClosed = false;
    if (
      updatedJob.positionsAvailable !== null &&
      updatedJob.filledPositions >= updatedJob.positionsAvailable
    ) {
      await db.job.update({
        where: { id: updatedJob.id },
        data: { status: JobStatus.CLOSED },
      });
      // Auto-reject all pending applications for this job
      await db.application.updateMany({
        where: {
          jobId: updatedJob.id,
          status: { in: [ApplicationStatus.PENDING, ApplicationStatus.ACCEPTED] },
        },
        data: { status: ApplicationStatus.CLOSED },
      });
      autoClosed = true;
    }

    // Notify applicant
    if (application.user?.telegramId) {
      const lang = (application.user.language ?? "en") as Lang;
      await sendMessage({
        chatId: application.user.telegramId,
        text:
          `✅ *Payment confirmed!*\n\n` +
          `You're hired for:\n*${application.job.title}*\n\n` +
          `The employer will contact you at ${application.user.phone ?? "your Telegram"} to arrange the next steps.`,
        replyMarkup: {
          inline_keyboard: [[
            { text: t(lang, "botOpenApp"), web_app: { url: `${MINI_APP_URL}?startapp=applications` } },
          ]],
        },
      });
    }

    // Notify employer
    const employer = await db.user.findUnique({ where: { id: application.job.employerId } });
    if (employer?.telegramId) {
      const lang = (employer.language ?? "en") as Lang;
      const applicantName = application.user.fullName ?? application.user.firstName ?? "Applicant";
      await sendMessage({
        chatId: employer.telegramId,
        text:
          `✅ *Applicant hired*\n\n` +
          `*${applicantName}* has been confirmed for:\n*${application.job.title}*\n\n` +
          (autoClosed ? "🎯 Job auto-closed — your hiring target was reached." : `Positions filled: ${updatedJob.filledPositions}/${updatedJob.positionsAvailable ?? "∞"}`),
        replyMarkup: {
          inline_keyboard: [[
            { text: t(lang, "botOpenApp"), web_app: { url: `${MINI_APP_URL}?startapp=applications` } },
          ]],
        },
      });
    }

    return NextResponse.json({ ok: true, autoClosed, filledPositions: updatedJob.filledPositions });
  }

  if (action === "reject") {
    // Reject payment → back to ACCEPTED so student can re-upload
    await db.application.update({
      where: { id },
      data: {
        status: ApplicationStatus.ACCEPTED,
        paymentStatus: PaymentStatus.REJECTED,
        paymentRejectionReason: reason ?? null,
        paymentReviewedBy: admin.id,
        paymentReviewedAt: new Date(),
        // Clear the screenshot so they can re-upload
        paymentScreenshot: null,
      },
    });
    await db.payment.updateMany({
      where: { applicationId: application.id, type: "APPLICATION" },
      data: {
        status: PaymentStatus.REJECTED,
        reviewNote: reason ?? null,
        reviewedBy: admin.id,
        reviewedAt: new Date(),
      },
    });

    // Notify applicant
    if (application.user?.telegramId) {
      const lang = (application.user.language ?? "en") as Lang;
      await sendMessage({
        chatId: application.user.telegramId,
        text:
          `❌ *Payment not approved*\n\n` +
          `For: *${application.job.title}*\n` +
          `Reason: ${reason ?? "Screenshot unclear or payment not received."}\n\n` +
          `Please re-upload a clear payment screenshot.`,
        replyMarkup: {
          inline_keyboard: [[
            { text: t(lang, "botOpenApp"), web_app: { url: `${MINI_APP_URL}?startapp=applications` } },
          ]],
        },
      });
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
