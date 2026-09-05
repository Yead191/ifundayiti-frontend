import type { Metadata } from "next";
import { Sora, Source_Sans_3 } from "next/font/google";
import "../globals.css";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SiteProviders } from "@/components/layout/site-providers";
import { getDictionary } from "@/lib/dictionaries";
import { TranslationProvider } from "@/components/providers/translation-provider";
import {
  DEFAULT_KEYWORDS,
  SITE_NAME,
  absoluteUrl,
  getSiteUrl,
} from "@/lib/seo";
import NavServer from "@/components/layout/NavServer";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["500", "600", "700"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} — Grants that grow Haitian ideas`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "IFundAyiti supports Haitian entrepreneurs and community builders with equity-free micro-grants of up to $1,000.",
  keywords: [...DEFAULT_KEYWORDS],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: siteUrl }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "nonprofit",
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Grants that grow Haitian ideas`,
    description:
      "A grant program for Haitian entrepreneurs and community builders. Apply, track, donate, and follow the impact.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Grants that grow Haitian ideas`,
    description:
      "Equity-free micro-grants of up to $1,000 for Haitian community projects.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ht" }];
}

export default async function LangRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: currentLang } = await params;
  const dict = await getDictionary(currentLang);

  return (
    <html
      lang={currentLang}
      className={`${sora.variable} ${sourceSans.variable}`}
    >
      <body className="min-h-screen bg-cream text-cloud antialiased scroll-smooth">
        <TranslationProvider messages={dict}>
          <SiteProviders>
            <NavServer />
            <main className="relative">{children}</main>
            <Footer />
          </SiteProviders>
        </TranslationProvider>
      </body>
    </html>
  );
}
