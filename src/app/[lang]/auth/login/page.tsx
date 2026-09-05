import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const isHt = lang === "ht";

  return buildMetadata({
    title: isHt ? "Konekte" : "Sign In",
    description: isHt
      ? "Konekte sou kont IFundAyiti ou pou w jwenn aksè nan aplikasyon sibvansyon w ak pwofil ou."
      : "Sign in to your IFundAyiti account to manage your grant applications, projects, and community profile.",
    path: `/${lang}/auth/login`,
    keywords: ["IFundAyiti login", "sign in", "konekte", "Haitian grants"],
    noIndex: true,
  });
}

export default async function LoginPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const isHt = lang === "ht";
  const authT = dict?.Auth || {};

  return (
    <AuthShell
      lang={lang}
      title={authT.WelcomeBack || (isHt ? "Byenveni ankò" : "Welcome back")}
      subtitle={
        authT.WelcomeSubtitle ||
        (isHt
          ? "Konekte pou w jwenn aksè nan aplikasyon sibvansyon w, kòmand ou yo, ak pwofil kominote a."
          : "Sign in to access your grant applications, orders, and community profile.")
      }
      panelEyebrow={
        isHt ? "IFundAyiti Òganizasyon San Pwofi" : "IFundAyiti Nonprofit"
      }
      panelTitle={
        isHt
          ? "Transparans, sipò kominotè, ak sibvansyon dirab."
          : "Transparent micro-grants for Haitian changemakers."
      }
      panelPoints={
        isHt
          ? [
              "Aksè nan panèl kontwòl aplikasyon ak pwojè w yo",
              "Swivi alafwa pou donatè, volontè ak moun k ap postile",
              "Konekte dirèkteman ak kominote lidè ayisyen yo",
            ]
          : [
              "Access your live grant applications & dashboard",
              "Track disbursements, donor contributions & project milestones",
              "Connect with an active ecosystem of Haitian entrepreneurs",
            ]
      }
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
