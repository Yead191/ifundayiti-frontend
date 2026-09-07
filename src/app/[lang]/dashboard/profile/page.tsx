import type { Metadata } from "next";

import getProfile from "@/helpers/next-fetch/getProfile";
import { ProfileForms } from "@/features/dashboard/profile-forms";
import { getDictionary } from "@/lib/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: dict?.ProfilePage?.Title || "Profile",
  };
}

export default async function DashboardProfilePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const [user, dict] = await Promise.all([getProfile(), getDictionary(lang)]);
  return <ProfileForms user={user ?? {}} lang={lang} dict={dict} />;
}
