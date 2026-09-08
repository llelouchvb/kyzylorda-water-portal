import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LangSwitch({ dark = false }: { dark?: boolean }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full p-0.5 text-xs font-bold",
        dark ? "bg-white/10 ring-1 ring-white/20" : "bg-muted ring-1 ring-border",
      )}
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLang("kk")}
        className={cn(
          "cursor-pointer rounded-full px-2.5 py-1 tracking-wide transition-colors",
          lang === "kk"
            ? dark
              ? "bg-white text-slate-900"
              : "bg-white text-primary shadow-sm ring-1 ring-border"
            : dark
              ? "text-white/70 hover:text-white"
              : "text-muted-foreground hover:text-foreground",
        )}
      >
        {t("lang.kk")}
      </button>
      <button
        type="button"
        onClick={() => setLang("ru")}
        className={cn(
          "cursor-pointer rounded-full px-2.5 py-1 tracking-wide transition-colors",
          lang === "ru"
            ? dark
              ? "bg-white text-slate-900"
              : "bg-white text-primary shadow-sm ring-1 ring-border"
            : dark
              ? "text-white/70 hover:text-white"
              : "text-muted-foreground hover:text-foreground",
        )}
      >
        {t("lang.ru")}
      </button>
    </div>
  );
}
