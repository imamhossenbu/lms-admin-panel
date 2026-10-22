"use client";

import React from "react";
import { CategoryItem } from "@/types/category";
import { CategoryIconRenderer } from "./CategoryIconRenderer";
import { BookOpen, Layers, Edit2, Eye } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";

interface CategoryGridProps {
  categories: CategoryItem[];
  onEdit: (category: CategoryItem) => void;
  onViewDetails: (category: CategoryItem) => void;
}

export function CategoryGrid({
  categories,
  onEdit,
  onViewDetails,
}: CategoryGridProps) {
  return (
    <div className="p-4 border-t border-dash grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 text-left">
      {categories.map((category) => {
        const subCount = category.subCategories?.length || 0;

        return (
          <div
            key={category.id}
            className="bg-white rounded-xl border border-dash p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <CategoryIconRenderer iconId={category.iconId} size="lg" />
                <ToneBadge
                  tone={category.status === "Active" ? "green" : "red"}
                  size="sm"
                >
                  {category.status}
                </ToneBadge>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <h4 className="heading-h6 font-bold text-primary-500">
                  {category.name}
                </h4>
                {subCount > 0 && (
                  <span className="body-2xsm-regular px-2 py-0.5 rounded-full bg-slate-100 text-primary-400 font-medium flex items-center gap-1">
                    <Layers className="w-3 h-3 text-brand-orange" />
                    <span>{subCount}</span>
                  </span>
                )}
              </div>

              <p className="body-sm-regular text-primary-400 line-clamp-2">
                {category.description}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-dash flex items-center justify-between">
              <span className="flex items-center gap-1 body-2xsm-regular font-semibold text-primary-500">
                <BookOpen className="w-3.5 h-3.5 text-brand-orange" />
                <span>{category.totalCourses} Courses</span>
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onViewDetails(category)}
                  className="p-1.5 rounded-lg text-primary-300 hover:text-primary-500 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(category)}
                  className="p-1.5 rounded-lg text-primary-300 hover:text-brand-orange hover:bg-brand-orange-light/50 transition-colors cursor-pointer"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CategoryGrid;
