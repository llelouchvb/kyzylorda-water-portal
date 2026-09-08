import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Droplets,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
  Siren,
  UserRound,
  Waves,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { PHONES, telHref } from "@/lib/site";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LangSwitch } from "@/components/portal/LangSwitch";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/cabinet",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
    } catch {
      setError(t("auth.sendFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      navigate(redirect, { replace: true });
    } catch {
      setError(t("auth.wrongCode"));
      setOtp("");
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      navigate(redirect, { replace: true });
    } catch {
      setError(t("auth.sendFailed"));
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (step === "signIn") return;
    setIsLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("email", step.email);
      await signIn("email-otp", fd);
    } catch {
      setError(t("auth.sendFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      {/* decorative water */}
      <div className="water-radial pointer-events-none absolute inset-0 opacity-80" aria-hidden />
      <div className="water-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />

      {/* top bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Droplets className="size-4" />
          </span>
          <span className="leading-none">
            <span className="block text-[13px] font-extrabold tracking-tight">{t("brand.short")}</span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/70">
              {t("brand.subname")}
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <LangSwitch />
          <Button asChild variant="ghost" size="sm" className="hidden gap-1.5 text-muted-foreground sm:inline-flex">
            <Link to="/">
              <ArrowLeft className="size-4" />
              {t("nav.home")}
            </Link>
          </Button>
        </div>
      </header>

      {/* content */}
      <main className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-4 pb-12 sm:px-6 lg:grid-cols-[1fr_420px] lg:gap-16">
        {/* brand panel */}
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="hidden lg:block"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-white/70 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary backdrop-blur">
            <Waves className="size-3.5" />
            {t("brand.name")}
          </span>
          <h1 className="mt-6 max-w-lg text-balance text-5xl font-extrabold leading-[1.05] tracking-tight">
            {t("hero.title1")}{" "}
            <span className="text-primary">{t("hero.title2")}</span>
          </h1>
          <p className="mt-5 max-w-md text-pretty text-base leading-7 text-muted-foreground">
            {t("hero.subtitle")}
          </p>

          <ul className="mt-8 space-y-3 text-sm font-semibold text-foreground/80">
            <li className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-white text-primary ring-1 ring-sky-100">
                <Mail className="size-4" />
              </span>
              {t("cabinet.title")} — {t("cabinet.nav.main")}
            </li>
            <li className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-white text-primary ring-1 ring-sky-100">
                <Siren className="size-4" />
              </span>
              {t("header.emergency24")}: {PHONES.emergencyPretty}
            </li>
            <li className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-white text-primary ring-1 ring-sky-100">
                <ShieldCheck className="size-4" />
              </span>
              {t("auth.secured")}
            </li>
          </ul>
        </motion.div>

        {/* auth card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <Card className="border-border/80 bg-white/90 shadow-[0_30px_80px_-40px_rgba(11,79,156,0.45)] backdrop-blur">
            {step === "signIn" ? (
              <>
                <CardHeader className="text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-100 text-primary">
                    <UserRound className="size-6" />
                  </div>
                  <CardTitle className="mt-4 text-2xl tracking-tight">{t("auth.title")}</CardTitle>
                  <CardDescription>{t("auth.subtitle")}</CardDescription>
                </CardHeader>
                <form onSubmit={handleEmailSubmit}>
                  <CardContent>
                    <div className="space-y-1.5">
                      <label htmlFor="auth-email" className="text-sm font-bold">
                        {t("auth.email")}
                      </label>
                      <Input
                        id="auth-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        className="h-11"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    {error ? (
                      <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                        {error}
                      </p>
                    ) : null}
                    <Button type="submit" size="lg" className="mt-4 w-full gap-2" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <>
                          {t("auth.continue")}
                          <ArrowRight className="size-4" />
                        </>
                      )}
                    </Button>

                    <div className="my-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <span className="h-px flex-1 bg-border" />
                      {t("auth.or")}
                      <span className="h-px flex-1 bg-border" />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="w-full gap-2 border-border bg-card"
                      onClick={handleGuestLogin}
                      disabled={isLoading}
                    >
                      <KeyRound className="size-4 text-primary" />
                      {t("auth.guest")}
                    </Button>
                    <p className="mt-3 text-center text-[11px] leading-4 text-muted-foreground">
                      {t("auth.guestHint")} {t("auth.guestNote")}
                    </p>
                  </CardContent>
                </form>
              </>
            ) : (
              <>
                <CardHeader className="text-center">
                  <CardTitle className="mt-4 text-2xl tracking-tight">{t("auth.checkEmail")}</CardTitle>
                  <CardDescription>
                    {t("auth.checkEmailDesc", { email: step.email })}
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleOtpSubmit}>
                  <CardContent>
                    <input type="hidden" name="email" value={step.email} />
                    <input type="hidden" name="code" value={otp} />
                    <div className="flex justify-center">
                      <InputOTP
                        value={otp}
                        onChange={setOtp}
                        maxLength={6}
                        disabled={isLoading}
                      >
                        <InputOTPGroup>
                          {Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPSlot key={index} index={index} />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    {error ? (
                      <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center text-xs font-semibold text-red-700">
                        {error}
                      </p>
                    ) : null}
                    <Button
                      type="submit"
                      size="lg"
                      className="mt-5 w-full"
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? <Loader2 className="size-4 animate-spin" /> : t("auth.verify")}
                    </Button>
                  </CardContent>
                  <CardFooter className="flex-col gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full text-muted-foreground"
                      onClick={handleResend}
                      disabled={isLoading}
                    >
                      {t("auth.resend")}
                    </Button>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-muted-foreground"
                      onClick={() => setStep("signIn")}
                      disabled={isLoading}
                    >
                      {t("common.back")}
                    </Button>
                  </CardFooter>
                </form>
              </>
            )}

            <div className="border-t bg-muted/40 px-6 py-3 text-center text-[11px] text-muted-foreground">
              {t("brand.name")} ·{" "}
              <a href={telHref(PHONES.callCenter)} className="font-bold hover:text-primary">
                {PHONES.callCenterPretty}
              </a>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense fallback={null}>
      <Auth {...props} />
    </Suspense>
  );
}
