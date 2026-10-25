"use client";

import React, { useState, useEffect, useRef } from "react";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { AdminCategoryItem } from "@/lib/types";
import { coursesApi } from "@/lib/api";
import { toast } from "sonner";
import { UploadCloud, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { EMOJI_OPTIONS } from "./constants";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: AdminCategoryItem | null;
  onSave: (catData: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    status: "ACTIVE" | "INACTIVE";
  }) => Promise<void>;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  category,
  onSave,
}: CategoryFormModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState("⚡");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const isEditing = Boolean(category);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setDesc(category.description || "");
      setIcon(category.icon || "⚡");
      setStatus((category.status as "ACTIVE" | "INACTIVE") || "ACTIVE");
    } else {
      setName("");
      setSlug("");
      setDesc("");
      setIcon("⚡");
      setStatus("ACTIVE");
    }
  }, [category, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");
      setSlug(generatedSlug);
    }
  };

  const handleDeviceIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file (PNG, JPG, SVG, WebP)",
      });
      return;
    }

    setIsUploadingIcon(true);
    const toastId = toast.loading("Uploading icon to Cloudinary...");

    try {
      const res = await coursesApi.uploadThumbnail(file);
      if (res && res.url) {
        setIcon(res.url);
        toast.success("Icon uploaded to Cloudinary!", {
          id: toastId,
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        });
      }
    } catch {
      const localUrl = URL.createObjectURL(file);
      setIcon(localUrl);
      toast.info("Using local icon preview", { id: toastId });
    } finally {
      setIsUploadingIcon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        slug:
          slug.trim() ||
          name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-"),
        description: desc.trim() || undefined,
        icon,
        status,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { label: "Active (Catalog Visible)", value: "ACTIVE" },
    { label: "Inactive (Archived)", value: "INACTIVE" },
  ];

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Category" : "Add Academic Category"}
      subtitle={
        isEditing
          ? `Modify configuration for "${category?.name}"`
          : "Create a new discipline for organizing courses"
      }
      maxWidth="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !name.trim()}
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
              ? "Update Category"
              : "Create Category"}
          </PrimaryButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Icon & Emoji Selection */}
        <div className="space-y-2 p-3.5 rounded-[10px] bg-[#F8F9FA] border border-[#EDEDED]">
          <label className="body-sm-medium text-primary-500 font-semibold block">
            Category Icon / Visual Mark
          </label>

          <div className="flex items-center gap-3">
            <CategoryIcon
              icon={icon}
              className="w-14 h-14 text-2xl shadow-xs"
              imgClassName="object-contain p-1.5"
            />

            <div className="flex-1 space-y-1.5">
              <input
                ref={iconInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/svg+xml"
                onChange={handleDeviceIconUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => iconInputRef.current?.click()}
                disabled={isUploadingIcon}
                className="px-3 py-1.5 rounded-[8px] bg-white border border-[#EDEDED] hover:border-brand-orange text-brand-orange body-xsm-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                {isUploadingIcon ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <UploadCloud className="w-3.5 h-3.5" />
                )}
                <span>Upload Custom Icon / Logo</span>
              </button>

              <span className="body-2xsm-regular subtext-500 block">
                PNG, SVG, or WebP • Uploads to Cloudinary Cloud CDN
              </span>
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <span className="body-xsm-regular subtext-500 block">
              Or select a standard emoji mark:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`w-8 h-8 rounded-[6px] border text-base flex items-center justify-center transition-all cursor-pointer ${
                    icon === emoji
                      ? "border-brand-orange bg-brand-orange-light ring-2 ring-brand-orange/20"
                      : "border-[#EDEDED] bg-white hover:bg-gray-50"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Name & Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InputField
            label="Category Name"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Artificial Intelligence"
          />

          <InputField
            label="URL Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. artificial-intelligence"
          />
        </div>

        <InputField
          label="Description (Optional)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Summary of topics covered by this discipline"
        />

        <DropdownSelect
          fieldLabel="Category Status"
          options={statusOptions}
          value={status}
          onChange={(val) => setStatus(val as any)}
        />
      </form>
    </ModalShell>
  );
}
