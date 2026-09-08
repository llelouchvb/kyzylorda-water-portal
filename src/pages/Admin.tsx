import { useMutation } from "convex/react";
import {
  ArrowLeft,
  BellRing,
  Building2,
  ClipboardList,
  Droplets,
  FileQuestion,
  Gauge,
  Home,
  LayoutDashboard,
  LogOut,
  Newspaper,
  ShieldAlert,
  ShieldCheck,
  Tags,
  Users,
} from "lucide-react";
import { useEffect, useMemo, type ComponentType } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LangSwitch } from "@/components/portal/LangSwitch";
import { LoadingRow } from "@/components/admin/shared";
import {
  AppealsManager,
  FaqManager,
  NewsManager,
  OutagesManager,
  TariffsManager,
  UsersManager,
} from "@/components/admin/managers";

type SectionId = "overview" | "news" | "outages" | "appeals" | "tariffs" | "faq" | "users";

const SECTIONS: {
  id: SectionId;
  key: "admin.nav.overview" | "admin.nav.news" | "admin.nav.outages" | "admin.nav.appeals" | "admin.nav.tariffs" | "admin.nav.faq" | "admin.nav.users";
  icon: ComponentType<{ className?: string }>;
  roles: string[];
}[] = [
  { id: "overview", key: "admin.nav.overview", icon: LayoutDashboard, roles: ["admin", "operator", "dispatcher", "editor", "manager"] },
  { id: "news", key: "admin.nav.news", icon: Newspaper, roles: ["admin", "editor", "manager"] },
  { id: "outages", key: "admin.nav.outages", icon: Gauge, roles: ["admin", "dispatcher", "manager"] },
  { id: "appeals", key: "admin.nav.appeals", icon: ClipboardList, roles: ["admin", "operator", "dispatcher", "manager"] },
  { id: "tariffs", key: "admin.nav.tariffs", icon: Tags, roles: ["admin", "manager"] },
  { id: "faq", key: "admin.nav.faq", icon: FileQuestion, roles: ["admin", "editor"] },
  { id: "users", key: "admin.nav.users", icon: Users, roles: ["admin"] },
];

