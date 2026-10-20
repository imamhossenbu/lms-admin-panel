"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { categoriesApi } from "@/lib/api";
import { InputField } from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { FolderPlus, CheckCircle2, Sparkles } from "lucide-react";
import { CategoryOption } from "./constants";

interface QuickCategoryAddProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: (category: CategoryOption) => void;
  onOpenCategoryManager?: () => void;
}

export function QuickCategoryAdd({
  isOpen,
  onClose,
  onCategoryCreated,
  onOpenCategoryManager,
}: QuickCategoryAddProps) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState("📚");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Category name required");
      return;
    }

    setIsSubmitting(true);
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");

    try {
      const created = await categoriesApi.create({
        name: name.trim(),
        slug,
        description: desc.trim() || undefined,
        icon,
      });

      const newOption: CategoryOption = {
        id: created.id,
        name: created.name,
        slug: created.slug,
      };

      onCategoryCreated(newOption);
      setName("");
      setDesc("");
      onClose();

      toast.success("Category Created!", {
        description: `"${newOption.name}" has been created and selected.`,
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      });
    } catch (err: any) {
      console.warn("Category quick create fallback:", err);
      const fallbackOption: CategoryOption = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        slug,
      };
      onCategoryCreated(fallbackOption);
      setName("");
      setDesc("");
      onClose();
      toast.success(`Category "${fallbackOption.name}" added locally.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-3.5 rounded-[10px] bg-blue-50/50 border border-blue-200/60 space-y-3 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <span className="body-xs-medium text-[#1C4D8D] font-bold flex items-center gap-1.5">
          <FolderPlus className="w-3.5 h-3.5" />
          <span>Quick Create New Category</span>
        </span>
        {onOpenCategoryManager && (
          <button
            type="button"
            onClick={onOpenCategoryManager}
            className="body-xsm-regular text-primary-400 hover:text-[#1C4D8D] underline cursor-pointer"
          >
            Open Category Hub →
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
        <div className="sm:col-span-3">
          <InputField
            label="Icon / Emoji"
            className="text-center text-lg"
            placeholder="📚"
            maxLength={4}
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
          />
        </div>
        <div className="sm:col-span-9">
          <InputField
            label="Category Name"
            required
            placeholder="e.g. Mobile App Development"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      <InputField
        label="Description (Optional)"
        placeholder="Short overview of what topics this category covers"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <div className="flex items-center justify-end gap-2 pt-1">
        <SecondaryButton
          size="sm"
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          size="sm"
          type="button"
          onClick={handleCreate}
          disabled={isSubmitting || !name.trim()}
          icon={<Sparkles className="w-3.5 h-3.5" />}
        >
          {isSubmitting ? "Saving..." : "Save & Select"}
        </PrimaryButton>
      </div>
    </div>
  );
}
