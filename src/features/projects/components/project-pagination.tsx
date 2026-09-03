"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PaginationControls } from "@/components/ui/pagination-controls";
import type { Pagination } from "@/types";

export function ProjectPagination({
  pagination,
  lang,
}: {
  pagination: Pagination;
  lang: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/${lang}/projects?${params.toString()}`);
  };

  return (
    <div className="mt-14">
      <PaginationControls
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
