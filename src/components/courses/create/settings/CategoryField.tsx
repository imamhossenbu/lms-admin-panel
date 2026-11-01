"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { AppSelect } from "@/components/ui/AppSelect";
import { QuickCategoryAdd } from "@/components/courses/QuickCategoryAdd";
import { FieldError } from "../basic/FieldLabel";
import { SettingsActionButton } from "./SettingsActionButton";

export interface CategoryFieldProps {
  categories: { id: string; name: string }[];
  value: string;
  onChange: (id: string) => void;
  onCategoryCreated?: (category: { id: string; name: string }) => void;
  error?: string;
}

/** Category select + "Add New Category" button that expands the quick-create panel. */
export function CategoryField({ categories, value, onChange, onCategoryCreated, error }: CategoryFieldProps) {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 min-w-0">
          <AppSelect
            fullWidth
            value={value}
            onValueChange={onChange}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            placeholder={categories.length ? "Select category" : "No categories available"}
            disabled={!categories.length}
            triggerClassName={error ? "border-red bg-red-14" : undefined}
          />
          <FieldError message={error} />
        </div>
        {onCategoryCreated && (
          <SettingsActionButton
            icon={isAdding ? <X /> : <Plus />}
            active={isAdding}
            onClick={() => setIsAdding((open) => !open)}
          >
            {isAdding ? "Cancel" : "Add New Category"}
          </SettingsActionButton>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isAdding && onCategoryCreated && (
          <motion.div
            key="quick-category"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <QuickCategoryAdd
              isOpen
              onClose={() => setIsAdding(false)}
              onCategoryCreated={(category) => {
                onCategoryCreated({ id: category.id, name: category.name });
                onChange(category.id);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CategoryField;
