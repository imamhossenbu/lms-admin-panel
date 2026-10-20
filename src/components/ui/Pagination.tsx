"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  totalItems?: number;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [7, 10, 20, 50],
  className = "",
}: PaginationProps) {
  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 3) return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2) {
      return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    }
    return [page - 2, page - 1, page, page + 1, page + 2];
  };

  const visiblePages = getVisiblePages();

  return (
    <div
      className={cn(
        "flex items-center justify-between w-full pt-3 select-none",
        className
      )}
    >
      {/* Left: Per Page Selector */}
      {onPageSizeChange && (
        <div className="flex items-center gap-2 body-sm-regular subtext-500">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-[#EDEDED] bg-white px-2.5 py-1 body-xsm-medium text-primary-500 outline-none transition focus:border-[#1C4D8D] cursor-pointer"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {String(size).padStart(2, "0")}
              </option>
            ))}
          </select>
          <span>Per Page</span>
        </div>
      )}

      {/* Right: Page Numbers */}
      <div className="flex items-center gap-1.5 ml-auto">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#EDEDED] bg-white text-primary-400 transition-colors hover:bg-gray-50 hover:text-primary-500 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page List */}
        {visiblePages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-lg body-xsm-medium transition-all cursor-pointer",
              p === page
                ? "bg-[#1C4D8D] text-white shadow-xs font-semibold"
                : "border border-[#EDEDED] bg-white text-primary-400 hover:bg-gray-50 hover:text-primary-500"
            )}
          >
            {p}
          </button>
        ))}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#EDEDED] bg-white text-primary-400 transition-colors hover:bg-gray-50 hover:text-primary-500 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
