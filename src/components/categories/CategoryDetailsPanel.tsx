"use client";

import React from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import type { CategoryItem } from "@/types/category";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { CategoryIconRenderer } from "./CategoryIconRenderer";

interface CategoryDetailsPanelProps {
  category: CategoryItem;
  /** Every category (parent and sub-category names). */
  categories: CategoryItem[];
  onClose: () => void;
  onEdit: (category: CategoryItem) => void;
  onDelete: (category: CategoryItem) => void;
}

function Metric({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="p-3 rounded-lg border border-dash bg-white text-center">
      <span className="body-2xsm-regular text-primary-300 block">{label}</span>
      <span className={`heading-h5 block mt-0.5 ${tone}`}>{value}</span>
    </div>
  );
}

/** Details mode of the category drawer: banner, course counts and Edit / Delete. */
export function CategoryDetailsPanel({ category, categories, onClose, onEdit, onDelete }: CategoryDetailsPanelProps) {
  const parent = category.parentId ? categories.find((c) => c.id === category.parentId) : undefined;
  const children = categories.filter((c) => c.parentId === category.id).sort((a, b) => a.name.localeCompare(b.name));
  const created = category.createdAt ? new Date(category.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";
  const blocked = category.totalCourses > 0 || children.length > 0;
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex-1 overflow-y-auto p-5 space-y-5">
        <div className="p-4 rounded-xl border border-dash bg-gray-bg/50 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <CategoryIconRenderer iconId={category.iconId} size="lg" />
              <div className="min-w-0">
                <h3 className="heading-h5 text-primary-500 truncate">{category.name}</h3>
                <span className="body-xsm-regular text-primary-300 font-mono">slug: /{category.slug}</span>
              </div>
            </div>
            <ToneBadge tone={category.status === "Active" ? "green" : "red"} size="md">
              {category.status}
            </ToneBadge>
          </div>
          <p className="body-sm-regular text-primary-400">{category.description || "No description yet."}</p>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <Metric label="Total Courses" value={category.totalCourses} tone="text-primary-500" />
          <Metric label="Published" value={category.publishedCourses} tone="text-brand-orange" />
          <Metric label="Not published" value={Math.max(0, category.totalCourses - category.publishedCourses)} tone="text-blue" />
        </div>

        <dl className="rounded-xl border border-dash bg-white divide-y divide-dash">
          <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
            <dt className="body-xsm-regular text-primary-300">Parent category</dt>
            <dd className="body-sm-medium text-primary-500 truncate">{parent ? parent.name : "None (top level)"}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
            <dt className="body-xsm-regular text-primary-300">Created</dt>
            <dd className="body-sm-medium text-primary-500">{created || "—"}</dd>
          </div>
        </dl>

        {!category.parentId && (
          <div>
            <span className="body-xsm-medium text-primary-400 block mb-2">Sub-categories ({children.length})</span>
            {children.length ? (
              <div className="flex flex-wrap gap-1.5">
                {children.map((c) => (
                  <ToneBadge key={c.id} tone={c.status === "Active" ? "blue" : "gray"} size="sm">
                    {c.name}
                  </ToneBadge>
                ))}
              </div>
            ) : (
              <p className="body-2xsm-regular text-primary-300">No sub-categories yet. Pick this category as the parent when you add or edit one.</p>
            )}
          </div>
        )}

        {children.length > 0 && (
          <p className="body-2xsm-regular text-primary-300">
            Move or delete the {children.length === 1 ? "sub-category" : `${children.length} sub-categories`} before deleting this category.
          </p>
        )}

        {category.totalCourses > 0 && (
          <p className="body-2xsm-regular text-primary-300">
            {category.totalCourses} course{category.totalCourses === 1 ? " uses" : "s use"} this category. Move {category.totalCourses === 1 ? "it" : "them"} to another
            category before deleting.
          </p>
        )}
      </motion.div>

      <div className="p-4 border-t border-dash bg-slate-50/50 flex items-center justify-between gap-3">
        <SecondaryButton onClick={onClose} size="md">
          Close
        </SecondaryButton>
        <div className="flex items-center gap-2">
          <SecondaryButton onClick={() => onDelete(category)} leftIcon={<Trash2 className="w-4 h-4" />} size="md" disabled={blocked}>
            Delete
          </SecondaryButton>
          <PrimaryButton onClick={() => onEdit(category)} icon={<Edit2 className="w-4 h-4" />} size="md">
            Edit Category
          </PrimaryButton>
        </div>
      </div>
    </>
  );
}

export default CategoryDetailsPanel;
