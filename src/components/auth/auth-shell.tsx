import Link from "next/link";
import { Check, Sparkles, ShieldCheck } from "lucide-react";

import { Logo } from "@/components/layout/logo";

interface AuthShellProps {
  /** Headline + copy for the form column. */
  title: string;
  subtitle: string;
  /** The form column content. */
  children: React.ReactNode;
  /** Brand panel content. */
  panelEyebrow?: string;
  panelTitle?: string;
  panelPoints?: string[];
  lang?: string;
}

export function AuthShell({
  title,
  subtitle,
  children,
  panelEyebrow = "IFundAyiti Nonprofit",
  panelTitle = "Grants that turn Haitian ideas into lasting impact.",
  panelPoints = [
    "Transparent, equity-free micro-grants for local changemakers",
    "Direct community tracking and verified progress updates",
    "A global network uniting Haiti and the diaspora",
  ],
  lang = "en",
}: AuthShellProps) {
  const homeHref = `/${lang}`;

  return (
    <section className="relative min-h-screen overflow-hidden bg-cream/60 py-24 sm:py-28">
      {/* Subtle luxury ambient glows */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-forest/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-96 w-96 rounded-full bg-sand/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        {/* Brand panel (Desktop) */}
        <aside className="relative hidden flex-col justify-between overflow-hidden rounded-[28px] border border-forest/15 bg-linear-to-br from-[#05281d] via-[#0b3d2e] to-[#041c15] p-10 text-white shadow-2xl lg:flex">
          {/* Subtle gold/emerald gradient blurs */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sand/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-forest-bright/20 blur-2xl" />

          {/* Top badge & Logo */}
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <Link
                href={homeHref}
                className="inline-block transition-opacity hover:opacity-90"
              >
                <Logo />
              </Link>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-sand/30 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-sand backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-sand" />
                <span>501(c)(3) Pending</span>
              </div>
            </div>

            <div className="mt-10">
              <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sand">
                {panelEyebrow}
              </span>
              <h2 className="mt-4 text-balance text-3xl font-bold leading-snug tracking-tight text-white">
                {panelTitle}
              </h2>
            </div>
          </div>

          {/* Value points */}
          <ul className="relative z-10 my-8 flex flex-col gap-4">
            {panelPoints.map((point) => (
              <li key={point} className="flex items-start gap-3 text-white/90">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sand/20 text-sand border border-sand/30">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm font-medium leading-relaxed">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          {/* Nonprofit dedication quote */}
          <div className="relative z-10 rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sand">
              <ShieldCheck className="h-4 w-4" />
              <span>Dedicated to Transparency</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-white/75">
              “Every grant, donation, and community initiative on IFundAyiti is
              tracked openly to ensure real-world impact for Haitian
              entrepreneurs.”
            </p>
          </div>
        </aside>

        {/* Form column */}
        <div className="relative flex flex-col justify-center rounded-[28px] border border-hairline/80 bg-white/95 p-7 shadow-[0_20px_50px_-20px_rgba(11,61,46,0.14)] backdrop-blur-xl sm:p-10">
          <div className="mx-auto w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-6 flex justify-center lg:hidden">
              <Link href={homeHref}>
                <Logo />
              </Link>
            </div>

            <div className="flex flex-col gap-2 text-center lg:text-left">
              <h1 className="text-2xl font-bold tracking-tight text-forest-deep sm:text-3xl">
                {title}
              </h1>
              <p className="text-sm text-mist">{subtitle}</p>
            </div>

            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
