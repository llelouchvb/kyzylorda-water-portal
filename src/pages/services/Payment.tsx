import { motion } from "framer-motion";
import {
  ArrowRight,
  Building,
  CheckCircle2,
  CreditCard,
  Landmark,
  MonitorSmartphone,
  QrCode,
  Smartphone,
  Store,
} from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { REQUISITES } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoTag, PageHero } from "@/components/portal/primitives";

const METHODS = [
  {
    key: "payment.kaspi.title" as const,
    desc: "payment.kaspi.desc" as const,
    icon: QrCode,
    chip: "Kaspi.kz",
  },
  {
    key: "payment.bank.title" as const,
    desc: "payment.bank.desc" as const,
    icon: Landmark,
    chip: "Halyk · Bereke",
  },
  {
    key: "payment.card.title" as const,
    desc: "payment.card.desc" as const,
    icon: CreditCard,
    chip: "Visa · Mastercard",
  },
  {
    key: "payment.terminal.title" as const,
    desc: "payment.terminal.desc" as const,
    icon: Store,
    chip: "QIWI · Касса 24",
  },
];

export default function Payment() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const [account, setAccount] = useState(params.get("account") ?? "");
  const [paid, setPaid] = useState(false);
  const valid = /^\d{8}$/.test(account.trim());

  return (
    <div>
      <PageHero eyebrow={t("nav.services")} title={t("payment.title")} subtitle={t("payment.subtitle")} />

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
        {/* methods */}
        <div>
          <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
            <Smartphone className="size-5 text-primary" />
            {t("payment.methods.title")}
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {METHODS.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="card-hover rounded-2xl border bg-card p-5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-blue-100 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                      {m.chip}
                    </span>
                  </div>
                  <h3 className="mt-4 font-extrabold tracking-tight">{t(m.key)}</h3>
                  <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">{t(m.desc)}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border bg-card">
            <div className="flex items-center gap-2 border-b px-5 py-4">
              <Building className="size-4 text-primary" />
              <h3 className="text-sm font-extrabold tracking-tight">{t("payment.details.title")}</h3>
            </div>
            <dl className="divide-y px-5 text-sm">
              {(
                [
                  { k: t("payment.details.bin"), v: REQUISITES.bin },
                  { k: t("payment.details.iban"), v: REQUISITES.iik },
                  { k: t("payment.details.bank"), v: REQUISITES.bank },
                  { k: t("payment.details.kbe"), v: REQUISITES.kbe },
                ] as const
              ).map((r) => (
                <div key={r.k} className="flex items-center justify-between gap-4 py-3">
                  <dt className="shrink-0 text-muted-foreground">{r.k}</dt>
                  <dd className="text-right font-bold tabular-nums">{r.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* online widget */}
        <div className="h-fit lg:sticky lg:top-28">
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-white sm:p-7">
            <div className="water-radial pointer-events-none absolute inset-0 opacity-40" aria-hidden />
            <div className="relative">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
                  <MonitorSmartphone className="size-5 text-sky-300" />
                  {t("payment.online.title")}
                </h2>
                <DemoTag mock />
              </div>
              <p className="mt-2 text-[13px] leading-6 text-slate-300">{t("payment.online.desc")}</p>

              {paid ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-2xl border border-sky-400/30 bg-sky-400/10 p-5 text-center"
                >
                  <CheckCircle2 className="mx-auto size-10 text-sky-300" />
                  <p className="mt-2 font-extrabold">{t("payment.demo")}: OK</p>
                  <p className="mt-1 text-xs text-slate-300">{t("payment.integrationNote")}</p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-4 border-white/25 bg-white/10 text-white hover:bg-white/20"
                  >
                    <Link to="/services/balance">{t("hero.cta.balance")}</Link>
                  </Button>
                </motion.div>
              ) : (
                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setPaid(true);
                    toast.success(t("payment.demo"));
                  }}
                >
                  <div className="space-y-1.5">
                    <Label className="text-slate-200">{t("payment.online.account")}</Label>
                    <Input
                      value={account}
                      onChange={(e) => setAccount(e.target.value.replace(/\D/g, "").slice(0, 8))}
                      placeholder={t("readings.form.accountPh")}
                      inputMode="numeric"
                      className="h-11 border-white/15 bg-white/10 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!valid}
                    className="w-full gap-2 bg-sky-500 hover:bg-sky-400"
                  >
                    {t("payment.online.pay")}
                    <ArrowRight className="size-4" />
                  </Button>
                  <p className="text-[11px] leading-4 text-slate-400">{t("payment.integrationNote")}</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
