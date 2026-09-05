import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

import { FocusShell } from "@/components/auth/focus-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { getDictionary } from "@/lib/dictionaries";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata(
  "Reset password",
  "Choose a new password for your IFundAyiti account.",
);

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function ResetPasswordPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const isHt = lang === "ht";
  const authT = dict?.Auth || {};

  return (
    <FocusShell
      lang={lang}
      eyebrow={isHt ? "Prèske fini" : "Almost done"}
      icon={<ShieldCheck className="h-6 w-6" />}
      title={authT.ResetTitle || (isHt ? "Kreye yon nouvo modpas" : "Set a new password")}
      subtitle={
        authT.ResetSubtitle ||
        (isHt
          ? "Chwazi yon bon modpas ki gen omwen 8 karaktè pou w ka konekte."
          : "Choose a strong password with at least 8 characters. You'll use it to sign in from now on.")
      }
      backHref={`/${lang}/login`}
      backLabel={authT.BackToSignIn || (isHt ? "Retounen nan paj koneksyon" : "Back to sign in")}
    >
      <ResetPasswordForm />
    </FocusShell>
  );
}
