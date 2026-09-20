"use client";

import { useEffect, useState, useCallback, useRef } from "react";

// Minimal Telegram WebApp SDK typings
interface TgWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
    start_param?: string;
  };
  colorScheme: "light" | "dark";
  themeParams: Record<string, string>;
  viewportHeight: number;
  viewportStableHeight: number;
  isExpanded: boolean;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  expand: () => void;
  ready: () => void;
  close: () => void;
  openTelegramLink: (url: string) => void;
  openLink: (url: string) => void;
  HapticFeedback: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    setText: (text: string) => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
    enable: () => void;
    disable: () => void;
  };
  onEvent: (event: string, cb: () => void) => void;
  offEvent: (event: string, cb: () => void) => void;
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TgWebApp };
  }
}

export function useTelegram() {
  const [tg, setTg] = useState<TgWebApp | null>(null);
  const [initData, setInitData] = useState<string>("");
  const [startParam, setStartParam] = useState<string | null>(null);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const init = () => {
      const wa = window.Telegram?.WebApp;
      if (wa) {
        try { wa.ready(); } catch {}
        try { wa.expand(); } catch {}
        try {
          wa.setHeaderColor?.(wa.colorScheme === "dark" ? "#17212b" : "#ffffff");
          wa.setBackgroundColor?.(wa.colorScheme === "dark" ? "#0e1621" : "#f4f4f5");
        } catch {}
        setTg(wa);
        setInitData(wa.initData);
        setStartParam(wa.initDataUnsafe?.start_param ?? null);
      } else {
        // Dev fallback: detect startapp from URL ?startapp=...
        const url = new URL(window.location.href);
        const sp = url.searchParams.get("startapp");
        setStartParam(sp);
      }
    };

    // If the SDK script is still loading, wait for it.
    if (window.Telegram?.WebApp) {
      init();
    } else {
      const timer = setTimeout(init, 200);
      return () => clearTimeout(timer);
    }
  }, []);

  return { tg, initData, startParam };
}

export function haptic(tg: TgWebApp | null, type: "light" | "medium" | "heavy" | "success" | "error" | "warning" = "light") {
  if (!tg) return;
  try {
    if (type === "success" || type === "error" || type === "warning") {
      tg.HapticFeedback?.notificationOccurred(type);
    } else {
      tg.HapticFeedback?.impactOccurred(type);
    }
  } catch {}
}

/** Hook to fetch JSON with auth header attached. */
export function useApiFetch(getInitData: () => string) {
  return useCallback(async (url: string, init?: RequestInit) => {
    const initData = getInitData();
    const headers = new Headers(init?.headers);
    if (initData) {
      headers.set("x-telegram-init-data", initData);
    }
    if (init?.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    const res = await fetch(url, { ...init, headers });
    return res;
  }, [getInitData]);
}
