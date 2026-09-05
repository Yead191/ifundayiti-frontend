"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { registerSchema, type RegisterValues } from "@/lib/validators";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton, AuthDivider } from "@/components/auth/google-button";
import { FieldError } from "@/components/auth/field-error";
import { useResendOtp } from "@/hooks/useResendOtp";

interface RegisterFormProps {
  lang?: string;
  dict?: any;
}

export function RegisterForm({ lang = "en", dict }: RegisterFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const router = useRouter();
  const { resend } = useResendOtp();

  const t = dict?.Auth || {};

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  async function onSubmit(values: RegisterValues) {
    try {
      const body: Record<string, string> = {
        name: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      };
      if (values.phone?.trim()) {
        body.phone = values.phone.trim();
      }

      const response = await nextFetch("/auth/register", {
        method: "POST",
        body,
      });

      if (
        !response?.success &&
        response.message ===
          "Account is not verified. Please check your email for verification code."
      ) {
        await resend(values.email);
        router.push(
          `/${lang}/verify-otp?email=${encodeURIComponent(values.email)}&flow=verify`,
        );
        return;
      }

      if (response?.success) {
        toast.success(
          response?.message ||
            (lang === "ht"
              ? "Kont ou kreye avèk siksè — verifye imèl ou pou kontinye."
              : "Account created — verify your email to continue."),
        );
        router.push(
          `/${lang}/auth/verify-otp?email=${encodeURIComponent(values.email)}&flow=verify`,
        );
        return;
      }

      if (response?.error && Array.isArray(response.error)) {
        response.error.forEach((err: { message: string }) => {
          toast.error(err.message, { id: "register" });
        });
      } else {
        toast.error(
          response?.message ||
            (lang === "ht"
              ? "Enskripsyon an pa reyisi. Tanpri eseye ankò."
              : "Registration failed. Please try again."),
          { id: "register" },
        );
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(
        lang === "ht"
          ? "Erè nan rezo a. Tanpri eseye ankò."
          : "Network error. Please try again.",
        { id: "register" },
      );
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <GoogleButton
        label={lang === "ht" ? "Kontinye avèk Google" : "Continue with Google"}
      />
      <AuthDivider
        label={
          t.OrContinueWith ||
          (lang === "ht" ? "oswa kontinye ak imèl" : "or continue with email")
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5 text-left">
          <Label
            htmlFor="fullName"
            className="text-xs font-bold text-forest-deep"
          >
            {t.FullName || "Full Name"} *
          </Label>
          <Input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder={t.FullNamePlaceholder || "Jean-Luc Baptiste"}
            aria-invalid={!!errors.fullName}
            className="h-11 rounded-xl border-hairline bg-white/90 px-3.5 text-sm shadow-2xs focus-visible:ring-forest/20"
            {...register("fullName")}
          />
          <FieldError message={errors.fullName?.message} />
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1.5 text-left">
          <Label htmlFor="email" className="text-xs font-bold text-forest-deep">
            {t.Email || "Email address"} *
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

        {/* Phone Number (Optional) */}
        <div className="flex flex-col gap-1.5 text-left">
          <Label htmlFor="phone" className="text-xs font-bold text-forest-deep">
            {t.Phone || "Phone number (optional)"}
          </Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder={t.PhonePlaceholder || "+1 (518) 509-1804"}
            aria-invalid={!!errors.phone}
            className="h-11 rounded-xl border-hairline bg-white/90 px-3.5 text-sm shadow-2xs focus-visible:ring-forest/20"
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5 text-left">
          <Label
            htmlFor="password"
            className="text-xs font-bold text-forest-deep"
          >
            {t.Password || "Password"} *
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              className="h-11 rounded-xl border-hairline bg-white/90 pr-10 pl-3.5 text-sm shadow-2xs focus-visible:ring-forest/20"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mist hover:text-forest-deep"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <FieldError message={errors.password?.message} />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5 text-left">
          <Label
            htmlFor="confirmPassword"
            className="text-xs font-bold text-forest-deep"
          >
            {t.ConfirmPassword ||
              (lang === "ht" ? "Konfime modpas la" : "Confirm password")}{" "}
            *
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!errors.confirmPassword}
              className="h-11 rounded-xl border-hairline bg-white/90 pr-10 pl-3.5 text-sm shadow-2xs focus-visible:ring-forest/20"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mist hover:text-forest-deep"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        <p className="text-[11px] leading-relaxed text-mist pt-1">
          {t.TermsAgree ||
            (lang === "ht"
              ? "Lè w kreye yon kont, ou aksepte Kondisyon ak Règ sou Konfidansyalite IFundAyiti yo."
              : "By creating an account, you agree to IFundAyiti's Terms of Service and Privacy Policy.")}
        </p>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="mt-2 h-11 w-full rounded-xl bg-forest font-bold text-white shadow-md hover:bg-forest/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {lang === "ht" ? "N ap kreye kont lan..." : "Creating account..."}
            </>
          ) : (
            t.CreateAccount || (lang === "ht" ? "Kreye Kont" : "Create Account")
          )}
        </Button>
      </form>

      <div className="text-center text-xs text-mist">
        {t.AlreadyHaveAccount ||
          (lang === "ht"
            ? "Ou gen yon kont deja?"
            : "Already have an account?")}{" "}
        <Link
          href={`/${lang}/auth/login`}
          className="font-bold text-forest hover:underline"
        >
          {t.SignIn || (lang === "ht" ? "Konekte" : "Sign in")}
        </Link>
      </div>
    </div>
  );
}
