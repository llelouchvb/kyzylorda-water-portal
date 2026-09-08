import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgePercent,
  Droplets,
  FlaskConical,
  Network,
  ScrollText,
  Waves,
} from "lucide-react";
import { Link } from "react-router";
import { useI18n } from "@/lib/i18n";
import { SYSTEM_INFO } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { PageHero, Reveal, SectionHeading } from "@/components/portal/primitives";
import type { ComponentType } from "react";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  droplets: Droplets,
  waves: Waves,
  flask: FlaskConical,
};

export default function Consumers() {
  const { t, lang } = useI18n();

  const need = [
    { to: "/services/readings", title: t("services.reading.title"), icon: Network },
    { to: "/services/balance", title: t("services.balance.title"), icon: BadgePercent },
    { to: "/services/payment", title: t("services.pay.title"), icon: ScrollText },
    { to: "/outages", title: t("nav.outages"), icon: Waves },
    { to: "/faq", title: t("nav.faq"), icon: FlaskConical },
    { to: "/appeal", title: t("services.appeal.title"), icon: ArrowRight },
  ];

  const info = [
    { to: "/tariffs", title: t("nav.tariffs"), note: t("tariffs.subtitle") },
    { to: "/map", title: t("consumers.schemeWater"), note: t("about.water.desc") },
    { to: "/documents", title: t("consumers.normative"), note: t("consumers.contracts") },
    { to: "/documents", title: t("consumers.invest"), note: t("about.reports.title") },
  ];

  return (
    <div>
      <PageHero eyebrow={t("nav.consumers")} title={t("consumers.title")} subtitle={t("consumers.subtitle")} />

      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <SectionHeading eyebrow={t("consumers.needTitle")} title={t("services.title")} />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {need.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={0.04 * i}>
                <Link
                  to={s.to}
                  className="card-hover flex items-center gap-3 rounded-2xl border bg-card p-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="flex-1 text-sm font-extrabold tracking-tight">{s.title}</span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          {/* info links */}
          <div>
            <SectionHeading eyebrow={t("consumers.infoTitle")} title={t("documents.subtitle")} />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {info.map((c, i) => (
                <Reveal key={c.title} delay={0.05 * i}>
                  <Link
                    to={c.to}
                    className="card-hover flex h-full flex-col rounded-2xl border bg-card p-5"
                  >
                    <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-primary">
                      <ScrollText className="size-4" />
                    </span>
                    <span className="mt-3 text-sm font-extrabold tracking-tight">{c.title}</span>
                    <span className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {c.note}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-4">
              <Button asChild variant="outline" className="w-full border-border">
                <Link to="/documents">
                  {t("documents.title")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </Reveal>
          </div>

          {/* systems */}
          <div>
            <SectionHeading eyebrow={t("consumers.systemTitle")} title={t("about.nav.mission")} />
            <div className="mt-6 space-y-3">
              {SYSTEM_INFO.map((s, i) => {
                const Icon = ICONS[s.iconKey] ?? Droplets;
                return (
                  <Reveal key={s.title[lang]} delay={0.05 * i}>
                    <motion.div className="rounded-2xl border bg-card p-5" whileHover={{ y: -2 }}>
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-sky-100 text-primary">
                          <Icon className="size-5" />
                        </span>
                        <h3 className="font-extrabold tracking-tight">{s.title[lang]}</h3>
                      </div>
                      <p className="mt-3 text-[13px] leading-6 text-muted-foreground">{s.desc[lang]}</p>
                    </motion.div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
