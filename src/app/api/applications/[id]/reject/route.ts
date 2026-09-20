// POST /api/applications/[id]/reject — employer rejects an applicant
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticate, MINI_APP_URL } from "@/lib/auth";
import { sendMessage } from "@/lib/telegram";
import { ApplicationStatus } from "@prisma/client";
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

  // Only the job's employer (or admin) can reject
  if (application.job.employerId !== user.id && !user.isAdmin) {
    return NextResponse.json({ error: "Only the employer can reject applicants" }, { status: 403 });
  }

  if (application.status === ApplicationStatus.HIRED) {
    return NextResponse.json({ error: "Cannot reject a hired applicant" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const reason = body.reason as string | undefined;

  await db.application.update({
    where: { id },
    data: { status: ApplicationStatus.REJECTED },
  });

  // Notify the applicant
  const applicant = await db.user.findUnique({ where: { id: application.userId } });
  if (applicant?.telegramId) {
    const lang = (applicant.language ?? "en") as Lang;
    await sendMessage({
      chatId: applicant.telegramId,
      text:
        `📋 *Application update*\n\n` +
        `Your application for *${application.job.title}* was not selected.\n` +
        (reason ? `Note: ${reason}` : "Keep applying — more jobs are posted daily!") +
        `\n\nTap below to browse more jobs 👇`,
      replyMarkup: {
        inline_keyboard: [[
          { text: t(lang, "botOpenApp"), web_app: { url: `${MINI_APP_URL}?startapp=home` } },
        ]],
      },
    });
  }

  return NextResponse.json({ ok: true });
}
