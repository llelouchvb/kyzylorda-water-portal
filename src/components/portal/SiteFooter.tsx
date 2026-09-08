import { Clock, Droplets, MapPin, PhoneCall, Siren } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { ORG, PHONES, telHref } from "@/lib/site";
import { LangSwitch } from "@/components/portal/LangSwitch";

export function SiteFooter() {
  const { t, lang } = useI18n();
  const { isAuthenticated } = useAuth();
  const address = lang === "kk" ? ORG.addressKk : ORG.addressRu;

  const serviceLinks = [
    { to: "/services/readings", key: "services.reading.title" },
    { to: "/services/balance", key: "services.balance.title" },
    { to: "/services/payment", key: "services.pay.title" },
    { to: "/services/emergency", key: "services.accident.title" },
    { to: "/appeal", key: "services.appeal.title" },
  ];
  const infoLinks = [
    { to: "/tariffs", key: "nav.tariffs" },
    { to: "/outages", key: "nav.outages" },
    { to: "/map", key: "nav.map" },
    { to: "/faq", key: "nav.faq" },
    { to: "/news", key: "nav.news" },
    { to: "/documents", key: "nav.documents" },
  ];

  return (
    <footer className="border-t border-border bg-slate-950 text-slate-300">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Droplets className="size-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-sm font-extrabold tracking-tight text-white">
                {t("brand.name")}
              </span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-300/80">
                {t("brand.subname")}
              </span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-[13px] leading-6 text-slate-400">
            {t("footer.about")}
          </p>
          <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
            <MapPin className="size-3.5 shrink-0 text-sky-300" />
            <span>{address}</span>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-200">
            {t("footer.services")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-[13px]">
            {serviceLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-slate-400 transition-colors hover:text-sky-300"
                >
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-200">
            {t("footer.information")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-[13px]">
            {infoLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-slate-400 transition-colors hover:text-sky-300"
                >
                  {t(l.key)}
                </Link>
              </li>
            ))}
            {isAuthenticated ? (
              <li>
                <Link
                  to="/cabinet"
                  className="font-semibold text-sky-300 hover:text-sky-200"
                >
                  {t("nav.cabinet")}
                </Link>
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-200">
            {t("footer.contacts")}
          </h3>
          <ul className="mt-4 space-y-3 text-[13px]">
            <li>
              <a
                href={telHref(PHONES.callCenter)}
                className="flex items-start gap-2.5 text-slate-400 transition-colors hover:text-white"
              >
                <PhoneCall className="mt-0.5 size-3.5 shrink-0 text-sky-300" />
                <span>
                  <span className="block text-xs font-semibold text-slate-300">
                    {t("contacts.callCenter")}
                  </span>
                  {PHONES.callCenterPretty} · {PHONES.individualsPretty}
                </span>
              </a>
            </li>
            <li>
              <a
                href={telHref(PHONES.emergency)}
                className="flex items-start gap-2.5 text-slate-400 transition-colors hover:text-white"
              >
                <Siren className="mt-0.5 size-3.5 shrink-0 text-sky-300" />
                <span>
                  <span className="block text-xs font-semibold text-slate-300">
                    {t("contacts.emergency")}
                  </span>
                  {PHONES.emergencyPretty}
                  <span className="text-slate-500"> · {t("contacts.emergencyNote")}</span>
                </span>
              </a>
            </li>
            <li className="flex items-start gap-2.5 text-slate-400">
              <Clock className="mt-0.5 size-3.5 shrink-0 text-sky-300" />
              <span>
                {t("contacts.hoursMonFri")}
                <span className="block text-slate-500">{t("contacts.hoursSat")}</span>
              </span>
            </li>
          </ul>
          <div className="mt-5">
            <LangSwitch dark />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-[11px] text-slate-500 sm:px-6 md:flex-row md:text-left">
          <p>
            © {new Date().getFullYear()} {ORG.nameRu}. {t("footer.rights")}
          </p>
          <p>{t("footer.demo")}</p>
        </div>
      </div>
    </footer>
  );
}
