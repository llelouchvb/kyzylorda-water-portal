import { v } from "convex/values";
import { getSession } from "./helpers";
import { mutation, query } from "./_generated/server";

/* ------------------------------- NEWS ---------------------------------- */

export const listNews = query({
  args: { includeAll: v.optional(v.boolean()) },
  handler: async (ctx, { includeAll }) => {
    const session = await getSession(ctx);
    const wantAll = includeAll === true && ["admin", "editor", "manager"].includes(session.role);
    const items = await ctx.db.query("news").order("desc").take(200);
    const filtered = wantAll ? items : items.filter((n) => n.published);
    return filtered.map((n) => ({
      _id: n._id,
      category: n.category,
      date: n.date,
      published: n.published,
      title: n.title,
      excerpt: n.excerpt,
      body: n.body,
    }));
  },
});

export const getNews = query({
  args: { id: v.id("news") },
  handler: async (ctx, { id }) => {
    const session = await getSession(ctx);
    const staff = ["admin", "editor", "manager"].includes(session.role);
    const doc = await ctx.db.get(id);
    if (!doc) return null;
    if (!doc.published && !staff) return null;
    return {
      _id: doc._id,
      category: doc.category,
      date: doc.date,
      published: doc.published,
      title: doc.title,
      excerpt: doc.excerpt,
      body: doc.body,
    };
  },
});

/* ------------------------------ OUTAGES -------------------------------- */

export const listOutages = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("outages").order("desc").take(100);
    return items.map((o) => ({
      _id: o._id,
      district: o.district,
      streets: o.streets,
      reason: o.reason,
      status: o.status,
      startAt: o.startAt,
      restoredAt: o.restoredAt,
      updatedAt: o.updatedAt,
    }));
  },
});

/* ------------------------------ TARIFFS -------------------------------- */

export const listTariffs = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("tariffs").take(100);
    return items
      .filter((t) => t.active)
      .map((t) => ({
        _id: t._id,
        audience: t.audience,
        service: t.service,
        unit: t.unit,
        period: t.period,
        price: t.price,
        docUrl: t.docUrl ?? null,
      }));
  },
});

/* -------------------------------- FAQ ---------------------------------- */

export const listFaq = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("faq").order("asc").take(100);
    return items.map((f) => ({
      _id: f._id,
      question: f.question,
      answer: f.answer,
      order: f.order,
    }));
  },
});

/* ---------------------------- DOCUMENTS -------------------------------- */

export const listDocuments = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("documents").order("desc").take(100);
    return items.map((d) => ({
      _id: d._id,
      category: d.category,
      title: d.title,
      date: d.date,
      fileName: d.fileName ?? null,
    }));
  },
});

/* ------------------------------ APPEALS -------------------------------- */

const appealBase = {
  kind: v.union(v.literal("appeal"), v.literal("accident")),
  category: v.string(),
  name: v.string(),
  phone: v.string(),
  account: v.optional(v.string()),
  address: v.optional(v.string()),
  message: v.string(),
  fileName: v.optional(v.string()),
  lang: v.union(v.literal("ru"), v.literal("kk")),
};

export const createAppeal = mutation({
  args: appealBase,
  handler: async (ctx, args) => {
    const clean = (s: string) => s.trim();
    if (!clean(args.name) || args.name.length > 160) throw new Error("INVALID_NAME");
    if (!/^[+0-9 ()-]{6,20}$/.test(clean(args.phone))) throw new Error("INVALID_PHONE");
    if (args.message.trim().length < 5 || args.message.length > 6000)
      throw new Error("INVALID_MESSAGE");
    if (args.account && !/^\d{8}$/.test(clean(args.account)))
      throw new Error("INVALID_ACCOUNT");

    const session = await getSession(ctx);
    const id = await ctx.db.insert("appeals", {
      kind: args.kind,
      category: args.category,
      status: "new",
      name: clean(args.name),
      phone: clean(args.phone),
      account: args.account ? clean(args.account) : undefined,
      address: args.address?.trim() || undefined,
      message: args.message.trim(),
      fileName: args.fileName || undefined,
      lang: args.lang,
      userId: session.userId ?? undefined,
    });

    // Human-friendly 5-digit display number derived from the doc id.
    const num = (parseInt(id.slice(0, 8), 16) % 90000) + 10000;
    const number = String(num);
    await ctx.db.patch(id, { displayNumber: number });
    return { number, id };
  },
});

/** Appeals belonging to the signed-in subscriber (cabinet). */
export const listMyAppeals = query({
  args: {},
  handler: async (ctx) => {
    const session = await getSession(ctx);
    if (!session.userId) return [];
    const items = await ctx.db
      .query("appeals")
      .withIndex("by_user", (q) => q.eq("userId", session.userId!))
      .order("desc")
      .take(100);
    return items.map((a) => ({
      _id: a._id,
      kind: a.kind,
      category: a.category,
      status: a.status,
      message: a.message,
      address: a.address ?? null,
      response: a.response ?? null,
      displayNumber: a.displayNumber ?? "",
      lang: a.lang,
      _creationTime: a._creationTime,
    }));
  },
});
