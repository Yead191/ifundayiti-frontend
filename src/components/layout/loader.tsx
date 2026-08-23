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

/**
 * Dual counter-rotating forest/sand arcs with a breathing core and
 * orbiting sand node. Use on its own anywhere a spinner is needed.
 */
export function BrandSpinner({
  size = "md",
  className,
  idPrefix = "fund",
}: {
  size?: Size;
  className?: string;
  idPrefix?: string;
}) {
  const px = SPINNER_PX[size];

  return (
    <span
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: px, height: px }}
      role="status"
      aria-label="Loading"
    >
      <span
        aria-hidden
        className="loader-glow absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(11,61,46,0.28), rgba(230,213,184,0.35) 52%, transparent 72%)",
          filter: "blur(8px)",
        }}
      />

      <svg
        viewBox="0 0 100 100"
        width={px}
        height={px}
        fill="none"
        aria-hidden
        className="relative"
      >
        <defs>
          <linearGradient
            id={gradientId(idPrefix, "forest")}
            x1="0"
            y1="0"
            x2="100"
            y2="100"
          >
            <stop offset="0" stopColor="#145c45" />
            <stop offset="0.55" stopColor="#0b3d2e" />
            <stop offset="1" stopColor="#072a20" />
          </linearGradient>
          <linearGradient
            id={gradientId(idPrefix, "sand")}
            x1="0"
            y1="100"
            x2="100"
            y2="0"
          >
            <stop offset="0" stopColor="#f3eadf" />
            <stop offset="0.45" stopColor="#e6d5b8" />
            <stop offset="1" stopColor="#c9b896" />
          </linearGradient>
          <radialGradient
            id={gradientId(idPrefix, "core")}
            cx="0.5"
            cy="0.45"
            r="0.62"
          >
            <stop offset="0" stopColor="#f3eadf" />
            <stop offset="0.45" stopColor="#145c45" />
            <stop offset="1" stopColor="#0b3d2e" />
          </radialGradient>
        </defs>

        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="rgba(11,61,46,0.08)"
          strokeWidth="5"
        />
        <circle
          cx="50"
          cy="50"
          r="30"
          stroke="rgba(230,213,184,0.45)"
          strokeWidth="4"
        />

        <g className="fund-rot">
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke={`url(#${gradientId(idPrefix, "forest")})`}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="148 116"
          />
        </g>

        <g className="fund-rot-rev">
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke={`url(#${gradientId(idPrefix, "sand")})`}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="96 93"
          />
        </g>

        <g className="fund-orbit">
          <circle cx="50" cy="8" r="4" fill="#e6d5b8" />
          <circle cx="50" cy="8" r="6.5" fill="#e6d5b8" opacity="0.35" />
        </g>

        <circle
          className="fund-core"
          cx="50"
          cy="50"
          r="10"
          fill={`url(#${gradientId(idPrefix, "core")})`}
        />
        <circle
          cx="50"
          cy="50"
          r="10"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="0.75"
        />
      </svg>
    </span>
  );
}

/**
 * Full loader: spinner, IFundAyiti wordmark with shimmer, animated
 * progress bar, and optional caption. Set `fullscreen` for route overlays.
 */
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
      <BrandSpinner size={size} idPrefix="loader" />

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
