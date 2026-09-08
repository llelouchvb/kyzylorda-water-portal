import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  Newspaper,
  Wrench,
} from "lucide-react";
import { Link } from "react-router";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  categoryDotOf,
  outageStyleOf,
  useCategoryLabel,
  useOutageLabel,
} from "@/components/portal/meta";

type Bi = { ru: string; kk: string };
export type OutageDoc = {
  _id: string;
  district: Bi;
  streets: Bi;
  reason: Bi;
  status: "planned" | "active" | "restored";
  startAt: number;
  restoredAt?: number | null;
  updatedAt: number;
};
export type NewsDoc = {
  _id: string;
  category: "news" | "announcement" | "outage" | "repair" | "tariffs";
  date: number;
  published: boolean;
  title: Bi;
  excerpt: Bi;
  body: Bi;
};

export function OutageStatusChip({ status }: { status: OutageDoc["status"] }) {
  const label = useOutageLabel(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset",
        outageStyleOf(status),
      )}
    >
      <span className="relative flex size-1.5">
        {status === "active" ? (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
        ) : null}
        <span className="relative inline-flex size-1.5 rounded-full bg-current" />
      </span>
      {label}
    </span>
  );
}

export function OutageCard({ outage, compact = false }: { outage: OutageDoc; compact?: boolean }) {
  const { t, lang, dateTime } = useI18n();
  const hasRestored = outage.status === "restored" && outage.restoredAt;

  return (
    <motion.article
      whileHover={{ y: -2 }}
      className={cn(
        "flex flex-col rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40",
        compact ? "gap-2" : "gap-3",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <OutageStatusChip status={outage.status} />
        {hasRestored ? (
          <span className="text-[11px] font-semibold text-emerald-600">
            {dateTime(outage.restoredAt as number)}
          </span>
        ) : null}
      </div>
      <div>
        <p className="flex items-center gap-1.5 text-sm font-extrabold tracking-tight">
          <MapPin className="size-3.5 shrink-0 text-primary/70" />
          {outage.district[lang]}
        </p>
        <p className="mt-1 text-[13px] leading-5 text-foreground/85">{outage.streets[lang]}</p>
      </div>
      {!compact ? (
        <p className="flex items-start gap-1.5 text-[13px] leading-5 text-muted-foreground">
          <Wrench className="mt-0.5 size-3.5 shrink-0" />
          {outage.reason[lang]}
        </p>
      ) : null}
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-2.5 text-[11px] font-semibold text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="size-3" />
          {t("outages.starts")}: {dateTime(outage.startAt)}
        </span>
        {outage.restoredAt ? (
          <span className="flex items-center gap-1">
            {t("outages.ends")}: {dateTime(outage.restoredAt)}
          </span>
        ) : null}
      </div>
    </motion.article>
  );
}

export function NewsCard({ item }: { item: NewsDoc }) {
  const { t, lang, dateShort } = useI18n();
  const cat = useCategoryLabel(item.category);

  return (
    <Link
      to={`/news/${item._id}`}
      className="card-hover group flex h-full flex-col overflow-hidden rounded-2xl border bg-card"
    >
      {/* gradient placeholder art instead of a raster image */}
      <div className="relative flex h-36 items-end overflow-hidden bg-gradient-to-br from-sky-100 via-blue-50 to-white px-4 pb-3">
        <div className="absolute -right-6 -top-8 size-32 rounded-full bg-sky-200/60 blur-2xl transition-transform duration-500 group-hover:scale-125" />
        <div className="absolute -bottom-10 left-6 size-28 rounded-full bg-blue-100/80 blur-xl" />
        <span
          className={cn("absolute left-4 top-4 size-2 rounded-full", categoryDotOf(item.category))}
        />
        <span className="relative flex size-9 items-center justify-center rounded-xl border bg-white/80 text-primary shadow-sm backdrop-blur">
          {item.category === "repair" ? (
            <Wrench className="size-4" />
          ) : (
            <Newspaper className="size-4" />
          )}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
            {cat}
          </Badge>
          <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <CalendarDays className="size-3" />
            {dateShort(item.date)}
          </span>
        </div>
        <h3 className="line-clamp-2 text-[15px] font-extrabold leading-snug tracking-tight transition-colors group-hover:text-primary">
          {item.title[lang]}
        </h3>
        <p className="line-clamp-2 text-[13px] leading-5 text-muted-foreground">
          {item.excerpt[lang]}
        </p>
        <span className="mt-auto flex items-center gap-1 pt-1 text-[13px] font-bold text-primary">
          {t("news.readMore")}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
