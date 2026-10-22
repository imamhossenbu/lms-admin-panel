"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, ChevronDown, Loader2 } from "lucide-react";
import { CATEGORY_ICONS } from "@/data/mockCategoryData";
import { CategoryIconRenderer } from "./CategoryIconRenderer";
import { CategoryItem } from "@/types/category";
import { toast } from "sonner";

const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name is too long"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(200, "Description cannot exceed 200 characters"),
  iconId: z.string().min(1, "Please choose an icon"),
  status: z.enum(["Active", "Inactive"]),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface AddCategoryCardProps {
  onClose?: () => void;
  onCategoryCreated: (category: CategoryItem) => void;
}

export function AddCategoryCard({
  onClose,
  onCategoryCreated,
}: AddCategoryCardProps) {
  const [selectedIcon, setSelectedIcon] = useState("code");
  const [descriptionCount, setDescriptionCount] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      iconId: "code",
      status: "Active",
    },
  });

  const selectedStatus = watch("status");

  const handleSelectIcon = (id: string) => {
    setSelectedIcon(id);
    setValue("iconId", id, { shouldValidate: true });
  };

  const onSubmit = async (data: CategoryFormData) => {
    const toastId = toast.loading("Creating category...", {
      description: `Saving "${data.name}" to curriculum taxonomy.`,
    });

    try {
      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newCategory: CategoryItem = {
        id: `cat-${Date.now()}`,
        orderNumber: Math.floor(Math.random() * 50) + 11,
        name: data.name,
        slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: data.description,
        totalCourses: 0,
        publishedCourses: 0,
        status: data.status,
        createdDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        iconId: data.iconId,
        colorScheme: "orange",
      };

      onCategoryCreated(newCategory);

      toast.success("Category Created", {
        id: toastId,
        description: `"${data.name}" has been successfully added.`,
      });

      reset();
      setDescriptionCount(0);
      setSelectedIcon("code");
    } catch {
      toast.error("Failed to Create Category", {
        id: toastId,
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-dash shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden text-left flex flex-col justify-between">
      {/* Card Header */}
      <div className="p-4 border-b border-dash flex items-center justify-between">
        <h3 className="heading-h6 font-bold text-primary-500 text-sm">
          Add Category
        </h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-primary-300 hover:text-primary-500 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
        {/* Category Name */}
        <div>
          <label className="block body-sm-medium text-primary-500 font-medium mb-1.5">
            Category Name <span className="text-red">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter category name"
            {...register("name")}
            className="w-full h-9 px-3 rounded-lg border border-dash body-sm-regular text-primary-500 focus:outline-none focus:border-brand-orange transition-colors"
          />
          {errors.name && (
            <p className="body-2xsm-regular text-red font-medium mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block body-sm-medium text-primary-500 font-medium mb-1.5">
            Description
          </label>
          <div className="relative">
            <textarea
              rows={3}
              placeholder="Enter a short description about this category..."
              maxLength={200}
              {...register("description", {
                onChange: (e) => setDescriptionCount(e.target.value.length),
              })}
              className="w-full p-2.5 rounded-lg border border-dash body-sm-regular text-primary-500 focus:outline-none focus:border-brand-orange transition-colors resize-none pb-6"
            />
            <span className="absolute right-2.5 bottom-2 body-2xsm-regular text-primary-300 font-medium select-none">
              {descriptionCount}/200
            </span>
          </div>
          {errors.description && (
            <p className="body-2xsm-regular text-red font-medium mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Category Icon */}
        <div>
          <label className="block body-sm-medium text-primary-500 font-medium mb-2">
            Category Icon
          </label>
          <div className="grid grid-cols-5 gap-2">
            {CATEGORY_ICONS.map((icon) => {
              const isSelected = selectedIcon === icon.id;

              return (
                <button
                  key={icon.id}
                  type="button"
                  onClick={() => handleSelectIcon(icon.id)}
                  className={`h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                    isSelected
                      ? "border-2 border-brand-orange bg-[#FFF4ED] shadow-xs"
                      : "border-dash hover:border-slate-300 bg-white"
                  }`}
                  title={icon.label}
                >
                  <CategoryIconRenderer iconId={icon.id} size="sm" />
                </button>
              );
            })}
          </div>
          {errors.iconId && (
            <p className="body-2xsm-regular text-red font-medium mt-1">
              {errors.iconId.message}
            </p>
          )}
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block body-sm-medium text-primary-500 font-medium mb-1.5">
            Status
          </label>
          <div className="relative">
            <select
              {...register("status")}
              className="w-full h-9 pl-8 pr-8 rounded-lg border border-dash bg-white body-sm-medium text-primary-500 appearance-none focus:outline-none focus:border-brand-orange transition-colors cursor-pointer"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* Status Dot */}
            <span
              className={`w-2 h-2 rounded-full absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                selectedStatus === "Active" ? "bg-green" : "bg-red"
              }`}
            />
            <ChevronDown className="w-3.5 h-3.5 text-primary-300 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-dash flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              reset();
              setDescriptionCount(0);
              onClose?.();
            }}
            className="px-4 py-2 rounded-lg border border-dash body-sm-medium text-primary-400 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg bg-brand-orange hover:bg-brand-orange-hover text-white body-sm-medium font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <span>Create Category</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
