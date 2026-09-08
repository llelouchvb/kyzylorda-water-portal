import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export type BiValue = { ru: string; kk: string };

export function DialogShell({
  open,
  onOpenChange,
  title,
  children,
  onSubmit,
  busy,
  submitLabel,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  children: ReactNode;
  onSubmit?: () => void;
  busy?: boolean;
  submitLabel?: string;
}) {
  const { t } = useI18n();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg tracking-tight">{title}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            {t("common.cancel")}
          </Button>
          {onSubmit ? (
            <Button onClick={onSubmit} disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              {submitLabel ?? t("common.save")}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function BiInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: BiValue;
  onChange: (v: BiValue) => void;
  type?: "text" | "textarea";
}) {
  const { t } = useI18n();
  const render = (lang: "ru" | "kk") =>
    type === "textarea" ? (
      <Textarea
        value={value[lang]}
        onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
        rows={4}
      />
    ) : (
      <Input value={value[lang]} onChange={(e) => onChange({ ...value, [lang]: e.target.value })} />
    );

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            {t("lang.ru")}
          </span>
          {render("ru")}
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            {t("lang.kk")}
          </span>
          {render("kk")}
        </div>
      </div>
    </div>
  );
}

export function PlainField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

/** Two-step delete: first click arms, second click deletes. */
export function DeleteButton({ onDelete, busy }: { onDelete: () => void; busy?: boolean }) {
  const { t } = useI18n();
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <Button
      variant={armed ? "destructive" : "ghost"}
      size="sm"
      className={cn("gap-1.5", armed ? "text-white" : "text-destructive hover:text-destructive")}
      disabled={busy}
      onClick={() => {
        if (armed) {
          if (timer.current) clearTimeout(timer.current);
          onDelete();
          setArmed(false);
        } else {
          setArmed(true);
          timer.current = setTimeout(() => setArmed(false), 3000);
        }
      }}
    >
      {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
      {armed ? t("common.confirmDelete") : t("common.delete")}
    </Button>
  );
}

export function EmptyRow({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed bg-card/60 px-6 py-12 text-center text-sm font-semibold text-muted-foreground">
      {message}
    </div>
  );
}

export function LoadingRow() {
  const { t } = useI18n();
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      {t("common.loading")}
    </div>
  );
}

export function toLocalDateTime(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromLocalDateTime(v: string): number {
  return new Date(v).getTime();
}

export function toDateInput(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromDateInput(v: string, hour = 10): number {
  const d = new Date(`${v}T00:00:00`);
  d.setHours(hour, 0, 0, 0);
  return d.getTime();
}
