import Link from "next/link";
import {
  ArrowRight,
  Package,
  User,
  ShoppingBag,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import getProfile from "@/helpers/next-fetch/getProfile";
import { Button } from "@/components/ui/button";
import { DashboardPanel } from "@/features/dashboard/ui";

interface PageProps {
  params: Promise<{ lang: string }>;
}

async function countTotal(url: string) {
  const res = await nextFetch(url, {
    method: "GET",
    cache: "no-store",
  });
  return res.success
    ? (res.pagination?.total ??
        (Array.isArray(res.data) ? res.data.length : 0))
    : 0;
}

export default async function DashboardOverviewPage({ params }: PageProps) {
  const { lang } = await params;
  const isHt = lang === "ht";
  const user = await getProfile();

  const ordersCount = await countTotal("/order?page=1&limit=1");

  const cards = [
    {
      label: isHt ? "Kòmand Mwen Yo" : "My Orders",
      description: isHt
        ? "Swiv livrezon ak tout resi acha ou yo"
        : "Track shipments and purchase receipts",
      value: ordersCount,
      href: `/${lang}/dashboard/orders`,
      icon: Package,
      highlight: true,
    },
    {
      label: isHt ? "Boutik la" : "Mission Shop",
      description: isHt
        ? "Achte atik pou sipòte kreyatè ayisyen yo"
        : "Explore apparel supporting local entrepreneurs",
      value: "Shop",
      href: `/${lang}/shop`,
      icon: ShoppingBag,
    },
    {
      label: isHt ? "Pwofil Kont" : "Account Profile",
      description: isHt
        ? "Mete enfòmasyon pèsonèl ou yo ajou"
        : "Update your contact and sign-in details",
      value: isHt ? "Profil" : "Profile",
      href: `/${lang}/dashboard/profile`,
      icon: User,
    },
    {
      label: isHt ? "Sibvansyon" : "Grant Programs",
      description: isHt
        ? "Gade enpak ak aplikasyon sibvansyon yo"
        : "View active cycles and track applications",
      value: isHt ? "Sibvansyon" : "Grants",
      href: `/${lang}/grants`,
      icon: HeartHandshake,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <DashboardPanel
        title={isHt ? "Apèsi sou Kont la" : "Account overview"}
        description={
          isHt
            ? "Yon koudèy sou aktivite w sou IFundAyiti."
            : "A quick look at your IFundAyiti activity."
        }
        actions={
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
            <Link href={`/${lang}/dashboard/profile`}>
              <User className="mr-1.5 h-3.5 w-3.5" />
              {isHt ? "Modifye Profil" : "Edit profile"}
            </Link>
          </Button>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, description, value, href, icon: Icon, highlight }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl border border-hairline/80 bg-panel/75 p-4.5 transition-all duration-200 hover:border-forest/40 hover:bg-panel hover:shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest/10 text-forest">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <ArrowRight className="h-4 w-4 text-mist transition-transform group-hover:translate-x-0.5 group-hover:text-forest" />
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-cloud">
                {value}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-cloud">{label}</p>
              <p className="mt-1 text-[11px] text-mist leading-relaxed line-clamp-2">
                {description}
              </p>
            </Link>
          ))}
        </div>
      </DashboardPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Card */}
        <DashboardPanel
          title={isHt ? "Pwofil" : "Profile"}
          description={
            isHt
              ? "Enfòmasyon kont ki konekte a."
              : "Signed-in account details."
          }
        >
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-hairline pb-3">
              <dt className="text-mist">{isHt ? "Non" : "Name"}</dt>
              <dd className="font-semibold text-cloud">{user?.name || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-hairline pb-3">
              <dt className="text-mist">{isHt ? "Imèl" : "Email"}</dt>
              <dd className="font-semibold text-cloud">{user?.email || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-hairline pb-3">
              <dt className="text-mist">{isHt ? "Wòl" : "Role"}</dt>
              <dd className="font-semibold text-forest uppercase text-xs tracking-wider">
                {user?.role || "MEMBER"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mist">{isHt ? "Nimewo Kontak" : "Contact Number"}</dt>
              <dd className="font-semibold text-cloud">
                {user?.phone || user?.vendorProfile?.contactNo || "—"}
              </dd>
            </div>
          </dl>
        </DashboardPanel>

        {/* Mission & Support Card */}
        <DashboardPanel
          title={isHt ? "Enpak ak Kòmand" : "Orders & Mission Impact"}
          description={
            isHt
              ? "Tout acha ou fè yo finanse mikwo-sibvansyon an Ayiti."
              : "Every purchase directly fuels equity-free micro-grants for Haitian builders."
          }
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-forest/20 bg-forest/5 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-forest uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4 text-forest" />
                <span>{isHt ? "Pwoteksyon Peman Stripe" : "Stripe Secured Payments"}</span>
              </div>
              <p className="mt-1.5 text-xs text-mist leading-relaxed">
                {isHt
                  ? "Tout kòmand ou yo trete an sekirite epi pwoteje ak chifreman nivo labank."
                  : "All your store orders are processed securely and protected with bank-level encryption."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Button asChild className="rounded-xl bg-forest hover:bg-forest-bright text-xs font-semibold text-white shadow-xs flex-1">
                <Link href={`/${lang}/dashboard/orders`}>
                  <Package className="mr-1.5 h-3.5 w-3.5" />
                  {isHt ? "Gade Kòmand Mwen Yo" : "View My Orders"}
                </Link>
              </Button>

              <Button asChild variant="outline" className="rounded-xl text-xs flex-1">
                <Link href={`/${lang}/shop`}>
                  <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                  {isHt ? "Vizite Boutik la" : "Browse Shop"}
                </Link>
              </Button>
            </div>
          </div>
        </DashboardPanel>
      </div>
    </div>
  );
}
