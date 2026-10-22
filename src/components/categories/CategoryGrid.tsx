"use client";

import React from "react";
import { CategoryItem } from "@/types/category";
import { CategoryIconRenderer } from "./CategoryIconRenderer";
import { BookOpen } from "lucide-react";

interface CategoryGridProps {
  categories: CategoryItem[];
  onEdit?: (category: CategoryItem) => void;
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="p-4 border-t border-dash grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white rounded-xl border border-dash p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow flex flex-col justify-between text-left"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <CategoryIconRenderer iconId={category.iconId} size="lg" />
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md body-2xsm-regular font-semibold ${
                  category.status === "Active"
                    ? "bg-green-bg text-green"
                    : "bg-red-14 text-red"
                }`}
              >
                {category.status}
              </span>
            </div>

            <h4 className="heading-h6 font-bold text-primary-500 mb-1">
              {category.name}
            </h4>
            <p className="body-sm-regular text-primary-400 line-clamp-2">
              {category.description}
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-dash flex items-center justify-between body-2xsm-regular text-primary-300">
            <span className="flex items-center gap-1 font-medium text-primary-500">
              <BookOpen className="w-3.5 h-3.5 text-brand-orange" />
              <span>{category.totalCourses} Courses</span>
            </span>
            <span>Created {category.createdDate}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
