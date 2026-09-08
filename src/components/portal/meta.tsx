import { useI18n } from "@/lib/i18n";

export const OUTAGE_STATUSES = ["planned", "active", "restored"] as const;
export type OutageStatus = (typeof OUTAGE_STATUSES)[number];

export const APPEAL_STATUSES = ["new", "in_progress", "done"] as const;
export type AppealStatus = (typeof APPEAL_STATUSES)[number];

export const NEWS_CATEGORIES = [
  "news",
  "announcement",
  "outage",
  "repair",
  "tariffs",
] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

const outageLabelKey: Record<OutageStatus, "outages.status.planned" | "outages.status.active" | "outages.status.restored"> =
  {
    planned: "outages.status.planned",
    active: "outages.status.active",
    restored: "outages.status.restored",
  };

const outageStyle: Record<OutageStatus, string> = {
  planned: "bg-amber-50 text-amber-700 ring-amber-600/20",
  active: "bg-red-50 text-red-700 ring-red-600/20",
  restored: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

const appealLabelKey: Record<AppealStatus, "appeal.status.new" | "appeal.status.in_progress" | "appeal.status.done"> =
  {
    new: "appeal.status.new",
    in_progress: "appeal.status.in_progress",
    done: "appeal.status.done",
  };

const appealStyle: Record<AppealStatus, string> = {
  new: "bg-blue-50 text-blue-700 ring-blue-600/20",
  in_progress: "bg-amber-50 text-amber-700 ring-amber-600/20",
  done: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

const categoryLabelKey: Record<
  NewsCategory,
  "news.filters.news" | "news.filters.announcement" | "news.filters.outage" | "news.filters.repair" | "news.filters.tariffs"
> = {
  news: "news.filters.news",
  announcement: "news.filters.announcement",
  outage: "news.filters.outage",
  repair: "news.filters.repair",
  tariffs: "news.filters.tariffs",
};

const categoryDot: Record<NewsCategory, string> = {
  news: "bg-blue-500",
  announcement: "bg-violet-500",
  outage: "bg-red-500",
  repair: "bg-amber-500",
  tariffs: "bg-teal-500",
};

export function useOutageLabel(status: OutageStatus): string {
  const { t } = useI18n();
  return t(outageLabelKey[status]);
}
export function outageStyleOf(status: OutageStatus): string {
  return outageStyle[status];
}

export function useAppealLabel(status: AppealStatus): string {
  const { t } = useI18n();
  return t(appealLabelKey[status]);
}
export function appealStyleOf(status: AppealStatus): string {
  return appealStyle[status];
}

export function useCategoryLabel(category: NewsCategory): string {
  const { t } = useI18n();
  return t(categoryLabelKey[category]);
}
export function categoryDotOf(category: NewsCategory): string {
  return categoryDot[category];
}
