import { APP_DEMO_ACCOUNT } from "@/lib/site";
import type { Doc } from "@/convex/_generated/dataModel";

type UserShape = Pick<Doc<"users">, "_id" | "email" | "isAnonymous"> | null | undefined;

/** FNV-1a 32-bit hash. */
function hashStr(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * In the demo the cabinet links every signed-in user to a deterministic
 * mock account. Anonymous guests all use the showcase account 12345678;
 * e-mail users get a stable 8-digit number derived from their address.
 */
export function demoAccountFor(user: UserShape): string {
  if (!user) return APP_DEMO_ACCOUNT;
  if (user.isAnonymous) return APP_DEMO_ACCOUNT;
  const email = user.email ?? user._id;
  const seed = hashStr(`ksj-${email}`);
  // digits 2–9 keep the number valid for the mock billing engine
  const digits = Array.from({ length: 8 }, (_, i) => {
    if (i === 0) return 2 + (seed % 8);
    return (seed >> ((i * 4) % 28)) % 10;
  });
  const candidate = digits.join("");
  return candidate === APP_DEMO_ACCOUNT ? "87654321" : candidate;
}
