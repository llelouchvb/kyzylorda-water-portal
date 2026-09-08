import { motion } from "framer-motion";
import {
  Building2,
  Clock,
  ExternalLink,
  MapPin,
  Navigation,
  PhoneCall,
  Siren,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ORG, PHONES, telHref } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { PageHero, Reveal } from "@/components/portal/primitives";

export default function Contacts() {
  const { t, lang } = useI18n();
  const address = lang === "kk" ? ORG.addressKk : ORG.addressRu;
  const mapsUrl = `https://yandex.ru/maps/?text=${encodeURIComponent("Кызылорда, Желтоксан 156")}`;

  return (
    <div>
      <PageHero eyebrow={t("nav.contacts")} title={t("contacts.title")} subtitle={t("contacts.subtitle")} />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        {/* office card */}
        <Reveal>
          <div className="grid overflow-hidden rounded-3xl border bg-card lg:grid-cols-[1fr_1.2fr]">
            <div className="water-radial relative bg-slate-950 p-7 text-white">
              <div className="relative">
                <Building2 className="size-8 text-sky-300" />
                <h2 className="mt-4 text-xl font-extrabold tracking-tight">{t("contacts.office")}</h2>
                <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-slate-300">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-sky-300" />
                  {address}
                </p>
                <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
                  <p className="flex items-center gap-2 text-slate-300">
                    <Clock className="size-4 text-sky-300" />
                    {t("contacts.hoursMonFri")}
                  </p>
                  <p className="pl-6 text-xs text-slate-400">{t("contacts.hoursSat")}</p>
                  <p className="flex items-center gap-2 pt-1 text-slate-300">
                    <PhoneCall className="size-4 text-sky-300" />
                    {t("contacts.dispatcher")}: {PHONES.dispatcherPretty}
                  </p>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 transition-colors hover:bg-white/20"
                >
                  <Navigation className="size-4" />
                  {t("contacts.getDirections")}
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>

            {/* phones */}
            <div className="grid gap-px bg-border/70 sm:grid-cols-2">
              <a
                href={telHref(PHONES.callCenter)}
                className="flex flex-col justify-between gap-6 bg-card p-7 transition-colors hover:bg-muted/40"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-blue-100 text-primary">
                  <PhoneCall className="size-6" />
                </span>
                <span>
                  <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                    {t("contacts.callCenter")}
                  </span>
                  <span className="mt-1 block text-2xl font-extrabold tabular-nums tracking-tight">
                    {PHONES.callCenterPretty}
                  </span>
                </span>
              </a>
              <a
                href={telHref(PHONES.individuals)}
                className="flex flex-col justify-between gap-6 bg-card p-7 transition-colors hover:bg-muted/40"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                  <Building2 className="size-6" />
                </span>
                <span>
                  <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                    {t("contacts.individuals")}
                  </span>
                  <span className="mt-1 block text-2xl font-extrabold tabular-nums tracking-tight">
                    {PHONES.individualsPretty}
                  </span>
                </span>
              </a>
              <a
                href={telHref(PHONES.dispatcher)}
                className="flex flex-col justify-between gap-6 bg-card p-7 transition-colors hover:bg-muted/40 sm:col-span-2"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <Clock className="size-6" />
                </span>
                <span className="flex flex-wrap items-end justify-between gap-3">
                  <span>
                    <span className="block text-xs font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                      {t("contacts.dispatcher")} · {t("contacts.dispatcherNote")}
                    </span>
                    <span className="mt-1 block text-2xl font-extrabold tabular-nums tracking-tight">
                      {PHONES.dispatcherPretty}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">{t("services.hours")}</span>
                </span>
              </a>
            </div>
          </div>
        </Reveal>

        {/* emergency wide band */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-r from-red-700 via-rose-700 to-red-800 p-7 text-white sm:p-9"
        >
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                <Siren className="size-7" />
              </span>
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-red-100">
                  {t("contacts.emergency")}
                </p>
                <p className="mt-1 text-3xl font-extrabold tabular-nums tracking-tight sm:text-4xl">
                  {PHONES.emergencyPretty}
                </p>
                <p className="mt-1 text-[13px] text-red-100/90">{t("contacts.emergencyNote")}</p>
              </div>
            </div>
            <Button asChild size="lg" className="gap-2 bg-white text-red-700 hover:bg-red-50">
              <a href={telHref(PHONES.emergency)}>
                <PhoneCall className="size-4" />
                {t("header.call")}
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
