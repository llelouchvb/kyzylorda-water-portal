import { useConvexAuth } from "convex/react";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { api } from "@/convex/_generated/api";
import { AssistantFab } from "@/components/portal/AssistantFab";
import { MobileBottomNav } from "@/components/portal/MobileBottomNav";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { SiteHeader } from "@/components/portal/SiteHeader";

export function SiteLayout() {
  const { pathname } = useLocation();
  const ensureSeeded = useMutation(api.seed.ensureSeeded);
  const ensureRole = useMutation(api.users.ensureRole);
  const { isAuthenticated } = useConvexAuth();

  // Seed demo content once (idempotent server-side).
  useEffect(() => {
    void ensureSeeded();
  }, [ensureSeeded]);

  // Bootstrap the demo RBAC role after the first login.
  useEffect(() => {
    if (isAuthenticated) {
      void ensureRole();
    }
  }, [isAuthenticated, ensureRole]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      {/* spacer so the fixed bottom nav never covers content */}
      <div className="h-16 md:hidden" aria-hidden />
      <MobileBottomNav />
      <AssistantFab />
    </div>
  );
}

export default SiteLayout;

