import {
  FilePlus2,
  Gauge,
  Home,
  LayoutGrid,
  UserRound,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  const items = [
    { to: "/", key: "mobile.home", icon: Home },
    { to: "/services", key: "mobile.services", icon: LayoutGrid },
    { to: "/services/readings", key: "mobile.readings", icon: Gauge },
    { to: "/appeal", key: "mobile.appeal", icon: FilePlus2 },
    {
      to: isAuthenticated ? "/cabinet" : "/auth?returnTo=%2Fcabinet",
      key: "mobile.cabinet",
      icon: UserRound,
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden"
      aria-label="Быстрые действия"
    >
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to;
          return (
            <Link
              key={item.key}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                  active ? "bg-primary/10" : "",
                )}
              >
                <Icon className="size-5" />
              </span>
              {t(item.key)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
