import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/portal/primitives";

const ALL = "all";
const CATS = ["report", "normative", "contract", "tender", "form"] as const;

const CAT_KEY = {
  report: "documents.cat.report",
  normative: "documents.cat.normative",
  contract: "documents.cat.contract",
  tender: "documents.cat.tender",
  form: "documents.cat.form",
} as const;

export default function Documents() {
  const { t, lang, dateShort } = useI18n();
  const docs = useQuery(api.content.listDocuments);
  const [filter, setFilter] = useState<string>(ALL);

  const filters = [
    { value: ALL, label: t("common.all") },
    ...CATS.map((c) => ({ value: c, label: t(CAT_KEY[c]) })),
  ];
  const visible = (docs ?? []).filter((d) => filter === ALL || d.category === filter);

  return (
    <div>
      <PageHero eyebrow={t("nav.documents")} title={t("documents.title")} subtitle={t("documents.subtitle")} />

      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
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

        {docs === undefined ? (
          <p className="mt-8 text-sm text-muted-foreground">{t("common.loading")}</p>
        ) : visible.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed bg-card/60 p-12 text-center text-sm font-semibold text-muted-foreground">
            {t("admin.tab.empty")}
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border bg-card">
            {visible.map((d, i) => (
              <motion.div
                key={d._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
                className="flex flex-col gap-3 border-b border-border/60 p-4 last:border-b-0 sm:flex-row sm:items-center"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-primary">
                  <FileText className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold tracking-tight">{d.title[lang]}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t(CAT_KEY[d.category])} · {dateShort(d.date)} ·{" "}
                    <span className="italic">{t("documents.demo")}</span>
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-1.5"
                  onClick={() => toast.info(t("documents.demo"))}
                >
                  <Download className="size-3.5" />
                  {t("documents.download")}
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
