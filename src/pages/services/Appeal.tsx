import { motion } from "framer-motion";
import {
  CheckCircle2,
  FileUp,
  MessageSquareText,
  Paperclip,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DemoTag, PageHero } from "@/components/portal/primitives";

const CATEGORIES = [
  { value: "accrual", key: "appeal.cat.accrual" },
  { value: "debt", key: "appeal.cat.debt" },
  { value: "water", key: "appeal.cat.water" },
  { value: "sewer", key: "appeal.cat.sewer" },
  { value: "meter", key: "appeal.cat.meter" },
  { value: "accident", key: "appeal.cat.accident" },
  { value: "quality", key: "appeal.cat.quality" },
  { value: "other", key: "appeal.cat.other" },
] as const;

export default function Appeal() {
  const { t, lang } = useI18n();
  const createAppeal = useMutation(api.content.createAppeal);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [account, setAccount] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState<string>("other");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await createAppeal({
        kind: "appeal",
        category,
        name,
        phone,
        account: account.trim() || undefined,
        address: address.trim() || undefined,
        message,
        fileName: fileName ?? undefined,
        lang,
      });
      setResult(res.number);
      toast.success(t("appeal.success.title"));
    } catch {
      toast.error(t("misc.error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHero
        eyebrow={t("nav.services")}
        title={t("appeal.title")}
        subtitle={t("appeal.subtitle")}
      />

      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        {result ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border bg-card p-8 text-center"
          >
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="size-8" />
            </span>
            <h2 className="mt-4 text-xl font-extrabold tracking-tight">{t("appeal.success.title")}</h2>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-primary">№{result}</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              {t("appeal.success.desc")}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={() => setResult(null)}>
                {t("readings.success.again")}
              </Button>
              <Button asChild>
                <Link to="/cabinet">{t("nav.cabinet")}</Link>
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={submit}
            className="rounded-2xl border bg-card p-6 sm:p-8"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
                <MessageSquareText className="size-5 text-primary" />
                {t("appeal.form.category").replace(":", "")}
              </h2>
              <DemoTag mock />
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="ap-name">{t("appeal.form.name")}</Label>
                <Input id="ap-name" value={name} onChange={(e) => setName(e.target.value)} className="h-11" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ap-phone">{t("appeal.form.phone")}</Label>
                <Input
                  id="ap-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ap-account">
                  {t("appeal.form.account")}{" "}
                  <span className="font-normal text-muted-foreground">({t("common.optional")})</span>
                </Label>
                <Input
                  id="ap-account"
                  value={account}
                  onChange={(e) => setAccount(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  inputMode="numeric"
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ap-address">
                  {t("appeal.form.address")}{" "}
                  <span className="font-normal text-muted-foreground">({t("common.optional")})</span>
                </Label>
                <Input id="ap-address" value={address} onChange={(e) => setAddress(e.target.value)} className="h-11" />
              </div>
            </div>

            <div className="mt-5 space-y-1.5">
              <Label>{t("appeal.form.category")}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {t(c.key)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-5 space-y-1.5">
              <Label htmlFor="ap-msg">{t("appeal.form.message")}</Label>
              <Textarea
                id="ap-msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
              />
            </div>

            <div className="mt-5">
              <Label>{t("appeal.form.file")}</Label>
              <label className="mt-1.5 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed px-4 py-3.5 transition-colors hover:border-primary/60 hover:bg-muted/40">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <FileUp className="size-4 text-primary" />
                  {fileName ? (
                    <>
                      <Paperclip className="size-3.5" />
                      {fileName}
                    </>
                  ) : (
                    t("appeal.form.file")
                  )}
                </span>
                <span className="text-[11px] text-muted-foreground">{t("appeal.form.fileHint")}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setFileName(f ? f.name : null);
                  }}
                />
              </label>
            </div>

            <Button type="submit" size="lg" className="mt-7 w-full gap-2 sm:w-auto sm:px-10" disabled={busy}>
              {busy ? (
                <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <MessageSquareText className="size-4" />
              )}
              {t("common.submit")}
            </Button>
          </motion.form>
        )}
      </div>
    </div>
  );
}
