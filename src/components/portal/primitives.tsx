import { motion } from "framer-motion";
import { FlaskConical } from "lucide-react";
import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";

/** Small pill that marks demo / mock data clearly. */
export function DemoTag({ mock = false }: { mock?: boolean }) {
  const { t } = useI18n();
  return (
    <Badge
      variant="outline"
      className="gap-1 border-blue-200 bg-blue-50/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700"
    >
      <FlaskConical className="size-3" />
      {mock ? t("common.mockBadge") : t("common.demoBadge")}
    </Badge>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Sub-page hero: eyebrow chip + title + subtitle over soft water radial. */
export function PageHero({
  title,
  subtitle,
  eyebrow,
  children,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children?: ReactNode;
}) {
  return (
    <section className="water-radial relative overflow-hidden border-b border-border/60 bg-background">
      <div className="water-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-2xl"
        >
          {eyebrow ? (
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary/80">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              {subtitle}
            </p>
          ) : null}
          {children}
        </motion.div>
      </div>
    </section>
  );
}

/** Section heading used on home page and hubs. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary/80">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-balance text-2xl font-extrabold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 text-pretty text-sm leading-6 text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
