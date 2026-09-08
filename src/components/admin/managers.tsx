import { Plus, Pencil } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BiInput,
  DeleteButton,
  DialogShell,
  EmptyRow,
  fromDateInput,
  fromLocalDateTime,
  LoadingRow,
  PlainField,
  toDateInput,
  toLocalDateTime,
  type BiValue,
} from "@/components/admin/shared";
import { Badge } from "@/components/ui/badge";
import {
  appealStyleOf,
  outageStyleOf,
  useAppealLabel,
  useCategoryLabel,
} from "@/components/portal/meta";

function CategoryText({ category }: { category: NewsRow["category"] }) {
  const label = useCategoryLabel(category);
  return <span className="font-bold text-primary">{label}</span>;
}


/* ------------------------------- NEWS ---------------------------------- */

type NewsRow = {
  _id: string;
  category: "news" | "announcement" | "outage" | "repair" | "tariffs";
  date: number;
  published: boolean;
  title: BiValue;
  excerpt: BiValue;
  body: BiValue;
};

export function NewsManager() {
  const { t, lang, dateShort } = useI18n();
  const rows = useQuery(api.content.listNews, { includeAll: true });
  const save = useMutation(api.admin.newsSave);
  const remove = useMutation(api.admin.newsDelete);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NewsRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [category, setCategory] = useState<NewsRow["category"]>("news");
  const [date, setDate] = useState("");
  const [published, setPublished] = useState(true);
  const [title, setTitle] = useState<BiValue>({ ru: "", kk: "" });
  const [excerpt, setExcerpt] = useState<BiValue>({ ru: "", kk: "" });
  const [body, setBody] = useState<BiValue>({ ru: "", kk: "" });

  const openNew = () => {
    setEditing(null);
    setCategory("news");
    setDate(toDateInput(Date.now()));
    setPublished(true);
    setTitle({ ru: "", kk: "" });
    setExcerpt({ ru: "", kk: "" });
    setBody({ ru: "", kk: "" });
    setOpen(true);
  };

  const openEdit = (row: NewsRow) => {
    setEditing(row);
    setCategory(row.category);
    setDate(toDateInput(row.date));
    setPublished(row.published);
    setTitle(row.title);
    setExcerpt(row.excerpt);
    setBody(row.body);
    setOpen(true);
  };

  const submit = async () => {
    setBusy(true);
    try {
      await save({
        id: editing?._id as never,
        category,
        date: fromDateInput(date),
        published,
        title,
        excerpt,
        body,
      });
      toast.success(editing ? t("admin.saved") : t("admin.created"));
      setOpen(false);
    } catch {
      toast.error(t("misc.error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{t("admin.overview.totalNews")}: {rows?.length ?? 0}</p>
        <Button size="sm" className="gap-1.5" onClick={openNew}>
          <Plus className="size-4" />
          {t("admin.new")}
        </Button>
      </div>

      {rows === undefined ? (
        <LoadingRow />
      ) : rows.length === 0 ? (
        <EmptyRow message={t("admin.news.empty")} />
      ) : (
        <div className="space-y-2">
          {rows.map((r) => {
            return (
              <div key={r._id} className="flex flex-col gap-2 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-extrabold tracking-tight">{r.title[lang]}</p>
                    {!r.published ? (
                      <Badge variant="secondary" className="text-[10px]">{t("admin.f.published")}: —</Badge>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    <CategoryText category={r.category} /> · {dateShort(r.date)} ·{" "}
                    {r.excerpt[lang].slice(0, 90)}…
                  </p>
                </div>
                <div className="flex items-center gap-1 self-end sm:self-auto">
                  <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => openEdit(r)}>
                    <Pencil className="size-3.5" />
                    {t("common.edit")}
                  </Button>
                  <DeleteButton onDelete={async () => { await remove({ id: r._id as never }); toast.success(t("admin.deleted")); }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title={editing ? t("admin.edit") : t("admin.new")}
        onSubmit={submit}
        busy={busy}
      >
        <div className="grid gap-4">
          <BiInput label={t("admin.f.titleRu")} value={title} onChange={setTitle} />
          <BiInput label={t("admin.f.excerptRu")} value={excerpt} onChange={setExcerpt} type="textarea" />
          <BiInput label={t("admin.f.bodyRu")} value={body} onChange={setBody} type="textarea" />
          <div className="grid gap-4 sm:grid-cols-2">
            <PlainField label={t("admin.f.category")}>
              <Select value={category} onValueChange={(v) => setCategory(v as NewsRow["category"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["news", "announcement", "outage", "repair", "tariffs"] as const).map((c) => (
                    <SelectItem key={c} value={c}>{t(`news.filters.${c}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </PlainField>
            <PlainField label={t("admin.f.date")}>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </PlainField>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="published" checked={published} onCheckedChange={setPublished} />
            <label htmlFor="published" className="text-sm font-semibold">{t("admin.f.published")}</label>
          </div>
        </div>
      </DialogShell>
    </div>
  );
}

/* ------------------------------ OUTAGES -------------------------------- */

type OutageRow = {
  _id: string;
  district: BiValue;
  streets: BiValue;
  reason: BiValue;
  status: "planned" | "active" | "restored";
  startAt: number;
  restoredAt?: number | null;
  updatedAt: number;
};

export function OutagesManager() {
  const { t, lang, dateTime } = useI18n();
  const rows = useQuery(api.content.listOutages);
  const save = useMutation(api.admin.outageSave);
  const remove = useMutation(api.admin.outageDelete);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<OutageRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [district, setDistrict] = useState<BiValue>({ ru: "", kk: "" });
  const [streets, setStreets] = useState<BiValue>({ ru: "", kk: "" });
  const [reason, setReason] = useState<BiValue>({ ru: "", kk: "" });
  const [status, setStatus] = useState<OutageRow["status"]>("planned");
  const [startAt, setStartAt] = useState("");
  const [restoredAt, setRestoredAt] = useState("");

  const openNew = () => {
    setEditing(null);
    setDistrict({ ru: "", kk: "" });
    setStreets({ ru: "", kk: "" });
    setReason({ ru: "", kk: "" });
    setStatus("planned");
    setStartAt(toLocalDateTime(Date.now()));
    setRestoredAt("");
    setOpen(true);
  };

  const openEdit = (r: OutageRow) => {
    setEditing(r);
    setDistrict(r.district);
    setStreets(r.streets);
    setReason(r.reason);
    setStatus(r.status);
    setStartAt(toLocalDateTime(r.startAt));
    setRestoredAt(r.restoredAt ? toLocalDateTime(r.restoredAt) : "");
    setOpen(true);
  };

  const submit = async () => {
    setBusy(true);
    try {
      await save({
        id: editing?._id as never,
        district,
        streets,
        reason,
        status,
        startAt: fromLocalDateTime(startAt),
        restoredAt: restoredAt ? fromLocalDateTime(restoredAt) : undefined,
      });
      toast.success(editing ? t("admin.saved") : t("admin.created"));
      setOpen(false);
    } catch {
      toast.error(t("misc.error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{t("admin.overview.totalNews")}: {rows?.length ?? 0}</p>
        <Button size="sm" className="gap-1.5" onClick={openNew}>
          <Plus className="size-4" />
          {t("admin.new")}
        </Button>
      </div>
      {rows === undefined ? (
        <LoadingRow />
      ) : rows.length === 0 ? (
        <EmptyRow message={t("admin.tab.empty")} />
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r._id} className="flex flex-col gap-2 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-extrabold tracking-tight">{r.district[lang]}</p>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset", outageStyleOf(r.status))}>
                    {t(`outages.status.${r.status}` as never)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {r.streets[lang]} · {dateTime(r.startAt)}
                </p>
              </div>
              <div className="flex items-center gap-1 self-end sm:self-auto">
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => openEdit(r)}>
                  <Pencil className="size-3.5" />
                  {t("common.edit")}
                </Button>
                <DeleteButton onDelete={async () => { await remove({ id: r._id as never }); toast.success(t("admin.deleted")); }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <DialogShell open={open} onOpenChange={setOpen} title={editing ? t("admin.edit") : t("admin.new")} onSubmit={submit} busy={busy}>
        <div className="grid gap-4">
          <BiInput label={t("admin.f.districtRu")} value={district} onChange={setDistrict} />
          <BiInput label={t("admin.f.streetsRu")} value={streets} onChange={setStreets} />
          <BiInput label={t("admin.f.reasonRu")} value={reason} onChange={setReason} />
          <PlainField label={t("admin.f.status")}>
            <Select value={status} onValueChange={(v) => setStatus(v as OutageRow["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["planned", "active", "restored"] as const).map((s) => (
                  <SelectItem key={s} value={s}>{t(`outages.status.${s}` as never)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </PlainField>
          <div className="grid gap-4 sm:grid-cols-2">
            <PlainField label={t("admin.f.startAt")}>
              <Input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
            </PlainField>
            <PlainField label={t("admin.f.restoredAt")}>
              <Input type="datetime-local" value={restoredAt} onChange={(e) => setRestoredAt(e.target.value)} />
            </PlainField>
          </div>
        </div>
      </DialogShell>
    </div>
  );
}

/* ------------------------------ TARIFFS -------------------------------- */

type TariffRow = {
  _id: string;
  audience: "physical" | "legal";
  service: BiValue;
  unit: BiValue;
  period: BiValue;
  price: number;
  active: boolean;
};

export function TariffsManager() {
  const { t } = useI18n();
  const rows = useQuery(api.admin.listTariffsAll);
  const save = useMutation(api.admin.tariffSave);
  const remove = useMutation(api.admin.tariffDelete);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TariffRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [audience, setAudience] = useState<"physical" | "legal">("physical");
  const [service, setService] = useState<BiValue>({ ru: "", kk: "" });
  const [unit, setUnit] = useState<BiValue>({ ru: "", kk: "" });
  const [period, setPeriod] = useState<BiValue>({ ru: "", kk: "" });
  const [price, setPrice] = useState("");
  const [active, setActive] = useState(true);

  const openNew = () => {
    setEditing(null);
    setAudience("physical");
    setService({ ru: "", kk: "" });
    setUnit({ ru: "1 м³", kk: "1 м³" });
    setPeriod({ ru: "", kk: "" });
    setPrice("");
    setActive(true);
    setOpen(true);
  };
  const openEdit = (r: TariffRow) => {
    setEditing(r);
    setAudience(r.audience);
    setService(r.service);
    setUnit(r.unit);
    setPeriod(r.period);
    setPrice(String(r.price));
    setActive(r.active);
    setOpen(true);
  };

  const submit = async () => {
    setBusy(true);
    try {
      await save({
        id: editing?._id as never,
        audience,
        service,
        unit,
        period,
        price: parseFloat(price.replace(",", ".")) || 0,
        active,
      });
      toast.success(editing ? t("admin.saved") : t("admin.created"));
      setOpen(false);
    } catch {
      toast.error(t("misc.error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{t("admin.overview.tariffsCount")}: {rows?.length ?? 0}</p>
        <Button size="sm" className="gap-1.5" onClick={openNew}>
          <Plus className="size-4" />
          {t("admin.new")}
        </Button>
      </div>
      {rows === undefined ? (
        <LoadingRow />
      ) : rows === null ? (
        <EmptyRow message={t("admin.denied.desc")} />
      ) : rows.length === 0 ? (
        <EmptyRow message={t("admin.tab.empty")} />
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r._id} className="flex flex-col gap-2 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold tracking-tight">{r.service.ru}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {r.audience === "physical" ? t("tariffs.audience.physical") : t("tariffs.audience.legal")} ·{" "}
                  {new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(r.price)} ₸ / {r.unit.ru} ·{" "}
                  {r.period.ru}
                  {!r.active ? ` · ${t("common.no")}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-1 self-end sm:self-auto">
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => openEdit(r)}>
                  <Pencil className="size-3.5" />
                  {t("common.edit")}
                </Button>
                <DeleteButton onDelete={async () => { await remove({ id: r._id as never }); toast.success(t("admin.deleted")); }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <DialogShell open={open} onOpenChange={setOpen} title={editing ? t("admin.edit") : t("admin.new")} onSubmit={submit} busy={busy}>
        <div className="grid gap-4">
          <PlainField label={t("admin.f.audience")}>
            <Select value={audience} onValueChange={(v) => setAudience(v as "physical" | "legal")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="physical">{t("tariffs.audience.physical")}</SelectItem>
                <SelectItem value="legal">{t("tariffs.audience.legal")}</SelectItem>
              </SelectContent>
            </Select>
          </PlainField>
          <BiInput label={t("admin.f.serviceRu")} value={service} onChange={setService} />
          <div className="grid gap-4 sm:grid-cols-2">
            <PlainField label={t("admin.f.price")}>
              <Input value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d.,]/g, ""))} placeholder="121.87" inputMode="decimal" />
            </PlainField>
            <div className="flex items-end gap-2 pb-2">
              <Switch id="tactive" checked={active} onCheckedChange={setActive} />
              <label htmlFor="tactive" className="text-sm font-semibold">{t("admin.f.published")}</label>
            </div>
          </div>
          <BiInput label={t("admin.f.unitRu")} value={unit} onChange={setUnit} />
          <BiInput label={t("admin.f.periodRu")} value={period} onChange={setPeriod} />
        </div>
      </DialogShell>
    </div>
  );
}

/* -------------------------------- FAQ ---------------------------------- */

type FaqRow = { _id: string; question: BiValue; answer: BiValue; order: number };

export function FaqManager() {
  const { t, lang } = useI18n();
  const rows = useQuery(api.content.listFaq);
  const save = useMutation(api.admin.faqSave);
  const remove = useMutation(api.admin.faqDelete);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FaqRow | null>(null);
  const [busy, setBusy] = useState(false);
  const [question, setQuestion] = useState<BiValue>({ ru: "", kk: "" });
  const [answer, setAnswer] = useState<BiValue>({ ru: "", kk: "" });
  const [order, setOrder] = useState("1");

  const openNew = () => {
    setEditing(null);
    setQuestion({ ru: "", kk: "" });
    setAnswer({ ru: "", kk: "" });
    setOrder(String((rows?.length ?? 0) + 1));
    setOpen(true);
  };
  const openEdit = (r: FaqRow) => {
    setEditing(r);
    setQuestion(r.question);
    setAnswer(r.answer);
    setOrder(String(r.order));
    setOpen(true);
  };

  const submit = async () => {
    setBusy(true);
    try {
      await save({
        id: editing?._id as never,
        question,
        answer,
        order: parseInt(order, 10) || 1,
      });
      toast.success(editing ? t("admin.saved") : t("admin.created"));
      setOpen(false);
    } catch {
      toast.error(t("misc.error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{t("admin.overview.faqCount")}: {rows?.length ?? 0}</p>
        <Button size="sm" className="gap-1.5" onClick={openNew}>
          <Plus className="size-4" />
          {t("admin.new")}
        </Button>
      </div>
      {rows === undefined ? (
        <LoadingRow />
      ) : rows.length === 0 ? (
        <EmptyRow message={t("admin.tab.empty")} />
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r._id} className="flex flex-col gap-2 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold tracking-tight">{r.question[lang]}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{r.answer[lang]}</p>
              </div>
              <div className="flex items-center gap-1 self-end sm:self-auto">
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => openEdit(r)}>
                  <Pencil className="size-3.5" />
                  {t("common.edit")}
                </Button>
                <DeleteButton onDelete={async () => { await remove({ id: r._id as never }); toast.success(t("admin.deleted")); }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <DialogShell open={open} onOpenChange={setOpen} title={editing ? t("admin.edit") : t("admin.new")} onSubmit={submit} busy={busy}>
        <div className="grid gap-4">
          <BiInput label={t("admin.f.questionRu")} value={question} onChange={setQuestion} />
          <BiInput label={t("admin.f.answerRu")} value={answer} onChange={setAnswer} type="textarea" />
          <PlainField label={t("common.date")}>
            <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
          </PlainField>
        </div>
      </DialogShell>
    </div>
  );
}

/* ------------------------------ APPEALS -------------------------------- */

type AppealRow = {
  _id: string;
  kind: "appeal" | "accident";
  category: string;
  status: "new" | "in_progress" | "done";
  name: string;
  phone: string;
  account: string | null;
  address: string | null;
  message: string;
  fileName: string | null;
  response: string | null;
  displayNumber: string;
  _creationTime: number;
};

const CAT_KEY: Record<string, string> = {
  accrual: "appeal.cat.accrual",
  debt: "appeal.cat.debt",
  water: "appeal.cat.water",
  sewer: "appeal.cat.sewer",
  meter: "appeal.cat.meter",
  accident: "appeal.cat.accident",
  quality: "appeal.cat.quality",
  other: "appeal.cat.other",
};

export function AppealsManager() {
  const { t, dateTime } = useI18n();
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "in_progress" | "done">("new");
  const rows = useQuery(api.admin.listAppeals, statusFilter === "all" ? {} : { status: statusFilter });
  const update = useMutation(api.admin.appealUpdate);
  const [responseBy, setResponseBy] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const statusLabel = useAppealLabel;

  const filters = [
    { value: "new", label: t("appeal.status.new") },
    { value: "in_progress", label: t("appeal.status.in_progress") },
    { value: "done", label: t("appeal.status.done") },
    { value: "all", label: t("common.all") },
  ] as const;

  const act = async (id: string, patch: { status?: AppealRow["status"]; response?: string }) => {
    setBusyId(id);
    try {
      await update({ id: id as never, ...patch });
      toast.success(t("admin.saved"));
    } catch {
      toast.error(t("misc.error"));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatusFilter(f.value)}
            className={cn(
              "cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors",
              statusFilter === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {rows === undefined ? (
        <LoadingRow />
      ) : rows === null ? (
        <EmptyRow message={t("admin.denied.desc")} />
      ) : rows.length === 0 ? (
        <EmptyRow message={t("admin.tab.empty")} />
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r._id} className="rounded-2xl border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-extrabold">№{r.displayNumber}</p>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset", appealStyleOf(r.status))}>
                    {statusLabel(r.status)}
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    {t(CAT_KEY[r.category] ?? "appeal.cat.other")} · {dateTime(r._creationTime)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {r.name} · {r.phone}
                  {r.account ? ` · №${r.account}` : ""}
                </p>
              </div>
              <p className="mt-2 text-[13px] leading-6 text-foreground/85">{r.message}</p>
              {r.address ? (
                <p className="mt-1 text-xs font-semibold text-muted-foreground">{r.address}</p>
              ) : null}
              {r.fileName ? (
                <p className="mt-1 text-xs font-semibold text-primary">📎 {r.fileName}</p>
              ) : null}

              {r.status === "done" && r.response ? (
                <p className="mt-3 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-[13px] leading-6 text-emerald-900">
                  <b>{t("appeal.reply")}:</b> {r.response}
                </p>
              ) : null}

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
                {r.status === "new" ? (
                  <Button size="sm" variant="outline" disabled={busyId === r._id} onClick={() => act(r._id, { status: "in_progress" })}>
                    {t("admin.appeals.inProgress")}
                  </Button>
                ) : null}
                {r.status === "in_progress" ? (
                  <>
                    <input
                      value={responseBy[r._id] ?? r.response ?? ""}
                      onChange={(e) => setResponseBy((m) => ({ ...m, [r._id]: e.target.value }))}
                      placeholder={t("appeal.replyPh")}
                      className="min-w-0 flex-1 rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <Button
                      size="sm"
                      className="gap-1.5"
                      disabled={busyId === r._id || !(responseBy[r._id] ?? "").trim()}
                      onClick={() => act(r._id, { status: "done", response: (responseBy[r._id] ?? "").trim() })}
                    >
                      {t("admin.appeals.respond")}
                    </Button>
                  </>
                ) : null}
                {r.status === "done" ? (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <Badge variant="secondary">{t("appeal.status.done")}</Badge>
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------- USERS --------------------------------- */

export function UsersManager() {
  const { t } = useI18n();
  const users = useQuery(api.users.listUsers);
  const setRole = useMutation(api.users.setRole);
  const [busyId, setBusyId] = useState<string | null>(null);
  const ROLES = [
    { value: "admin", label: t("admin.roles.admin") },
    { value: "operator", label: t("admin.roles.operator") },
    { value: "dispatcher", label: t("admin.roles.dispatcher") },
    { value: "editor", label: t("admin.roles.editor") },
    { value: "manager", label: t("admin.roles.manager") },
    { value: "user", label: t("admin.roles.user") },
  ] as const;

  return (
    <div>
      {users === undefined ? (
        <LoadingRow />
      ) : users === null ? (
        <EmptyRow message={t("admin.denied.desc")} />
      ) : users.length === 0 ? (
        <EmptyRow message={t("admin.tab.empty")} />
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={String(u._id)} className="flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-extrabold text-primary">
                {(u.name || u.email || "?").slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-extrabold tracking-tight">{u.name || u.email}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {u.email} {u.isAnonymous ? "· guest" : ""}
                </p>
              </div>
              <Select
                value={u.role}
                disabled={busyId === String(u._id)}
                onValueChange={async (role) => {
                  setBusyId(String(u._id));
                  try {
                    await setRole({ userId: u._id as never, role: role as never });
                    toast.success(t("admin.users.roleUpdated"));
                  } catch {
                    toast.error(t("misc.error"));
                  } finally {
                    setBusyId(null);
                  }
                }}
              >
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
