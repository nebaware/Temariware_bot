// POST /api/bot — Telegram bot webhook (long-polling compatible)
// Handles: /start, /latest, /search, /subscribe, /unsubscribe, /myapps, /postjob, /admin, /help
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendMessage, isBotConfigured } from "@/lib/telegram";
import { authenticate, isAdminTelegramId, MINI_APP_URL } from "@/lib/auth";
import { JobStatus, JobType, UserRole } from "@prisma/client";
import { t, type Lang } from "@/lib/i18n";

interface TgUpdate {
  update_id: number;
  message?: {
    message_id: number;
    chat: { id: number; type: string };
    from?: { id: number; first_name?: string; last_name?: string; username?: string; language_code?: string };
    text?: string;
  };
  callback_query?: {
    id: string;
    from: { id: number; first_name?: string; username?: string };
    message?: { chat: { id: number } };
    data?: string;
  };
}

async function ensureUser(tgFrom: NonNullable<TgUpdate["message"]>["from"]): Promise<{ id: string; telegramId: string; language: string; role: string; verification: string; isAdmin: boolean } | null> {
  if (!tgFrom) return null;
  const lang = (tgFrom.language_code?.startsWith("am") ? "am" : tgFrom.language_code?.startsWith("or") ? "or" : "en") as Lang;
  const isAdmin = isAdminTelegramId(String(tgFrom.id));
  const user = await db.user.upsert({
    where: { telegramId: String(tgFrom.id) },
    update: {
      firstName: tgFrom.first_name,
      lastName: tgFrom.last_name,
      username: tgFrom.username,
      ...(isAdmin ? { isAdmin: true, role: UserRole.ADMIN } : {}),
    },
    create: {
      telegramId: String(tgFrom.id),
      firstName: tgFrom.first_name,
      lastName: tgFrom.last_name,
      username: tgFrom.username,
      language: lang,
      isAdmin,
      role: isAdmin ? UserRole.ADMIN : UserRole.STUDENT,
    },
  });
  return {
    id: user.id,
    telegramId: user.telegramId,
    language: user.language,
    role: user.role,
    verification: user.verification,
    isAdmin: user.isAdmin,
  };
}

function langOf(lang: string): Lang {
  return (lang === "am" || lang === "or" ? lang : "en") as Lang;
}

async function handleStart(user: NonNullable<Awaited<ReturnType<typeof ensureUser>>>, chatId: number) {
  const lang = langOf(user.language);
  await sendMessage({
    chatId,
    text: t(lang, "botWelcome"),
    replyMarkup: {
      inline_keyboard: [[
        { text: t(lang, "botOpenApp"), web_app: { url: MINI_APP_URL } },
      ]],
    },
  });
}

async function handleLatest(user: NonNullable<Awaited<ReturnType<typeof ensureUser>>>, chatId: number) {
  const lang = langOf(user.language);
  const jobs = await db.job.findMany({
    where: { status: JobStatus.APPROVED },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { _count: { select: { applications: true } } },
  });
  if (jobs.length === 0) {
    await sendMessage({ chatId, text: t(lang, "botNoJobs"), replyMarkup: { inline_keyboard: [[{ text: t(lang, "botOpenApp"), web_app: { url: MINI_APP_URL } }]] } });
    return;
  }
  let text = t(lang, "botLatest");
  for (const j of jobs) {
    text += `*${j.title}*\n📍 ${j.location ?? "—"} | 📚 ${j.subjects}\n💰 ${j.salary ?? t(lang, "negotiable")}\n${j.deadline ? `⏰ ${new Date(j.deadline).toLocaleDateString()}` : ""}\n\n`;
  }
  await sendMessage({
    chatId,
    text,
    replyMarkup: {
      inline_keyboard: jobs.slice(0, 5).map((j) => [
        { text: `→ ${j.title.slice(0, 40)}`, web_app: { url: `${MINI_APP_URL}?startapp=job_${j.id}` } },
      ]),
    },
  });
}

