"use client";

import React from "react";
import { Search, ChevronDown, Table, LayoutGrid } from "lucide-react";

interface CategoryToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
}

export function CategoryToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  viewMode,
  onViewModeChange,
}: CategoryToolbarProps) {
  return (
    <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Search Input and Status Dropdown */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-primary-300 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search categories..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#F8FAFC]/60 border border-dash body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none focus:border-brand-orange focus:bg-white transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-9 pl-3 pr-8 rounded-lg border border-dash bg-white body-sm-medium text-primary-500 appearance-none focus:outline-none focus:border-brand-orange transition-colors cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-primary-300 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* View Mode Toggle Buttons */}
      <div className="flex items-center gap-1 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => onViewModeChange("table")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg body-sm-medium transition-all cursor-pointer ${
            viewMode === "table"
              ? "bg-brand-orange text-white font-semibold shadow-2xs"
              : "text-primary-400 hover:bg-slate-50 hover:text-primary-500"
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Table</span>
        </button>

        <button
          type="button"
          onClick={() => onViewModeChange("grid")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg body-sm-medium transition-all cursor-pointer ${
            viewMode === "grid"
              ? "bg-brand-orange text-white font-semibold shadow-2xs"
              : "text-primary-400 hover:bg-slate-50 hover:text-primary-500"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Grid</span>
        </button>
      </div>
    </div>
  );
}
