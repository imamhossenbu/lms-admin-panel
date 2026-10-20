"use client";

import React from "react";
import { FolderTree, BookOpen, Layers, TrendingUp } from "lucide-react";
import { AdminCategoryItem } from "@/lib/types";

interface CategoryStatsProps {
  categories: AdminCategoryItem[];
}

export function CategoryStats({ categories }: CategoryStatsProps) {
  const totalCount = categories.length;
  const activeCount = categories.filter((c) => c.status === "ACTIVE").length;
  const totalCourses = categories.reduce(
    (acc, c) => acc + (c._count?.courses ?? 0),
    0
  );
  const topCategory = [...categories].sort(
    (a, b) => (b._count?.courses ?? 0) - (a._count?.courses ?? 0)
  )[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 rounded-[12px] bg-white border border-[#EDEDED] shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="body-xsm-medium text-primary-400">Total Disciplines</span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1C4D8D] flex items-center justify-center">
            <FolderTree className="w-4 h-4" />
          </div>
        </div>
        <span className="title-md text-primary-500 font-bold block">
          {totalCount}
        </span>
        <span className="body-xsm-regular text-emerald-600 flex items-center gap-1 mt-1 font-semibold">
          <TrendingUp className="w-3 h-3" />
          <span>Organized Catalog</span>
        </span>
      </div>

      <div className="p-4 rounded-[12px] bg-white border border-[#EDEDED] shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="body-xsm-medium text-primary-400">Active Categories</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <span className="title-md text-primary-500 font-bold block">
          {activeCount}
        </span>
        <span className="body-xsm-regular subtext-500 block mt-1">
          {totalCount - activeCount} Draft or Archived
        </span>
      </div>

      <div className="p-4 rounded-[12px] bg-white border border-[#EDEDED] shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="body-xsm-medium text-primary-400">Associated Courses</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
        <span className="title-md text-primary-500 font-bold block">
          {totalCourses}
        </span>
        <span className="body-xsm-regular text-indigo-600 block mt-1 font-semibold">
          Distributed Across Fields
        </span>
      </div>

      <div className="p-4 rounded-[12px] bg-white border border-[#EDEDED] shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="body-xsm-medium text-primary-400">Highest Volume Field</span>
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <span className="text-sm">🏆</span>
          </div>
        </div>
        <span className="body-sm-medium text-primary-500 font-bold truncate block">
          {topCategory ? topCategory.name : "N/A"}
        </span>
        <span className="body-xsm-regular subtext-500 block mt-1">
          {topCategory ? `${topCategory._count?.courses ?? 0} Live Courses` : "-"}
        </span>
      </div>
    </div>
  );
}
