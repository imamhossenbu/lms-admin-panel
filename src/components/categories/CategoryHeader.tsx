"use client";

import React from "react";
import Link from "next/link";
import { Home, Plus } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface CategoryHeaderProps {
  onAddClick: () => void;
}

export function CategoryHeader({ onAddClick }: CategoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-[16px] text-left">
      <div>
        {/* Reusable breadcrumb with ChevronRight */}
        <Breadcrumb
          items={[
            {
              label: "Dashboard",
              href: "/",
              icon: <Home className="w-4 h-4" />,
            },
            {
              label: "Categories",
            },
          ]}
          className="mb-1.5"
        />

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
