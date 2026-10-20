"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Edit3, Trash2 } from "lucide-react";
import { AdminCategoryItem } from "@/lib/types";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ToneBadge } from "@/components/ui/ToneBadge";

interface CategoryGridProps {
  categories: AdminCategoryItem[];
  onEdit: (cat: AdminCategoryItem) => void;
  onDelete: (cat: AdminCategoryItem) => void;
}

export function CategoryGrid({
  categories,
  onEdit,
  onDelete,
}: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat, idx) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: idx * 0.03 }}
          className="p-5 rounded-[12px] bg-white border border-[#EDEDED] hover:border-[#1C4D8D]/40 transition-all flex flex-col justify-between group shadow-xs hover:shadow-md text-left"
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <CategoryIcon icon={cat.icon} />
              <div className="flex items-center gap-1.5">
                <ToneBadge
                  tone={cat.status === "ACTIVE" ? "success" : "gray"}
                  size="sm"
                >
                  {cat.status}
                </ToneBadge>
              </div>
            </div>

            <h3 className="body-md-medium text-primary-500 font-bold group-hover:text-[#1C4D8D] transition-colors">
              {cat.name}
            </h3>

            <p className="body-xsm-regular subtext-500 mt-1 line-clamp-2 min-h-[32px]">
              {cat.description || "Instructional domain for LMS courses."}
            </p>
          </div>

          <div className="pt-4 mt-3 border-t border-[#EDEDED]/80 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-primary-400 body-xsm-regular">
              <BookOpen className="w-3.5 h-3.5 text-[#1C4D8D]" />
              <span className="font-semibold text-primary-500">
                {cat._count?.courses ?? 0}
              </span>
              <span>courses cataloged</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onEdit(cat)}
                className="p-1.5 rounded-[6px] text-primary-400 hover:text-[#1C4D8D] hover:bg-blue-50 transition-colors cursor-pointer"
                title="Edit Category"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(cat)}
                className="p-1.5 rounded-[6px] text-primary-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Delete Category"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
