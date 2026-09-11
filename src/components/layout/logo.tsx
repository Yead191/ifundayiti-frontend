"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  logoClass = "",
  href,
  asLink = true,
}: {
  className?: string;
  logoClass?: string;
  href?: string;
  asLink?: boolean;
}) {
  const pathname = usePathname() || "";
  const currentLocale = pathname.split("/")[1] === "ht" ? "ht" : "en";
  const targetHref = href || `/${currentLocale}`;

  const image = (
    <Image
      src="/logo-ifundayiti-nav.png"
      alt="IFundAyiti"
      width={639}
      height={216}
      className={cn("relative h-10 w-auto select-none sm:h-11", logoClass)}
      draggable={false}
      priority
    />
  );

  if (!asLink) {
    return (
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center outline-none",
          className,
        )}
      >
        {image}
      </span>
    );
  }

  return (
    <Link
      href={targetHref}
      aria-label="IFundAyiti — home"
      className={cn(
        "group relative inline-flex shrink-0 items-center outline-none",
        className,
      )}
    >
      {image}
    </Link>
  );
}