async function handleSearch(user: NonNullable<Awaited<ReturnType<typeof ensureUser>>>, chatId: number, query: string) {
  const lang = langOf(user.language);
  if (!query) {
    await sendMessage({ chatId, text: "Usage: /search <query> — e.g. /search Math" });
    return;
  }
  const jobs = await db.job.findMany({
    where: {
      status: JobStatus.APPROVED,
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { subjects: { contains: query } },
        { location: { contains: query } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
  if (jobs.length === 0) {
    await sendMessage({ chatId, text: t(lang, "botNoResults", { q: query }) });
    return;
  }
  let text = t(lang, "botSearchResults", { q: query });
  for (const j of jobs) {
    text += `*${j.title}*\n📍 ${j.location ?? "—"} | 📚 ${j.subjects} | 💰 ${j.salary ?? t(lang, "negotiable")}\n\n`;
  }
  await sendMessage({
    chatId,
    text,
    replyMarkup: {
      inline_keyboard: jobs.map((j) => [
        { text: `→ ${j.title.slice(0, 40)}`, web_app: { url: `${MINI_APP_URL}?startapp=job_${j.id}` } },
      ]),
    },
  });
}

async function handleSubscribe(user: NonNullable<Awaited<ReturnType<typeof ensureUser>>>, chatId: number, category: string) {
  const lang = langOf(user.language);
  const cat = (category || "ALL").toUpperCase();
  // Validate category
  const valid = ["ALL", "TUTORING", "FREELANCE", "PART_TIME", "FULL_TIME", "INTERNSHIP", "REMOTE"];
  if (!valid.includes(cat)) {
    await sendMessage({ chatId, text: `Invalid category. Valid: ${valid.join(", ").toLowerCase()}` });
    return;
  }
  const existing = await db.subscription.findUnique({
    where: { userId_category: { userId: user.id, category: cat } },
  });
  if (existing) {
    await sendMessage({ chatId, text: t(lang, "botAlreadySubscribed", { category: cat }) });
    return;
  }
  await db.subscription.create({ data: { userId: user.id, category: cat } });
  await sendMessage({ chatId, text: t(lang, "botSubscribed", { category: cat }) });
}

async function handleUnsubscribe(user: NonNullable<Awaited<ReturnType<typeof ensureUser>>>, chatId: number, category: string) {
  const lang = langOf(user.language);
  const cat = (category || "ALL").toUpperCase();
  await db.subscription.deleteMany({ where: { userId: user.id, category: cat } });
  await sendMessage({ chatId, text: t(lang, "botUnsubscribed", { category: cat }) });
}

async function handleMyApps(user: NonNullable<Awaited<ReturnType<typeof ensureUser>>>, chatId: number) {
  const lang = langOf(user.language);
  const apps = await db.application.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { job: true },
  });
  if (apps.length === 0) {
    await sendMessage({ chatId, text: t(lang, "botNoApps"), replyMarkup: { inline_keyboard: [[{ text: t(lang, "botOpenApp"), web_app: { url: `${MINI_APP_URL}?startapp=applications` } }]] } });
    return;
  }
  let text = t(lang, "botMyApps");
  for (const a of apps) {
    text += `• *${a.job.title}*\n  Status: ${a.status.toLowerCase()}\n\n`;
  }
  await sendMessage({
    chatId,
    text,
    replyMarkup: { inline_keyboard: [[{ text: t(lang, "botOpenApp"), web_app: { url: `${MINI_APP_URL}?startapp=applications` } }]] },
  });
}

async function handlePostJob(user: NonNullable<Awaited<ReturnType<typeof ensureUser>>>, chatId: number) {
  const lang = langOf(user.language);
  // Allow if verified employer or admin
  const canPost = user.verification === "APPROVED" || user.isAdmin;
  if (!canPost) {
    await sendMessage({ chatId, text: t(lang, "botNotEmployer"), replyMarkup: { inline_keyboard: [[{ text: t(lang, "postVerifyCta"), web_app: { url: `${MINI_APP_URL}?startapp=profile` } }]] } });
    return;
  }
  await sendMessage({
    chatId,
    text: t(lang, "postTitle"),
    replyMarkup: { inline_keyboard: [[{ text: t(lang, "postSubmit"), web_app: { url: `${MINI_APP_URL}?startapp=post` } }]] },
  });
}

async function handleAdmin(user: NonNullable<Awaited<ReturnType<typeof ensureUser>>>, chatId: number) {
  const lang = langOf(user.language);
  if (!user.isAdmin) {
    await sendMessage({ chatId, text: t(lang, "botNotAdmin") });
    return;
  }
  const [pending, verifs] = await Promise.all([
    db.job.count({ where: { status: JobStatus.PENDING } }),
    db.verificationRequest.count({ where: { status: "PENDING" } }),
  ]);
  await sendMessage({
    chatId,
    text: `*Admin panel*\n\n• ${pending} jobs awaiting review\n• ${verifs} verification requests\n\nTap below to open the admin panel:`,
    replyMarkup: { inline_keyboard: [[{ text: "Open admin", web_app: { url: `${MINI_APP_URL}?startapp=admin` } }]] },
  });
}

async function handleHelp(user: NonNullable<Awaited<ReturnType<typeof ensureUser>>>, chatId: number) {
  const lang = langOf(user.language);
  await sendMessage({ chatId, text: t(lang, "botHelp") });
}

export async function POST(request: Request) {
  // Dev: if no bot token, return ok so we can still test the app
  if (!isBotConfigured()) {
    return NextResponse.json({ ok: true, note: "Bot not configured (TELEGRAM_BOT_TOKEN missing). Set it to receive real updates." });
  }

  const update = (await request.json()) as TgUpdate;

  try {
    if (update.message?.text) {
      const chatId = update.message.chat.id;
      const from = update.message.from;
      const user = await ensureUser(from);
      if (!user) return NextResponse.json({ ok: true });

      const text = update.message.text.trim();
      const [cmd, ...rest] = text.split(/\s+/);
      const arg = rest.join(" ").trim();
      const command = cmd.toLowerCase().split("@")[0]; // strip @botname suffix

      switch (command) {
        case "/start": await handleStart(user, chatId); break;
        case "/latest":
        case "/jobs": await handleLatest(user, chatId); break;
        case "/search": await handleSearch(user, chatId, arg); break;
        case "/subscribe": await handleSubscribe(user, chatId, arg); break;
        case "/unsubscribe": await handleUnsubscribe(user, chatId, arg); break;
        case "/myapps": await handleMyApps(user, chatId); break;
        case "/postjob": await handlePostJob(user, chatId); break;
        case "/admin": await handleAdmin(user, chatId); break;
        case "/help": await handleHelp(user, chatId); break;
        default:
          if (command.startsWith("/")) {
            await sendMessage({ chatId, text: `Unknown command: ${command}\n\nUse /help to see what I can do.` });
          }
      }
    }
  } catch (e) {
    console.error("[bot] handler error:", e);
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    bot: isBotConfigured() ? "configured" : "not-configured",
    commands: ["/start", "/latest", "/search", "/subscribe", "/unsubscribe", "/myapps", "/postjob", "/admin", "/help"],
    miniAppUrl: MINI_APP_URL,
  });
}
