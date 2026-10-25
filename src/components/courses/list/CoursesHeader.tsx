"use client";

import React from "react";
import { Home, Plus, FolderTree } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PrimaryButton } from "@/components/ui/primary-button";

interface CoursesHeaderProps {
  onCreate: () => void;
  onCategories: () => void;
}

const OUTLINE =
  "h-11 px-4 rounded-lg border border-dash bg-white body-sm-medium text-primary-500 hover:bg-slate-50 transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap";

export function CoursesHeader({ onCreate, onCategories }: CoursesHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 text-left">
      <div>
        <Breadcrumb items={[{ label: "Home", href: "/", icon: <Home className="w-4 h-4" /> }, { label: "Courses" }]} className="mb-1.5" />
        <h1 className="heading-h3 font-bold text-primary-500 tracking-tight">Courses</h1>
        <p className="body-sm-regular text-primary-400 mt-1">Create, publish and manage every course in your catalog.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={onCategories} className={OUTLINE}>
          <FolderTree className="w-4 h-4 text-primary-400" />
          Categories
        </button>
        <PrimaryButton type="button" size="lg" onClick={onCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Create Course
        </PrimaryButton>
      </div>
    </div>
  );
}

export default CoursesHeader;
