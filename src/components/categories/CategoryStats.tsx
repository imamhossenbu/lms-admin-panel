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
      <div className="p-4 rounded-xl bg-white border border-dash shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="body-xsm-medium text-primary-400">Total Disciplines</span>
          <div className="w-8 h-8 rounded-lg bg-blue-14 text-blue flex items-center justify-center">
            <FolderTree className="w-4 h-4" />
          </div>
        </div>
        <span className="title-md text-primary-500 block">
          {totalCount}
        </span>
        <span className="body-xsm-regular text-green flex items-center gap-1 mt-1">
          <TrendingUp className="w-3 h-3" />
          <span>Organized Catalog</span>
        </span>
      </div>

      <div className="p-4 rounded-xl bg-white border border-dash shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="body-xsm-medium text-primary-400">Active Categories</span>
          <div className="w-8 h-8 rounded-lg bg-green-bg text-green flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <span className="title-md text-primary-500 block">
          {activeCount}
        </span>
        <span className="body-xsm-regular subtext-500 block mt-1">
          {totalCount - activeCount} Draft or Archived
        </span>
      </div>

      <div className="p-4 rounded-xl bg-white border border-dash shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="body-xsm-medium text-primary-400">Associated Courses</span>
          <div className="w-8 h-8 rounded-lg bg-blue-14 text-blue flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
        <span className="title-md text-primary-500 block">
          {totalCourses}
        </span>
        <span className="body-xsm-regular text-blue block mt-1">
          Distributed Across Fields
        </span>
      </div>

      <div className="p-4 rounded-xl bg-white border border-dash shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="body-xsm-medium text-primary-400">Highest Volume Field</span>
          <div className="w-8 h-8 rounded-lg bg-purple-14 text-purple flex items-center justify-center">
            <span className="body-sm-regular">🏆</span>
          </div>
        </div>
        <span className="body-sm-medium text-primary-500 truncate block">
          {topCategory ? topCategory.name : "N/A"}
        </span>
        <span className="body-xsm-regular subtext-500 block mt-1">
          {topCategory ? `${topCategory._count?.courses ?? 0} Live Courses` : "-"}
        </span>
      </div>
    </div>
  );
}
