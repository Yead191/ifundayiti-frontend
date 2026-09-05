"use client";

import React from "react";

const SKELETON_HEIGHTS = [
  400, 360, 480, 340, 520, 390, 460, 370, 420, 500, 350, 470,
];

export function MasonrySkeleton({ count = 8 }: { count?: number }) {
  const items = SKELETON_HEIGHTS.slice(0, count);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {items.map((height, i) => (
          <div
            key={i}
            style={{ minHeight: `${height * 0.75}px` }}
            className="relative w-full rounded-2xl overflow-hidden bg-sand-soft/50 border border-hairline/60 shadow-xs animate-pulse"
          >
            {/* Shimmer wave */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />

            {/* Bottom info pill skeleton */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
              <div className="h-4 w-24 rounded-full bg-mist/15" />
              <div className="h-5 w-3/4 rounded-lg bg-mist/20" />
            </div>

            {/* Top badge skeleton */}
            {i % 3 === 0 && (
              <div className="absolute top-3.5 right-3.5 h-6 w-20 rounded-full bg-mist/15" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
