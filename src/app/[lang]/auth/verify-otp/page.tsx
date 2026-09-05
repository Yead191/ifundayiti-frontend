import type { Metadata } from "next";
import { Suspense } from "react";
import { MailCheck } from "lucide-react";

import { FocusShell } from "@/components/auth/focus-shell";
import { VerifyOtpForm } from "@/components/auth/verify-otp-form";
import { getDictionary } from "@/lib/dictionaries";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata(
  "Verify your email",
  "Enter the one-time code we sent to your email.",
);

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ email?: string; flow?: string }>;
}

/** Masks an email like j••••@domain.com for privacy in the UI. */
function maskEmail(email?: string) {
  if (!email || !email.includes("@")) return "your email";
  const [name, domain] = email.split("@");
  const shown = name.slice(0, 1);
  return `${shown}${"•".repeat(Math.max(name.length - 1, 3))}@${domain}`;
}

export default async function VerifyOtpPage({
  params,
  searchParams,
}: PageProps) {
  const { lang } = await params;
  const { email, flow } = await searchParams;
  const dict = await getDictionary(lang);
  const isHt = lang === "ht";
  const authT = dict?.Auth || {};
  const isReset = flow === "reset";

  return (
    <FocusShell
      lang={lang}
      eyebrow={
        isReset
          ? isHt
            ? "Chanje modpas"
            : "Reset password"
          : isHt
            ? "Verifye imèl"
            : "Verify email"
      }
      icon={<MailCheck className="h-6 w-6" />}
      title={
        authT.VerifyTitle ||
        (isHt ? "Mete kòd verifikasyon an" : "Enter your code")
      }
      subtitle={
        isHt ? (
          <>
            Nou voye yon kòd nan{" "}
            <span className="font-semibold text-forest-deep">
              {maskEmail(email)}
            </span>
            . Mete l anba a pou w ka kontinye.
          </>
        ) : (
          <>
            We sent a one-time code to{" "}
            <span className="font-semibold text-forest-deep">
              {maskEmail(email)}
            </span>
            . Enter it below to continue.
          </>
        )
      }
      backHref={
        isReset ? `/${lang}/auth/forgot-password` : `/${lang}/auth/login`
      }
      backLabel={
        isReset
          ? isHt
            ? "Itilize yon lòt imèl"
            : "Use a different email"
          : authT.BackToSignIn ||
            (isHt ? "Retounen nan paj koneksyon" : "Back to sign in")
      }
    >
      <Suspense fallback={null}>
        <VerifyOtpForm />
      </Suspense>
    </FocusShell>
  );
}
