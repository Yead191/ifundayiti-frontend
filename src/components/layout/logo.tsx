import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  logoClass = "",
}: {
  className?: string;
  logoClass?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="IFundAyiti — home"
      className={cn(
        "group relative inline-flex shrink-0 items-center outline-none",
        className,
      )}
    >
      <Image
        src="/logo-ifundayiti-nav.png"
        alt="IFundAyiti"
        width={639}
        height={216}
        className={cn(
          "relative h-10 w-auto select-none sm:h-11",
          logoClass,
        )}
        draggable={false}
        priority
      />
    </Link>
  );
}
