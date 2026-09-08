import { format } from "date-fns";
import { kk as kkLocale, ru as ruLocale } from "date-fns/locale";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { kk } from "@/locales/kk";
import { ru, type RuDict } from "@/locales/ru";

export type Lang = "ru" | "kk";
type Dict = { [K in keyof RuDict]: string };

const dictionaries: Record<Lang, Dict> = { ru, kk };

const STORAGE_KEY = "ksj.lang";

const locales = { ru: ruLocale, kk: kkLocale } as const;

function detectInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "ru" || stored === "kk") return stored;
  } catch {
    /* ignore */
  }
  if (typeof navigator !== "undefined") {
    const nav = navigator.language.toLowerCase();
    if (nav.startsWith("kk") || nav.startsWith("kz")) return "kk";
  }
  return "ru";
}

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  dict: Dict;
  /** Translate a dictionary key, optionally substituting {var} tokens. */
  t: (key: keyof RuDict | (string & {}), vars?: Record<string, string | number>) => string;
  /** Format money with the tenge symbol. */
  money: (amount: number) => string;
  /** Format a plain number with thousand separators. */
  num: (value: number) => string;
  dateShort: (date: Date | number | string) => string;
  dateLong: (date: Date | number | string) => string;
  dateTime: (date: Date | number | string) => string;
  /** Short month label used in charts, e.g. "сен" / "сент". */
  monthShort: (date: Date | number | string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitialLang);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = lang === "kk" ? "kk" : "ru";
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);

  const value = useMemo<I18nValue>(() => {
    const dict = dictionaries[lang];
    const dateLocale = locales[lang];
    return {
      lang,
      setLang,
      toggleLang: () => setLangState((prev) => (prev === "ru" ? "kk" : "ru")),
      dict,
      t: (key, vars) => {
        const template = dict[key as keyof RuDict] ?? String(key);
        if (!vars) return template;
        return template.replace(/\{(\w+)\}/g, (_, name: string) =>
          vars[name] !== undefined ? String(vars[name]) : `{${name}}`,
        );
      },
      money: (amount) =>
        `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(amount)} ₸`,
      num: (value) => new Intl.NumberFormat("ru-RU").format(value),
      dateShort: (date) => format(new Date(date), "d MMM yyyy", { locale: dateLocale }),
      dateLong: (date) => format(new Date(date), "d MMMM yyyy", { locale: dateLocale }),
      dateTime: (date) => format(new Date(date), "d MMM yyyy, HH:mm", { locale: dateLocale }),
      monthShort: (date) => format(new Date(date), "LLL", { locale: dateLocale }),
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside <I18nProvider>");
  }
  return ctx;
}
