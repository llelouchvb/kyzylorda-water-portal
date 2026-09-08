import { getAuthUserId } from "@convex-dev/auth/server";
import { getSession } from "./helpers";
import { mutation, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get the current signed in user. Returns null if the user is not signed in.
 * Usage: const signedInUser = await ctx.runQuery(api.authHelpers.currentUser);
 * THIS FUNCTION IS READ-ONLY. DO NOT MODIFY.
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (user === null) {
      return null;
    }

    return user;
  },
});

/**
 * Use this function internally to get the current user data. Remember to handle the null user case.
 * @param ctx
 * @returns
 */
export const getCurrentUser = async (ctx: QueryCtx) => {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    return null;
  }
  return await ctx.db.get(userId);
};

/**
 * Demo bootstrap: assign a role the first time a user profile is seen.
 *  - anonymous (guest) sessions act as the demo admin so the whole portal
 *    (including the admin panel) can be explored without an inbox;
 *  - the first e-mail user becomes admin, later sign-ups become subscribers.
 * Once assigned, roles are managed from the admin panel (RBAC).
 */
export const ensureRole = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;
    if (user.role) return user.role;

    const existingAdmin = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .take(1);
    const nextRole = user.isAnonymous || existingAdmin.length === 0 ? "admin" : "user";
    await ctx.db.patch(userId, { role: nextRole });
    return nextRole;
  },
});

/** Staff directory (admin panel → Пользователи). */
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const session = await getSession(ctx);
    if (session.role !== "admin") return null;
    const users = await ctx.db.query("users").order("desc").take(100);
    return users.map((u) => ({
      _id: u._id,
      name: u.name ?? "",
      email: u.email ?? "",
      isAnonymous: u.isAnonymous ?? false,
      role: u.role ?? "user",
    }));
  },
});

export const setRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(
      v.literal("admin"),
      v.literal("operator"),
      v.literal("dispatcher"),
      v.literal("editor"),
      v.literal("manager"),
      v.literal("user"),
    ),
  },
  handler: async (ctx, { userId, role }) => {
    const session = await getSession(ctx);
    if (session.role !== "admin") throw new Error("FORBIDDEN");
    await ctx.db.patch(userId, { role });
    return true;
  },
});
