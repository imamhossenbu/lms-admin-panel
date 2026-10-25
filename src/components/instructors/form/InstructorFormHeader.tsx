"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/Breadcrumb";

interface InstructorFormHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  backHref: string;
  backLabel: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export function InstructorFormHeader({
  breadcrumbs,
  backHref,
  backLabel,
  icon,
  title,
  subtitle,
}: InstructorFormHeaderProps) {
  return (
    <div className="space-y-4 text-left">
      <Breadcrumb items={breadcrumbs} />

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-dash bg-white text-primary-500 hover:bg-slate-50 body-sm-medium transition-colors shadow-2xs w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-primary-400" />
          <span>{backLabel}</span>
        </Link>

        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-full bg-blue-14 text-blue flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div className="min-w-0">
            <h1 className="heading-h4 font-bold text-primary-500 tracking-tight truncate">
              {title}
            </h1>
            <p className="body-sm-regular text-primary-300 mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorFormHeader;
