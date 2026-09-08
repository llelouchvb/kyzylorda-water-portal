import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Newspaper } from "lucide-react";
import { Link, useParams } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useI18n } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCategoryLabel } from "@/components/portal/meta";
import { categoryDotOf } from "@/components/portal/meta";

export default function NewsDetail() {
  const { t, lang, dateLong } = useI18n();
  const params = useParams();
  const id = params.id as Id<"news"> | undefined;
  const item = useQuery(
    api.content.getNews,
    id ? { id } : "skip",
  );
  const cat = useCategoryLabel(item?.category ?? "news");

  if (item === undefined) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-3 text-sm text-muted-foreground">
        <span className="size-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        {t("common.loading")}
      </div>
    );
  }

  if (item === null) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
        <Newspaper className="size-10 text-primary/40" />
        <h1 className="mt-4 text-xl font-extrabold">{t("news.notFound")}</h1>
        <Button asChild variant="outline" className="mt-5">
          <Link to="/news">
            <ArrowLeft className="size-4" />
            {t("news.back")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
      <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1.5 text-muted-foreground">
        <Link to="/news">
          <ArrowLeft className="size-4" />
          {t("news.back")}
        </Link>
      </Button>

      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mt-5"
      >
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="gap-2 rounded-full border-border bg-card px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
          >
            <span className={`size-2 rounded-full ${categoryDotOf(item.category)}`} />
            {cat}
          </Badge>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {dateLong(item.date)}
          </span>
        </div>

        <h1 className="mt-4 text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {item.title[lang]}
        </h1>
        <p className="mt-4 text-pretty text-lg font-medium leading-7 text-muted-foreground">
          {item.excerpt[lang]}
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl">
          <div className="water-radial relative flex h-40 items-end bg-gradient-to-br from-sky-100 via-blue-50 to-white p-6 sm:h-52">
            <div className="absolute -right-10 -top-12 size-44 rounded-full border-[22px] border-sky-200/50" />
            <div className="absolute -bottom-12 left-1/3 size-36 rounded-full border-[16px] border-blue-100/80" />
            <span className="relative text-6xl text-primary/15">
              <Newspaper className="size-10" />
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {item.body[lang].split("\n").map((p, i) => (
            <p key={i} className="text-[15px] leading-7 text-foreground/90">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 rounded-2xl border bg-card p-5 sm:flex-row sm:items-center">
          <p className="text-sm font-semibold text-muted-foreground">
            {t("faq.hint")}{" "}
            <Link to="/appeal" className="font-bold text-primary hover:underline">
              {t("faq.hintLink")}
            </Link>
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/faq">{t("nav.faq")}</Link>
          </Button>
        </div>
      </motion.article>
    </div>
  );
}
