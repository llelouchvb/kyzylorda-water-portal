import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Building2,
  ChevronRight,
  CreditCard,
  FileQuestion,
  Gauge,
  Map as MapIcon,
  MessageSquareText,
  PhoneCall,
  Search,
  Send,
  ShieldCheck,
  Siren,
  UserRound,
  Waves,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import { Link } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useI18n } from "@/lib/i18n";
import { ORG, PHONES, telHref } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NewsCard, OutageCard, type OutageDoc } from "@/components/portal/cards";
import { DemoTag, Reveal, SectionHeading } from "@/components/portal/primitives";

/* ---------------------------- hero quick check --------------------------- */

function QuickCheck() {
  const { t, money, lang } = useI18n();
  const [account, setAccount] = useState("");
  const trimmed = account.trim();
  const isValid = /^\d{8}$/.test(trimmed);
  const result = useQuery(
    api.billing.getAccount,
    isValid ? { accountNumber: trimmed } : "skip",
  );

  return (
    <div className="relative overflow-hidden rounded-3xl border border-sky-200/70 bg-white/85 p-6 shadow-[0_24px_60px_-30px_rgba(11,79,156,0.35)] backdrop-blur sm:p-7">
      <div className="water-radial pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-extrabold">{t("hero.panel.title")}</p>
          <DemoTag mock />
        </div>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isValid) return;
          }}
        >
          <div className="flex-1">
            <Label htmlFor="hero-account" className="sr-only">
              {t("hero.panel.enter")}
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="hero-account"
                value={account}
                onChange={(e) => setAccount(e.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder={t("hero.panel.placeholder")}
                inputMode="numeric"
                className="h-11 border-border/80 bg-white pl-9"
                aria-label={t("hero.panel.enter")}
              />
            </div>
          </div>
          <Button type="submit" className="h-11 px-4 sm:px-5" disabled={!isValid}>
            {t("hero.panel.check")}
          </Button>
        </form>

        {result === undefined && isValid ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            {t("balance.searching")}
          </p>
        ) : null}

        {result && result.found ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-2xl border bg-white/90 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  {t("balance.account.label")} {result.number}
                </p>
                <p className="mt-1 text-xs font-semibold text-foreground/80">
                  {result.address[lang]}
                </p>
              </div>
              <p className="text-right">
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("balance.debt")}
                </span>
                <span
                  className={cn(
                    "text-lg font-extrabold tabular-nums",
                    result.balance > 0 ? "text-red-600" : "text-emerald-600",
                  )}
                >
                  {result.balance > 0 ? money(result.balance) : t("balance.debtZero")}
                </span>
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1 bg-white">
                <Link to={`/services/balance?account=${result.number}`}>
                  {t("hero.cta.balance")}
                </Link>
              </Button>
              <Button asChild size="sm" className="flex-1">
                <Link to={`/services/payment?account=${result.number}`}>
                  <Banknote className="size-3.5" />
                  {t("balance.pay")}
                </Link>
              </Button>
            </div>
          </motion.div>
        ) : null}

        {result && !result.found ? (
          <p className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[13px] font-semibold text-amber-800">
            <AlertTriangle className="size-4 shrink-0" />
            {t("hero.panel.error")}
          </p>
        ) : null}

        <p className="mt-4 text-[11px] leading-4 text-muted-foreground">
          {t("hero.panel.note")}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------- services ------------------------------- */

interface ServiceCardDef {
  to: string;
  titleKey: "services.reading.title" | "services.balance.title" | "services.pay.title" | "services.accident.title" | "services.appeal.title";
  descKey: "services.reading.desc" | "services.balance.desc" | "services.pay.desc" | "services.accident.desc" | "services.appeal.desc";
  icon: ComponentType<{ className?: string }>;
  accent: string;
  featured?: boolean;
}

