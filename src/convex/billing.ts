/**
 * BILLING API (public surface of the integration layer)
 *
 *   Frontend  →  billing.ts (Convex)  →  mockEngine / realSource  →  Billing
 *
 * These functions are what the UI consumes. Currently they delegate to the
 * deterministic demo engine (`billing/mockEngine.ts`); when the operator's
 * billing API is connected, only the delegation inside changes.
 */
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { buildAccount } from "./billing/mockEngine";

/** Statement + profile for one account number. Not found → found: false. */
export const getAccount = query({
  args: { accountNumber: v.string() },
  handler: async (_ctx, { accountNumber }) => {
    const demo = buildAccount(accountNumber.trim());
    if (!demo) return { found: false as const };
    return {
      found: true as const,
      number: demo.number,
      name: demo.name,
      address: demo.address,
      balance: demo.balance,
      lastAccrual: demo.lastAccrual,
      lastPayment: demo.lastPayment,
      updatedAt: demo.updatedAt,
      months: demo.months,
    };
  },
});

export type BillingMonth = {
  month: string;
  volume: number;
  rate: number;
  accrual: number;
  paid: number;
};

/**
 * Submit meter readings from the portal.
 * Validates input, then returns a receipt the user can see on screen.
 */
export const submitReading = mutation({
  args: {
    accountNumber: v.string(),
    value: v.number(),
    date: v.string(),
    phone: v.optional(v.string()),
    fileName: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const accountNumber = args.accountNumber.trim();
    if (!/^\d{8}$/.test(accountNumber)) {
      throw new Error("INVALID_ACCOUNT");
    }
    if (!Number.isFinite(args.value) || args.value <= 0 || args.value > 999999) {
      throw new Error("INVALID_READING");
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(args.date)) {
      throw new Error("INVALID_DATE");
    }
    const demo = buildAccount(accountNumber);
    if (!demo) {
      throw new Error("ACCOUNT_NOT_FOUND");
    }

    const now = new Date();
    const yyyy = now.getFullYear();
    const seq = Math.floor(100000 + Math.random() * 900000);
    return {
      operation: `${yyyy}-${seq}`,
      accountNumber,
      value: args.value,
      date: args.date,
      submittedAt: now.toISOString(),
      phone: args.phone ?? null,
      fileName: args.fileName ?? null,
      accepted: true as const,
    };
  },
});
