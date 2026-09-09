import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/checkout",
          "/checkout/*",
          "/cart",
          "/cart/*",
          "/payment",
          "/payment/*",
          "/auth/forgot-password",
          "/auth/reset-password",
          "/auth/verify-otp",
          "/*/dashboard",
          "/*/dashboard/*",
          "/*/checkout",
          "/*/checkout/*",
          "/*/cart",
          "/*/cart/*",
          "/*/payment",
          "/*/payment/*",
          "/*/auth/forgot-password",
          "/*/auth/reset-password",
          "/*/auth/verify-otp",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