const SERVICES: ServiceCardDef[] = [
  {
    to: "/services/readings",
    titleKey: "services.reading.title",
    descKey: "services.reading.desc",
    icon: Gauge,
    accent: "text-sky-600 bg-sky-100",
  },
  {
    to: "/services/balance",
    titleKey: "services.balance.title",
    descKey: "services.balance.desc",
    icon: Search,
    accent: "text-blue-600 bg-blue-100",
  },
  {
    to: "/services/payment",
    titleKey: "services.pay.title",
    descKey: "services.pay.desc",
    icon: Banknote,
    accent: "text-teal-600 bg-teal-100",
  },
  {
    to: "/services/emergency",
    titleKey: "services.accident.title",
    descKey: "services.accident.desc",
    icon: Siren,
    accent: "text-rose-600 bg-rose-100",
  },
  {
    to: "/appeal",
    titleKey: "services.appeal.title",
    descKey: "services.appeal.desc",
    icon: MessageSquareText,
    accent: "text-violet-600 bg-violet-100",
  },
];

function OutageAlertBanner({ outages }: { outages: OutageDoc[] }) {
  const { t, lang } = useI18n();
  const active = outages.filter((o) => o.status === "active");
  const planned = outages.filter((o) => o.status === "planned");
  if (active.length === 0 && planned.length === 0) return null;
  return (
    <Reveal>
      <Link
        to="/outages"
        className="group flex items-center gap-3 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50/60 px-4 py-3 transition-colors hover:border-amber-300"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          <Siren className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-extrabold tracking-tight text-amber-900">
            {active.length > 0
              ? `${t("outages.active")} · ${active[0]?.district[lang]} — ${active[0]?.streets[lang]}`
              : t("outages.upcoming")}
          </p>
          <p className="truncate text-xs text-amber-700/90">
            {active.length > 0 ? active[0]?.reason[lang] : planned[0]?.reason[lang]}
          </p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-amber-600 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </Reveal>
  );
}

/* --------------------------------- home --------------------------------- */

