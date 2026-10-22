"use client";

import React, { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

interface DashboardHeaderProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  onCreateCourse: () => void;
}

const PERIOD_OPTIONS = [
  "Today",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "This Year",
];

export function DashboardHeader({
  selectedPeriod,
  onPeriodChange,
  onCreateCourse,
}: DashboardHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-[12px]">
      {/* Title & Subtitle */}
      <div className="text-left">
        <h1 className="heading-h1-bold text-primary-500 tracking-tight font-extrabold">
          Overview
        </h1>
        <p className="body-regular text-primary-300 mt-1">
          Here&apos;s what&apos;s happening across your LMS today.
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Period Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-dash bg-white body-sm-medium text-primary-500 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span>{selectedPeriod}</span>
            <ChevronDown className="w-4 h-4 text-primary-300" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-xl shadow-lg border border-dash py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
              {PERIOD_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onPeriodChange(option);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 body-sm-medium transition-colors cursor-pointer ${
                    selectedPeriod === option
                      ? "text-brand-orange bg-brand-orange-light font-semibold"
                      : "text-primary-500 hover:bg-slate-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Create Course Button */}
        <button
          type="button"
          onClick={onCreateCourse}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white body-sm-medium font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Course</span>
        </button>
      </div>
    </div>
  );
}
