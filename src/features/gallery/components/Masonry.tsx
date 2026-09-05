"use client";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, MapPin, Eye } from "lucide-react";
import { MasonrySkeleton } from "./MasonrySkeleton";

gsap.registerPlugin(ScrollTrigger);

const useMedia = (
  queries: string[],
  values: number[],
  defaultValue: number,
): number => {
  const get = () => {
    if (typeof window === "undefined") return defaultValue;
    return (
      values[queries.findIndex((q) => window.matchMedia(q).matches)] ??
      defaultValue
    );
  };

  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = () => setValue(get);
    const mqls = queries.map((q) => window.matchMedia(q));
    mqls.forEach((mql) => mql.addEventListener("change", handler));

    return () =>
      mqls.forEach((mql) => mql.removeEventListener("change", handler));
  }, [queries]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

export interface Item {
  id: string;
  img: string;
  url?: string;
  height: number;
  title?: string;
  category?: string;
  location?: string;
  date?: string | Date;
  featured?: boolean;
  rawItem?: any;
}

interface GridItem extends Item {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MasonryProps {
  items: Item[];
  onItemClick?: (item: Item) => void;
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: "bottom" | "top" | "left" | "right" | "center" | "random";
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
}

function MasonryCard({
  item,
  index,
  colorShiftOnHover,
}: {
  item: GridItem;
  index: number;
  colorShiftOnHover?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-sand-soft/50 shadow-[0px_8px_30px_-10px_rgba(0,0,0,0.18)] transition-all duration-500 group-hover:shadow-[0px_20px_50px_-10px_rgba(0,0,0,0.35)]">
      {/* Individual Skeleton Shimmer while this specific image is downloading */}
      {!loaded && !error && (
        <div className="absolute inset-0 z-0 bg-linear-to-r from-sand-soft/80 via-cream to-sand-soft/80 animate-pulse">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
        </div>
      )}

      {/* Next.js Optimized Image with progressive loading */}
      <Image
        src={item.img}
        alt={item.title || "IFundAyiti Community Photo"}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 33vw"
        priority={index < 4}
        loading={index < 4 ? "eager" : "lazy"}
        className={`object-cover transition-all duration-700 ${
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />

      {/* Spotlight Star Badge */}
      {item.featured && (
        <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-black/50 px-2.5 py-1 text-[11px] font-bold text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.6)] backdrop-blur-md">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400 animate-pulse" />
          <span className="uppercase tracking-wider">Spotlight</span>
        </div>
      )}

      {/* Hover Editorial Overlay */}
      <div className="absolute inset-0 z-10 bg-linear-to-t from-black/85 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-5 text-white pointer-events-none">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          {item.category && (
            <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-200 backdrop-blur-md">
              {item.category}
            </span>
          )}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
            <Eye className="h-3.5 w-3.5" />
          </span>
        </div>

        {item.title && (
          <h4 className="font-display font-bold text-base leading-snug text-white line-clamp-2">
            {item.title}
          </h4>
        )}

        {item.location && (
          <p className="text-xs text-white/80 mt-1 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-sand shrink-0" />
            <span className="truncate">{item.location}</span>
          </p>
        )}
      </div>

      {colorShiftOnHover && (
        <div className="color-overlay absolute inset-0 z-10 rounded-2xl bg-linear-to-tr from-pink-500/30 to-sky-500/30 opacity-0 pointer-events-none" />
      )}
    </div>
  );
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  onItemClick,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.96,
  blurToFocus = true,
  colorShiftOnHover = false,
}) => {
  const columns = useMedia(
    [
      "(min-width:1500px)",
      "(min-width:1080px)",
      "(min-width:720px)",
      "(min-width:480px)",
    ],
    [4, 3, 2, 2],
    2,
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();

  const getInitialPosition = (item: GridItem) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;
    if (animateFrom === "random") {
      const dirs = ["top", "bottom", "left", "right"];
      direction = dirs[
        Math.floor(Math.random() * dirs.length)
      ] as typeof animateFrom;
    }

    switch (direction) {
      case "top":
        return { x: item.x, y: -200 };
      case "bottom":
        return { x: item.x, y: window.innerHeight + 200 };
      case "left":
        return { x: -200, y: item.y };
      case "right":
        return { x: window.innerWidth + 200, y: item.y };
      case "center":
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  const grid = useMemo<GridItem[]>(() => {
    if (!width || !items || items.length === 0) return [];
    const colHeights = new Array(columns).fill(0);
    const gap = 20;
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;

    return items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      // Scaled proportionate height
      const height = Math.max(220, child.height * 0.75);
      const y = colHeights[col];

      colHeights[col] += height + gap;
      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, items, width]);

  const hasMounted = useRef(false);

  // Mount + resize animation - immediate without waiting for all images to download
  useLayoutEffect(() => {
    if (grid.length === 0) return;

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

      if (!hasMounted.current) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: "blur(8px)" }),
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: "blur(0px)" }),
            duration: 0.6,
            ease: "power3.out",
            delay: Math.min(index * stagger, 0.6),
          },
        );
      } else {
        gsap.to(selector, {
          ...animProps,
          duration,
          ease,
          overwrite: "auto",
        });
      }
    });

    hasMounted.current = true;
  }, [grid, stagger, animateFrom, blurToFocus, duration, ease]);

  // Height adjustment
  useLayoutEffect(() => {
    if (!containerRef.current || grid.length === 0) return;
    const maxBottom = Math.max(...grid.map((i) => i.y + i.h));
    containerRef.current.style.height = maxBottom + "px";
  }, [grid]);

  const handleMouseEnter = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: hoverScale,
        duration: 0.3,
        ease: "power2.out",
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector(".color-overlay") as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }
  };

  const handleMouseLeave = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector(".color-overlay") as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
  };

  if (!width && items.length > 0) {
    return (
      <div ref={containerRef} className="w-full">
        <MasonrySkeleton count={Math.min(items.length, 8)} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full min-h-[300px]">
      {grid?.map((item, index) => (
        <div
          key={item.id}
          data-key={item.id}
          onClick={() => onItemClick?.(item)}
          className="absolute box-content cursor-pointer group select-none"
          style={{ willChange: "transform, width, height, opacity" }}
          onMouseEnter={(e) => handleMouseEnter(item.id, e.currentTarget)}
          onMouseLeave={(e) => handleMouseLeave(item.id, e.currentTarget)}
        >
          <MasonryCard
            item={item}
            index={index}
            colorShiftOnHover={colorShiftOnHover}
          />
        </div>
      ))}
    </div>
  );
};

export default Masonry;
