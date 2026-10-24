"use client";

import React from "react";
import Link from "next/link";
import { Home, Plus } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface InstructorHeaderProps {
  onAddClick: () => void;
}

export function InstructorHeader({ onAddClick }: InstructorHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
      <div>
        {/* Breadcrumb matching design system */}
        <Breadcrumb
          items={[
            {
              label: "Home",
              href: "/",
              icon: <Home className="w-4 h-4" />,
            },
            {
              label: "Instructors",
            },
          ]}
          className="mb-1.5"
        />

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
