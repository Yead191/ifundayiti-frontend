import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
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
    title: isHt ? "Kreye Kont ou" : "Create an Account",
    description: isHt
      ? "Kreye yon kont sou IFundAyiti pou w ka postile pou mikwo-sibvansyon, sipòte pwojè yo, epi patisipe nan kominote a."
      : "Join IFundAyiti to apply for micro-grants, support grassroots projects, and connect with Haitian pioneers.",
    path: `/${lang}/auth/join`,
    keywords: [
      "IFundAyiti register",
      "create account",
      "micro-grants Haiti",
      "join IFundAyiti",
      "Haitian entrepreneurs",
    ],
  });
}

export default async function JoinPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const isHt = lang === "ht";
  const authT = dict?.Auth || {};

  return (
    <AuthShell
      lang={lang}
      title={
        authT.JoinTitle || (isHt ? "Antre nan IFundAyiti" : "Join IFundAyiti")
      }
      subtitle={
        authT.JoinSubtitle ||
        (isHt
          ? "Kreye kont ou pou postile pou mikwo-sibvansyon, sipòte pwojè yo, epi patisipe nan kominote a."
          : "Create your account to apply for micro-grants, support projects, and engage with the community.")
      }
      panelEyebrow={
        isHt ? "IFundAyiti Òganizasyon San Pwofi" : "IFundAyiti Nonprofit"
      }
      panelTitle={
        isHt
          ? "Sibvansyon ki fè lide ayisyen yo vin reyalite dirab."
          : "Grants that turn Haitian ideas into lasting impact."
      }
      panelPoints={
        isHt
          ? [
              "Mikwo-sibvansyon transparan jiska $1,000 pou lidè lokal yo",
              "Swivi aplikasyon an dirèk ak rapò pwojè verifye",
              "Yon rezo mondyal ki ini Ayiti ak dyaspora a",
            ]
          : [
              "Transparent, equity-free micro-grants up to $1,000",
              "Direct application tracking and verified progress reports",
              "A global network uniting Haiti and the diaspora",
            ]
      }
    >
      <Suspense fallback={null}>
        <RegisterForm lang={lang} dict={dict} />
      </Suspense>
    </AuthShell>
  );
}
