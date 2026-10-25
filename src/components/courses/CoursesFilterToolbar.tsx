"use client";

import React from "react";
import { Search, LayoutGrid, List } from "lucide-react";
import { PillTabs, PillTabItem } from "@/components/ui/PillTabs";
import { DropdownSelect } from "@/components/ui/DropdownSelect";

interface CoursesFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (val: string) => void;
  categoryOptions: { label: string; value: string }[];
  levelFilter: string;
  onLevelFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  statusTabs: PillTabItem[];
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
}

export function CoursesFilterToolbar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  categoryOptions,
  levelFilter,
  onLevelFilterChange,
  statusFilter,
  onStatusFilterChange,
  statusTabs,
  viewMode,
  onViewModeChange,
}: CoursesFilterToolbarProps) {
  const levelOptions = [
    { label: "All Levels", value: "ALL" },
    { label: "Beginner", value: "BEGINNER" },
    { label: "Intermediate", value: "INTERMEDIATE" },
    { label: "Advanced", value: "ADVANCED" },
  ];

  return (
    <div className="space-y-3 p-4 rounded-[12px] bg-white border border-[#EDEDED] shadow-xs text-left">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary-300" />
          <input
            type="text"
            placeholder="Search courses by title, topic, or instructor..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-[8px] border border-dash body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none focus:border-brand-orange"
          />
        </div>

        {/* Dropdowns & View Mode */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-48">
            <DropdownSelect
              options={categoryOptions}
              value={categoryFilter}
              onChange={onCategoryFilterChange}
            />
          </div>

          <div className="w-36">
            <DropdownSelect
              options={levelOptions}
              value={levelFilter}
              onChange={onLevelFilterChange}
            />
          </div>

          {/* Grid / Table View Toggle */}
          <div className="h-10 flex items-center p-1 rounded-[8px] bg-[#F8F9FA] border border-dash">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`h-full px-2.5 rounded-[6px] flex items-center justify-center transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-brand-orange shadow-2xs"
                  : "text-primary-400 hover:text-primary-500"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={`h-full px-2.5 rounded-[6px] flex items-center justify-center transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-brand-orange shadow-2xs"
                  : "text-primary-400 hover:text-primary-500"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Pill Tabs */}
      <div className="pt-2 border-t border-[#EDEDED]/80">
        <PillTabs
          activeId={statusFilter}
          onChange={onStatusFilterChange}
          tabs={statusTabs}
        />
      </div>
    </div>
  );
}
