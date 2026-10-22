"use client";

import React from "react";
import Link from "next/link";
import { Home, Plus } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";

interface InstructorHeaderProps {
  onAddClick: () => void;
}

export function InstructorHeader({ onAddClick }: InstructorHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
      <div>
        {/* Breadcrumb matching design system */}
        <div className="flex items-center gap-2 mb-1.5 body-sm-regular text-primary-400">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-brand-orange transition-colors"
          >
            <Home className="w-4 h-4 text-primary-300" />
          </Link>
          <span className="text-primary-300">/</span>
          <span className="text-primary-500 font-semibold">Instructors</span>
        </div>

        {/* Page Heading & Subtitle */}
        <h1 className="heading-h3 text-primary-500 font-bold tracking-tight">
          Instructors
        </h1>
        <p className="body-sm-regular text-primary-400 mt-1">
          Manage your instructors, their courses and performance.
        </p>
      </div>

      {/* CTA Button */}
      <div className="shrink-0">
        <PrimaryButton
          onClick={onAddClick}
          leftIcon={<Plus className="w-4 h-4" />}
          size="md"
        >
          Add Instructor
        </PrimaryButton>
      </div>
    </div>
  );
}

export default InstructorHeader;
