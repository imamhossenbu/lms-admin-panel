"use client";

import React from "react";
import Link from "next/link";
import { Home, Plus } from "lucide-react";

interface CategoryHeaderProps {
  onAddClick: () => void;
}

export function CategoryHeader({ onAddClick }: CategoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-[12px] text-left">
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 body-2xsm-regular text-primary-300 mb-1">
          <Link
            href="/"
            className="hover:text-primary-500 transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
          </Link>
          <span>/</span>
          <span className="text-primary-400 font-medium">Categories</span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-[22px] sm:text-[24px] font-bold text-primary-500 tracking-tight leading-tight">
          Categories
        </h1>
        <p className="body-sm-regular text-primary-300 mt-0.5">
          Organize your courses into clear learning categories.
        </p>
      </div>

      {/* Add Category CTA Button */}
      <button
        type="button"
        onClick={onAddClick}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-orange hover:bg-brand-orange-hover text-white body-sm-medium font-semibold shadow-2xs transition-all cursor-pointer shrink-0 self-start sm:self-auto"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Add Category</span>
      </button>
    </div>
  );
}
