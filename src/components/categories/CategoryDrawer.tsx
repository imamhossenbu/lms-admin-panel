"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Edit2, FolderTree, X } from "lucide-react";
import type { CategoryDrawerMode, CategoryItem } from "@/types/category";
import { CategoryForm } from "./CategoryForm";
import { CategoryDetailsPanel } from "./CategoryDetailsPanel";

interface CategoryDrawerProps {
  isOpen: boolean;
  mode: CategoryDrawerMode;
  /** The category for edit / details; null in create mode. */
  category: CategoryItem | null;
  /** Every category of the workspace (parent picker, parent / sub-category names). */
  categories: CategoryItem[];
  onClose: () => void;
  onSaved: (item: CategoryItem) => void;
  onOpenEdit: (category: CategoryItem) => void;
  onDelete: (category: CategoryItem) => void;
}

const HEADER: Record<CategoryDrawerMode, { title: string; subtitle: string; icon: React.ReactNode }> = {
  create: { title: "Add New Category", subtitle: "Create a category to organize your courses.", icon: <FolderTree className="w-4 h-4 text-brand-orange" /> },
  edit: { title: "Edit Category", subtitle: "Update the category's name, slug, parent, icon and status.", icon: <Edit2 className="w-4 h-4 text-brand-orange" /> },
  details: { title: "Category Details", subtitle: "Overview and course counts.", icon: <BookOpen className="w-4 h-4 text-brand-orange" /> },
};

/** Slide-over for creating, editing and viewing one category. */
export function CategoryDrawer({ isOpen, mode, category, categories, onClose, onSaved, onOpenEdit, onDelete }: CategoryDrawerProps) {
  const header = HEADER[mode];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-drawer-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-120 bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-dash text-left"
          >
            <div className="px-5 py-4 border-b border-dash flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-orange-light text-brand-orange flex items-center justify-center">{header.icon}</div>
                <div>
                  <h2 id="category-drawer-title" className="title-medium text-primary-500">
                    {header.title}
                  </h2>
                  <p className="body-2xsm-regular text-primary-300 mt-1">{header.subtitle}</p>
                </div>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-300 hover:text-primary-500 hover:bg-slate-200/60 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {mode === "details" && category ? (
              <CategoryDetailsPanel category={category} categories={categories} onClose={onClose} onEdit={onOpenEdit} onDelete={onDelete} />
            ) : (
              <CategoryForm key={`${mode}-${category?.id ?? "new"}`} category={mode === "edit" ? category : null} categories={categories} onCancel={onClose} onSaved={onSaved} />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CategoryDrawer;
