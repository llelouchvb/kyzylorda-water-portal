import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Search,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useI18n } from "@/lib/i18n";
import { APP_DEMO_ACCOUNT } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoTag, PageHero } from "@/components/portal/primitives";

export default function Balance() {
  const { t, lang, money, dateTime } = useI18n();
  const [params] = useSearchParams();
  const [input, setInput] = useState(params.get("account") ?? "");
  const trimmed = input.trim();
  const valid = /^\d{8}$/.test(trimmed);
  const result = useQuery(
    api.billing.getAccount,
    valid ? { accountNumber: trimmed } : "skip",
  );

  const searched = valid;
  const notFound = searched && result !== undefined && !result.found;

  return (
    <div>
      <PageHero eyebrow={t("nav.services")} title={t("balance.title")} subtitle={t("balance.subtitle")} />

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-14">
        {/* lookup panel */}
        <div className="h-fit rounded-2xl border bg-card p-6 sm:p-7 lg:sticky lg:top-28">
          <div className="flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-primary">
              <Search className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">{t("hero.panel.enter")}</h2>
              <DemoTag mock />
            </div>
          </div>

          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="space-y-1.5">
              <Label htmlFor="account">{t("balance.account")}</Label>
              <Input
                id="account"
                value={input}
                onChange={(e) => setInput(e.target.value.replace(/\D/g, "").slice(0, 8))}
                inputMode="numeric"
                placeholder={t("balance.accountPh")}
                className="h-11 text-base tracking-wide"
                autoFocus
              />
              <p className="text-[11px] text-muted-foreground">
                {t("readings.form.accountPh")} · {t("hero.panel.note")}
              </p>
            </div>
            <Button type="submit" size="lg" className="w-full gap-2" disabled={!valid}>
              {valid && result === undefined ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  {t("balance.searching")}
                </>
              ) : (
                <>
                  {t("balance.search")}
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          {notFound ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4"
            >
              <p className="flex items-center gap-2 text-sm font-extrabold text-amber-900">
                <AlertTriangle className="size-4" />
                {t("balance.notFound")}
              </p>
              <p className="mt-1.5 text-[13px] leading-5 text-amber-800/90">
                {t("balance.notFoundDesc")}
              </p>
              <button
                type="button"
                onClick={() => setInput(APP_DEMO_ACCOUNT)}
                className="mt-3 cursor-pointer rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-primary ring-1 ring-amber-200 transition-colors hover:bg-amber-100"
              >
                {t("hero.panel.placeholder")}
              </button>
            </motion.div>
          ) : null}
        </div>

        {/* result */}
        <div>
          {!searched ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed bg-card/60 p-8 text-center">
              <Wallet className="size-10 text-primary/40" />
              <p className="mt-3 max-w-xs text-sm font-semibold text-muted-foreground">
                {t("balance.subtitle")}
              </p>
            </div>
          ) : result === undefined ? (
            <div className="flex min-h-64 items-center justify-center rounded-2xl border bg-card/60">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="size-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                {t("balance.searching")}
              </p>
            </div>
          ) : result.found ? (
            <motion.div
              key={result.number}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* headline debt card */}
              <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-white">
                <div className="water-radial pointer-events-none absolute inset-0 opacity-40" aria-hidden />
                <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-300">
                      {t("balance.found")}
                    </p>
                    <p className="mt-3 text-3xl font-extrabold tracking-tight tabular-nums sm:text-4xl">
                      {result.balance > 0 ? money(result.balance) : t("balance.debtZero")}
                    </p>
                    <p className="mt-2 text-[13px] text-slate-400">{result.address[lang]}</p>
                  </div>
                  <Button asChild size="lg" className="gap-2 bg-sky-500 hover:bg-sky-400">
                    <Link to={`/services/payment?account=${result.number}`}>
                      <CreditCard className="size-4" />
                      {t("balance.pay")}
                    </Link>
                  </Button>
                </div>
              </div>

              {/* account facts */}
              <div className="grid gap-4 sm:grid-cols-2">
                <FactCard icon={CalendarClock} label={t("balance.accrual")} value={money(result.lastAccrual)} />
                <FactCard icon={CheckCircle2} label={t("balance.payment")} value={money(result.lastPayment)} />
                <FactCard
                  icon={Wallet}
                  label={t("balance.debt")}
                  value={result.balance > 0 ? money(result.balance) : t("balance.debtZero")}
                  tone={result.balance > 0 ? "rose" : "emerald"}
                />
                <FactCard icon={CalendarClock} label={t("balance.updated")} value={dateTime(result.updatedAt)} />
              </div>

              {/* statement table */}
              <div className="overflow-hidden rounded-2xl border bg-card">
                <div className="flex items-center justify-between border-b px-5 py-4">
                  <h3 className="flex items-center gap-2 text-sm font-extrabold tracking-tight">
                    <TrendingUp className="size-4 text-primary" />
                    {t("balance.history")}
                  </h3>
                  <DemoTag mock />
                </div>
                <div className="max-h-[420px] overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-muted/80 text-left text-[11px] font-bold uppercase tracking-wide text-muted-foreground backdrop-blur">
                      <tr>
                        <th className="px-5 py-2.5">{t("cabinet.period")}</th>
                        <th className="px-5 py-2.5 text-right">{t("cabinet.volume")}</th>
                        <th className="px-5 py-2.5 text-right">{t("balance.sum")}</th>
                        <th className="px-5 py-2.5 text-right">{t("cabinet.paid")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.months.map((m) => (
                        <tr key={m.month} className="border-t border-border/60">
                          <td className="px-5 py-2.5 font-bold">{monthName(m.month, lang)}</td>
                          <td className="px-5 py-2.5 text-right tabular-nums text-muted-foreground">
                            {m.volume} м³
                          </td>
                          <td className="px-5 py-2.5 text-right font-bold tabular-nums">{money(m.accrual)}</td>
                          <td className="px-5 py-2.5 text-right tabular-nums text-muted-foreground">
                            {money(m.paid)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="flex items-start gap-2 rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-xs leading-5 text-sky-900">
                <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-sky-500" />
                {t("balance.demoNote")}
              </p>
            </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  );

  function monthName(iso: string, lng: "ru" | "kk"): string {
    const d = new Date(`${iso}T00:00:00`);
    try {
      return new Intl.DateTimeFormat(lng === "kk" ? "kk-KZ" : "ru-RU", {
        month: "long",
        year: "numeric",
      }).format(d);
    } catch {
      return new Intl.DateTimeFormat("ru-RU", {
        month: "long",
        year: "numeric",
      }).format(d);
    }
  }
}

function FactCard({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  tone?: "default" | "rose" | "emerald";
}) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3.5 text-primary/70" />
        {label}
      </p>
      <p
        className={cn(
          "mt-2 truncate text-lg font-extrabold tabular-nums tracking-tight",
          tone === "rose" && "text-red-600",
          tone === "emerald" && "text-emerald-600",
        )}
      >
        {value}
      </p>
    </div>
  );
}
