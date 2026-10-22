"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function CategoryPagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}: CategoryPaginationProps) {
  const startItem = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="p-3.5 sm:p-4 border-t border-dash flex items-center justify-between">
      <span className="body-2xsm-regular text-primary-300">
        Showing {startItem} to {endItem} of {totalCount} categories
      </span>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg border border-dash flex items-center justify-center text-primary-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {[...Array(totalPages || 1)].map((_, idx) => {
          const page = idx + 1;
          const isActive = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-lg body-sm-medium font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-brand-orange text-white shadow-2xs"
                  : "border border-dash text-primary-400 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="w-8 h-8 rounded-lg border border-dash flex items-center justify-center text-primary-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