function Overview({ role }: { role: string }) {
  const { t } = useI18n();
  const stats = useQuery(api.admin.overview);
  const auditQuery = useQuery(api.admin.auditLog);
  const audit = auditQuery ?? [];

  const cards = [
    { key: "admin.overview.totalNews", value: stats?.news, icon: Newspaper },
    { key: "admin.overview.activeOutages", value: stats?.activeOutages, icon: Gauge },
    { key: "admin.overview.newAppeals", value: stats?.newAppeals, icon: BellRing },
    { key: "admin.overview.tariffsCount", value: stats?.tariffs, icon: Tags },
    { key: "admin.overview.faqCount", value: stats?.faq, icon: FileQuestion },
    { key: "admin.overview.usersCount", value: stats?.users, icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight">{t("admin.overview.welcome")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("admin.overview.welcomeDesc")}</p>
      </div>

      {stats === undefined ? (
        <LoadingRow />
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Card key={c.key} className="border-border/70 shadow-none">
                <CardContent className="flex items-center gap-3 p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                      {t(c.key)}
                    </p>
                    <p className="text-xl font-extrabold tabular-nums">{c.value ?? "—"}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {SECTIONS.filter((s) => s.roles.includes(role)).map((s) => (
          <Link
            key={s.id}
            to={s.id === "overview" ? "/admin" : `/admin/${s.id}`}
            className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3.5 py-1.5 text-xs font-bold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <s.icon className="size-3.5" />
            {t(s.key)}
          </Link>
        ))}
      </div>

      {role === "admin" ? (
        <div className="rounded-2xl border bg-card">
          <div className="border-b px-5 py-3.5">
            <h3 className="flex items-center gap-2 text-sm font-extrabold tracking-tight">
              <ShieldCheck className="size-4 text-primary" />
              {t("admin.audit")}
            </h3>
          </div>
          {auditQuery === undefined ? (
            <p className="px-5 py-6 text-sm text-muted-foreground">{t("common.loading")}</p>
          ) : audit.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted-foreground">{t("admin.audit.empty")}</p>
          ) : (
            <ul className="divide-y">
              {audit.slice(0, 8).map((l) => (
                <li key={String(l._id)} className="flex items-center justify-between gap-3 px-5 py-2.5 text-xs">
                  <span>
                    <b className="uppercase text-primary">{l.action}</b> → {l.resource}
                    {l.details ? <span className="text-muted-foreground"> · {l.details}</span> : null}
                  </span>
                  <span className="shrink-0 text-muted-foreground">
                    {new Date(l.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {l.actorRole}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default function Admin() {
  const { t } = useI18n();
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const ensureRole = useMutation(api.users.ensureRole);
  const ensureSeeded = useMutation(api.seed.ensureSeeded);
  const requested = (params.section ?? "overview") as SectionId;

  const role = user?.role ?? "user";
  const roleLabel = `admin.roles.${role}`;

  const allowed = useMemo(
    () => SECTIONS.filter((s) => s.roles.includes(role)),
    [role],
  );
  const sectionActive = allowed.some((s) => s.id === requested)
    ? requested
    : "overview";

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [sectionActive]);

  useEffect(() => {
    void ensureRole();
    void ensureSeeded();
  }, [ensureRole, ensureSeeded]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-muted/30">
        <LoadingRow />
      </div>
    );
  }

  const isStaff = role !== "user";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-dvh flex-col bg-muted/30">
      {/* top bar */}
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-sky-300">
              <Droplets className="size-4" />
            </span>
            <div className="hidden leading-none sm:block">
              <p className="text-[13px] font-extrabold tracking-tight">{t("admin.title")}</p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {t(roleLabel as never)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <Link to="/">
                <Home className="size-4" />
                {t("nav.home")}
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <Link to="/cabinet">
                <Building2 className="size-4" />
                {t("cabinet.title")}
              </Link>
            </Button>
            <LangSwitch />
            <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label={t("cabinet.signOut")}>
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-0 sm:px-4 lg:px-6">
        {/* sidebar */}
        <aside className="hidden w-60 shrink-0 pt-8 lg:block">
          <nav className="sticky top-20 space-y-1">
            {allowed.map((s) => {
              const Icon = s.icon;
              const to = s.id === "overview" ? "/admin" : `/admin/${s.id}`;
              const active = location.pathname === to;
              return (
                <Link
                  key={s.id}
                  to={to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors",
                    active
                      ? "bg-slate-950 text-white"
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

        <main className="min-w-0 flex-1 px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
          {/* mobile section tabs */}
          <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 lg:hidden">
            {allowed.map((s) => {
              const to = s.id === "overview" ? "/admin" : `/admin/${s.id}`;
              const active = location.pathname === to;
              return (
                <Link
                  key={s.id}
                  to={to}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors",
                    active
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-border bg-card text-muted-foreground",
                  )}
                >
                  {t(s.key)}
                </Link>
              );
            })}
          </div>

          {!isStaff ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border bg-card p-10 text-center">
              <ShieldAlert className="size-12 text-amber-500" />
              <h1 className="mt-4 text-xl font-extrabold tracking-tight">{t("admin.denied.title")}</h1>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                {t("admin.denied.desc")}
              </p>
              <Button asChild className="mt-6">
                <Link to="/cabinet">
                  <ArrowLeft className="size-4" />
                  {t("cabinet.title")}
                </Link>
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight">{t("admin.title")}</h1>
                  <p className="text-sm text-muted-foreground">{t("admin.subtitle")}</p>
                </div>
              </div>
              {sectionActive === "overview" ? (
                <Overview role={role} />
              ) : (
                <div>
                  {sectionActive === "news" ? <NewsManager /> : null}
                  {sectionActive === "outages" ? <OutagesManager /> : null}
                  {sectionActive === "appeals" ? <AppealsManager /> : null}
                  {sectionActive === "tariffs" ? <TariffsManager /> : null}
                  {sectionActive === "faq" ? <FaqManager /> : null}
                  {sectionActive === "users" ? <UsersManager /> : null}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
