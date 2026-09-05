"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";

import { loginSchema, type LoginValues } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton, AuthDivider } from "@/components/auth/google-button";
import { FieldError } from "@/components/auth/field-error";
import { useResendOtp } from "@/hooks/useResendOtp";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { useTranslation } from "@/components/providers/translation-provider";

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dict = useTranslation();

  const segments = pathname.split("/");
  const currentLocale = segments[1] === "ht" ? "ht" : "en";
  const t = dict?.Auth || {};

  // Return the user to where they came from, else home.
  const rawRedirect = searchParams.get("redirect");
  const redirectTo = rawRedirect
    ? rawRedirect.startsWith("http")
      ? rawRedirect
      : rawRedirect.startsWith(`/${currentLocale}`)
        ? rawRedirect
        : `/${currentLocale}${rawRedirect.startsWith("/") ? rawRedirect : `/${rawRedirect}`}`
    : `/${currentLocale}`;

  const { resend } = useResendOtp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (values: LoginValues) => {
    const { email, password } = values;

    try {
      const response = await nextFetch("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      // Unverified account → send a fresh code and route to verification.
      if (
        !response?.success &&
        response.message ===
          "Account is not verified. Please check your email for verification code."
      ) {
        await resend(email);
        router.push(
          `/${currentLocale}/verify-otp?email=${encodeURIComponent(email)}&flow=verify`,
        );
        return;
      }

      if (response?.success) {
        Cookies.set("accessToken", response?.data?.createToken);
        Cookies.set("role", response?.data?.role);
        toast.success(
          response?.message ||
            (currentLocale === "ht" ? "Byenveni ankò!" : "Welcome back!"),
        );
        router.replace(redirectTo);
        return;
      }

      if (response?.error && Array.isArray(response.error)) {
        response.error.forEach((err: { message: string }) => {
          toast.error(err.message, { id: "login" });
        });
      } else {
        toast.error(
          response?.message ||
            (currentLocale === "ht"
              ? "Imèl oswa modpas la pa kòrèk."
              : "Something went wrong!"),
          { id: "login" },
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(
        currentLocale === "ht"
          ? "Erè nan rezo a. Tanpri eseye ankò."
          : "Network error. Please try again.",
        { id: "login" },
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <GoogleButton
        label={
          currentLocale === "ht"
            ? "Kontinye avèk Google"
            : "Continue with Google"
        }
      />
      <AuthDivider
        label={
          t.OrContinueWith ||
          (currentLocale === "ht"
            ? "oswa kontinye ak imèl"
            : "or sign in with email")
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5 text-left">
          <Label htmlFor="email" className="text-xs font-bold text-forest-deep">
            {t.Email || "Email address"}
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t.EmailPlaceholder || "you@example.com"}
            aria-invalid={!!errors.email}
            className="h-11 rounded-xl border-hairline bg-white/90 px-3.5 text-sm shadow-2xs focus-visible:ring-forest/20"
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-xs font-bold text-forest-deep"
            >
              {t.Password || "Password"}
            </Label>
            <Link
              href={`/${currentLocale}/auth/forgot-password`}
              className="text-xs font-bold text-forest hover:underline"
            >
              {t.ForgotPassword || "Forgot password?"}
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              className="h-11 rounded-xl border-hairline bg-white/90 pr-10 pl-3.5 text-sm shadow-2xs focus-visible:ring-forest/20"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mist hover:text-forest-deep"
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
          <FieldError message={errors.password?.message} />
        </div>

        <label className="flex cursor-pointer select-none items-center gap-2.5 text-xs text-mist pt-0.5">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-hairline accent-forest"
            {...register("remember")}
          />
          {t.RememberMe || "Keep me signed in"}
        </label>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="mt-2 h-11 w-full rounded-xl bg-forest font-bold text-white shadow-md hover:bg-forest/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {currentLocale === "ht" ? "N ap konekte..." : "Signing in…"}
            </>
          ) : (
            t.SignIn || "Sign in"
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-mist">
        {t.DontHaveAccount ||
          (currentLocale === "ht"
            ? "Ou pa gen yon kont?"
            : "Don't have an account?")}{" "}
        <Link
          href={`/${currentLocale}/auth/join`}
          className="font-bold text-forest hover:underline"
        >
          {t.SignUp ||
            (currentLocale === "ht" ? "Kreye yon kont" : "Create an account")}
        </Link>
      </p>
    </div>
  );
}
