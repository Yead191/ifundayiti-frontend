import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Logo } from "@/components/layout/logo";

interface FocusShellProps {
  /** Small pill/eyebrow above the icon. */
  eyebrow?: string;
  /** Icon rendered in the glowing badge. */
  icon: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
  /** Optional footer (links, help text). */
  footer?: React.ReactNode;
  /** Back link target + label. */
  backHref?: string;
  backLabel?: string;
  lang?: string;
}

/**
 * Centered, single-column premium shell used by the focused auth steps
 * (verify OTP, forgot password, reset password).
 */
export function FocusShell({
  eyebrow,
  icon,
  title,
  subtitle,
  children,
  footer,
  backHref = "/login",
  backLabel = "Back to sign in",
  lang = "en",
}: FocusShellProps) {
  const homeHref = `/${lang}`;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream/60 px-4 py-24 sm:px-6 sm:py-28">
      {/* Subtle ambient glows */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-forest/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-sand/30 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href={homeHref} className="transition-opacity hover:opacity-90">
            <Logo />
          </Link>
        </div>

        <div className="relative rounded-[28px] border border-hairline/80 bg-white/95 p-7 shadow-[0_20px_50px_-15px_rgba(11,61,46,0.12)] backdrop-blur-xl sm:p-10">
          <div className="flex flex-col items-center text-center">
            <span className="relative mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-forest text-sand ring-8 ring-forest/10 shadow-sm">
              {icon}
            </span>
            {eyebrow ? (
              <span className="mb-2 inline-block rounded-full bg-sand-soft px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-forest">
                {eyebrow}
              </span>
            ) : null}
            <h1 className="text-2xl font-bold tracking-tight text-forest-deep sm:text-3xl">
              {title}
            </h1>
            <div className="mt-2.5 text-sm leading-relaxed text-mist">{subtitle}</div>
          </div>

          <div className="mt-7">{children}</div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4">
          {footer}
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest/90 transition-colors hover:text-forest hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> {backLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
