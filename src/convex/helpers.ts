import { getAuthUserId } from "@convex-dev/auth/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";

/** Resources that can be gated with staff permissions. */
export type StaffResource =
  | "news"
  | "outages"
  | "appeals"
  | "tariffs"
  | "faq"
  | "users"
  | "audit";

const DEFAULT_ROLE = "user";

/** Roles allowed to manage each resource (RBAC matrix). */
const PERMISSIONS: Record<StaffResource, readonly string[]> = {
  news: ["admin", "editor", "manager"],
  outages: ["admin", "dispatcher", "manager"],
  appeals: ["admin", "operator", "dispatcher", "manager"],
  tariffs: ["admin", "manager"],
  faq: ["admin", "editor"],
  users: ["admin"],
  audit: ["admin"],
};

export function isStaffRole(role: string | null | undefined): boolean {
  return role !== undefined && role !== null && role !== DEFAULT_ROLE;
}

/** Backend authorization check — throws when the caller lacks rights. */
export function canManage(
  resource: StaffResource,
  role: string | null | undefined,
): boolean {
  if (!role) return false;
  return PERMISSIONS[resource].includes(role);
}

export interface Session {
  userId: string | null;
  role: string;
  isAuthenticated: boolean;
}

/** Current session identity + effective role (defaults to "user"). */
export async function getSession(ctx: QueryCtx | MutationCtx): Promise<Session> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) return { userId: null, role: DEFAULT_ROLE, isAuthenticated: false };
  const user = await ctx.db.get(userId);
  return {
    userId,
    role: user?.role ?? DEFAULT_ROLE,
    isAuthenticated: true,
  };
}

/** Audit log entry for sensitive mutations (admin/content changes). */
export async function logAudit(
  ctx: MutationCtx,
  entry: {
    session: Session;
    action: string;
    resource: string;
    details?: string;
  },
): Promise<void> {
  await ctx.db.insert("auditLogs", {
    actorId: entry.session.userId ?? undefined,
    actorRole: entry.session.role,
    action: entry.action,
    resource: entry.resource,
    details: entry.details,
    ts: Date.now(),
  });
}
