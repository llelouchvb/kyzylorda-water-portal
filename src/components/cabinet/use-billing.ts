import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { demoAccountFor } from "@/lib/account";

export interface BillingMonth {
  month: string;
  volume: number;
  rate: number;
  accrual: number;
  paid: number;
}

export interface Statement {
  found: true;
  number: string;
  name: { ru: string; kk: string };
  address: { ru: string; kk: string };
  balance: number;
  lastAccrual: number;
  lastPayment: number;
  updatedAt: number;
  months: BillingMonth[];
}

export function useBillingForUser() {
  const { user, isLoading } = useAuth();
  const account = useMemo(() => demoAccountFor(user), [user]);
  const result = useQuery(
    api.billing.getAccount,
    user !== undefined ? { accountNumber: account } : "skip",
  );
  return {
    user,
    authLoading: isLoading,
    loading: result === undefined && user !== undefined,
    account,
    statement: result && result.found ? (result as Statement) : null,
  };
}

export function monthLabelLong(iso: string, lang: "ru" | "kk"): string {
  const d = new Date(`${iso}T00:00:00`);
  try {
    return new Intl.DateTimeFormat(lang === "kk" ? "kk-KZ" : "ru-RU", {
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(d);
  }
}

export function monthLabelShort(iso: string, lang: "ru" | "kk"): string {
  const d = new Date(`${iso}T00:00:00`);
  try {
    return new Intl.DateTimeFormat(lang === "kk" ? "kk-KZ" : "ru-RU", { month: "short" }).format(d);
  } catch {
    return new Intl.DateTimeFormat("ru-RU", { month: "short" }).format(d);
  }
}
