import { motion } from "framer-motion";
import { HelpCircle, LifeBuoy } from "lucide-react";
import { Link } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useI18n } from "@/lib/i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/portal/primitives";

export default function Faq() {
  const { t, lang } = useI18n();
  const faq = useQuery(api.content.listFaq);
  const items = faq ?? [];

  return (
    <div>
      <PageHero eyebrow={t("nav.faq")} title={t("faq.title")} subtitle={t("faq.subtitle")} />

      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_280px] lg:py-14">
        <div>
          {faq === undefined ? (
            <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-3">
              {items.map((f, i) => (
                <motion.div
                  key={f._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.4) }}
                >
                  <AccordionItem
                    value={f._id}
                    className="overflow-hidden rounded-2xl border bg-card px-1"
                  >
                    <AccordionTrigger className="px-4 py-4 text-left text-[15px] font-extrabold tracking-tight hover:no-underline">
                      {f.question[lang]}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-5 text-[14px] leading-7 text-muted-foreground">
                      {f.answer[lang]}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          )}
        </div>

        <div className="h-fit space-y-4 lg:sticky lg:top-28">
          <div className="rounded-2xl border bg-card p-6">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-100 text-primary">
              <HelpCircle className="size-5" />
            </span>
            <h2 className="mt-4 font-extrabold tracking-tight">{t("faq.hint")}</h2>
            <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">{t("faq.subtitle")}</p>
            <Button asChild className="mt-4 w-full">
              <Link to="/appeal">{t("services.appeal.title")}</Link>
            </Button>
          </div>
          <div className="rounded-2xl bg-slate-950 p-6 text-white">
            <LifeBuoy className="size-6 text-sky-300" />
            <h2 className="mt-3 text-sm font-extrabold tracking-tight">{t("contacts.callCenter")}</h2>
            <p className="mt-1 text-lg font-extrabold tabular-nums">+7 (705) 690-34-10</p>
            <p className="mt-2 text-xs text-slate-400">{t("contacts.hoursMonFri")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
