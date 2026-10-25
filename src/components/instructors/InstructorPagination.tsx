"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DropdownSelect } from "@/components/ui/DropdownSelect";

const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "Show 10" },
  { value: "20", label: "Show 20" },
  { value: "50", label: "Show 50" },
];

interface InstructorPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function InstructorPagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: InstructorPaginationProps) {
  const effectiveTotalPages = Math.max(1, totalPages);
  const startItem = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  // Dynamically compute the visible page numbers based on actual totalPages
  const getPageNumbers = (): (number | string)[] => {
    if (effectiveTotalPages <= 5) {
      return Array.from({ length: effectiveTotalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", effectiveTotalPages];
    }

    if (currentPage >= effectiveTotalPages - 2) {
      return [
        1,
        "...",
        effectiveTotalPages - 3,
        effectiveTotalPages - 2,
        effectiveTotalPages - 1,
        effectiveTotalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      effectiveTotalPages,
    ];
  };

  const pages = getPageNumbers();

  return (
    <div className="p-3.5 sm:p-4 border-t border-dash flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
      <span className="body-sm-regular text-primary-400">
        Showing <span className="font-semibold text-primary-500">{startItem}</span> to{" "}
        <span className="font-semibold text-primary-500">{endItem}</span> of{" "}
        <span className="font-semibold text-primary-500">{totalCount}</span> instructors
      </span>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        {/* Dynamic Pagination Buttons */}
        <div className="flex items-center gap-1">
          {/* Previous Page */}
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="w-8 h-8 rounded-lg border border-dash flex items-center justify-center text-primary-400 hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dynamic Page Items */}
          {pages.map((item, idx) => {
            if (typeof item === "string") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-6 text-center text-primary-300 body-sm-regular select-none"
                >
                  ...
                </span>
              );
            }

            const page = item as number;
            const isActive = page === currentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-lg body-sm-medium font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-brand-orange text-white shadow-2xs"
                    : "border border-dash text-primary-400 hover:bg-slate-50 hover:text-primary-500"
                }`}
              >
                {page}
              </button>
            );
          })}

          {/* Next Page */}
          <button
            type="button"
            onClick={() => onPageChange(Math.min(effectiveTotalPages, currentPage + 1))}
            disabled={currentPage >= effectiveTotalPages}
            className="w-8 h-8 rounded-lg border border-dash flex items-center justify-center text-primary-400 hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Page size dropdown using reusable DropdownSelect */}
        {onPageSizeChange && (
          <div className="w-[116px] ml-2 shrink-0">
            <DropdownSelect
              options={PAGE_SIZE_OPTIONS}
              value={String(pageSize)}
              onChange={(val) => onPageSizeChange(Number(val))}
              buttonClassName="!h-8 !py-1 body-sm-medium border-dash rounded-lg px-2.5"
              menuClassName="min-w-[116px] w-[116px]"
              align="right"
              direction="up"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default InstructorPagination;
