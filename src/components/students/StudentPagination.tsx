"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface StudentPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function StudentPagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: StudentPaginationProps) {
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
        <span className="font-semibold text-primary-500">{totalCount}</span> students
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

        {/* Page size dropdown */}
        <div className="relative ml-2">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            className="h-8 pl-2.5 pr-6 rounded-lg border border-dash bg-white body-sm-medium text-primary-500 appearance-none focus:outline-none focus:border-brand-orange cursor-pointer"
          >
            <option value={10}>Show 10</option>
            <option value={20}>Show 20</option>
            <option value={50}>Show 50</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-primary-300 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

export default StudentPagination;
