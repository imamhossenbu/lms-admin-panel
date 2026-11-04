"use client";

import React from "react";
import { CategoryItem } from "@/types/category";
import { CategoryIconRenderer } from "./CategoryIconRenderer";
import { BookOpen, Edit2, Eye } from "lucide-react";
import { motion } from "framer-motion";
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
  if (categories.length === 0) {
    return <p className="p-10 border-t border-dash text-center body-sm-regular text-primary-300">No categories match your filters.</p>;
  }

  return (
    <div className="p-4 border-t border-dash grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 text-left">
      {categories.map((category, i) => {
        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2, delay: Math.min(i, 10) * 0.03 }}
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

              <h4 className="heading-h6 text-primary-500 mb-1">{category.name}</h4>

              <p className="body-sm-regular text-primary-400 line-clamp-2">
                {category.description || "No description yet."}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-dash flex items-center justify-between">
              <span className="flex items-center gap-1 body-2xsm-regular text-primary-500">
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
          </motion.div>
        );
      })}
    </div>
  );
}

export default CategoryGrid;
