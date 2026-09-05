import type { Metadata } from "next";
import { KeyRound } from "lucide-react";

import { FocusShell } from "@/components/auth/focus-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { getDictionary } from "@/lib/dictionaries";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata(
  "Forgot password",
  "Reset your IFundAyiti password.",
);

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function ForgotPasswordPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const isHt = lang === "ht";
  const authT = dict?.Auth || {};

  return (
    <FocusShell
      lang={lang}
      eyebrow={isHt ? "Chanje modpas" : "Reset password"}
      icon={<KeyRound className="h-6 w-6" />}
      title={
        authT.ForgotPassword ||
        (isHt ? "Ou bliye modpas ou?" : "Forgot your password?")
      }
      subtitle={
        authT.ForgotSubtitle ||
        (isHt
          ? "Mete adrès imèl ou pou nou voye yon kòd verifikasyon pou w ka chanje modpas ou."
          : "Enter the email tied to your account and we'll send you a one-time code to reset it.")
      }
      backHref={`/${lang}/auth/login`}
      backLabel={
        authT.BackToSignIn ||
        (isHt ? "Retounen nan paj koneksyon" : "Back to sign in")
      }
    >
      <ForgotPasswordForm />
    </FocusShell>
  );
}
