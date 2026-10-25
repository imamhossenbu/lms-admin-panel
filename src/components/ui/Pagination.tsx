"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { DropdownSelect } from "./DropdownSelect";

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

  const dropdownOptions = pageSizeOptions.map((size) => ({
    value: String(size),
    label: `Show ${size}`,
  }));

  return (
    <div
      className={cn(
        "flex items-center justify-between w-full pt-3 select-none",
        className
      )}
    >
      {/* Left: Per Page Selector using DropdownSelect */}
      {onPageSizeChange && (
        <div className="w-[116px] shrink-0">
          <DropdownSelect
            options={dropdownOptions}
            value={String(pageSize)}
            onChange={(val) => onPageSizeChange(Number(val))}
            buttonClassName="!h-8 !py-1 body-sm-medium border-dash rounded-lg px-2.5"
            menuClassName="min-w-[116px] w-[116px]"
            align="left"
            direction="up"
          />
        </div>
      )}

      {/* Right: Page Numbers */}
      <div className="flex items-center gap-1.5 ml-auto">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-dash bg-white text-primary-400 transition-colors hover:bg-slate-50 hover:text-primary-500 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          title="Previous Page"
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
              "inline-flex h-8 w-8 items-center justify-center rounded-lg body-sm-medium font-bold transition-all cursor-pointer",
              p === page
                ? "bg-brand-orange text-white shadow-2xs font-bold"
                : "border border-dash bg-white text-primary-400 hover:bg-slate-50 hover:text-primary-500"
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
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-dash bg-white text-primary-400 transition-colors hover:bg-slate-50 hover:text-primary-500 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          title="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
