// Telegram Bot API client (zero dependencies — uses fetch only)

const API_BASE = "https://api.telegram.org/bot";

export function getBotToken(): string {
  const tok = process.env.TELEGRAM_BOT_TOKEN;
  if (!tok) {
    // In dev without a real token, calls will no-op. We log so the dev knows.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[telegram] TELEGRAM_BOT_TOKEN not set — bot calls will be skipped.");
    }
    return "";
  }
  return tok;
}

export function isBotConfigured(): boolean {
  return !!getBotToken();
}

interface SendMessageParams {
  chatId: string | number;
  text: string;
  parseMode?: "MarkdownV2" | "HTML" | "Markdown";
  replyMarkup?: unknown;
  disablePreview?: boolean;
}

async function tg<T = unknown>(method: string, body: Record<string, unknown>): Promise<T | null> {
  const token = getBotToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error(`[telegram] ${method} failed:`, errText);
      return null;
    }
    return (await res.json()) as T;
  } catch (e) {
    console.error(`[telegram] ${method} error:`, e);
    return null;
  }
}

export async function sendMessage({
  chatId,
  text,
  parseMode = "Markdown",
  replyMarkup,
  disablePreview = true,
}: SendMessageParams) {
  return tg("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: parseMode,
    reply_markup: replyMarkup,
    disable_web_page_preview: disablePreview,
  });
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  return tg("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    text,
  });
}

export async function setMyCommands(commands: { command: string; description: string }[]) {
  return tg("setMyCommands", { commands });
}

/** Build an inline keyboard that opens the Mini App. */
export function openAppButton(miniAppUrl: string, label = "Open app", startParam?: string) {
  const url = startParam ? `${miniAppUrl}?startapp=${startParam}` : miniAppUrl;
  return {
    inline_keyboard: [[{ text: label, web_app: { url } }]],
  };
}

/** Build an inline keyboard for a single job (Open + Apply). */
export function jobCardKeyboard(miniAppUrl: string, jobId: string) {
  return {
    inline_keyboard: [
      [
        { text: "View & apply", web_app: { url: `${miniAppUrl}?startapp=job_${jobId}` } },
        { text: "Share", switch_inline_query: `/job_${jobId}` },
      ],
    ],
  };
}

// ---- Telegram WebApp initData validation ---------------------------------

import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Validate a Telegram WebApp initData string.
 * Returns the parsed user object if valid, null otherwise.
 *
 * Spec: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateInitData(initData: string, botToken?: string): {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
} | null {
  const token = botToken ?? getBotToken();
  if (!token) return null;

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  // Sort keys alphabetically and build the data-check string
  const dataCheck = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  // secret = HMAC-SHA256("WebAppData", bot_token)
  const secret = createHmac("sha256", "WebAppData").update(token).digest();
  // calculated_hash = HMAC-SHA256(secret, data_check)
  const calculated = createHmac("sha256", secret).update(dataCheck).digest("hex");

  // timing-safe compare
  try {
    const a = Buffer.from(calculated, "hex");
    const b = Buffer.from(hash, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  // Also check auth_date freshness (24h window)
  const authDate = Number(params.get("auth_date"));
  if (!authDate) return null;
  const now = Math.floor(Date.now() / 1000);
  if (now - authDate > 60 * 60 * 24) return null;

  const userRaw = params.get("user");
  if (!userRaw) return null;
  try {
    return JSON.parse(userRaw);
  } catch {
    return null;
  }
}

/** In dev mode (no token), return a fake user from a dev header so the app is testable. */
export function devUser(): { id: number; first_name: string; username: string } | null {
  if (process.env.NODE_ENV === "production") return null;
  const id = process.env.DEV_TELEGRAM_ID;
  if (!id) return null;
  return {
    id: Number(id),
    first_name: process.env.DEV_TELEGRAM_NAME ?? "Dev User",
    username: process.env.DEV_TELEGRAM_USERNAME ?? "devuser",
  };
}
