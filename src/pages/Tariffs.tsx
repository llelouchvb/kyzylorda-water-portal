import { motion } from "framer-motion";
import { Download, Landmark, ScrollText } from "lucide-react";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DemoTag, PageHero } from "@/components/portal/primitives";

type Audience = "physical" | "legal";

export default function Tariffs() {
  const { t, lang, money } = useI18n();
  const tariffs = useQuery(api.content.listTariffs);
  const [audience, setAudience] = useState<Audience>("physical");
  const rows = (tariffs ?? []).filter((r) => r.audience === audience);

  return (
    <div>
      <PageHero eyebrow={t("nav.tariffs")} title={t("tariffs.title")} subtitle={t("tariffs.subtitle")} />

      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          {/* audience toggle */}
          <div className="inline-flex w-fit rounded-full border bg-card p-1">
            {(
              [
                { value: "physical", label: t("tariffs.audience.physical"), icon: Landmark },
                { value: "legal", label: t("tariffs.audience.legal"), icon: ScrollText },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAudience(opt.value)}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold transition-colors",
                  audience === opt.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <opt.icon className="size-3.5" />
                {opt.label}
              </button>
            ))}
          </div>
          <DemoTag mock />
        </div>

        {tariffs === undefined ? (
          <p className="mt-10 text-sm text-muted-foreground">{t("common.loading")}</p>
        ) : (
          <motion.div
            key={audience}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 overflow-hidden rounded-2xl border bg-card"
          >
            <table className="w-full text-sm">
              <thead className="bg-muted/70 text-left text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5">{t("tariffs.col.service")}</th>
                  <th className="px-5 py-3.5">{t("tariffs.col.unit")}</th>
                  <th className="px-5 py-3.5 text-right">{t("tariffs.col.price")}</th>
                  <th className="hidden px-5 py-3.5 md:table-cell">{t("tariffs.col.period")}</th>
                  <th className="px-5 py-3.5 text-right">{t("tariffs.col.doc")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r._id} className="border-t border-border/60">
                    <td className="px-5 py-4 font-extrabold">{r.service[lang]}</td>
                    <td className="px-5 py-4 text-muted-foreground">{r.unit[lang]}</td>
                    <td className="px-5 py-4 text-right font-extrabold tabular-nums text-primary">
                      {money(r.price)}
                    </td>
                    <td className="hidden px-5 py-4 text-muted-foreground md:table-cell">
                      {r.period[lang]}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-primary"
                        onClick={() => toast.info(t("tariffs.demoNote"))}
                      >
                        <Download className="size-3.5" />
                        {t("tariffs.download")}
                      </Button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                      {t("admin.tab.empty")}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </motion.div>
        )}

        <p className="mt-5 rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-xs leading-5 text-sky-900">
          {t("tariffs.demoNote")}
        </p>
      </div>
    </div>
  );
}
