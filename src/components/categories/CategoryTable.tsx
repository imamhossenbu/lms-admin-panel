"use client";

import React from "react";
import { AdminCategoryItem } from "@/lib/types";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { Edit3, Trash2 } from "lucide-react";

interface CategoryTableProps {
  categories: AdminCategoryItem[];
  onEdit: (cat: AdminCategoryItem) => void;
  onDelete: (cat: AdminCategoryItem) => void;
}

export function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <div className="rounded-[12px] border border-[#EDEDED] bg-white overflow-hidden shadow-xs text-left">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-[#EDEDED] body-xsm-medium text-primary-400">
              <th className="py-3 px-4">Icon & Name</th>
              <th className="py-3 px-4">Slug Identifier</th>
              <th className="py-3 px-4">Course Density</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDEDED] body-sm-regular text-primary-500">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <CategoryIcon
                      icon={cat.icon}
                      className="w-9 h-9 text-lg"
                      imgClassName="object-contain p-0.5"
                    />
                    <div>
                      <span className="body-sm-medium text-primary-500 font-bold block">
                        {cat.name}
                      </span>
                      <span className="body-xsm-regular subtext-500 truncate max-w-xs block">
                        {cat.description || "Curriculum Category"}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-primary-400">
                  {cat.slug}
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-primary-500">
                    {cat._count?.courses ?? 0}
                  </span>{" "}
                  Courses
                </td>
                <td className="py-3.5 px-4">
                  <ToneBadge
                    tone={cat.status === "ACTIVE" ? "success" : "gray"}
                    size="sm"
                  >
                    {cat.status}
                  </ToneBadge>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
