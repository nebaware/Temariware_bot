// Server-side helpers shared across API routes.

import { db } from "@/lib/db";
import { validateInitData, devUser } from "@/lib/telegram";
import type { User } from "@prisma/client";

/**
 * Authenticate a request coming from the Telegram Mini App.
 * Returns the (created-or-updated) User, or null if unauthenticated.
 */
export async function authenticate(request: Request): Promise<User | null> {
  // Dev fallback: if no bot token, allow a fake user via env vars.
  const dev = devUser();
  if (dev) {
    return await upsertUser({
      telegramId: String(dev.id),
      firstName: dev.first_name,
      username: dev.username,
    });
  }

  // Production: validate Telegram initData.
  const initData = request.headers.get("x-telegram-init-data") ?? "";
  if (!initData) return null;
  const tgUser = validateInitData(initData);
  if (!tgUser) return null;

  return await upsertUser({
    telegramId: String(tgUser.id),
    firstName: tgUser.first_name,
    lastName: tgUser.last_name,
    username: tgUser.username,
    photoUrl: tgUser.photo_url,
  });
}

async function upsertUser(input: {
  telegramId: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
}): Promise<User> {
  const isAdmin = isAdminTelegramId(input.telegramId);
  const user = await db.user.upsert({
    where: { telegramId: input.telegramId },
    update: {
      firstName: input.firstName,
      lastName: input.lastName,
      username: input.username,
      photoUrl: input.photoUrl,
      ...(isAdmin ? { isAdmin: true, role: "ADMIN" as const } : {}),
    },
    create: {
      telegramId: input.telegramId,
      firstName: input.firstName,
      lastName: input.lastName,
      username: input.username,
      photoUrl: input.photoUrl,
      isAdmin,
      role: isAdmin ? "ADMIN" : "STUDENT",
    },
  });
  return user;
}

/** Parse a `startapp` parameter to determine where the Mini App should land. */
export function parseStartParam(startParam: string | null): {
  view?: "job" | "post" | "admin" | "applications" | "profile";
  jobId?: string;
} {
  if (!startParam) return {};
  if (startParam.startsWith("job_")) return { view: "job", jobId: startParam.slice(4) };
  if (startParam === "post") return { view: "post" };
  if (startParam === "admin") return { view: "admin" };
  if (startParam === "applications") return { view: "applications" };
  if (startParam === "profile") return { view: "profile" };
  return {};
}

export const MINI_APP_URL = process.env.MINI_APP_URL ?? "https://your-app.vercel.app";

/** Admin telegram IDs (comma-separated env var). */
export function getAdminIds(): string[] {
  const raw = process.env.ADMIN_TELEGRAM_IDS ?? "";
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

export function isAdminTelegramId(tgId: string): boolean {
  return getAdminIds().includes(tgId);
}
