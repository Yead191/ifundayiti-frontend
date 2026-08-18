import Link from "next/link";
import { FaTiktok } from "react-icons/fa";
import { Facebook, Instagram } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { footerNav } from "@/data/navigation";
import { SITE } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-hairline bg-forest text-sand-soft">
      <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-14 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-sand/90">
              {SITE.summary}
            </p>
            <p className="mt-4 text-sm text-sand/80">
              {SITE.email}
              <br />
              {SITE.location}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8">
            <FooterCol heading="Explore" links={footerNav.explore} />
            <FooterCol heading="Participate" links={footerNav.participate} />
            <FooterCol heading="Legal" links={footerNav.legal} />
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-sand/70">
            © {new Date().getFullYear()} IFundAyiti. All rights reserved.
          </p>
          <div className="flex gap-3">
            <Social href={SITE.social.facebook} label="Facebook">
              <Facebook className="h-4 w-4" />
            </Social>
            <Social href={SITE.social.instagram} label="Instagram">
              <Instagram className="h-4 w-4" />
            </Social>
            <Social href={SITE.social.tiktok} label="TikTok">
              <FaTiktok />
            </Social>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-sans text-sm font-semibold tracking-wide text-white">
        {heading}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-sand/80 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sand transition-colors hover:bg-sand hover:text-forest"
    >
      {children}
    </Link>
  );
}
