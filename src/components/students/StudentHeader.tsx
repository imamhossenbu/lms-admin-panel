"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { LimitGuard } from "@/components/plan-gate/LimitGuard";

interface StudentHeaderProps {
  onAddClick?: () => void;
}

export function StudentHeader({ onAddClick }: StudentHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 text-left">
      <div>
        {/* Reusable breadcrumbs using Breadcrumb component with ChevronRight */}
        <Breadcrumb
          items={[{ label: "Students" }]}
          className="mb-1.5"
        />

        {/* Title & Subtitle */}
        <h1 className="heading-h4 text-primary-500 tracking-tight">
          Students
        </h1>
        <p className="body-sm-regular text-primary-300 mt-0.5">
          Manage your students, view their progress and learning activity.
        </p>
      </div>

      {/* Add Student CTA Button Linking to Create Page */}
      <LimitGuard limitKey="students" className="shrink-0 self-start sm:self-auto">
        {({ disabled }) => {
          const button = (
            <PrimaryButton
              type="button"
              onClick={onAddClick}
              disabled={disabled}
              icon={<Plus className="w-4 h-4" strokeWidth={2.5} />}
              size="md"
              className="shrink-0 self-start sm:self-auto"
            >
              Add Student
            </PrimaryButton>
          );
          return disabled ? button : <Link href="/students/create">{button}</Link>;
        }}
      </LimitGuard>
    </div>
  );
}

export default StudentHeader;
