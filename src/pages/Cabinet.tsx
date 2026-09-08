import { useConvexAuth, useMutation } from "convex/react";
import {
  Droplets,
  FileText,
  Gauge,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Receipt,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useEffect, type ComponentType } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LangSwitch } from "@/components/portal/LangSwitch";
import { DemoNotice } from "@/components/cabinet/sections";
import {
  AccrualsSection,
  CabinetAppealsSection,
  CabinetDocumentsSection,
  OverviewSection,
  PaymentsSection,
  ProfileSection,
  ReadingsSection,
} from "@/components/cabinet/sections";

const SECTIONS: {
  id: string;
  key: "cabinet.nav.main" | "cabinet.nav.accruals" | "cabinet.nav.payments" | "cabinet.nav.readings" | "cabinet.nav.appeals" | "cabinet.nav.documents" | "cabinet.nav.profile";
  icon: ComponentType<{ className?: string }>;
}[] = [
  { id: "", key: "cabinet.nav.main", icon: LayoutDashboard },
  { id: "accruals", key: "cabinet.nav.accruals", icon: Receipt },
  { id: "payments", key: "cabinet.nav.payments", icon: Wallet },
  { id: "readings", key: "cabinet.nav.readings", icon: Gauge },
  { id: "appeals", key: "cabinet.nav.appeals", icon: MessageSquareText },
  { id: "documents", key: "cabinet.nav.documents", icon: FileText },
  { id: "profile", key: "cabinet.nav.profile", icon: ShieldCheck },
];

function SectionSwitch({ section }: { section: string }) {
  switch (section) {
    case "accruals":
      return <AccrualsSection />;
    case "payments":
      return <PaymentsSection />;
    case "readings":
      return <ReadingsSection />;
    case "appeals":
      return <CabinetAppealsSection />;
    case "documents":
      return <CabinetDocumentsSection />;
    case "profile":
      return <ProfileSection />;
    default:
      return <OverviewSection />;
  }
}

export default function Cabinet() {
  const { t } = useI18n();
  const { signOut, user } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const ensureRole = useMutation(api.users.ensureRole);
  const ensureSeeded = useMutation(api.seed.ensureSeeded);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const section = params.section ?? "";

  useEffect(() => {
    if (isAuthenticated) {
      void ensureRole();
    }
    void ensureSeeded();
  }, [isAuthenticated, ensureRole, ensureSeeded]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [section]);

  const isStaff =
    user?.role !== undefined && ["admin", "operator", "dispatcher", "editor", "manager"].includes(user.role);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-dvh flex-col bg-muted/30">
      {/* top bar */}
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5" aria-label="На главную">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Droplets className="size-4" />
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-[13px] font-extrabold tracking-tight">{t("brand.short")}</span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary/70">
                {t("cabinet.title")}
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <LangSwitch />
            {isStaff ? (
              <Button asChild variant="outline" size="sm" className="gap-1.5 border-border bg-card">
                <Link to="/admin">
                  <ShieldCheck className="size-4" />
                  {t("cabinet.toAdmin")}
                </Link>
              </Button>
            ) : null}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-muted-foreground"
              aria-label={t("cabinet.signOut")}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-0 px-0 sm:px-4 lg:gap-8 lg:px-6">
        {/* sidebar */}
        <aside className="hidden w-60 shrink-0 pt-8 lg:block">
          <nav className="sticky top-20 space-y-1" aria-label="Разделы кабинета">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const to = `/cabinet${s.id ? `/${s.id}` : ""}`;
              const active = location.pathname === to;
              return (
                <Link
                  key={s.id || "main"}
                  to={to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-card hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {t(s.key)}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* content */}
        <main className="min-w-0 flex-1 px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
          {/* mobile section tabs */}
          <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 lg:hidden">
            {SECTIONS.map((s) => {
              const to = `/cabinet${s.id ? `/${s.id}` : ""}`;
              const active = location.pathname === to;
              return (
                <Link
                  key={s.id || "main"}
                  to={to}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground",
                  )}
                >
                  {t(s.key)}
                </Link>
              );
            })}
          </div>

          <h1 className="text-balance text-2xl font-extrabold tracking-tight sm:text-3xl">
            {section === "" ? `${t("cabinet.greeting")}` : t(SECTIONS.find((s) => s.id === section)?.key ?? "cabinet.nav.main")}
          </h1>
          {section === "" ? (
            <p className="mt-1 text-sm text-muted-foreground">{t("cabinet.quickActions")}</p>
          ) : null}

          <div className="mt-6">
            <SectionSwitch section={section} />
          </div>
          <div className="mt-6">
            <DemoNotice />
          </div>
        </main>
      </div>
    </div>
  );
}
