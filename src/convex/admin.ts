import { v } from "convex/values";
import { canManage, getSession, isStaffRole, logAudit } from "./helpers";
import { mutation, query } from "./_generated/server";

const bi = v.object({ ru: v.string(), kk: v.string() });


/* ------------------------------ NEWS (staff) --------------------------- */

export const newsSave = mutation({
  args: {
    id: v.optional(v.id("news")),
    category: v.union(
      v.literal("news"),
      v.literal("announcement"),
      v.literal("outage"),
      v.literal("repair"),
      v.literal("tariffs"),
    ),
    date: v.number(),
    published: v.boolean(),
    title: bi,
    excerpt: bi,
    body: bi,
  },
  handler: async (ctx, args) => {
    const session = await getSession(ctx);
    if (!canManage("news", session.role)) throw new Error("FORBIDDEN");
    const { id, ...data } = args;
    if (id) {
      await ctx.db.patch(id, { ...data });
      await logAudit(ctx, { session, action: "update", resource: "news", details: id });
      return id;
    }
    const created = await ctx.db.insert("news", { ...data });
    await logAudit(ctx, { session, action: "create", resource: "news", details: created });
    return created;
  },
});

export const newsDelete = mutation({
  args: { id: v.id("news") },
  handler: async (ctx, { id }) => {
    const session = await getSession(ctx);
    if (!canManage("news", session.role)) throw new Error("FORBIDDEN");
    await ctx.db.delete(id);
    await logAudit(ctx, { session, action: "delete", resource: "news", details: id });
  },
});

/* ---------------------------- OUTAGES (staff) -------------------------- */

export const outageSave = mutation({
  args: {
    id: v.optional(v.id("outages")),
    district: bi,
    streets: bi,
    reason: bi,
    status: v.union(v.literal("planned"), v.literal("active"), v.literal("restored")),
    startAt: v.number(),
    restoredAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const session = await getSession(ctx);
    if (!canManage("outages", session.role)) throw new Error("FORBIDDEN");
    const { id, ...data } = args;
    const payload = { ...data, updatedAt: Date.now() };
    if (id) {
      await ctx.db.patch(id, payload);
      await logAudit(ctx, { session, action: "update", resource: "outages", details: id });
      return id;
    }
    const created = await ctx.db.insert("outages", payload);
    await logAudit(ctx, { session, action: "create", resource: "outages", details: created });
    return created;
  },
});

export const outageDelete = mutation({
  args: { id: v.id("outages") },
  handler: async (ctx, { id }) => {
    const session = await getSession(ctx);
    if (!canManage("outages", session.role)) throw new Error("FORBIDDEN");
    await ctx.db.delete(id);
    await logAudit(ctx, { session, action: "delete", resource: "outages", details: id });
  },
});

/* ------------------------------ APPEALS -------------------------------- */

export const listAppeals = query({
  args: { status: v.optional(v.union(v.literal("new"), v.literal("in_progress"), v.literal("done"))) },
  handler: async (ctx, { status }) => {
    const session = await getSession(ctx);
    if (!canManage("appeals", session.role)) return null;
    let items = await ctx.db.query("appeals").order("desc").take(300);
    if (status) items = items.filter((a) => a.status === status);
    return items.map((a) => ({
      _id: a._id,
      kind: a.kind,
      category: a.category,
      status: a.status,
      name: a.name,
      phone: a.phone,
      account: a.account ?? null,
      address: a.address ?? null,
      message: a.message,
      fileName: a.fileName ?? null,
      response: a.response ?? null,
      displayNumber: a.displayNumber ?? "",
      lang: a.lang,
      _creationTime: a._creationTime,
    }));
  },
});

export const appealUpdate = mutation({
  args: {
    id: v.id("appeals"),
    status: v.optional(v.union(v.literal("new"), v.literal("in_progress"), v.literal("done"))),
    response: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, response }) => {
    const session = await getSession(ctx);
    if (!canManage("appeals", session.role)) throw new Error("FORBIDDEN");
    const patch: { status?: "new" | "in_progress" | "done"; response?: string } = {};
    if (status) patch.status = status;
    if (response !== undefined) patch.response = response;
    await ctx.db.patch(id, patch);
    await logAudit(ctx, { session, action: "update", resource: "appeals", details: id });
    return true;
  },
});

