import { motion } from "framer-motion";
import {
  Droplets,
  Home,
  Info,
  LayoutGrid,
  LifeBuoy,
  Menu,
  Newspaper,
  PhoneCall,
  Siren,
  UserRound,
  Users,
  X,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { PHONES, telHref } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LangSwitch } from "@/components/portal/LangSwitch";

const NAV_ITEMS = [
  { to: "/", key: "nav.home", icon: Home },
  { to: "/about", key: "nav.about", icon: Info },
  { to: "/consumers", key: "nav.consumers", icon: Users },
  { to: "/services", key: "nav.services", icon: LayoutGrid },
  { to: "/news", key: "nav.news", icon: Newspaper },
  { to: "/documents", key: "nav.documents", icon: FileText },
  { to: "/contacts", key: "nav.contacts", icon: LifeBuoy },
];

export function BrandLockup({ onClick }: { onClick?: () => void }) {
  const { t } = useI18n();
  return (
    <Link
      to="/"
      onClick={onClick}
      className="flex shrink-0 items-center gap-2.5"
      aria-label="Қызылорда Су Жүйесі — на главную"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Droplets className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[13px] font-extrabold tracking-tight text-foreground sm:text-sm">
          ҚЫЗЫЛОРДА СУ ЖҮЙЕСІ
        </span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/70">
          {t("brand.subname")}
        </span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const { t } = useI18n();
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const cabinetHref = isAuthenticated ? "/cabinet" : "/auth?returnTo=%2Fcabinet";

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      {/* slim emergency strip */}
      <div className="hidden border-b border-border/60 bg-slate-950 text-white md:block">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-1.5 text-[11px] font-semibold">
          <span className="flex items-center gap-2 text-slate-200">
            <Siren className="size-3.5 text-sky-300" />
            {t("header.emergency24")}:
            <a
              href={telHref(PHONES.emergency)}
              className="text-sky-200 underline-offset-2 hover:underline"
            >
              {PHONES.emergencyPretty}
            </a>
          </span>
          <a
            href={telHref(PHONES.callCenter)}
            className="flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
          >
            <PhoneCall className="size-3.5" />
            {t("contacts.callCenter")}: {PHONES.callCenterPretty}
          </a>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <BrandLockup />

        {/* desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Основная навигация">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-[13px] font-bold transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                )}
              >
                {t(item.key)}
                {active ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-[3px] h-0.5 rounded-full bg-primary"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LangSwitch />
          <Button asChild className="hidden sm:inline-flex" size="sm">
            <Link to={cabinetHref}>
              <UserRound className="size-4" />
              {isLoading ? t("common.loading") : t("nav.cabinet")}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Меню"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* mobile menu */}
      {menuOpen ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-border/70 bg-background lg:hidden"
        >
          <nav className="mx-auto grid w-full max-w-7xl gap-1 px-4 py-4" aria-label="Мобильная навигация">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-colors",
                    location.pathname === item.to
                      ? "bg-accent text-primary"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="size-4 text-primary/80" />
                  {t(item.key)}
                </Link>
              );
            })}
            <Button asChild className="mt-2 w-full sm:hidden">
              <Link to={cabinetHref}>
                <UserRound className="size-4" />
                {t("nav.cabinet")}
              </Link>
            </Button>
          </nav>
        </motion.div>
      ) : null}
    </header>
  );
}
