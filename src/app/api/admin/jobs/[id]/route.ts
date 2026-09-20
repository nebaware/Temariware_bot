// POST /api/admin/jobs/[id] — approve or reject a job, with optional broadcast
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authenticate, MINI_APP_URL } from "@/lib/auth";
import { sendMessage } from "@/lib/telegram";
import { JobStatus, JobType, UserRole, PaymentStatus } from "@prisma/client";
import { t, type Lang } from "@/lib/i18n";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await authenticate(request);
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = await request.json();
  const action: "approve" | "reject" = body.action;
  const reason: string | undefined = body.reason;

  const job = await db.job.findUnique({
    where: { id },
    include: { employer: true },
  });
  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (action === "approve") {
    await db.job.update({
      where: { id },
      data: {
        status: JobStatus.APPROVED,
        rejectionReason: null,
        paymentStatus: PaymentStatus.APPROVED,
        paymentReviewedBy: user.id,
        paymentReviewedAt: new Date(),
        paymentRejectionReason: null,
      },
    });
    // Also update linked Payment audit record
    await db.payment.updateMany({
      where: { jobId: job.id, type: "JOB_POST" },
      data: {
        status: PaymentStatus.APPROVED,
        reviewedBy: user.id,
        reviewedAt: new Date(),
      },
    });

    // Notify employer
    if (job.employer?.telegramId) {
      const lang = (job.employer.language ?? "en") as Lang;
      await sendMessage({
        chatId: job.employer.telegramId,
        text: t(lang, "botJobApproved", { title: job.title }),
        replyMarkup: {
          inline_keyboard: [[
            { text: t(lang, "botOpenApp"), web_app: { url: `${MINI_APP_URL}?startapp=job_${job.id}` } },
          ]],
        },
      });
    }

    // Broadcast to channel (if ALERT_CHAT_ID is set)
    let channelPosted = false;
    try {
      channelPosted = await postToChannel(job);
    } catch (e) {
      console.error("[channel broadcast] error:", e);
    }

    // Broadcast to individual subscribers
    let broadcastCount = 0;
    try {
      broadcastCount = await broadcastNewJob(job);
    } catch (e) {
      console.error("[broadcast] error:", e);
    }

    return NextResponse.json({ ok: true, broadcastCount, channelPosted });
  }

  if (action === "reject") {
    await db.job.update({
      where: { id },
      data: {
        status: JobStatus.REJECTED,
        rejectionReason: reason ?? null,
        paymentStatus: PaymentStatus.REJECTED,
        paymentRejectionReason: reason ?? null,
        paymentReviewedBy: user.id,
        paymentReviewedAt: new Date(),
      },
    });
    await db.payment.updateMany({
      where: { jobId: job.id, type: "JOB_POST" },
      data: {
        status: PaymentStatus.REJECTED,
        reviewNote: reason ?? null,
        reviewedBy: user.id,
        reviewedAt: new Date(),
      },
    });
    if (job.employer?.telegramId) {
      const lang = (job.employer.language ?? "en") as Lang;
      await sendMessage({
        chatId: job.employer.telegramId,
        text: t(lang, "botJobRejected", { title: job.title, reason: reason ?? "—" }),
      });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

async function postToChannel(job: {
  id: string;
  title: string;
  description: string;
  subjects: string;
  location: string | null;
  salary: string | null;
  workType: JobType;
  gradeLevel: string | null;
  genderPref: string | null;
  languageReq: string | null;
  deadline: Date | null;
  hoursPerWeek: string | null;
  contactTelegram: string | null;
  positionsAvailable: number | null;
  applicationFee: number | null;
}): Promise<boolean> {
  const channelId = process.env.ALERT_CHAT_ID;
  if (!channelId) return false;

  // Build a richer card for the channel (English — channel is public-facing)
  const deadlineStr = job.deadline
    ? new Date(job.deadline).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "Open";
  const genderStr = !job.genderPref || job.genderPref === "any"
    ? "Any"
    : job.genderPref.charAt(0).toUpperCase() + job.genderPref.slice(1);
  const workTypeLabel = {
    TUTORING: "Tutoring", FREELANCE: "Freelance", PART_TIME: "Part-time",
    FULL_TIME: "Full-time", INTERNSHIP: "Internship", REMOTE: "Remote",
  }[job.workType] ?? job.workType;

  const positionsStr = job.positionsAvailable
    ? `${job.positionsAvailable} position${job.positionsAvailable > 1 ? "s" : ""}`
    : "Unlimited";

  // Bot + channel usernames (for t.me links)
  const botUsername = process.env.TELEGRAM_BOT_USERNAME ?? "temariwarebot";
  const channelUsername = process.env.CHANNEL_USERNAME ?? "TEMARIWARE";

  // Telegram channels do NOT support web_app buttons (only URL buttons).
  // URL buttons can't open the Mini App with auth — they open in a browser.
  // So instead of a broken "View & apply" URL button, we route users through the bot:
  //   1. Tap "Open bot" → opens bot chat in Telegram
  //   2. Tap the "Open Temariware" menu button → Mini App launches with full auth
  //   3. User can browse jobs and apply
  // The job details are already in this post so users can decide if it's worth applying.
  const botLink = `https://t.me/${botUsername}`;
  const channelLink = `https://t.me/${channelUsername}`;

  // Use HTML parse mode (Markdown breaks on IDs with underscores)
  const text =
    `📢 <b>New Job on Temariware</b>\n\n` +
    `<b>${escapeHtml(job.title)}</b>\n\n` +
    `📚 Subjects: ${escapeHtml(job.subjects)}\n` +
    `🎓 Level: ${escapeHtml(job.gradeLevel ?? "—")}\n` +
    `📍 Location: ${escapeHtml(job.location ?? "—")}\n` +
    `💼 Type: ${workTypeLabel}\n` +
    `💰 Salary: ${escapeHtml(job.salary ?? "Negotiable")}\n` +
    `⏰ Schedule: ${escapeHtml(job.hoursPerWeek ?? "—")}\n` +
    `👤 Gender pref: ${genderStr}\n` +
    (job.languageReq ? `🗣 Language: ${escapeHtml(job.languageReq)}\n` : "") +
    `👥 Positions: ${positionsStr}\n` +
    `📅 Deadline: ${deadlineStr}\n\n` +
    `${escapeHtml(job.description.length > 400 ? job.description.slice(0, 400) + "…" : job.description)}\n\n` +
    `━━━━━━━━━━━━━━━\n` +
    `🤖 <b>To apply:</b> Tap "Open bot" below → then tap the "Open Temariware" menu button (next to the text input) → browse jobs → apply.\n\n` +
    `📢 More jobs: ${channelLink}`;

  const res = await sendMessage({
    chatId: channelId,
    text,
    parseMode: "HTML",
    replyMarkup: {
      inline_keyboard: [
        [
          // Primary CTA — opens bot chat in Telegram, then user taps menu button for Mini App
          { text: "🤖 Open bot & apply", url: botLink },
          { text: "📢 Join channel", url: channelLink },
        ],
      ],
    },
    disablePreview: false,
  });
  return !!res;
}

/** Escape special HTML characters to prevent injection / parsing errors. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function broadcastNewJob(job: {
  id: string;
  title: string;
  description: string;
  subjects: string;
  location: string | null;
  salary: string | null;
  workType: JobType;
  gradeLevel: string | null;
  genderPref: string | null;
  languageReq: string | null;
}): Promise<number> {
  // Find subscribers whose category matches the job type, or "ALL"
  const jobCategory = job.workType as string; // e.g. "TUTORING"
  const subs = await db.subscription.findMany({
    where: { OR: [{ category: jobCategory }, { category: "ALL" }] },
    include: { user: { select: { telegramId: true, language: true, id: true } } },
  });

  // Deduplicate users (a user may have both ALL + TUTORING subs)
  const seen = new Set<string>();
  let count = 0;
  for (const sub of subs) {
    if (seen.has(sub.user.id)) continue;
    seen.add(sub.user.id);

    // Match against alert subjects if user set them
    if (sub.user.id !== job.employer?.id && sub.user.telegramId) {
      const lang = (sub.user.language ?? "en") as Lang;
      const botUsername = process.env.TELEGRAM_BOT_USERNAME ?? "temariwarebot";
      const channelUsername = process.env.CHANNEL_USERNAME ?? "TEMARIWARE";
      const jobDirectLink = `${MINI_APP_URL}/?startapp=job_${job.id}`;

      const baseText = t(lang, "botNewJobAlert", {
        title: job.title,
        location: job.location ?? "—",
        subjects: job.subjects,
        salary: job.salary ?? "—",
      });

      // Add shareable links
      const linksText =
        `\n━━━━━━━━━━━━━━━\n` +
        `🔗 Links:\n` +
        `📋 View & apply: ${jobDirectLink}\n` +
        `🤖 Bot: https://t.me/${botUsername}\n` +
        `📢 Channel: https://t.me/${channelUsername}`;

      await sendMessage({
        chatId: sub.user.telegramId,
        text: baseText + linksText,
        replyMarkup: {
          inline_keyboard: [[
            // web_app buttons work in private chats — opens Mini App with auth
            { text: t(lang, "viewDetails"), web_app: { url: `${MINI_APP_URL}?startapp=job_${job.id}` } },
          ]],
        },
      });
      count++;
    }
  }
  return count;
}
