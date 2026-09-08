import "@vly-ai/integrations";
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { I18nProvider } from "@/lib/i18n";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Lazy load route components for better code splitting
const SiteLayout = lazy(() => import("./components/portal/SiteLayout.tsx"));
const Home = lazy(() => import("./pages/Home.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Consumers = lazy(() => import("./pages/Consumers.tsx"));
const ServicesHub = lazy(() => import("./pages/services/ServicesHub.tsx"));
const Readings = lazy(() => import("./pages/services/Readings.tsx"));
const Balance = lazy(() => import("./pages/services/Balance.tsx"));
const Payment = lazy(() => import("./pages/services/Payment.tsx"));
const Emergency = lazy(() => import("./pages/services/Emergency.tsx"));
const Appeal = lazy(() => import("./pages/services/Appeal.tsx"));
const News = lazy(() => import("./pages/News.tsx"));
const NewsDetail = lazy(() => import("./pages/NewsDetail.tsx"));
const Outages = lazy(() => import("./pages/Outages.tsx"));
const Tariffs = lazy(() => import("./pages/Tariffs.tsx"));
const Faq = lazy(() => import("./pages/Faq.tsx"));
const Documents = lazy(() => import("./pages/Documents.tsx"));
const MapPage = lazy(() => import("./pages/MapPage.tsx"));
const Contacts = lazy(() => import("./pages/Contacts.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Cabinet = lazy(() => import("./pages/Cabinet.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in WebContainer environment). */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[WebContainer preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground/80 max-h-40 overflow-auto rounded border border-border/60 p-2">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <I18nProvider>
        <ConvexAuthProvider client={convex}>
          <BrowserRouter>
            <RouteSyncer />
            <Suspense fallback={<RouteLoading />}>
              <Routes>
                {/* public portal pages */}
                <Route element={<SiteLayout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="consumers" element={<Consumers />} />
                  <Route path="services" element={<ServicesHub />} />
                  <Route path="services/readings" element={<Readings />} />
                  <Route path="services/balance" element={<Balance />} />
                  <Route path="services/payment" element={<Payment />} />
                  <Route path="services/emergency" element={<Emergency />} />
                  <Route path="appeal" element={<Appeal />} />
                  <Route path="news" element={<News />} />
                  <Route path="news/:id" element={<NewsDetail />} />
                  <Route path="outages" element={<Outages />} />
                  <Route path="tariffs" element={<Tariffs />} />
                  <Route path="faq" element={<Faq />} />
                  <Route path="documents" element={<Documents />} />
                  <Route path="map" element={<MapPage />} />
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* auth */}
                <Route
                  path="/auth"
                  element={<AuthPage redirectAfterAuth="/cabinet" />}
                />

                {/* protected product area */}
                <Route
                  path="/cabinet"
                  element={
                    <RequireAuth>
                      <Cabinet />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/cabinet/:section"
                  element={
                    <RequireAuth>
                      <Cabinet />
                    </RequireAuth>
                  }
                />

                {/* admin panel */}
                <Route
                  path="/admin"
                  element={
                    <RequireAuth>
                      <Admin />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/admin/:section"
                  element={
                    <RequireAuth>
                      <Admin />
                    </RequireAuth>
                  }
                />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Toaster />
        </ConvexAuthProvider>
      </I18nProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
