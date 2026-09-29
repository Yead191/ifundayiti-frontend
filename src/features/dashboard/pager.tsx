"use client";

import { useRouter, useSearchParams } from "next/navigation";

import type { Pagination } from "@/types";
import { PaginationControls } from "@/components/ui/pagination-controls";

export function DashboardPager({
  pagination,
  basePath,
}: {
  pagination?: Pagination;
  basePath: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  if (!pagination || pagination.totalPage <= 1) return null;

  return (
    <div className="mt-6">
      <PaginationControls
        pagination={pagination}
        onPageChange={(page) => {
          const params = new URLSearchParams(searchParams.toString());
          if (page > 1) {
            params.set("page", String(page));
          } else {
            params.delete("page");
          }
          const qs = params.toString();
          router.push(qs ? `${basePath}?${qs}` : basePath);
        }}
      />
    </div>
  );
}
