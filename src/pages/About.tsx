import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Crown,
  FileText,
  Gavel,
  History,
  Network,
  Quote,
} from "lucide-react";
import { Link } from "react-router";
import { useI18n } from "@/lib/i18n";
import { HISTORY, LEADERSHIP, MISSION } from "@/lib/content";
import { PHONES, telHref } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { PageHero, Reveal, SectionHeading } from "@/components/portal/primitives";
import { DemoTag } from "@/components/portal/primitives";

export default function About() {
  const { t, lang } = useI18n();

  const anchors = [
    { id: "history", key: "about.nav.history" },
    { id: "leadership", key: "about.nav.leadership" },
    { id: "structure", key: "about.nav.structure" },
    { id: "reports", key: "about.nav.reports" },
    { id: "procurement", key: "about.nav.procurement" },
  ];

  return (
    <div>
      <PageHero eyebrow={t("nav.about")} title={t("about.title")} subtitle={t("about.subtitle")} />

      {/* anchor nav */}
      <div className="sticky top-[72px] z-20 border-b bg-background/90 backdrop-blur">
        <div className="no-scrollbar mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-6">
          {anchors.map((a) => (
            <a
              key={a.id}
              href={`#${a.id}`}
              className="shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {t(a.key)}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl space-y-16 px-4 py-12 sm:px-6 lg:py-16">
        {/* mission */}
        <section className="mx-auto max-w-3xl text-center">
          <Quote className="mx-auto size-8 text-sky-300" />
          <p className="mt-4 text-pretty text-xl font-bold leading-8 tracking-tight text-foreground sm:text-2xl sm:leading-9">
            {MISSION[lang]}
          </p>
        </section>

        {/* history */}
        <section id="history" className="scroll-mt-28">
          <SectionHeading eyebrow={t("nav.about")} title={t("about.history.title")} />
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HISTORY.map((h, i) => (
              <Reveal key={h.year} delay={0.05 * i}>
                <div className="card-hover relative h-full rounded-2xl border bg-card p-5">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-primary">
                    <History className="size-5" />
                  </span>
                  <p className="mt-4 text-lg font-extrabold tracking-tight text-primary">{h.year}</p>
                  <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">{h.text[lang]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* leadership */}
        <section id="leadership" className="scroll-mt-28">
          <SectionHeading
            eyebrow={t("nav.about")}
            title={t("about.leadership.title")}
            subtitle={t("about.leadership.note")}
          />
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LEADERSHIP.map((m, i) => (
              <Reveal key={m.name} delay={0.05 * i}>
                <div className="rounded-2xl border bg-card p-5">
                  <span className="flex size-11 items-center justify-center rounded-full bg-sky-100 text-primary">
                    <Crown className="size-5" />
                  </span>
                  <p className="mt-4 text-sm font-extrabold leading-5 tracking-tight">{m.name}</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">{m.position[lang]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* structure */}
        <section id="structure" className="scroll-mt-28">
          <SectionHeading eyebrow={t("nav.about")} title={t("about.structure.title")} />
          <div className="mt-7 rounded-2xl border bg-card p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-primary">
                <Network className="size-6" />
              </span>
              <p className="text-[15px] leading-7 text-foreground/85">{t("about.structure.note")}</p>
            </div>
          </div>
        </section>

        {/* reports & procurement */}
        <section id="reports" className="scroll-mt-28 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                  <FileText className="size-5" />
                </span>
                <h2 className="text-lg font-extrabold tracking-tight">{t("about.reports.title")}</h2>
              </div>
              <p className="mt-3 text-[13px] leading-6 text-muted-foreground">{t("about.procurement.note")}</p>
              <Button asChild variant="outline" className="mt-5">
                <Link to="/documents">
                  {t("documents.title")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border bg-card p-6">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                    <Gavel className="size-5" />
                  </span>
                  <h2 className="text-lg font-extrabold tracking-tight">{t("about.procurement.title")}</h2>
                </div>
                <DemoTag />
              </div>
              <p className="mt-3 text-[13px] leading-6 text-muted-foreground">{t("about.procurement.note")}</p>
              <Button asChild variant="outline" className="mt-5">
                <Link to="/contacts">
                  <Building2 className="size-4" />
                  {t("contacts.title")}
                </Link>
              </Button>
            </div>
          </Reveal>
        </section>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-slate-950 px-6 py-8 text-white sm:px-10"
        >
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">{t("about.more")}</h2>
              <p className="mt-1.5 text-sm text-slate-400">
                {t("contacts.callCenter")}: {PHONES.callCenterPretty}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="lg" className="bg-sky-500 hover:bg-sky-400">
                <Link to="/tariffs">{t("nav.tariffs")}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <a href={telHref(PHONES.callCenter)}>{t("header.call")}</a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
