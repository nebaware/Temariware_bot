"use client";

import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MapPin, Briefcase, Clock, Users, GraduationCap, Filter, X } from "lucide-react";
import { type JobSummary, type Lang, deadlineText, formatRelativeDate } from "@/lib/client/types";
import { t } from "@/lib/i18n";
import { haptic } from "@/hooks/use-telegram";

interface Props {
  lang: Lang;
  initData: string;
  onSelectJob: (jobId: string) => void;
  tg: unknown;
}

const JOB_TYPES = ["TUTORING", "FREELANCE", "PART_TIME", "FULL_TIME", "INTERNSHIP", "REMOTE"] as const;
const SUBJECTS = ["Math", "Science", "English", "Chemistry", "Physics", "Biology", "Computer Science", "All"];
const LOCATIONS = ["Harar", "Addis Ababa", "Aweday", "Dire Dawa", "Remote"];

export default function HomeView({ lang, initData, onSelectJob, tg }: Props) {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>("");
  const [filterLocation, setFilterLocation] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterGender, setFilterGender] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (filterSubject) params.set("subject", filterSubject);
      if (filterLocation) params.set("location", filterLocation);
      if (filterType) params.set("workType", filterType);
      if (filterGender) params.set("gender", filterGender);
      const headers: HeadersInit = {};
      if (initData) headers["x-telegram-init-data"] = initData;
      const res = await fetch(`/api/jobs?${params.toString()}`, { headers });
      if (!res.ok) throw new Error("Failed to load jobs");
      const data = await res.json();
      setJobs(data.jobs ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(fetchJobs, 250); // debounce search
    return () => clearTimeout(id);
  }, [search, filterSubject, filterLocation, filterType, filterGender]);

  const activeFilterCount = useMemo(
    () => [filterSubject, filterLocation, filterType, filterGender].filter(Boolean).length,
    [filterSubject, filterLocation, filterType, filterGender]
  );

  const clearFilters = () => {
    haptic(tg as never, "light");
    setFilterSubject("");
    setFilterLocation("");
    setFilterType("");
    setFilterGender("");
    setSearch("");
  };

  return (
    <div className="flex flex-col gap-3 px-3 pb-24 pt-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t(lang, "search")}
          className="pl-9 pr-3 h-11 rounded-full bg-background border-border"
        />
      </div>

      {/* Filter toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant={showFilters ? "default" : "outline"}
          size="sm"
          className="rounded-full h-9"
          onClick={() => { haptic(tg as never, "light"); setShowFilters((v) => !v); }}
        >
          <Filter className="h-3.5 w-3.5 mr-1.5" />
          {t(lang, "filters")}
          {activeFilterCount > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-semibold rounded-full bg-primary-foreground text-primary">
              {activeFilterCount}
            </span>
          )}
        </Button>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" className="rounded-full h-9 text-muted-foreground" onClick={clearFilters}>
            <X className="h-3.5 w-3.5 mr-1" />
            {t(lang, "clear")}
          </Button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          {loading ? t(lang, "loading") : `${jobs.length} ${lang === "am" ? "ስራዎች" : lang === "or" ? "hojii" : "jobs"}`}
        </span>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <Card className="p-3 flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-2">
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="h-10 rounded-lg"><SelectValue placeholder={t(lang, "filterSubject")} /></SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="h-10 rounded-lg"><SelectValue placeholder={t(lang, "filterLocation")} /></SelectTrigger>
              <SelectContent>
                {LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-10 rounded-lg"><SelectValue placeholder={t(lang, "filterType")} /></SelectTrigger>
              <SelectContent>
                {JOB_TYPES.map((ty) => <SelectItem key={ty} value={ty}>{t(lang, `jobType${ty.charAt(0)}${ty.slice(1).toLowerCase().replace(/_./g, (m) => m.charAt(1).toUpperCase())}`)}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterGender} onValueChange={setFilterGender}>
              <SelectTrigger className="h-10 rounded-lg"><SelectValue placeholder={t(lang, "filterGender")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{t(lang, "postGenderAny")}</SelectItem>
                <SelectItem value="male">{t(lang, "postGenderMale")}</SelectItem>
                <SelectItem value="female">{t(lang, "postGenderFemale")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      )}

      {/* Subtitle */}
      <p className="text-sm text-muted-foreground px-1">
        {t(lang, "homeSubtitle")}
      </p>

      {/* Jobs list */}
      {error && (
        <Card className="p-4 text-sm text-destructive border-destructive/40">
          {error} — <button className="underline" onClick={fetchJobs}>{t(lang, "retry")}</button>
        </Card>
      )}

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-3 w-1/3" />
            </Card>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p className="text-sm">{t(lang, "homeEmpty")}</p>
          {activeFilterCount > 0 && (
            <Button variant="link" size="sm" onClick={clearFilters} className="mt-2">
              {t(lang, "clear")}
            </Button>
          )}
        </Card>
      ) : (
        <div className="flex flex-col gap-2.5">
          {jobs.map((job) => {
            const dl = deadlineText(job.deadline, lang, t);
            const created = formatRelativeDate(job.createdAt, lang);
            const isRecent = Date.now() - new Date(job.createdAt).getTime() < 24 * 60 * 60 * 1000;
            return (
              <Card
                key={job.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]"
                onClick={() => { haptic(tg as never, "light"); onSelectJob(job.id); }}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-semibold text-[15px] leading-snug flex-1">{job.title}</h3>
                  <div className="flex flex-col items-end gap-1">
                    {isRecent && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0 h-5">
                        {t(lang, "badgeNew")}
                      </Badge>
                    )}
                    {dl.urgent && !dl.expired && (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">
                        {t(lang, "badgeUrgent")}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-2">
                  <span className="inline-flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    {job.subjects.split(",").slice(0, 2).join(", ")}
                    {job.subjects.split(",").length > 2 && "…"}
                  </span>
                  {job.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {t(lang, `jobType${job.workType.charAt(0)}${job.workType.slice(1).toLowerCase().replace(/_./g, (m) => m.charAt(1).toUpperCase())}`)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">
                    {job.salary ?? t(lang, "negotiable")}
                  </span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="inline-flex items-center gap-0.5">
                      <Users className="h-3 w-3" />
                      {job._count.applications}
                    </span>
                    <span className="inline-flex items-center gap-0.5">
                      <Clock className="h-3 w-3" />
                      {created}
                    </span>
                    <span className={dl.urgent ? "text-destructive font-medium" : dl.expired ? "text-muted-foreground" : ""}>
                      {dl.text}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
