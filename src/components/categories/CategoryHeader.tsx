"use client";

import React from "react";
import Link from "next/link";
import { Home, Plus } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";

interface CategoryHeaderProps {
  onAddClick: () => void;
}

export function CategoryHeader({ onAddClick }: CategoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-[16px] text-left">
      <div>
        {/* Prominent, readable breadcrumb using globals.css tokens */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-1.5">
          <Link
            href="/"
            className="body-sm-medium text-primary-400 hover:text-brand-orange transition-colors flex items-center gap-1.5 group"
          >
            <Home className="w-4 h-4 text-primary-300 group-hover:text-brand-orange transition-colors" />
            <span>Dashboard</span>
          </Link>
          <span className="body-sm-regular text-primary-300">/</span>
          <span className="body-sm-medium text-primary-500 font-semibold">
            Categories
          </span>
        </nav>

        {/* Title & Subtitle with strict globals typography */}
        <h1 className="heading-h4 text-primary-500 font-bold tracking-tight">
          Categories Management
        </h1>
        <p className="body-sm-regular text-primary-300 mt-0.5">
          Organize your courses into clear learning categories and sub-categories.
        </p>
      </div>

      {/* Add Category CTA Button using Reusable PrimaryButton */}
      <PrimaryButton
        type="button"
        onClick={onAddClick}
        icon={<Plus className="w-4 h-4 stroke-[2.5]" />}
        size="md"
        className="shrink-0 self-start sm:self-auto"
      >
        Add Category
      </PrimaryButton>
    </div>
  );
}

export default CategoryHeader;
