"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/lib/validators";
import { useResendOtp } from "@/hooks/useResendOtp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/auth/field-error";
import { useTranslation } from "@/components/providers/translation-provider";

export function ForgotPasswordForm() {
  const router = useRouter();
  const pathname = usePathname();
  const dict = useTranslation();

  const segments = pathname.split("/");
  const currentLocale = segments[1] === "ht" ? "ht" : "en";
  const authT = dict?.Auth || {};

  // useResendOtp posts to /auth/forget-password with { email } and toasts.
  const { resend } = useResendOtp();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordValues) {
    const ok = await resend(values.email);
    if (ok) {
      router.push(
        `/${currentLocale}/verify-otp?email=${encodeURIComponent(values.email)}&flow=reset`,
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5 text-left">
        <Label htmlFor="email" className="text-xs font-bold text-forest-deep">
          {authT.Email || "Email address"}
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={authT.EmailPlaceholder || "you@example.com"}
          aria-invalid={!!errors.email}
          className="h-11 rounded-xl border-hairline bg-white/90 px-3.5 text-sm shadow-2xs focus-visible:ring-forest/20"
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="mt-2 h-11 w-full rounded-xl bg-forest font-bold text-white shadow-md hover:bg-forest/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {currentLocale === "ht" ? "N ap voye kòd la..." : "Sending code…"}
          </>
        ) : (
          authT.SendResetCode || (currentLocale === "ht" ? "Voye kòd verifikasyon" : "Send reset code")
        )}
      </Button>
    </form>
  );
}
