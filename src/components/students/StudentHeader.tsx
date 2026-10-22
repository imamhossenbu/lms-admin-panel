"use client";

import React from "react";
import Link from "next/link";
import { Home, Plus } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";

interface StudentHeaderProps {
  onAddClick: () => void;
}

export function StudentHeader({ onAddClick }: StudentHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-[16px] text-left">
      <div>
        {/* Prominent breadcrumbs using globals.css tokens */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-1.5">
          <Link
            href="/"
            className="body-sm-medium text-primary-400 hover:text-brand-orange transition-colors flex items-center gap-1.5 group"
          >
            <Home className="w-4 h-4 text-primary-300 group-hover:text-brand-orange transition-colors" />
            <span>Home</span>
          </Link>
          <span className="body-sm-regular text-primary-300">/</span>
          <span className="body-sm-medium text-primary-500 font-semibold">
            Students
          </span>
        </nav>

        {/* Title & Subtitle */}
        <h1 className="heading-h4 text-primary-500 font-bold tracking-tight">
          Students
        </h1>
        <p className="body-sm-regular text-primary-300 mt-0.5">
          Manage your students, view their progress and learning activity.
        </p>
      </div>

      {/* Add Student CTA Button */}
      <PrimaryButton
        type="button"
        onClick={onAddClick}
        icon={<Plus className="w-4 h-4 stroke-[2.5]" />}
        size="md"
        className="shrink-0 self-start sm:self-auto"
      >
        Add Student
      </PrimaryButton>
    </div>
  );
}

export default StudentHeader;
