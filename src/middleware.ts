import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LOCALES = ["en", "ht"];
const DEFAULT_LOCALE = "en";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Check if pathname already starts with a supported locale
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Detect locale preference from cookie or accept-language header
  const cookieLocale =
    request.cookies.get("NEXT_LOCALE")?.value ||
    request.cookies.get("lang")?.value;
  let targetLocale = DEFAULT_LOCALE;

  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    targetLocale = cookieLocale;
  } else {
    const acceptLanguage = request.headers.get("accept-language") || "";
    if (acceptLanguage.toLowerCase().includes("ht")) {
      targetLocale = "ht";
    }
  }

  // If path is under /payment/* without locale prefix, redirect to /[targetLocale]/payment/*
  if (pathname.startsWith("/payment/")) {
    const redirectUrl = new URL(
      `/${targetLocale}${pathname}${search}`,
      request.url,
    );
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/payment/:path*"],
};
