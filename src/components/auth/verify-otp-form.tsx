"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import { useResendOtp } from "@/hooks/useResendOtp";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { useTranslation } from "@/components/providers/translation-provider";

/** sessionStorage key that carries the reset token to /reset-password. */
export const RESET_TOKEN_KEY = "ifundayiti:resetToken";

const OTP_LENGTH = 4;

export function VerifyOtpForm() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const dict = useTranslation();

  const segments = pathname.split("/");
  const currentLocale = segments[1] === "ht" ? "ht" : "en";
  const authT = dict?.Auth || {};

  const email = params.get("email") ?? "";
  const flow = params.get("flow") === "reset" ? "reset" : "verify";

  const [code, setCode] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { resend, resendIn, isCoolingDown } = useResendOtp();

  const submit = React.useCallback(
    async (oneTimeCode: string) => {
      if (!email) {
        toast.error(
          currentLocale === "ht"
            ? "Adrès imèl la manke. Tanpri rekòmanse."
            : "Missing email address. Please restart the process.",
          { id: "verify-otp" },
        );
        return;
      }
      if (oneTimeCode.length !== OTP_LENGTH) {
        toast.error(
          currentLocale === "ht"
            ? `Mete kòd ${OTP_LENGTH} chif la`
            : `Enter the ${OTP_LENGTH}-digit code`,
          { id: "verify-otp" },
        );
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await nextFetch("/auth/verify-email", {
          method: "POST",
          body: { email, oneTimeCode: Number(oneTimeCode) },
        });

        if (!response?.success) {
          toast.error(
            response?.message ||
              (currentLocale === "ht"
                ? "Kòd la pa kòrèk oswa li ekspire"
                : "Invalid or expired code"),
            { id: "verify-otp" },
          );
          setCode("");
          return;
        }

        toast.success(
          response?.message ||
            (currentLocale === "ht"
              ? "Imèl ou verifye avèk siksè"
              : "Email verified successfully"),
          { id: "verify-otp" },
        );

        if (flow === "reset") {
          const data = response.data as
            | string
            | Record<string, string>
            | undefined;
          const token =
            typeof data === "string"
              ? data
              : (data?.resetPasswordToken ??
                data?.resetToken ??
                data?.token ??
                data?.accessToken);

          if (!token) {
            toast.error(
              currentLocale === "ht"
                ? "Kòd reset la pa jwenn. Tanpri eseye ankò."
                : "Could not read reset token. Please try again.",
              { id: "verify-otp" },
            );
            return;
          }
          sessionStorage.setItem(RESET_TOKEN_KEY, token);
          router.push(`/${currentLocale}/reset-password`);
          return;
        }

        router.push(`/${currentLocale}/login`);
      } catch (err) {
        console.error("verify-email error:", err);
        toast.error(
          currentLocale === "ht"
            ? "Erè nan rezo a. Tanpri eseye ankò."
            : "Network error. Please try again.",
          { id: "verify-otp" },
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, flow, router, currentLocale],
  );

  return (
    <div className="flex flex-col gap-6">
      <OtpInput
        value={code}
        onChange={setCode}
        length={OTP_LENGTH}
        disabled={isSubmitting}
        onComplete={(full) => submit(full)}
      />

      <Button
        type="button"
        size="lg"
        className="h-11 w-full rounded-xl bg-forest font-bold text-white shadow-md hover:bg-forest/90"
        disabled={isSubmitting || code.length !== OTP_LENGTH}
        onClick={() => submit(code)}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {currentLocale === "ht" ? "N ap verifye..." : "Verifying…"}
          </>
        ) : flow === "reset" ? (
          authT.VerifyBtn || (currentLocale === "ht" ? "Verifye & Kontinye" : "Verify & continue")
        ) : (
          authT.VerifyBtn || (currentLocale === "ht" ? "Verifye imèl" : "Verify email")
        )}
      </Button>

      <p className="text-center text-xs text-mist">
        {currentLocale === "ht"
          ? "Ou pa resevwa kòd la?"
          : "Didn't get the code?"}{" "}
        <button
          type="button"
          onClick={() => resend(email)}
          disabled={isCoolingDown || !email}
          className="font-bold text-forest hover:underline disabled:cursor-not-allowed disabled:opacity-60 disabled:no-underline"
        >
          {isCoolingDown
            ? `${authT.ResendIn || (currentLocale === "ht" ? "Voye ankò nan" : "Resend in")} ${resendIn}s`
            : authT.ResendCode || (currentLocale === "ht" ? "Voye kòd la ankò" : "Resend code")}
        </button>
      </p>
    </div>
  );
}
