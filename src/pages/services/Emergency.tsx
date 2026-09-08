import { motion } from "framer-motion";
import { CheckCircle2, MapPin, PhoneCall, Siren, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { PHONES, telHref } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DemoTag, PageHero } from "@/components/portal/primitives";

const WHAT_KEYS = ["emergency.what1", "emergency.what2", "emergency.what3", "emergency.what4"] as const;

export default function Emergency() {
  const { t, lang } = useI18n();
  const createAppeal = useMutation(api.content.createAppeal);
  const [address, setAddress] = useState("");
  const [desc, setDesc] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [number, setNumber] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await createAppeal({
        kind: "accident",
        category: "accident",
        name,
        phone,
        address: address.trim() || undefined,
        message: desc,
        lang,
      });
      setNumber(res.number);
      setSent(true);
      toast.success(t("emergency.success"));
    } catch {
      toast.error(t("misc.error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHero eyebrow={t("nav.services")} title={t("emergency.title")} subtitle={t("emergency.subtitle")} />

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-14">
        {/* hotline side */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 p-6 text-white">
            <Siren className="pointer-events-none absolute -right-6 -top-6 size-28 text-white/10" />
            <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-red-100">
              <Siren className="size-4" />
              {t("emergency.hotline")}
            </p>
            <a
              href={telHref(PHONES.emergency)}
              className="mt-4 block text-3xl font-extrabold tracking-tight tabular-nums hover:underline sm:text-4xl"
            >
              {PHONES.emergencyPretty}
            </a>
            <p className="mt-2 text-[13px] text-red-100">{t("emergency.hotlineNote")}</p>
            <Button asChild className="mt-5 gap-2 bg-white text-red-700 hover:bg-red-50">
              <a href={telHref(PHONES.emergency)}>
                <PhoneCall className="size-4" />
                {t("header.call")}
              </a>
            </Button>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <p className="flex items-center gap-2 text-sm font-extrabold tracking-tight">
              <TriangleAlert className="size-4 text-red-500" />
              {t("emergency.what")}
            </p>
            <ul className="mt-3 space-y-2">
              {WHAT_KEYS.map((k) => (
                <li key={k} className="flex items-start gap-2 text-[13px] leading-5 text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-red-400" />
                  {t(k)}
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-muted/70 px-3.5 py-2.5 text-xs leading-5 text-muted-foreground">
              {t("emergency.after")}
            </p>
          </div>
        </div>

        {/* form */}
        <div>
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center rounded-2xl border bg-card p-8 text-center"
            >
              <span className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="size-8" />
              </span>
              <h2 className="mt-4 text-xl font-extrabold tracking-tight">{t("emergency.success")}</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                {t("emergency.successDesc")} {t("appeal.success.number")}: <b className="text-foreground">№{number}</b>
              </p>
              <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
                {t("readings.success.again")}
              </Button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={submit}
              className="rounded-2xl border bg-card p-6 sm:p-7"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-extrabold tracking-tight">{t("emergency.form.title")}</h2>
                <DemoTag mock />
              </div>

              <div className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="e-address">{t("emergency.form.address")}</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      id="e-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t("emergency.form.addressPh")}
                      className="h-11 pl-9"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="e-desc">{t("emergency.form.desc")}</Label>
                  <Textarea
                    id="e-desc"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder={t("emergency.form.descPh")}
                    rows={4}
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="e-name">{t("emergency.form.name")}</Label>
                    <Input
                      id="e-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="e-phone">{t("emergency.form.phone")}</Label>
                    <Input
                      id="e-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (___) ___-__-__"
                      className="h-11"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="mt-6 w-full gap-2 sm:w-auto sm:px-8" disabled={busy}>
                {busy ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <Siren className="size-4" />
                )}
                {t("common.submit")}
              </Button>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
}
