import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { NewsCard } from "@/components/portal/cards";
import { PageHero } from "@/components/portal/primitives";
import { NEWS_CATEGORIES } from "@/components/portal/meta";

const ALL = "all";

export default function News() {
  const { t } = useI18n();
  const news = useQuery(api.content.listNews, {});
  const [filter, setFilter] = useState<string>(ALL);
  const items = (news ?? []).filter((n) => n.published);

  const filters = [
    { value: ALL, label: t("news.filters.all") },
    ...NEWS_CATEGORIES.map((c) => ({
      value: c,
      label: t(`news.filters.${c}`),
    })),
  ];

  const visible = filter === ALL ? items : items.filter((n) => n.category === filter);

  return (
    <div>
      <PageHero eyebrow={t("nav.news")} title={t("news.title")} subtitle={t("news.subtitle")} />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        {/* filter chips */}
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "shrink-0 cursor-pointer rounded-full border px-4 py-2 text-[13px] font-bold transition-colors",
                filter === f.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {news === undefined ? (
          <p className="mt-10 text-sm text-muted-foreground">{t("common.loading")}</p>
        ) : visible.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-dashed bg-card/60 p-10 text-center text-sm font-semibold text-muted-foreground">
            {t("news.notFound")}
          </p>
        ) : (
          <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((n, i) => (
              <motion.div
                key={n._id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
              >
                <NewsCard item={n} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
