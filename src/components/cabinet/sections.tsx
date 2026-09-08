import { motion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  Gauge,
  LogOut,
  MessageSquareText,
  Receipt,
  ShieldCheck,
  Send,
  UserRound,
  Wallet,
  Wrench,
} from "lucide-react";
import { Link } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { PHONES, telHref } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  monthLabelLong,
  monthLabelShort,
  useBillingForUser,
  type BillingMonth,
} from "@/components/cabinet/use-billing";
import { DemoTag } from "@/components/portal/primitives";
import { appealStyleOf, useAppealLabel } from "@/components/portal/meta";

const STAFF_ROLES = ["admin", "operator", "dispatcher", "editor", "manager"];

/* ============================== OVERVIEW ============================== */

export function OverviewSection() {
  const { t, lang, money } = useI18n();
  const { loading, account, statement } = useBillingForUser();

  if (loading || !statement) {
    return <LoadingBlock />;
  }
  const current = statement.months[0] ?? ({} as BillingMonth);
  const chrono = [...statement.months].reverse();
  const max = Math.max(...chrono.map((m) => m.volume), 1);

  return (
    <div className="space-y-5">
      <Card className="border-border/70 shadow-none">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-100 text-primary">
              <Wallet className="size-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {t("cabinet.account")}
              </p>
              <p className="text-lg font-extrabold tabular-nums tracking-tight">
                № {statement.number}
              </p>
              <p className="text-xs text-muted-foreground">{statement.address[lang]}</p>
            </div>
          </div>
          <DemoTag mock />
        </CardContent>
      </Card>

      {/* balance + quick actions */}
      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-white">
          <div className="water-radial pointer-events-none absolute inset-0 opacity-40" aria-hidden />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-300">
              {t("cabinet.balance")}
            </p>
            <p className="mt-2 text-4xl font-extrabold tracking-tight tabular-nums">
              {statement.balance > 0 ? money(statement.balance) : t("balance.debtZero")}
            </p>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-4 text-sm">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  {t("cabinet.accrued")}
                </p>
                <p className="mt-0.5 font-extrabold tabular-nums">{money(current.accrual ?? 0)}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  {t("cabinet.balancePaid")}
                </p>
                <p className="mt-0.5 font-extrabold tabular-nums text-emerald-300">
                  {money(current.paid ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  {t("cabinet.address")}
                </p>
                <p className="mt-0.5 font-bold">{statement.address[lang]}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild size="lg" className="gap-2 justify-start rounded-2xl h-14">
            <Link to="/services/readings">
              <Send className="size-4" />
              {t("cabinet.sendReading")}
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="gap-2 justify-start rounded-2xl h-14 border-border bg-card"
          >
            <Link to={`/services/payment?account=${statement.number}`}>
              <CreditCard className="size-4" />
              {t("cabinet.pay")}
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="gap-2 justify-start rounded-2xl h-14 border-border bg-card"
          >
            <Link to="/appeal">
              <MessageSquareText className="size-4" />
              {t("cabinet.appeals.create")}
            </Link>
          </Button>
        </div>
      </div>

      {/* usage chart */}
      <Card className="border-border/70 shadow-none">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base tracking-tight">{t("cabinet.usage.title")}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {t("cabinet.usage.subtitle")} ·{" "}
              {t("cabinet.usage.total")}:{" "}
              <b>{new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(chrono.reduce((s, m) => s + m.volume, 0))} м³</b>
            </p>
          </div>
          <DemoTag mock />
        </CardHeader>
        <CardContent>
          <div className="flex h-44 items-end gap-1.5 sm:gap-2">
            {chrono.map((m, i) => {
              const h = Math.max((m.volume / max) * 100, 3);
              return (
                <div key={m.month} className="group flex flex-1 flex-col items-center gap-1.5">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.04, duration: 0.5, ease: "easeOut" }}
                    className="relative w-full overflow-hidden rounded-t-md bg-gradient-to-t from-blue-600 to-sky-400 transition-opacity group-hover:opacity-80"
                    title={`${monthLabelLong(m.month, lang)}: ${m.volume} м³`}
                  >
                    <span className="absolute inset-x-0 -top-5 text-center text-[9px] font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      {m.volume}
                    </span>
                  </motion.div>
                  <span className="text-[9px] font-bold uppercase text-muted-foreground sm:text-[10px]">
                    {monthLabelShort(m.month, lang)}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================= ACCRUALS ============================== */

export function AccrualsSection() {
  const { t, lang, money } = useI18n();
  const { loading, statement } = useBillingForUser();
  if (loading || !statement) return <LoadingBlock />;
  const chrono = [...statement.months].reverse();
  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base tracking-tight">
          <Receipt className="size-4 text-primary" />
          {t("cabinet.accruals.subtitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="bg-muted/70 text-left text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3">{t("cabinet.period")}</th>
              <th className="px-5 py-3 text-right">{t("cabinet.volume")}</th>
              <th className="hidden px-5 py-3 text-right sm:table-cell">{t("cabinet.m3")} / ₸</th>
              <th className="px-5 py-3 text-right">{t("balance.sum")}</th>
              <th className="px-5 py-3 text-right">{t("cabinet.paid")}</th>
            </tr>
          </thead>
          <tbody>
            {chrono.map((m) => (
              <tr key={m.month} className="border-t border-border/60">
                <td className="px-5 py-3 font-extrabold">{monthLabelLong(m.month, lang)}</td>
                <td className="px-5 py-3 text-right tabular-nums">{m.volume} м³</td>
                <td className="hidden px-5 py-3 text-right tabular-nums text-muted-foreground sm:table-cell">
                  {m.rate} ₸
                </td>
                <td className="px-5 py-3 text-right font-bold tabular-nums">{money(m.accrual)}</td>
                <td className="px-5 py-3 text-right">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums",
                      m.paid >= m.accrual
                        ? "bg-emerald-50 text-emerald-700"
                        : m.paid > 0
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700",
                    )}
                  >
                    {m.paid >= m.accrual ? t("cabinet.paid") : money(m.paid)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

/* ============================= PAYMENTS ============================== */

export function PaymentsSection() {
  const { t, lang, money } = useI18n();
  const { loading, statement } = useBillingForUser();
  if (loading || !statement) return <LoadingBlock />;
  const paid = [...statement.months].reverse().filter((m) => m.paid > 0);
  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base tracking-tight">
          <Banknote className="size-4 text-primary" />
          {t("cabinet.payments.subtitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="bg-muted/70 text-left text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3">{t("cabinet.period")}</th>
                <th className="px-5 py-3 text-right">{t("balance.sum")}</th>
                <th className="px-5 py-3 text-right">{t("cabinet.paid")}</th>
              </tr>
            </thead>
            <tbody>
              {paid.map((m) => (
                <tr key={m.month} className="border-t border-border/60">
                  <td className="px-5 py-3 font-extrabold">{monthLabelLong(m.month, lang)}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                    {money(m.accrual)}
                  </td>
                  <td className="px-5 py-3 text-right font-bold tabular-nums text-emerald-600">
                    {money(m.paid)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t px-5 py-4">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/services/payment">
              <CreditCard className="size-4" />
              {t("payment.methods.title")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================= READINGS ============================== */

export function ReadingsSection() {
  const { t, lang } = useI18n();
  const { loading, statement } = useBillingForUser();
  if (loading || !statement) return <LoadingBlock />;
  const chrono = [...statement.months].reverse();
  return (
    <div className="space-y-4">
      <Card className="border-border/70 shadow-none">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-sky-100 text-primary">
              <Gauge className="size-5" />
            </span>
            <div>
              <p className="text-sm font-extrabold tracking-tight">{t("cabinet.reading.need")}</p>
              <p className="text-xs text-muted-foreground">{t("readings.subtitle")}</p>
            </div>
          </div>
          <Button asChild>
            <Link to="/services/readings">
              <Send className="size-4" />
              {t("cabinet.sendReading")}
            </Link>
          </Button>
        </CardContent>
      </Card>
      <Card className="border-border/70 shadow-none">
        <CardHeader>
          <CardTitle className="text-base tracking-tight">{t("cabinet.readings.subtitle")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/70 text-left text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3">{t("cabinet.period")}</th>
                <th className="px-5 py-3 text-right">{t("cabinet.volume")}</th>
                <th className="px-5 py-3 text-right">{t("cabinet.m3")} / ₸</th>
                <th className="px-5 py-3 text-right">{t("balance.sum")}</th>
              </tr>
            </thead>
            <tbody>
              {chrono.map((m) => (
                <tr key={m.month} className="border-t border-border/60">
                  <td className="px-5 py-3 font-bold">{monthLabelLong(m.month, lang)}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{m.volume} м³</td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{m.rate} ₸</td>
                  <td className="px-5 py-3 text-right font-bold tabular-nums">
                    {new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(m.accrual)} ₸
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================== APPEALS ============================== */

const CAT_KEY: Record<string, string> = {
  accrual: "appeal.cat.accrual",
  debt: "appeal.cat.debt",
  water: "appeal.cat.water",
  sewer: "appeal.cat.sewer",
  meter: "appeal.cat.meter",
  accident: "appeal.cat.accident",
  quality: "appeal.cat.quality",
  other: "appeal.cat.other",
};

export function CabinetAppealsSection() {
  const { t, dateTime } = useI18n();
  const appeals = useQuery(api.content.listMyAppeals);
  const statusLabel = useAppealLabel;

  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base tracking-tight">{t("cabinet.appeals.subtitle")}</CardTitle>
        <Button asChild size="sm">
          <Link to="/appeal">{t("cabinet.appeals.create")}</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {appeals === undefined ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">{t("common.loading")}</p>
        ) : appeals.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            {t("cabinet.appeals.empty")}
          </p>
        ) : (
          <ul className="divide-y">
            {appeals.map((a) => (
              <li key={a._id} className="flex flex-col gap-2 px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm font-extrabold tracking-tight">
                    <MessageSquareText className="size-4 text-primary/70" />
                    №{a.displayNumber}
                    <span className="text-xs font-semibold text-muted-foreground">
                      {t(CAT_KEY[a.category] ?? "appeal.cat.other")}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset",
                      appealStyleOf(a.status),
                    )}
                  >
                    {statusLabel(a.status)}
                  </span>
                </div>
                <p className="text-[13px] leading-6 text-foreground/85">{a.message}</p>
                {a.response ? (
                  <p className="rounded-xl bg-muted/60 px-3.5 py-2.5 text-[13px] leading-6">
                    <span className="font-bold">{t("appeal.reply")}: </span>
                    {a.response}
                  </p>
                ) : null}
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                  <CalendarDays className="size-3" />
                  {dateTime(a._creationTime)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/* ============================= DOCUMENTS ============================= */

export function CabinetDocumentsSection() {
  const { t, lang } = useI18n();
  const docs = useQuery(api.content.listDocuments);
  const relevant = (docs ?? []).filter((d) => d.category === "contract" || d.category === "form").slice(0, 5);

  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base tracking-tight">
          <FileText className="size-4 text-primary" />
          {t("cabinet.documents.subtitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {docs === undefined ? (
          <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
        ) : (
          relevant.map((d) => (
            <Link
              key={d._id}
              to="/documents"
              className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors hover:border-primary/40 hover:bg-muted/40"
            >
              <FileText className="size-4 shrink-0 text-primary/70" />
              <span className="flex-1 text-sm font-bold">{d.title[lang]}</span>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>
          ))
        )}
        <Button asChild variant="outline" className="w-full gap-2">
          <Link to="/documents">
            {t("documents.title")}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

/* ============================== PROFILE ============================== */

export function ProfileSection() {
  const { t } = useI18n();
  const { user, signOut } = useAuth();
  const { account, statement } = useBillingForUser();
  const role = user?.role ?? "user";
  const isStaff = STAFF_ROLES.includes(role);

  const roleLabel = `admin.roles.${role}`;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border/70 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base tracking-tight">
            <UserRound className="size-4 text-primary" />
            {t("cabinet.profile.subtitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row k={t("cabinet.profile.name")} v={user?.name ?? "—"} />
          <Row k={t("cabinet.profile.email")} v={user?.email ?? "guest@demo.local"} />
          <Row
            k={t("cabinet.profile.role")}
            v={
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-200">
                <ShieldCheck className="size-3" />
                {t(roleLabel as never)}
              </span>
            }
          />
          <Row k={t("cabinet.profile.demo")} v={`№ ${account} · ${statement?.address.ru ?? ""}`} />
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-none">
        <CardHeader>
          <CardTitle className="text-base tracking-tight">{t("contacts.callCenter")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <a
            href={telHref(PHONES.callCenter)}
            className="flex items-center justify-between rounded-xl border px-4 py-3 transition-colors hover:border-primary/40 hover:bg-muted/40"
          >
            <span className="text-sm font-bold">{PHONES.callCenterPretty}</span>
            <Wrench className="size-4 text-muted-foreground" />
          </a>
          <a
            href={telHref(PHONES.emergency)}
            className="flex items-center justify-between rounded-xl border px-4 py-3 transition-colors hover:border-primary/40 hover:bg-muted/40"
          >
            <span className="text-sm font-bold">{PHONES.emergencyPretty}</span>
            <span className="text-[10px] font-bold uppercase text-red-500">24/7</span>
          </a>
          {isStaff ? (
            <Button asChild className="w-full gap-2">
              <Link to="/admin">
                <ShieldCheck className="size-4" />
                {t("cabinet.toAdmin")}
              </Link>
            </Button>
          ) : null}
          <Button
            variant="outline"
            className="w-full gap-2 text-destructive hover:text-destructive"
            onClick={async () => {
              await signOut();
              window.location.href = "/";
            }}
          >
            <LogOut className="size-4" />
            {t("cabinet.signOut")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-2.5 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-bold">{v}</span>
    </div>
  );
}

/* ============================== SHARED =============================== */

function LoadingBlock() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-muted-foreground">
      <span className="size-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      {t("common.loading")}
    </div>
  );
}

export function DemoNotice() {
  const { t } = useI18n();
  return (
    <p className="flex items-start gap-2 rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-xs leading-5 text-sky-900">
      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-sky-500" />
      {t("cabinet.demoAccountNote")} {t("misc.demoData")}
    </p>
  );
}
