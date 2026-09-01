"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaTiktok } from "react-icons/fa";
import { Facebook, Instagram } from "lucide-react";
import { SITE } from "@/data/site";
import { useTranslation } from "@/components/providers/translation-provider";

export function Footer() {
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] === "ht" ? "ht" : "en";
  const dict = useTranslation();
  const t = dict.Navbar;
  const f = dict.Footer;

  const exploreLinks = [
    { label: t.About, href: "/about" },
    { label: t.OurTeam, href: "/team" },
    { label: t.Grants, href: "/grants" },
    { label: t.Impact, href: "/impact" },
    { label: t.Projects, href: "/projects" },
    { label: t.Winners, href: "/winners" },
  ];

  const participateLinks = [
    { label: t.Apply, href: "/apply" },
    { label: t.Track, href: "/track-application" },
    { label: t.Events, href: "/events" },
    { label: t.Donate, href: "/donate" },
    { label: t.Shop, href: "/shop" },
  ];

  const legalLinks = [
    { label: f.PrivacyPolicy, href: "/privacy-policy" },
    { label: f.Terms, href: "/terms" },
    { label: f.FAQ, href: "/faq" },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-hairline bg-forest-deep text-sand-soft">
      {/* Background Image with Balanced Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/assets/images/footer/footer-bg.jpeg"
          alt="Haitian community landscape"
          fill
          priority
          className="object-cover object-bottom"
          sizes="100vw"
        />
        {/* Balanced gradient overlay: provides text legibility while keeping the painting clearly visible */}
        <div className="absolute inset-0 bg-forest-deep/55" />
        <div className="absolute inset-0 bg-linear-to-t from-forest-deep/95 via-forest-deep/30 to-forest-deep/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-10 pt-14 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link
              href={`/${currentLocale}`}
              aria-label="IFundAyiti — home"
              className="group inline-flex items-center overflow-hidden rounded-2xl bg-white p-2.5 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <Image
                src="/logo-ifundayiti.png"
                alt="IFundAyiti"
                width={200}
                height={200}
                className="h-16 w-auto object-contain sm:h-20"
                priority
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-sand/90">
              {f.Summary}
            </p>
            <p className="mt-4 text-sm text-sand/80">
              {SITE.email}
              <br />
              {SITE.location}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8">
            <FooterCol
              heading={f.Explore}
              links={exploreLinks}
              locale={currentLocale}
            />
            <FooterCol
              heading={f.Participate}
              links={participateLinks}
              locale={currentLocale}
            />
            <FooterCol
              heading={f.Legal}
              links={legalLinks}
              locale={currentLocale}
            />
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-6 border-t border-white/15 pt-8 md:flex-row">
          <p className="text-sm text-sand/75">
            © {new Date().getFullYear()} IFundAyiti. {f.Copyright}
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
  locale,
}: {
  heading: string;
  links: { label: string; href: string }[];
  locale: string;
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
              href={`/${locale}${link.href}`}
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
