"use client";

import React from "react";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/Breadcrumb";

interface InstructorFormHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export function InstructorFormHeader({
  breadcrumbs,
  icon,
  title,
  subtitle,
}: InstructorFormHeaderProps) {
  return (
    <div className="space-y-4 text-left">
      <Breadcrumb items={breadcrumbs} />

      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-11 h-11 rounded-full bg-blue-14 text-blue flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <h1 className="heading-h4 text-primary-500 tracking-tight truncate">
            {title}
          </h1>
          <p className="body-sm-regular text-primary-300 mt-0.5">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default InstructorFormHeader;
