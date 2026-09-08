import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { OutageCard, type OutageDoc } from "@/components/portal/cards";
import { PageHero } from "@/components/portal/primitives";
import { DemoTag } from "@/components/portal/primitives";

type Filter = "all" | "active" | "planned" | "restored";
const FILTERS: { value: Filter; labelKey: "outages.active" | "outages.upcoming" | "outages.status.restored" | "outages.filter.all" }[] = [
  { value: "all", labelKey: "outages.filter.all" },
  { value: "active", labelKey: "outages.active" },
  { value: "planned", labelKey: "outages.upcoming" },
  { value: "restored", labelKey: "outages.status.restored" },
];

export default function Outages() {
  const { t } = useI18n();
  const outages = useQuery(api.content.listOutages);
  const [filter, setFilter] = useState<Filter>("all");

  const statusRank: Record<OutageDoc["status"], number> = { active: 0, planned: 1, restored: 2 };
  const sorted = [...(outages ?? [])].sort((a, b) => {
    const r = statusRank[a.status] - statusRank[b.status];
    return r !== 0 ? r : b.startAt - a.startAt;
  });
  const visible = sorted.filter((o) => filter === "all" || o.status === filter);

  const activeCount = (outages ?? []).filter((o) => o.status === "active").length;

  return (
    <div>
      <PageHero eyebrow={t("nav.outages")} title={t("outages.title")} subtitle={t("outages.subtitle")} />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        {/* summary + filters */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-2 text-[13px] font-bold transition-colors",
                  filter === f.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {t(f.labelKey)}
              </button>
            ))}
          </div>
          <span className="flex items-center gap-2 text-sm font-bold">
            {activeCount > 0 ? (
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-red-500" />
              </span>
            ) : null}
            {activeCount > 0
              ? `${t("outages.active")}: ${activeCount}`
              : t("outages.empty")}
            <DemoTag />
          </span>
        </div>

        {outages === undefined ? (
          <p className="mt-10 text-sm text-muted-foreground">{t("common.loading")}</p>
        ) : visible.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed bg-card/60 p-12 text-center">
            <p className="text-sm font-semibold text-muted-foreground">{t("outages.empty")}</p>
          </div>
        ) : (
          <motion.div layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((o, i) => (
              <motion.div
                key={o._id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
              >
                <OutageCard outage={o} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <p className="mt-6 flex items-start gap-2 rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-xs leading-5 text-sky-900">
          <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-sky-500" />
          {t("outages.notice")}
        </p>
      </div>
    </div>
  );
}