export default function Home() {
  const { t, lang } = useI18n();
  const outages = useQuery(api.content.listOutages);
  const news = useQuery(api.content.listNews, {});

  const latestNews = (news ?? []).filter((n) => n.published).slice(0, 3);
  const latestOutages = (outages ?? []).slice(0, 3);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: "easeOut" as const },
  });

  return (
    <div className="bg-background">
      {/* ============================ HERO ============================ */}
      <section className="water-radial relative overflow-hidden border-b border-border/50">
        <div className="water-grid absolute inset-0 opacity-70" aria-hidden />
        {/* decorative floating ripples */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-20 top-10 size-72 rounded-full border-[24px] border-sky-200/40"
          />
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-24 top-40 size-24 rounded-full border-[10px] border-sky-300/30"
          />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14 lg:pb-24 lg:pt-20">
          <div>
            <motion.div {...fade(0)}>
              <Badge
                variant="outline"
                className="gap-1.5 rounded-full border-sky-200 bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary backdrop-blur"
              >
                <ShieldCheck className="size-3.5" />
                {t("brand.name")}
              </Badge>
            </motion.div>
            <motion.h1
              {...fade(0.08)}
              className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.6rem]"
            >
              {t("hero.title1")}{" "}
              <span className="relative whitespace-nowrap text-primary">
                {t("hero.title2")}
                <svg
                  viewBox="0 0 220 12"
                  className="absolute -bottom-1 left-0 h-3 w-full text-sky-300"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M3 9 C 40 3, 80 11, 120 7 S 200 4, 217 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>
            <motion.p
              {...fade(0.16)}
              className="mt-6 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div {...fade(0.24)} className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-12 gap-2 rounded-xl px-6">
                <Link to="/services/readings">
                  <Send className="size-4" />
                  {t("hero.cta.reading")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 gap-2 rounded-xl border-border bg-white/80 px-6 backdrop-blur">
                <Link to="/services/balance">
                  <Search className="size-4" />
                  {t("hero.cta.balance")}
                </Link>
              </Button>
            </motion.div>

            <motion.div
              {...fade(0.32)}
              className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-bold text-muted-foreground"
            >
              <Link to="/cabinet" className="group inline-flex items-center gap-1.5 transition-colors hover:text-primary">
                <UserRound className="size-4 text-primary/70" />
                {t("hero.cta.cabinet")}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to="/services/emergency" className="group inline-flex items-center gap-1.5 transition-colors hover:text-primary">
                <Siren className="size-4 text-rose-500/80" />
                {t("hero.cta.accident")}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            {/* trust strip — factual, from public contacts */}
            <motion.dl
              {...fade(0.4)}
              className="mt-9 grid grid-cols-3 gap-4 border-t border-sky-200/60 pt-6"
            >
              {[
                { label: t("contacts.emergencyNote"), value: PHONES.emergencyPretty, icon: Siren },
                { label: t("contacts.callCenter"), value: PHONES.callCenterPretty, icon: PhoneCall },
                { label: t("contacts.hours"), value: lang === "kk" ? ORG.workHoursKk : ORG.workHoursRu, icon: Building2 },
              ].map((row, i) => {
                const Icon = row.icon;
                return (
                  <div key={i} className="min-w-0">
                    <dt className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                      <Icon className="size-3 text-primary/60" />
                      {row.label}
                    </dt>
                    <dd className="mt-1 truncate text-[13px] font-extrabold tabular-nums text-foreground">
                      {row.value}
                    </dd>
                  </div>
                );
              })}
            </motion.dl>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <QuickCheck />
          </motion.div>
        </div>
      </section>

      {/* ============================ SERVICES ============================ */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20" id="services">
        <SectionHeading
          eyebrow={t("nav.services")}
          title={t("services.title")}
          subtitle={t("services.subtitle")}
          action={
            <Button asChild variant="ghost" className="hidden gap-1.5 sm:inline-flex">
              <Link to="/services">
                {t("services.viewAll")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* featured reading card */}
          <Reveal className="sm:col-span-2 lg:col-span-2">
            <Link
              to={SERVICES[0].to}
              className="card-hover group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-sky-950 via-primary to-sky-600 p-6 text-white sm:p-7"
            >
              <div className="pointer-events-none absolute -right-10 -top-14 size-52 rounded-full border-[26px] border-white/10" />
              <div className="pointer-events-none absolute -bottom-16 right-16 size-40 rounded-full border-[18px] border-white/5" />
              <div className="relative flex items-start justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                  <Gauge className="size-6" />
                </span>
                <DemoTag />
              </div>
              <div className="relative mt-10">
                <h3 className="text-2xl font-extrabold tracking-tight sm:text-[1.7rem]">
                  {t("services.reading.title")}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-sky-100/90">
                  {t("services.reading.desc")}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-sky-100">
                  {t("common.open")}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>

          {/* remaining four */}
          {SERVICES.slice(1).map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.to} delay={0.05 * (i + 1)}>
                <Link
                  to={s.to}
                  className="card-hover group flex h-full flex-col rounded-2xl border bg-card p-5 sm:p-6"
                >
                  <span className={cn("flex size-11 items-center justify-center rounded-xl", s.accent)}>
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold tracking-tight transition-colors group-hover:text-primary">
                    {t(s.titleKey)}
                  </h3>
                  <p className="mt-1.5 flex-1 text-[13px] leading-6 text-muted-foreground">
                    {t(s.descKey)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-primary">
                    {t("common.open")}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ====================== OUTAGES + QUICK LINKS ====================== */}
      <section className="border-y border-border/60 bg-gradient-to-b from-background to-sky-50/50">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:py-20">
          <div>
            <SectionHeading
              eyebrow={t("nav.outages")}
              title={t("outages.home.title")}
              subtitle={t("outages.home.subtitle")}
              action={
                <Button asChild variant="outline" className="border-border bg-white/70">
                  <Link to="/outages">
                    {t("outages.all")}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              }
            />
            <div className="mt-8">
              <OutageAlertBanner outages={outages ?? []} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(latestOutages.length ? latestOutages : ([] as OutageDoc[])).map((o) => (
                <OutageCard key={o._id} outage={o} compact />
              ))}
              {latestOutages.length === 0 ? (
                <div className="rounded-2xl border bg-card p-6 text-sm font-semibold text-muted-foreground sm:col-span-2 lg:col-span-3">
                  {t("outages.empty")}
                </div>
              ) : null}
            </div>
          </div>

          {/* info hubs */}
          <div className="flex flex-col gap-4">
            {[
              {
                to: "/map",
                title: t("nav.map"),
                desc: t("map.subtitle"),
                icon: MapIcon,
              },
              {
                to: "/tariffs",
                title: t("nav.tariffs"),
                desc: t("tariffs.subtitle"),
                icon: CreditCard,
              },
              {
                to: "/faq",
                title: t("nav.faq"),
                desc: t("faq.subtitle"),
                icon: FileQuestion,
              },
            ].map((hub, i) => {
              const Icon = hub.icon;
              return (
                <Reveal key={hub.to} delay={0.06 * i}>
                  <Link
                    to={hub.to}
                    className="card-hover group flex items-center gap-4 rounded-2xl border bg-card p-4"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-extrabold tracking-tight">{hub.title}</h3>
                      <p className="line-clamp-1 text-xs text-muted-foreground">{hub.desc}</p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ NEWS ============================ */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading
          eyebrow={t("nav.news")}
          title={t("news.title")}
          subtitle={t("news.subtitle")}
          action={
            <Button asChild variant="ghost" className="hidden gap-1.5 sm:inline-flex">
              <Link to="/news">
                {t("nav.news")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latestNews.length ? (
            latestNews.map((n, i) => (
              <Reveal key={n._id} delay={0.06 * i}>
                <NewsCard item={n} />
              </Reveal>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
          )}
        </div>
      </section>

      {/* ======================= EMERGENCY CTA BAND ======================= */}
      <section className="px-4 pb-16 sm:px-6 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white sm:px-12">
              <div className="pointer-events-none absolute -right-16 -top-24 size-80 rounded-full border-[30px] border-sky-400/10" />
              <div className="pointer-events-none absolute -bottom-24 left-1/4 size-72 rounded-full bg-sky-500/10 blur-3xl" />
              <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-sky-300">
                    <Waves className="size-4" />
                    {t("header.emergency24")}
                  </p>
                  <h2 className="mt-4 text-balance text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                    {t("emergency.what")}
                  </h2>
                  <ul className="mt-5 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                    {(
                      [
                        "emergency.what1",
                        "emergency.what2",
                        "emergency.what3",
                        "emergency.what4",
                      ] as const
                    ).map((k) => (
                      <li key={k} className="flex items-center gap-2">
                        <BadgeCheck className="size-4 shrink-0 text-sky-300" />
                        {t(k)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <a
                    href={telHref(PHONES.emergency)}
                    className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-white/10 px-6 py-4 ring-1 ring-white/15 transition-colors hover:bg-white/15"
                  >
                    <span className="flex size-11 items-center justify-center rounded-full bg-red-400/20 text-red-300">
                      <PhoneCall className="size-5" />
                    </span>
                    <span className="text-left">
                      <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        {t("contacts.emergency")}
                      </span>
                      <span className="block text-lg font-extrabold tabular-nums text-white">
                        {PHONES.emergencyPretty}
                      </span>
                    </span>
                  </a>
                  <Button
                    asChild
                    size="lg"
                    className="flex-1 bg-sky-500 px-6 text-white hover:bg-sky-400"
                  >
                    <Link to="/services/emergency">
                      <Siren className="size-4" />
                      {t("emergency.form.title")}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
