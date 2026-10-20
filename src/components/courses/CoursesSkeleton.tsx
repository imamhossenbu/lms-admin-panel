import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export function CoursesSkeleton({ showHeader = false }: { showHeader?: boolean } = {}) {
  return (
    <div className="space-y-5 text-left animate-in fade-in duration-300">
      {/* 1. Header Skeleton (optional) */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full mb-[20px]">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-7 w-64 rounded-[8px]" />
              <Skeleton className="h-6 w-24 rounded-[6px]" />
            </div>
            <Skeleton className="h-4 w-96 max-w-full rounded-[6px]" />
          </div>
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-10 w-20 rounded-[8px]" />
            <Skeleton className="h-10 w-28 rounded-[8px]" />
            <Skeleton className="h-10 w-36 rounded-[8px]" />
          </div>
        </div>
      )}

      {/* 2. KPI Metrics Ribbon Skeleton (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between w-full h-[132px] rounded-[10px] border border-[#E9E9E9] bg-white p-4"
            style={{
              boxShadow: "0px 1px 2px 0px rgba(228, 229, 231, 0.24)",
            }}
          >
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-[6px]" />
              <Skeleton className="h-4 w-28 rounded-[4px]" />
            </div>
            <div className="my-auto">
              <Skeleton className="h-7 w-24 rounded-[6px]" />
            </div>
            <div className="flex items-center gap-1.5 pt-2">
              <Skeleton className="h-3.5 w-16 rounded-[4px]" />
              <Skeleton className="h-3.5 w-20 rounded-[4px]" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Toolbar Skeleton */}
      <div className="space-y-3">
        {/* Row 1: Pilltabs in one line */}
        <div className="w-full overflow-x-auto pb-1">
          <div className="flex items-center gap-1 bg-[#F3F4F6] rounded-[8px] p-1 w-fit">
            <Skeleton className="h-7 w-24 rounded-[6px] shrink-0" />
            <Skeleton className="h-7 w-32 rounded-[6px] shrink-0" />
            <Skeleton className="h-7 w-28 rounded-[6px] shrink-0" />
            <Skeleton className="h-7 w-28 rounded-[6px] shrink-0" />
            <Skeleton className="h-7 w-36 rounded-[6px] shrink-0" />
          </div>
        </div>

        {/* Row 2: Search (left) & Filters (right) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          <Skeleton className="h-[46px] w-full sm:w-80 md:w-96 rounded-[10px]" />
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end flex-wrap sm:flex-nowrap">
            <Skeleton className="h-10 w-36 rounded-[10px]" />
            <Skeleton className="h-10 w-44 rounded-[10px]" />
            <Skeleton className="h-10 w-20 rounded-[8px]" />
            <Skeleton className="h-10 w-32 rounded-[8px]" />
          </div>
        </div>
      </div>

      {/* 4. Course Cards Grid Skeleton (6 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-[12px] border border-[#EDEDED] bg-white p-5 flex flex-col justify-between"
            style={{
              boxShadow: "0px 1px 2px 0px rgba(13, 13, 18, 0.05)",
            }}
          >
            <div>
              {/* Header: Badges & Action Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-24 rounded-[6px]" />
                  <Skeleton className="h-6 w-16 rounded-[6px]" />
                </div>
                <Skeleton className="h-8 w-8 rounded-[8px]" />
              </div>

              {/* Info block with icon */}
              <div className="flex items-start gap-3.5 mt-4">
                <Skeleton className="w-10 h-10 rounded-[10px] shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-full rounded-[6px]" />
                  <Skeleton className="h-5 w-3/4 rounded-[6px]" />
                  <div className="flex items-center gap-2 pt-1">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="h-3.5 w-24 rounded-[4px]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Stats & Price */}
            <div className="pt-4 mt-4 border-t border-[#F0F0F0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-16 rounded-[4px]" />
                <Skeleton className="h-4 w-12 rounded-[4px]" />
              </div>
              <Skeleton className="h-6 w-14 rounded-[6px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoursesSkeleton;
