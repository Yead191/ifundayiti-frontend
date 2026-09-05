"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/validators";
import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/auth/field-error";
import { RESET_TOKEN_KEY } from "@/components/auth/verify-otp-form";
import { useTranslation } from "@/components/providers/translation-provider";

export function ResetPasswordForm() {
  const router = useRouter();
  const pathname = usePathname();
  const dict = useTranslation();

  const segments = pathname.split("/");
  const currentLocale = segments[1] === "ht" ? "ht" : "en";
  const authT = dict?.Auth || {};

  const [showPassword, setShowPassword] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    const stored = sessionStorage.getItem(RESET_TOKEN_KEY);
    if (!stored) {
      toast.error(
        currentLocale === "ht"
          ? "Sesyon an ekspire. Tanpri rekòmanse."
          : "Your reset session has expired. Please start again.",
        { id: "reset-password" },
      );
      router.replace(`/${currentLocale}/auth/forgot-password`);
      return;
    }
    setToken(stored);
  }, [router, currentLocale]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordValues) {
    if (!token) {
      toast.error(
        currentLocale === "ht"
          ? "Kòd la manke. Tanpri rekòmanse."
          : "Missing reset token. Please start again.",
        { id: "reset-password" },
      );
      router.replace(`/${currentLocale}/forgot-password`);
      return;
    }

    try {
      const response = await nextFetch("/auth/reset-password", {
        method: "POST",
        token,
        body: {
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
      });

      if (response?.success) {
        sessionStorage.removeItem(RESET_TOKEN_KEY);
        toast.success(
          response?.message ||
            (currentLocale === "ht"
              ? "Modpas ou chanje — tanpri konekte."
              : "Password reset — please sign in."),
        );
        router.push(`/${currentLocale}/auth/login`);
        return;
      }

      if (response?.error && Array.isArray(response.error)) {
        response.error.forEach((err: { message: string }) => {
          toast.error(err.message, { id: "reset-password" });
        });
      } else {
        toast.error(
          response?.message ||
            (currentLocale === "ht"
              ? "Nou pa t ka chanje modpas la."
              : "Could not reset password."),
          { id: "reset-password" },
        );
      }
    } catch (err) {
      console.error("reset-password error:", err);
      toast.error(
        currentLocale === "ht"
          ? "Erè nan rezo a. Tanpri eseye ankò."
          : "Network error. Please try again.",
        { id: "reset-password" },
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5 text-left">
        <Label
          htmlFor="newPassword"
          className="text-xs font-bold text-forest-deep"
        >
          {authT.NewPassword || "New password"}
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder={
              currentLocale === "ht"
                ? "Omwen 8 karaktè"
                : "At least 8 characters"
            }
            className="h-11 rounded-xl border-hairline bg-white/90 pr-10 pl-3.5 text-sm shadow-2xs focus-visible:ring-forest/20"
            aria-invalid={!!errors.newPassword}
            {...register("newPassword")}
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
        <FieldError message={errors.newPassword?.message} />
      </div>

      <div className="flex flex-col gap-1.5 text-left">
        <Label
          htmlFor="confirmPassword"
          className="text-xs font-bold text-forest-deep"
        >
          {authT.ConfirmPassword || "Confirm password"}
        </Label>
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder={
            currentLocale === "ht"
              ? "Re-antre modpas ou a"
              : "Re-enter your password"
          }
          aria-invalid={!!errors.confirmPassword}
          className="h-11 rounded-xl border-hairline bg-white/90 px-3.5 text-sm shadow-2xs focus-visible:ring-forest/20"
          {...register("confirmPassword")}
        />
        <FieldError message={errors.confirmPassword?.message} />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting || !token}
        className="mt-2 h-11 w-full rounded-xl bg-forest font-bold text-white shadow-md hover:bg-forest/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {currentLocale === "ht"
              ? "N ap chanje modpas la..."
              : "Updating password…"}
          </>
        ) : (
          authT.ResetPasswordBtn ||
          (currentLocale === "ht" ? "Chanje modpas la" : "Reset password")
        )}
      </Button>
    </form>
  );
}
