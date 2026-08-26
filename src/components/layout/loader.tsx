import Image from "next/image";

import { cn } from "@/lib/utils";

/* ============================================================
   IFundAyiti — premium shared loader
   Forest + sand rings, logo shimmer, and a soft progress pulse.
   Pure CSS animation; honours prefers-reduced-motion in globals.css.
   ============================================================ */

const LOGO_SRC = "/logo-ifundayiti.png";

type Size = "sm" | "md" | "lg";

const SPINNER_PX: Record<Size, number> = { sm: 44, md: 76, lg: 108 };
const LOGO_WIDTH: Record<Size, number> = { sm: 128, md: 168, lg: 208 };

function gradientId(prefix: string, name: string) {
  return `${prefix}-${name}`;
}

export function Loader({
  size = "md",
  label,
  showWordmark = true,
  fullscreen = true,
  className,
}: {
  size?: Size;
  label?: string;
  showWordmark?: boolean;
  fullscreen?: boolean;
  className?: string;
}) {
  const logoWidth = LOGO_WIDTH[size];

  const content = (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {showWordmark && (
        <div className="logo-sweep logo-sweep-loop relative overflow-hidden rounded-lg">
          <Image
            src={LOGO_SRC}
            alt="IFundAyiti"
            width={logoWidth}
            height={Math.round(logoWidth * 0.32)}
            className="h-auto w-auto select-none"
            priority
            draggable={false}
          />
        </div>
      )}

      <div
        aria-hidden
        className="h-0.5 w-44 overflow-hidden rounded-full bg-forest/10 sm:w-52"
      >
        <div className="loader-progress h-full w-full rounded-full bg-linear-to-r from-forest via-forest-bright to-sand" />
      </div>

      {label && (
        <p
          className="text-sm font-medium tracking-wide text-mist"
          aria-live="polite"
        >
          {label}
        </p>
      )}
    </div>
  );

  if (!fullscreen) return content;

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label ?? "Loading IFundAyiti"}
      className="loader-in fixed inset-0 z-100 grid place-items-center overflow-hidden bg-cream"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #0b3d2e 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />
      <span
        aria-hidden
        className="aurora animate-drift"
        style={{
          width: 480,
          height: 480,
          left: "50%",
          top: "40%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <span
        aria-hidden
        className="absolute h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{
          left: "18%",
          bottom: "12%",
          background:
            "radial-gradient(circle, rgba(11,61,46,0.14), transparent 70%)",
        }}
      />
      <div className="relative">{content}</div>
    </div>
  );
}

export default Loader;
