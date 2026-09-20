"use client";

import { useEffect, useState, useCallback } from "react";
import { useTelegram, haptic } from "@/hooks/use-telegram";
import { parseStartParam } from "@/lib/client/parse-start";
import { type Lang, type UserState, type View } from "@/lib/client/types";
import { t, LANGS } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon, PlusCircle, Inbox, User as UserIcon, Shield, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import HomeView from "@/components/mini-app/home-view";
import JobDetailView from "@/components/mini-app/job-detail-view";
import PostJobView from "@/components/mini-app/post-job-view";
import ApplicationsView from "@/components/mini-app/applications-view";
import ProfileView from "@/components/mini-app/profile-view";
import AdminView from "@/components/mini-app/admin-view";

export default function Home() {
  const { tg, initData, startParam } = useTelegram();
  const [view, setView] = useState<View>("home");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [user, setUser] = useState<UserState | null>(null);
  const [lang, setLang] = useState<Lang>("en");
  const [booted, setBooted] = useState(false);

  // Initial route from start_param
  useEffect(() => {
    const p = parseStartParam(startParam);
    if (p.view === "job" && p.jobId) {
      setSelectedJobId(p.jobId);
      setView("job");
    } else if (p.view) {
      setView(p.view);
    }
  }, [startParam]);

  // Listen for navigate events (from child components — e.g. when profile incomplete)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { view?: View };
      if (detail?.view) {
        haptic(tg, "light");
        setView(detail.view);
        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    window.addEventListener("navigate", handler);
    return () => window.removeEventListener("navigate", handler);
  }, [tg]);

  // Load user + set language
  const loadUser = useCallback(async () => {
    if (!initData && process.env.NODE_ENV === "production") return;
    try {
      const headers: HeadersInit = {};
      if (initData) headers["x-telegram-init-data"] = initData;
      const res = await fetch("/api/me", { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setLang((data.user.language as Lang) ?? "en");
        }
      }
    } catch {
      // ignore
    } finally {
      setBooted(true);
    }
  }, [initData]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Sync language to user when changed via picker
  const changeLang = async (newLang: Lang) => {
    haptic(tg, "light");
    setLang(newLang);
    if (user && initData) {
      try {
        await fetch("/api/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "x-telegram-init-data": initData },
          body: JSON.stringify({ language: newLang }),
        });
      } catch {}
    }
  };

  const navigate = (v: View, jobId?: string) => {
    haptic(tg, "light");
    if (jobId) setSelectedJobId(jobId);
    setView(v);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Boot splash
  if (!booted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
          T
        </div>
        <p className="text-sm text-muted-foreground">Temariware…</p>
      </div>
    );
  }

  const navItems: { view: View; icon: React.ReactNode; label: string; show: boolean }[] = [
    { view: "home", icon: <HomeIcon className="h-5 w-5" />, label: t(lang, "navHome"), show: true },
    { view: "post", icon: <PlusCircle className="h-5 w-5" />, label: t(lang, "navPost"), show: true },
    { view: "applications", icon: <Inbox className="h-5 w-5" />, label: t(lang, "navApplications"), show: true },
    { view: "profile", icon: <UserIcon className="h-5 w-5" />, label: t(lang, "navProfile"), show: true },
    { view: "admin", icon: <Shield className="h-5 w-5" />, label: t(lang, "navAdmin"), show: !!user?.isAdmin },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/30 dark:bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between px-3 h-12">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              T
            </div>
            <span className="font-semibold text-sm">{t(lang, "appName")}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2 gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                <span className="text-xs uppercase">{lang}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LANGS.map((l) => (
                <DropdownMenuItem key={l.code} onClick={() => changeLang(l.code)} className={lang === l.code ? "bg-muted" : ""}>
                  <span className="font-medium">{l.native}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{l.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main view */}
      <main className="flex-1">
        {view === "home" && (
          <HomeView lang={lang} initData={initData} onSelectJob={(id) => navigate("job", id)} tg={tg} />
        )}
        {view === "job" && selectedJobId && (
          <JobDetailView
            jobId={selectedJobId}
            lang={lang}
            initData={initData}
            user={user}
            onBack={() => navigate("home")}
            tg={tg}
          />
        )}
        {view === "post" && (
          <PostJobView
            lang={lang}
            initData={initData}
            user={user}
            onVerifyNeeded={() => navigate("profile")}
            onPosted={() => navigate("home")}
            tg={tg}
          />
        )}
        {view === "applications" && (
          <ApplicationsView
            lang={lang}
            initData={initData}
            onSelectJob={(id) => navigate("job", id)}
            tg={tg}
            isEmployer={!!user?.isAdmin || user?.verification === "APPROVED" || (user?.role === "EMPLOYER")}
          />
        )}
        {view === "profile" && (
          <ProfileView lang={lang} initData={initData} user={user} onUserUpdated={setUser} tg={tg} />
        )}
        {view === "admin" && user?.isAdmin && (
          <AdminView lang={lang} initData={initData} user={user} tg={tg} />
        )}
      </main>

      {/* Bottom nav */}
      <nav className="sticky bottom-0 z-20 bg-background/95 backdrop-blur border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14 px-1">
          {navItems.filter((n) => n.show).map((item) => {
            const active = view === item.view || (item.view === "home" && view === "job");
            return (
              <button
                key={item.view}
                onClick={() => navigate(item.view)}
                className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                  active ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
