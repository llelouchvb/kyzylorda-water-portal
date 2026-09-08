import { AnimatePresence, motion } from "framer-motion";
import { Building2, Droplet, MapPin, Wrench } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { MAP_MARKERS, pick, type MapMarker, type MarkerType } from "@/lib/content";
import { cn } from "@/lib/utils";
import { DemoTag, PageHero } from "@/components/portal/primitives";

const TYPE_META: Record<
  MarkerType,
  { labelKey: "map.legend.accident" | "map.legend.outage" | "map.legend.repair" | "map.legend.office"; dot: string; chip: string }
> = {
  accident: { labelKey: "map.legend.accident", dot: "bg-red-500", chip: "text-red-700 bg-red-50 ring-red-200" },
  outage: { labelKey: "map.legend.outage", dot: "bg-amber-500", chip: "text-amber-700 bg-amber-50 ring-amber-200" },
  repair: { labelKey: "map.legend.repair", dot: "bg-blue-500", chip: "text-blue-700 bg-blue-50 ring-blue-200" },
  office: { labelKey: "map.legend.office", dot: "bg-sky-700", chip: "text-sky-800 bg-sky-50 ring-sky-200" },
};

function MarkerIcon({ type }: { type: MarkerType }) {
  if (type === "office") return <Building2 className="size-3.5" />;
  if (type === "repair") return <Wrench className="size-3.5" />;
  if (type === "outage") return <Droplet className="size-3.5" />;
  return <MapPin className="size-3.5" />;
}

export default function MapPage() {
  const { t, lang } = useI18n();
  const [active, setActive] = useState<string>(MAP_MARKERS[0]?.id ?? "");
  const activeMarker = MAP_MARKERS.find((m) => m.id === active) ?? null;

  return (
    <div>
      <PageHero eyebrow={t("nav.map")} title={t("map.title")} subtitle={t("map.subtitle")} />

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:py-14">
        {/* map canvas */}
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border bg-gradient-to-b from-sky-50 via-[#eef6fc] to-[#e2eef7] sm:aspect-[16/10]">
            {/* stylized river + streets */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              <path
                d="M-4 78 C 12 66, 20 84, 34 72 S 62 52, 78 58 S 98 62, 106 54"
                fill="none"
                stroke="#bcddf3"
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.9"
              />
              <path d="M 0 12 H 100" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />
              <path d="M 0 30 H 100" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />
              <path d="M 0 50 H 100" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />
              <path d="M 0 68 H 100" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />
              <path d="M 0 88 H 100" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />
              <path d="M 22 0 V 100" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />
              <path d="M 46 0 V 100" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />
              <path d="M 68 0 V 100" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />
              <path d="M 88 0 V 100" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />
            </svg>

            {/* markers */}
            {MAP_MARKERS.map((m) => {
              const meta = TYPE_META[m.type];
              const selected = active === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  aria-label={pick(lang, m.title)}
                  onClick={() => setActive(m.id)}
                  className="absolute z-10 -translate-x-1/2 -translate-y-full cursor-pointer outline-none"
                  style={{ left: `${m.x}%`, top: `${m.y}%` }}
                >
                  <span className="relative flex flex-col items-center">
                    {selected ? (
                      <motion.span
                        layoutId="map-ring"
                        className={cn("absolute -inset-2 rounded-full opacity-30", meta.dot)}
                      />
                    ) : null}
                    <span
                      className={cn(
                        "relative flex size-7 items-center justify-center rounded-full text-white ring-2 ring-white shadow-md transition-transform",
                        meta.dot,
                        selected ? "scale-110" : "hover:scale-105",
                      )}
                    >
                      <MarkerIcon type={m.type} />
                    </span>
                    <span className="mt-0.5 rounded-full bg-white/90 px-1.5 py-px text-[9px] font-bold text-slate-700 shadow-sm">
                      {pick(lang, m.title)}
                    </span>
                  </span>
                </button>
              );
            })}

            {/* active card */}
            <div className="pointer-events-none absolute inset-x-3 bottom-3">
              <AnimatePresence>
                {activeMarker ? (
                  <motion.div
                    key={activeMarker.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="pointer-events-auto mx-auto w-full max-w-sm rounded-2xl border bg-white/95 p-3.5 shadow-lg backdrop-blur"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className={cn("mt-1 size-2 rounded-full", TYPE_META[activeMarker.type].dot)} />
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold tracking-tight">
                          {pick(lang, activeMarker.title)}
                        </p>
                        <p className="text-xs leading-5 text-muted-foreground">
                          {pick(lang, activeMarker.detail)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {(Object.keys(TYPE_META) as MarkerType[]).map((type) => (
              <span
                key={type}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ring-1",
                  TYPE_META[type].chip,
                )}
              >
                <span className={cn("size-2 rounded-full", TYPE_META[type].dot)} />
                {t(TYPE_META[type].labelKey)}
              </span>
            ))}
            <span className="ml-auto">
              <DemoTag mock />
            </span>
          </div>
          <p className="mt-3 rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-xs leading-5 text-sky-900">
            {t("map.integrationNote")}
          </p>
        </div>

        {/* object list */}
        <div>
          <h2 className="flex items-center justify-between gap-2 text-sm font-extrabold tracking-tight">
            <span>{t("map.objects")}</span>
            <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
              {MAP_MARKERS.length}
            </span>
          </h2>
          <ul className="mt-4 space-y-2">
            {MAP_MARKERS.map((m: MapMarker) => {
              const selected = active === m.id;
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => setActive(m.id)}
                    className={cn(
                      "flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-3.5 text-left transition-colors",
                      selected
                        ? "border-primary/50 bg-accent/60"
                        : "border-border bg-card hover:border-primary/30",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg text-white",
                        TYPE_META[m.type].dot,
                      )}
                    >
                      <MarkerIcon type={m.type} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-extrabold leading-5 tracking-tight">
                        {pick(lang, m.title)}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                        {pick(lang, m.detail)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
