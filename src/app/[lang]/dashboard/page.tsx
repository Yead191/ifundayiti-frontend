import Link from "next/link";
import {
  ArrowRight,
  Package,
  User,
  Heart,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
} from "lucide-react";

import { nextFetch } from "@/helpers/next-fetch/NextFetch";
import getProfile from "@/helpers/next-fetch/getProfile";
import { Button } from "@/components/ui/button";
import { DashboardPanel } from "@/features/dashboard/ui";
import { formatPrice } from "@/lib/utils";

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

  // Fetch real order count
  const ordersCount = await countTotal("/order?page=1&limit=1");

  // Meaningful demo donation info (to be connected to live donation API)
  const demoDonations = [
    {
      id: "DON-84920",
      cause: isHt
        ? "Dlo Pwòp Kominotè · Okap"
        : "Clean Water Community Micro-Grant · Cap-Haïtien",
      amount: 150,
      date: isHt ? "28 Out 2026" : "Aug 28, 2026",
      status: isHt ? "Konfime" : "Completed",
      directImpact: isHt
        ? "Finanse ekipman filtraj dlo pou 120 fanmi"
        : "Funded water filtration equipment for 120 families",
    },
    {
      id: "DON-72109",
      cause: isHt
        ? "Ekleraj Solè Mache Lannwit · Jakmèl"
        : "Solar Powered Night Market · Jacmel",
      amount: 100,
      date: isHt ? "14 Jiyè 2026" : "Jul 14, 2026",
      status: isHt ? "Konfime" : "Completed",
      directImpact: isHt
        ? "Finanse 6 lanp solè pou machann lari"
        : "Funded 6 solar lighting kits for night vendors",
    },
  ];

  const totalDonated = demoDonations.reduce((sum, d) => sum + d.amount, 0);

  const statCards = [
    {
      label: isHt ? "Kòmand Mwen Yo" : "My Orders",
      value: ordersCount,
      sublabel: isHt ? "Acha ak livrezon" : "Store shipments & tracking",
      href: `/${lang}/dashboard/orders`,
      icon: Package,
      badge: isHt ? "Boutik" : "Store",
    },
    {
      label: isHt ? "Total Donasyon" : "Total Donated",
      value: formatPrice(totalDonated),
      sublabel: isHt ? "2 kontribisyon nan fon an" : "2 contributions to Program Fund",
      href: `/${lang}/donate`,
      icon: Heart,
      badge: isHt ? "Enpak" : "Impact",
    },
    {
      label: isHt ? "Sibvansyon Sipòte" : "Grants Supported",
      value: "2",
      sublabel: isHt ? "Antreprenè lokal ki jwenn èd" : "Grassroots Haitian builders backed",
      href: `/${lang}/winners`,
      icon: Sparkles,
      badge: isHt ? "Kominote" : "Community",
    },
    {
      label: isHt ? "Boutik Ofisyèl" : "Mission Store",
      value: isHt ? "Vizite" : "Shop",
      sublabel: isHt ? "100% pwofi finanse pwojè" : "100% proceeds fund micro-grants",
      href: `/${lang}/shop`,
      icon: ShoppingBag,
      badge: isHt ? "Merch" : "Merch",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Stat Cards Row */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, sublabel, href, icon: Icon, badge }) => (
          <Link
            key={href}
            href={href}
            className="group relative overflow-hidden rounded-2xl border border-hairline/80 bg-panel/80 p-4.5 shadow-xs backdrop-blur-md transition-all duration-200 hover:border-forest/40 hover:bg-panel hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest/10 text-forest">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className="rounded-full border border-forest/20 bg-forest/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest">
                {badge}
              </span>
            </div>

            <p className="mt-3 font-display text-2xl font-bold text-cloud">
              {value}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-cloud">{label}</p>
            <p className="mt-1 text-[11px] text-mist leading-relaxed">{sublabel}</p>

            <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-forest group-hover:underline">
              <span>{isHt ? "Gade plis" : "View details"}</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      {/* 2. Main 2-Column Split: Profile & Donations */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Profile Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <DashboardPanel
            title={isHt ? "Pwofil Kont Ou" : "Account Profile"}
            description={
              isHt
                ? "Enfòmasyon pèsonèl ak sekirite kont ou."
                : "Personal details and account security."
            }
            actions={
              <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
                <Link href={`/${lang}/dashboard/profile`}>
                  <User className="mr-1.5 h-3.5 w-3.5" />
                  {isHt ? "Modifye" : "Edit profile"}
                </Link>
              </Button>
            }
          >
            <dl className="space-y-3.5 text-sm">
              <div className="flex justify-between gap-4 border-b border-hairline/60 pb-3">
                <dt className="text-xs text-mist font-medium">{isHt ? "Non Konplè" : "Full Name"}</dt>
                <dd className="font-semibold text-cloud text-xs">{user?.name || "Member"}</dd>
              </div>

              <div className="flex justify-between gap-4 border-b border-hairline/60 pb-3">
                <dt className="text-xs text-mist font-medium">{isHt ? "Adrès Imèl" : "Email Address"}</dt>
                <dd className="font-semibold text-cloud text-xs truncate max-w-[180px]">{user?.email || "—"}</dd>
              </div>

              <div className="flex justify-between gap-4 border-b border-hairline/60 pb-3">
                <dt className="text-xs text-mist font-medium">{isHt ? "Wòl nan Sistèm" : "Account Role"}</dt>
                <dd className="font-bold text-forest text-[11px] uppercase tracking-wider bg-forest/10 px-2 py-0.5 rounded-full border border-forest/20">
                  {user?.role || "MEMBER"}
                </dd>
              </div>

              <div className="flex justify-between gap-4 border-b border-hairline/60 pb-3">
                <dt className="text-xs text-mist font-medium">{isHt ? "Telefòn" : "Phone"}</dt>
                <dd className="font-semibold text-cloud text-xs">
                  {user?.phone || user?.vendorProfile?.contactNo || "—"}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-xs text-mist font-medium">{isHt ? "Sekirite" : "Security"}</dt>
                <dd className="flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{isHt ? "256-Bit SSL Pwoteje" : "256-Bit Protected"}</span>
                </dd>
              </div>
            </dl>

            <div className="mt-5 rounded-2xl border border-forest/20 bg-forest/5 p-3.5 text-xs text-mist">
              <p className="font-semibold text-forest">
                {isHt ? "Kòmand & Livrezon" : "Store Orders"}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed">
                {isHt
                  ? "Ou gen aksè ak tout resi acha ak swivi livrezon an tan reyèl nan seksyon Kòmand la."
                  : "Track package status, courier dispatch, and download receipts in your Orders tab."}
              </p>
              <Button asChild size="sm" className="mt-3 w-full rounded-xl bg-forest hover:bg-forest-bright text-xs font-bold text-white shadow-xs">
                <Link href={`/${lang}/dashboard/orders`}>
                  <Package className="mr-1.5 h-3.5 w-3.5" />
                  {isHt ? "Gade Tout Kòmand Yo" : "View All Orders"}
                </Link>
              </Button>
            </div>
          </DashboardPanel>
        </div>

        {/* Donations & Grant Impact Card (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <DashboardPanel
            title={isHt ? "Donasyon ak Enpak Kominotè" : "Donations & Community Impact"}
            description={
              isHt
                ? "Kontribisyon ou nan Fon Pwogram IFundAyiti pou kreyatè lokal yo."
                : "Your contributions to the IFundAyiti Program Fund empowering local builders."
            }
            actions={
              <Button asChild size="sm" className="rounded-xl bg-forest hover:bg-forest-bright text-xs font-bold text-white shadow-xs">
                <Link href={`/${lang}/donate`}>
                  <Heart className="mr-1.5 h-3.5 w-3.5 text-rose-300" />
                  {isHt ? "Fè Yon Don" : "Donate Now"}
                </Link>
              </Button>
            }
          >
            {/* Demo Donations Feed */}
            <div className="space-y-3">
              {demoDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="rounded-2xl border border-hairline/80 bg-white p-4 shadow-2xs transition-colors hover:border-forest/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-forest">
                          #{donation.id}
                        </span>
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                          {donation.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-bold text-cloud">
                        {donation.cause}
                      </p>
                      <p className="mt-0.5 text-xs text-mist flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-mist/70" />
                        <span>{donation.date}</span>
                      </p>
                    </div>

                    <p className="font-display text-base font-bold text-forest">
                      {formatPrice(donation.amount)}
                    </p>
                  </div>

                  <div className="mt-2.5 border-t border-hairline/50 pt-2 flex items-center gap-1.5 text-[11px] text-mist">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span>{donation.directImpact}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Micro-Grant Milestone Progress */}
            <div className="mt-5 rounded-2xl border border-hairline/80 bg-sand-soft/50 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-forest uppercase tracking-wider">
                  {isHt ? "Pwochen Sibvansyon $1,000" : "Next $1,000 Micro-Grant Cycle"}
                </span>
                <span className="font-bold text-forest-deep">$750 / $1,000 (75%)</span>
              </div>

              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-sand-soft border border-hairline/80">
                <div
                  className="h-full rounded-full bg-forest transition-all duration-500"
                  style={{ width: "75%" }}
                />
              </div>

              <p className="mt-2 text-[11px] text-mist leading-relaxed">
                {isHt
                  ? "Chak dola ou bay antre dirèkteman nan fon prim mikwo-sibvansyon an pou rekonpanse gayan sik aktyèl la."
                  : "Every dollar donated fuels our equity-free micro-grant awards for verified Haitian grassroots builders."}
              </p>
            </div>
          </DashboardPanel>
        </div>
      </div>

      {/* 3. Quick Navigation Band */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          href={`/${lang}/track-application`}
          className="group flex items-center gap-3.5 rounded-2xl border border-hairline/80 bg-panel/75 p-4 shadow-xs transition-all hover:border-forest/40 hover:bg-panel hover:shadow-md"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-forest/10 text-forest">
            <Compass className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-cloud group-hover:text-forest transition-colors">
              {isHt ? "Swiv Aplikasyon Sibvansyon" : "Track Grant Application"}
            </p>
            <p className="text-[11px] text-mist">
              {isHt ? "Tcheke eta dosye w" : "Check review milestone"}
            </p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 text-mist group-hover:translate-x-0.5 group-hover:text-forest transition-all" />
        </Link>

        <Link
          href={`/${lang}/winners`}
          className="group flex items-center gap-3.5 rounded-2xl border border-hairline/80 bg-panel/75 p-4 shadow-xs transition-all hover:border-forest/40 hover:bg-panel hover:shadow-md"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-forest/10 text-forest">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-cloud group-hover:text-forest transition-colors">
              {isHt ? "Gayan ak Enpak" : "Grant Winners & Stories"}
            </p>
            <p className="text-[11px] text-mist">
              {isHt ? "Gade pwojè k ap bati" : "Discover local creators"}
            </p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 text-mist group-hover:translate-x-0.5 group-hover:text-forest transition-all" />
        </Link>

        <Link
          href={`/${lang}/shop`}
          className="group flex items-center gap-3.5 rounded-2xl border border-hairline/80 bg-panel/75 p-4 shadow-xs transition-all hover:border-forest/40 hover:bg-panel hover:shadow-md"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-forest/10 text-forest">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-cloud group-hover:text-forest transition-colors">
              {isHt ? "Boutik Ofisyèl" : "Mission Merchandise"}
            </p>
            <p className="text-[11px] text-mist">
              {isHt ? "Kòmande rad ak akseswa" : "Support Haitian apparel"}
            </p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 text-mist group-hover:translate-x-0.5 group-hover:text-forest transition-all" />
        </Link>
      </div>
    </div>
  );
}