/* ------------------------------ TARIFFS -------------------------------- */

export const listTariffsAll = query({
  args: {},
  handler: async (ctx) => {
    const session = await getSession(ctx);
    if (!canManage("tariffs", session.role)) return null;
    const items = await ctx.db.query("tariffs").take(200);
    return items.map((t) => ({
      _id: t._id,
      audience: t.audience,
      service: t.service,
      unit: t.unit,
      period: t.period,
      price: t.price,
      active: t.active,
    }));
  },
});

export const tariffSave = mutation({
  args: {
    id: v.optional(v.id("tariffs")),
    audience: v.union(v.literal("physical"), v.literal("legal")),
    service: bi,
    unit: bi,
    period: bi,
    price: v.number(),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const session = await getSession(ctx);
    if (!canManage("tariffs", session.role)) throw new Error("FORBIDDEN");
    const { id, ...data } = args;
    if (id) {
      await ctx.db.patch(id, data);
      await logAudit(ctx, { session, action: "update", resource: "tariffs", details: id });
      return id;
    }
    const created = await ctx.db.insert("tariffs", data);
    await logAudit(ctx, { session, action: "create", resource: "tariffs", details: created });
    return created;
  },
});

export const tariffDelete = mutation({
  args: { id: v.id("tariffs") },
  handler: async (ctx, { id }) => {
    const session = await getSession(ctx);
    if (!canManage("tariffs", session.role)) throw new Error("FORBIDDEN");
    await ctx.db.delete(id);
    await logAudit(ctx, { session, action: "delete", resource: "tariffs", details: id });
  },
});

/* -------------------------------- FAQ ---------------------------------- */

export const faqSave = mutation({
  args: {
    id: v.optional(v.id("faq")),
    question: bi,
    answer: bi,
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const session = await getSession(ctx);
    if (!canManage("faq", session.role)) throw new Error("FORBIDDEN");
    const { id, ...data } = args;
    if (id) {
      await ctx.db.patch(id, data);
      await logAudit(ctx, { session, action: "update", resource: "faq", details: id });
      return id;
    }
    const created = await ctx.db.insert("faq", data);
    await logAudit(ctx, { session, action: "create", resource: "faq", details: created });
    return created;
  },
});

export const faqDelete = mutation({
  args: { id: v.id("faq") },
  handler: async (ctx, { id }) => {
    const session = await getSession(ctx);
    if (!canManage("faq", session.role)) throw new Error("FORBIDDEN");
    await ctx.db.delete(id);
    await logAudit(ctx, { session, action: "delete", resource: "faq", details: id });
  },
});

/* ------------------------------ OVERVIEW ------------------------------- */

export const overview = query({
  args: {},
  handler: async (ctx) => {
    const session = await getSession(ctx);
    if (!isStaffRole(session.role)) return null;
    const [news, outages, appeals, tariffs, faq, users] = await Promise.all([
      ctx.db.query("news").take(200),
      ctx.db.query("outages").take(200),
      ctx.db.query("appeals").take(300),
      ctx.db.query("tariffs").take(200),
      ctx.db.query("faq").take(200),
      ctx.db.query("users").take(200),
    ]);
    return {
      news: news.length,
      activeOutages: outages.filter((o) => o.status === "active").length,
      newAppeals: appeals.filter((a) => a.status === "new").length,
      tariffs: tariffs.length,
      faq: faq.length,
      users: users.length,
    };
  },
});

export const auditLog = query({
  args: {},
  handler: async (ctx) => {
    const session = await getSession(ctx);
    if (!canManage("audit", session.role)) return null;
    const items = await ctx.db.query("auditLogs").order("desc").take(100);
    return items.map((l) => ({
      _id: l._id,
      action: l.action,
      resource: l.resource,
      details: l.details ?? "",
      actorRole: l.actorRole ?? "",
      ts: l.ts,
    }));
  },
});
