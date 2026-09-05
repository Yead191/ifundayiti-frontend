import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ lang: string; role: string }>;
}

export function generateStaticParams() {
  return [
    { lang: "en", role: "member" },
    { lang: "en", role: "expert" },
    { lang: "ht", role: "member" },
    { lang: "ht", role: "expert" },
  ];
}

export default async function RegisterRolePage({ params }: PageProps) {
  const { lang } = await params;
  redirect(`/${lang}/join`);
}

