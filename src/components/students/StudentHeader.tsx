"use client";

import React from "react";
import Link from "next/link";
import { Home, Plus } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface StudentHeaderProps {
  onAddClick?: () => void;
}

export function StudentHeader({ onAddClick }: StudentHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-[16px] text-left">
      <div>
        {/* Reusable breadcrumbs using Breadcrumb component with ChevronRight */}
        <Breadcrumb
          items={[
            {
              label: "Home",
              href: "/",
              icon: <Home className="w-4 h-4" />,
            },
            {
              label: "Students",
            },
          ]}
          className="mb-1.5"
        />

        {/* Title & Subtitle */}
        <h1 className="heading-h4 text-primary-500 font-bold tracking-tight">
          Students
        </h1>
        <p className="body-sm-regular text-primary-300 mt-0.5">
          Manage your students, view their progress and learning activity.
        </p>
      </div>

      {/* Add Student CTA Button Linking to Create Page */}
      <Link href="/students/create">
        <PrimaryButton
          type="button"
          onClick={onAddClick}
          icon={<Plus className="w-4 h-4 stroke-[2.5]" />}
          size="md"
          className="shrink-0 self-start sm:self-auto"
        >
          Add Student
        </PrimaryButton>
      </Link>
    </div>
  );
}

export default StudentHeader;
