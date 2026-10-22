"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DropdownSelect } from "@/components/ui/DropdownSelect";

const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "Show 10" },
  { value: "20", label: "Show 20" },
  { value: "50", label: "Show 50" },
];

interface CategoryPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function CategoryPagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: CategoryPaginationProps) {
  const startItem = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="p-3.5 sm:p-4 border-t border-dash flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
      <span className="body-sm-regular text-primary-400">
        Showing <span className="font-semibold text-primary-500">{startItem}</span> to{" "}
        <span className="font-semibold text-primary-500">{endItem}</span> of{" "}
        <span className="font-semibold text-primary-500">{totalCount}</span> categories
      </span>

      <div className="flex items-center gap-2 self-end sm:self-auto">
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

        {/* Page size dropdown using reusable DropdownSelect */}
        {onPageSizeChange && (
          <div className="w-[116px] ml-2 shrink-0">
            <DropdownSelect
              options={PAGE_SIZE_OPTIONS}
              value={String(pageSize)}
              onChange={(val) => onPageSizeChange(Number(val))}
              buttonClassName="!h-8 !py-1 text-[13px] border-dash rounded-lg px-2.5"
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

export default CategoryPagination;
