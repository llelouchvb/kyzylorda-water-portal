import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// ---------------------------------------------------------------------------
// Roles (RBAC): staff roles are granted via the admin panel / demo bootstrap.
// ---------------------------------------------------------------------------
export const ROLES = {
  ADMIN: "admin",
  OPERATOR: "operator",
  DISPATCHER: "dispatcher",
  EDITOR: "editor",
  MANAGER: "manager",
  USER: "user",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.OPERATOR),
  v.literal(ROLES.DISPATCHER),
  v.literal(ROLES.EDITOR),
  v.literal(ROLES.MANAGER),
  v.literal(ROLES.USER),
);
export type Role = Infer<typeof roleValidator>;

/** Bilingual content block — single document, two languages. */
export const biText = v.object({
  ru: v.string(),
  kk: v.string(),
});

export const newsCategoryValidator = v.union(
  v.literal("news"),
  v.literal("announcement"),
  v.literal("outage"),
  v.literal("repair"),
  v.literal("tariffs"),
);

export const outageStatusValidator = v.union(
  v.literal("planned"),
  v.literal("active"),
  v.literal("restored"),
);

export const appealStatusValidator = v.union(
  v.literal("new"),
  v.literal("in_progress"),
  v.literal("done"),
);

export const appealKindValidator = v.union(
  v.literal("appeal"),
  v.literal("accident"),
);

export const audienceValidator = v.union(
  v.literal("physical"),
  v.literal("legal"),
);

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user (RBAC). do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // ------------------ Portal content tables ------------------

    /** News / announcements published on the portal. */
    news: defineTable({
      category: newsCategoryValidator,
      date: v.number(),
      published: v.boolean(),
      title: biText,
      excerpt: biText,
      body: biText,
      image: v.optional(v.string()),
    })
      .index("by_date", ["date"])
      .index("by_category", ["category"]),

    /** Planned / active water shutoffs maintained by the dispatch service. */
    outages: defineTable({
      district: biText,
      streets: biText,
      reason: biText,
      status: outageStatusValidator,
      startAt: v.number(),
      restoredAt: v.optional(v.number()),
      updatedAt: v.number(),
    })
      .index("by_status", ["status"])
      .index("by_start", ["startAt"]),

    /** Subscriber appeals & accident reports. */
    appeals: defineTable({
      kind: appealKindValidator,
      category: v.string(),
      status: appealStatusValidator,
      name: v.string(),
      phone: v.string(),
      account: v.optional(v.string()),
      address: v.optional(v.string()),
      message: v.string(),
      fileName: v.optional(v.string()),
      response: v.optional(v.string()),
      displayNumber: v.optional(v.string()),
      lang: v.union(v.literal("ru"), v.literal("kk")),
      userId: v.optional(v.string()),
    })
      .index("by_status", ["status"])
      .index("by_user", ["userId"]),

    /** Tariff register (physical / legal entities). */
    tariffs: defineTable({
      audience: audienceValidator,
      service: biText,
      unit: biText,
      period: biText,
      price: v.number(),
      docUrl: v.optional(v.string()),
      active: v.boolean(),
    }).index("by_audience", ["audience"]),

    /** FAQ entries used on the public page and by the assistant KB. */
    faq: defineTable({
      question: biText,
      answer: biText,
      order: v.number(),
    }).index("by_order", ["order"]),

    /** Public documents catalogue. */
    documents: defineTable({
      category: v.union(
        v.literal("report"),
        v.literal("normative"),
        v.literal("contract"),
        v.literal("tender"),
        v.literal("form"),
      ),
      title: biText,
      date: v.number(),
      fileName: v.optional(v.string()),
    }).index("by_category", ["category"]),

    /** Lightweight audit trail for staff mutations. */
    auditLogs: defineTable({
      actorId: v.optional(v.string()),
      actorRole: v.optional(v.string()),
      action: v.string(),
      resource: v.string(),
      details: v.optional(v.string()),
      ts: v.number(),
    }).index("by_ts", ["ts"]),

    // tableName: defineTable({
    //   ...
    //   // table fields
    // }).index("by_field", ["field"])
  },
  {
    schemaValidation: false,
  },
);

export default schema;
