"use client";

import React from "react";
import { Search, Table, LayoutGrid } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { DropdownSelect } from "@/components/ui/DropdownSelect";

interface CategoryToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
}

const STATUS_OPTIONS = [
  { value: "All", label: "All Status" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export function CategoryToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  viewMode,
  onViewModeChange,
}: CategoryToolbarProps) {
  return (
    <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dash">
      {/* Search Input & Status Dropdown using Reusable UI Components */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
        <div className="w-full sm:w-72">
          <InputField
            id="category-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search categories..."
            leftElement={<Search className="w-4 h-4 text-primary-300" />}
          />
        </div>

        <div className="w-full sm:w-40">
          <DropdownSelect
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={onStatusChange}
            className="w-full"
          />
        </div>
      </div>

      {/* View Mode Toggle Buttons */}
      <div className="h-10 flex items-center gap-1 self-end sm:self-auto bg-slate-50 p-1 rounded-lg border border-dash">
        <button
          type="button"
          onClick={() => onViewModeChange("table")}
          className={`h-full flex items-center gap-1.5 px-3 rounded-md body-sm-medium transition-all cursor-pointer ${
            viewMode === "table"
              ? "bg-white text-primary-500 font-semibold shadow-2xs border border-dash"
              : "text-primary-400 hover:text-primary-500"
          }`}
          title="Table View"
        >
          <Table className="w-4 h-4 text-primary-400" />
          <span>Table</span>
        </button>

        <button
          type="button"
          onClick={() => onViewModeChange("grid")}
          className={`h-full flex items-center gap-1.5 px-3 rounded-md body-sm-medium transition-all cursor-pointer ${
            viewMode === "grid"
              ? "bg-white text-primary-500 font-semibold shadow-2xs border border-dash"
              : "text-primary-400 hover:text-primary-500"
          }`}
          title="Grid View"
        >
          <LayoutGrid className="w-4 h-4 text-primary-400" />
          <span>Grid</span>
        </button>
      </div>
    </div>
  );
}

export default CategoryToolbar;
