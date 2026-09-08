import { ArrowRight, FileCheck2, Gauge, Layers, PhoneCall, Search, Stamp, Siren, Wallet } from "lucide-react";
import { Link } from "react-router";
import { useI18n } from "@/lib/i18n";
import { PHONES, telHref } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { PageHero, Reveal, SectionHeading } from "@/components/portal/primitives";

export default function ServicesHub() {
  const { t } = useI18n();

  const online = [
    {
      to: "/services/readings",
      title: t("services.reading.title"),
      desc: t("services.reading.desc"),
      icon: Gauge,
      accent: "bg-sky-100 text-sky-700",
    },
    {
      to: "/services/balance",
      title: t("services.balance.title"),
      desc: t("services.balance.desc"),
      icon: Search,
      accent: "bg-blue-100 text-blue-700",
    },
    {
      to: "/services/payment",
      title: t("services.pay.title"),
      desc: t("services.pay.desc"),
      icon: Wallet,
      accent: "bg-teal-100 text-teal-700",
    },
    {
      to: "/services/emergency",
      title: t("services.accident.title"),
      desc: t("services.accident.desc"),
      icon: Siren,
      accent: "bg-rose-100 text-rose-700",
    },
    {
      to: "/appeal",
      title: t("services.appeal.title"),
      desc: t("services.appeal.desc"),
      icon: Layers,
      accent: "bg-violet-100 text-violet-700",
    },
  ];

  const offline = [
    {
      title: t("services.contract.title"),
      desc: t("services.contract.desc"),
      icon: FileCheck2,
    },
    {
      title: t("services.sealing.title"),
      desc: t("services.sealing.desc"),
      icon: Stamp,
    },
    {
      title: t("services.inspect.title"),
      desc: t("services.inspect.desc"),
      icon: Gauge,
    },
    {
      title: t("services.cert.title"),
      desc: t("services.cert.desc"),
      icon: FileCheck2,
    },
  ];

  return (
    <div>
      <PageHero eyebrow={t("nav.services")} title={t("nav.services")} subtitle={t("services.subtitle")} />

      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <SectionHeading title={t("services.title")} />
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {online.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.to} delay={0.05 * i}>
                <Link
                  to={s.to}
                  className="card-hover group flex h-full flex-col rounded-2xl border bg-card p-6"
                >
                  <span className={`flex size-12 items-center justify-center rounded-2xl ${s.accent}`}>
                    <Icon className="size-6" />
                  </span>
                  <h2 className="mt-5 text-lg font-extrabold tracking-tight">{s.title}</h2>
                  <p className="mt-1.5 flex-1 text-[13px] leading-6 text-muted-foreground">{s.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-bold text-primary">
                    {t("common.open")}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}

          {/* offline booking tile */}
          <Reveal delay={0.3}>
            <div className="flex h-full flex-col justify-between rounded-2xl border border-dashed bg-gradient-to-b from-sky-50 to-white p-6">
              <div>
                <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                  <PhoneCall className="size-4" />
                  {t("services.viaPhone")}
                </p>
                <p className="mt-3 text-lg font-extrabold tracking-tight">{PHONES.callCenterPretty}</p>
                <p className="mt-1 text-[13px] text-muted-foreground">{t("services.hours")}</p>
              </div>
              <a
                href={telHref(PHONES.callCenter)}
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
              >
                {t("header.call")}
                <ArrowRight className="size-4" />
              </a>
            </div>
          </Reveal>
        </div>

        {/* offline services */}
        <div className="mt-14">
          <SectionHeading title={t("services.other")} subtitle={t("services.hours")} />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {offline.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.title} delay={0.05 * i}>
                  <div className="h-full rounded-2xl border bg-card p-5">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-primary">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 text-sm font-extrabold tracking-tight">{s.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-5 text-muted-foreground">{s.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal className="mt-6">
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border bg-card p-5 sm:flex-row sm:items-center">
              <p className="text-sm font-semibold text-muted-foreground">{t("readings.schemaDesc")}</p>
              <Button asChild variant="outline">
                <Link to="/services/readings">
                  <Gauge className="size-4" />
                  {t("services.reading.title")}
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
