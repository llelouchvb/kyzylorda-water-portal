import { motion } from "framer-motion";
import {
  CalendarRange,
  Camera,
  CheckCircle2,
  Gauge,
  Info,
  Paperclip,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoTag, PageHero } from "@/components/portal/primitives";

interface Receipt {
  operation: string;
  accountNumber: string;
  value: number;
  date: string;
}

export default function Readings() {
  const { t, dateLong } = useI18n();
  const submitReading = useMutation(api.billing.submitReading);

  const [account, setAccount] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [phone, setPhone] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const acc = account.trim();
    const val = parseFloat(value.replace(",", "."));
    if (!/^\d{8}$/.test(acc)) {
      setError(t("readings.error.invalid"));
      return;
    }
    if (!Number.isFinite(val) || val <= 0) {
      setError(t("readings.error.invalid"));
      return;
    }
    setBusy(true);
    try {
      const res = await submitReading({
        accountNumber: acc,
        value: val,
        date,
        phone: phone.trim() || undefined,
        fileName: fileName ?? undefined,
      });
      setReceipt({
        operation: res.operation,
        accountNumber: res.accountNumber,
        value: res.value,
        date: res.date,
      });
      toast.success(t("readings.success.title"));
    } catch {
      setError(t("readings.error.invalid"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHero eyebrow={t("nav.services")} title={t("readings.title")} subtitle={t("readings.subtitle")} />

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-14">
        <div>
          {receipt ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="overflow-hidden rounded-2xl border bg-card"
            >
              <div className="flex items-center gap-3 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-5">
                <span className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="size-6" />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold tracking-tight text-emerald-900">
                    {t("readings.success.title")}
                  </h2>
                  <p className="text-[13px] text-emerald-800/80">{t("readings.success.desc")}</p>
                </div>
              </div>
              <dl className="divide-y px-6 text-sm">
                {[
                  { k: t("readings.success.op"), v: receipt.operation },
                  { k: t("readings.success.account"), v: receipt.accountNumber },
                  { k: t("readings.success.value"), v: `${receipt.value} м³` },
                  { k: t("readings.success.date"), v: dateLong(receipt.date) },
                ].map((row) => (
                  <div key={row.k} className="flex items-center justify-between gap-3 py-3">
                    <dt className="text-muted-foreground">{row.k}</dt>
                    <dd className="text-right font-extrabold tabular-nums">{row.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex gap-2 border-t px-6 py-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setReceipt(null);
                    setAccount("");
                    setValue("");
                    setFileName(null);
                  }}
                >
                  {t("readings.success.again")}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="rounded-2xl border bg-card p-6 sm:p-7"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
                  <Gauge className="size-5 text-primary" />
                  {t("readings.form.account").replace(":", "")}
                </h2>
                <DemoTag mock />
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="acc">{t("readings.form.account")}</Label>
                  <Input
                    id="acc"
                    value={account}
                    onChange={(e) => setAccount(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    placeholder={t("readings.form.accountPh")}
                    inputMode="numeric"
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="meter">{t("readings.form.meter")}</Label>
                  <Input
                    id="meter"
                    value={value}
                    onChange={(e) => setValue(e.target.value.replace(/[^\d.,]/g, "").slice(0, 10))}
                    placeholder={t("readings.form.meterPh")}
                    inputMode="decimal"
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rdate">{t("readings.form.date")}</Label>
                  <Input
                    id="rdate"
                    type="date"
                    value={date}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rphone">
                    {t("readings.form.phone")}{" "}
                    <span className="font-normal text-muted-foreground">({t("common.optional")})</span>
                  </Label>
                  <Input
                    id="rphone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    inputMode="tel"
                    className="h-11"
                  />
                </div>
              </div>

              {/* photo attach */}
              <div className="mt-5">
                <Label>{t("readings.form.photo")}</Label>
                <label className="mt-1.5 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed px-4 py-3.5 transition-colors hover:border-primary/60 hover:bg-muted/40">
                  <span className="flex min-w-0 items-center gap-2 text-sm font-semibold">
                    <Camera className="size-4 shrink-0 text-primary" />
                    <span className="min-w-0 truncate">{fileName ?? t("readings.form.attach")}</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">{t("readings.form.photoHint")}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      setFileName(f ? f.name : null);
                    }}
                  />
                </label>
              </div>

              {error ? (
                <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] font-semibold text-red-700">
                  {error}
                </p>
              ) : null}

              <Button type="submit" size="lg" className="mt-6 w-full gap-2 sm:w-auto sm:px-8" disabled={busy}>
                {busy ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    {t("misc.processing")}
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    {t("common.submit")}
                  </>
                )}
              </Button>
            </motion.form>
          )}
        </div>

        {/* side info */}
        <div className="space-y-4">
          <div className="rounded-2xl border bg-card p-5">
            <p className="flex items-center gap-2 text-sm font-extrabold tracking-tight">
              <CalendarRange className="size-4 text-primary" />
              {t("readings.schema")}
            </p>
            <p className="mt-2 text-[13px] leading-6 text-muted-foreground">{t("readings.schemaDesc")}</p>
          </div>
          <div className="rounded-2xl border bg-slate-950 p-5 text-white">
            <p className="flex items-center gap-2 text-sm font-extrabold tracking-tight">
              <Info className="size-4 text-sky-300" />
              {t("readings.schedule")}
            </p>
            <ul className="mt-3 space-y-2 text-[13px] text-slate-300">
              <li className="flex items-center gap-2">
                <Sparkles className="size-3.5 text-sky-300" />
                {t("readings.subtitle")}
              </li>
              <li className="flex items-center gap-2">
                <Paperclip className="size-3.5 text-sky-300" />
                {t("readings.form.photoHint")}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-3.5 text-sky-300" />
                {t("services.viaPhone")} +7 (705) 690-34-10
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
