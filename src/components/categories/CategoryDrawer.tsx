"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  X,
  Edit2,
  FolderTree,
  BookOpen,
  Calendar,
  Layers,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import {
  CategoryItem,
  SubCategoryItem,
  CategoryDrawerMode,
  CategoryStatus,
} from "@/types/category";
import { CATEGORY_ICONS } from "@/data/mockCategoryData";
import { InputField } from "@/components/ui/InputField";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CategoryIconRenderer } from "./CategoryIconRenderer";
import { toast } from "sonner";

const categorySchema = z
  .object({
    name: z
      .string()
      .min(2, "Category name must be at least 2 characters")
      .max(60, "Category name cannot exceed 60 characters"),
    slug: z
      .string()
      .min(2, "Slug must be at least 2 characters")
      .regex(
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens"
      ),
    description: z
      .string()
      .max(300, "Description cannot exceed 300 characters"),
    isSubCategory: z.boolean(),
    parentId: z.string().optional(),
    status: z.enum(["Active", "Inactive"]),
    iconId: z.string().min(1, "Please select an icon"),
  })
  .refine(
    (data) => !data.isSubCategory || (data.isSubCategory && !!data.parentId),
    {
      message: "Please select a parent category for this sub-category",
      path: ["parentId"],
    }
  );

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryDrawerProps {
  isOpen: boolean;
  mode: CategoryDrawerMode;
  category: CategoryItem | null;
  editingSubCategory?: SubCategoryItem | null;
  parentCategories: CategoryItem[];
  onClose: () => void;
  onSave: (payload: {
    id?: string;
    name: string;
    slug: string;
    description: string;
    status: CategoryStatus;
    iconId: string;
    isSubCategory: boolean;
    parentId?: string;
  }) => void;
  onOpenEdit?: (category: CategoryItem) => void;
  onOpenEditSubCategory?: (
    subCategory: SubCategoryItem,
    parentCategory: CategoryItem
  ) => void;
}

export function CategoryDrawer({
  isOpen,
  mode,
  category,
  editingSubCategory,
  parentCategories,
  onClose,
  onSave,
  onOpenEdit,
  onOpenEditSubCategory,
}: CategoryDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      isSubCategory: false,
      parentId: "",
      status: "Active",
      iconId: "code",
    },
  });

  const isSubCategory = watch("isSubCategory");
  const selectedIconId = watch("iconId");
  const descriptionValue = watch("description") || "";

  // Synchronize form values whenever drawer opens or mode/category/subCategory changes
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit") {
      if (editingSubCategory) {
        // Editing an existing sub-category
        reset({
          name: editingSubCategory.name,
          slug: editingSubCategory.slug,
          description: editingSubCategory.description || "",
          isSubCategory: true,
          parentId: editingSubCategory.parentId || category?.id || "",
          status: editingSubCategory.status,
          iconId: category?.iconId || "code",
        });
      } else if (category) {
        // Editing an existing parent category
        reset({
          name: category.name,
          slug: category.slug,
          description: category.description || "",
          isSubCategory: Boolean(category.parentId),
          parentId: category.parentId || "",
          status: category.status,
          iconId: category.iconId || "code",
        });
      }
    } else if (mode === "create") {
      reset({
        name: "",
        slug: "",
        description: "",
        isSubCategory: false,
        parentId: parentCategories[0]?.id || "",
        status: "Active",
        iconId: "code",
      });
    }
  }, [isOpen, mode, category, editingSubCategory, reset, parentCategories]);

  // Handle auto slug generator when name changes (only in create mode)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name, { shouldValidate: true });
    if (mode === "create") {
      const generatedSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading(
      mode === "create" ? "Creating category..." : "Updating category..."
    );

    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const targetId = editingSubCategory ? editingSubCategory.id : category?.id;

      onSave({
        id: targetId,
        name: data.name,
        slug: data.slug,
        description: data.description || "",
        status: data.status as CategoryStatus,
        iconId: data.iconId,
        isSubCategory: data.isSubCategory,
        parentId: data.isSubCategory ? data.parentId : undefined,
      });

      toast.success(
        mode === "create" ? "Category Created" : "Saved Successfully",
        {
          id: toastId,
          description: data.isSubCategory
            ? `Sub-category "${data.name}" was saved.`
            : `Category "${data.name}" was saved.`,
        }
      );
      setIsSubmitting(false);
      onClose();
    } catch {
      toast.error("Operation Failed", {
        id: toastId,
        description: "Something went wrong. Please check your fields and try again.",
      });
      setIsSubmitting(false);
    }
  };

  const parentSelectOptions = parentCategories.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-dash text-left"
          >
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-dash flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-orange-light text-brand-orange flex items-center justify-center">
                  {mode === "details" ? (
                    <BookOpen className="w-4 h-4 text-brand-orange" />
                  ) : mode === "edit" ? (
                    <Edit2 className="w-4 h-4 text-brand-orange" />
                  ) : (
                    <FolderTree className="w-4 h-4 text-brand-orange" />
                  )}
                </div>
                <div>
                  <h2 className="title-medium text-primary-500 font-bold leading-none">
                    {mode === "details"
                      ? "Category Details"
                      : mode === "edit"
                      ? editingSubCategory
                        ? `Edit Sub-Category`
                        : `Edit Category`
                      : "Add New Category"}
                  </h2>
                  <p className="body-2xsm-regular text-primary-300 mt-1">
                    {mode === "details"
                      ? "Overview and nested sub-categories."
                      : mode === "edit"
                      ? editingSubCategory
                        ? `Editing sub-category under "${category?.name || "Parent"}"`
                        : `Update category details and hierarchy.`
                      : "Create a top-level category or nested sub-category."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-300 hover:text-primary-500 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* MODE 1: DETAILS VIEW */}
              {mode === "details" && category && (
                <div className="space-y-5">
                  {/* Category Banner Card */}
                  <div className="p-4 rounded-xl border border-dash bg-[#F8FAFC]/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CategoryIconRenderer
                          iconId={category.iconId}
                          size="lg"
                        />
                        <div>
                          <h3 className="heading-h5 text-primary-500 font-bold">
                            {category.name}
                          </h3>
                          <span className="body-xsm-regular text-primary-300 font-mono">
                            slug: /{category.slug}
                          </span>
                        </div>
                      </div>
                      <ToneBadge
                        tone={category.status === "Active" ? "green" : "red"}
                        size="md"
                      >
                        {category.status}
                      </ToneBadge>
                    </div>

                    <p className="body-sm-regular text-primary-400">
                      {category.description}
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-lg border border-dash bg-white text-center">
                      <span className="body-2xsm-regular text-primary-300 block">
                        Total Courses
                      </span>
                      <span className="heading-h5 text-primary-500 font-bold block mt-0.5">
                        {category.totalCourses}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg border border-dash bg-white text-center">
                      <span className="body-2xsm-regular text-primary-300 block">
                        Published
                      </span>
                      <span className="heading-h5 text-brand-orange font-bold block mt-0.5">
                        {category.publishedCourses}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg border border-dash bg-white text-center">
                      <span className="body-2xsm-regular text-primary-300 block">
                        Sub-categories
                      </span>
                      <span className="heading-h5 text-blue font-bold block mt-0.5">
                        {category.subCategories?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Sub-categories List with Edit Option for Sub-categories! */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-primary-400" />
                        <h4 className="title-sm text-primary-500 font-bold">
                          Sub-categories ({category.subCategories?.length || 0})
                        </h4>
                      </div>
                      <span className="body-2xsm-regular text-primary-300">
                        Under {category.name}
                      </span>
                    </div>

                    {category.subCategories &&
                    category.subCategories.length > 0 ? (
                      <div className="rounded-xl border border-dash divide-y divide-dash overflow-hidden bg-white">
                        {category.subCategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                          >
                            <div>
                              <span className="body-sm-medium text-primary-500 font-semibold block">
                                {sub.name}
                              </span>
                              <span className="body-2xsm-regular text-primary-300 font-mono">
                                /{sub.slug}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="body-2xsm-regular px-2 py-0.5 rounded bg-slate-100 text-primary-400 font-medium">
                                {sub.courseCount} courses
                              </span>
                              <ToneBadge
                                tone={sub.status === "Active" ? "green" : "red"}
                                size="sm"
                              >
                                {sub.status}
                              </ToneBadge>

                              {/* Edit Sub-category directly from details view */}
                              <button
                                type="button"
                                onClick={() =>
                                  onOpenEditSubCategory &&
                                  onOpenEditSubCategory(sub, category)
                                }
                                className="p-1 rounded-md text-primary-300 hover:text-brand-orange hover:bg-brand-orange-light/50 transition-colors cursor-pointer"
                                title={`Edit ${sub.name}`}
                              >
                                <Edit2 className="w-3.5 h-3.5 text-brand-orange" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 rounded-xl border border-dashed border-dash text-center bg-[#F8FAFC]">
                        <HelpCircle className="w-6 h-6 text-primary-300 mx-auto mb-1.5" />
                        <span className="body-sm-medium text-primary-400 block">
                          No sub-categories yet
                        </span>
                        <span className="body-2xsm-regular text-primary-300 block mt-0.5">
                          You can add sub-categories under this category anytime.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Created Date Info */}
                  <div className="flex items-center gap-2 body-2xsm-regular text-primary-300 pt-2 border-t border-dash">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created on {category.createdDate}</span>
                  </div>
                </div>
              )}

              {/* MODE 2 & 3: FORM VIEW (CREATE & EDIT) */}
              {(mode === "create" || mode === "edit") && (
                <form
                  id="category-drawer-form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Category Type Switcher (Top-Level Category vs Sub-Category) */}
                  <div>
                    <label className="block body-sm-regular text-primary-400 mb-1.5 select-none">
                      Category Type
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg border border-dash">
                      <button
                        type="button"
                        onClick={() =>
                          setValue("isSubCategory", false, {
                            shouldValidate: true,
                          })
                        }
                        className={`py-2 px-3 rounded-md body-sm-medium transition-all cursor-pointer ${
                          !isSubCategory
                            ? "bg-white text-primary-500 font-bold shadow-2xs"
                            : "text-primary-300 hover:text-primary-500"
                        }`}
                      >
                        Parent Category
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setValue("isSubCategory", true, {
                            shouldValidate: true,
                          })
                        }
                        className={`py-2 px-3 rounded-md body-sm-medium transition-all cursor-pointer ${
                          isSubCategory
                            ? "bg-white text-brand-orange font-bold shadow-2xs"
                            : "text-primary-300 hover:text-primary-500"
                        }`}
                      >
                        Sub-Category
                      </button>
                    </div>
                  </div>

                  {/* Parent Category Selector (When Sub-Category is selected) */}
                  {isSubCategory && (
                    <div className="p-3.5 rounded-lg border border-brand-orange/30 bg-brand-orange-light/20 space-y-2 animate-in fade-in duration-200">
                      <Controller
                        name="parentId"
                        control={control}
                        render={({ field }) => (
                          <DropdownSelect
                            fieldLabel="Select Parent Category *"
                            options={parentSelectOptions}
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Choose parent category"
                            className="w-full"
                          />
                        )}
                      />
                      {errors.parentId && (
                        <p className="body-2xsm-regular text-red flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.parentId.message}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Category Name */}
                  <InputField
                    id="cat-name"
                    label={isSubCategory ? "Sub-Category Name" : "Category Name"}
                    required
                    placeholder={
                      isSubCategory
                        ? "e.g. React & Next.js"
                        : "e.g. Artificial Intelligence"
                    }
                    {...register("name")}
                    onChange={handleNameChange}
                    error={errors.name?.message}
                  />

                  {/* Slug */}
                  <InputField
                    id="cat-slug"
                    label="URL Slug"
                    required
                    placeholder={
                      isSubCategory
                        ? "e.g. react-nextjs"
                        : "e.g. artificial-intelligence"
                    }
                    {...register("slug")}
                    error={errors.slug?.message}
                  />

                  {/* Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="cat-desc"
                        className="body-sm-regular text-primary-400 select-none"
                      >
                        Description
                      </label>
                      <span className="body-2xsm-regular text-primary-300">
                        {descriptionValue.length}/300
                      </span>
                    </div>
                    <textarea
                      id="cat-desc"
                      rows={3}
                      placeholder="Write a clear and concise description for learners..."
                      {...register("description")}
                      className={`w-full p-3 rounded-lg border body-sm-regular text-primary-500 outline-none transition-all placeholder:text-primary-300 focus:border-brand-orange focus:bg-white resize-none ${
                        errors.description
                          ? "border-red bg-red-14/10"
                          : "border-dash bg-white"
                      }`}
                    />
                    {errors.description && (
                      <p className="mt-1 body-2xsm-regular text-red">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Icon Selector (Shown for parent categories, or inherited for sub-categories) */}
                  <div>
                    <label className="block body-sm-regular text-primary-400 mb-1.5 select-none">
                      Icon & Theme <span className="text-red">*</span>
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {CATEGORY_ICONS.map((iconOpt) => {
                        const isSelected = selectedIconId === iconOpt.id;
                        return (
                          <button
                            key={iconOpt.id}
                            type="button"
                            onClick={() =>
                              setValue("iconId", iconOpt.id, {
                                shouldValidate: true,
                              })
                            }
                            className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                              isSelected
                                ? "border-brand-orange bg-brand-orange-light ring-2 ring-brand-orange/20"
                                : "border-dash bg-white hover:bg-slate-50"
                            }`}
                            title={iconOpt.label}
                          >
                            <CategoryIconRenderer
                              iconId={iconOpt.id}
                              size="sm"
                            />
                            <span className="body-2xsm-regular text-primary-400 truncate max-w-full block">
                              {iconOpt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.iconId && (
                      <p className="mt-1 body-2xsm-regular text-red">
                        {errors.iconId.message}
                      </p>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <DropdownSelect
                          fieldLabel="Publishing Status *"
                          options={[
                            { value: "Active", label: "Active (Published)" },
                            { value: "Inactive", label: "Inactive (Draft)" },
                          ]}
                          value={field.value}
                          onChange={field.onChange}
                          className="w-full"
                        />
                      )}
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-dash bg-slate-50/50 flex items-center justify-between gap-3">
              {mode === "details" ? (
                <>
                  <SecondaryButton onClick={onClose} size="md">
                    Close
                  </SecondaryButton>
                  <PrimaryButton
                    onClick={() => {
                      if (category && onOpenEdit) {
                        onOpenEdit(category);
                      }
                    }}
                    icon={<Edit2 className="w-4 h-4" />}
                    size="md"
                  >
                    Edit Category
                  </PrimaryButton>
                </>
              ) : (
                <>
                  <SecondaryButton
                    onClick={onClose}
                    disabled={isSubmitting}
                    size="md"
                  >
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton
                    type="submit"
                    form="category-drawer-form"
                    isLoading={isSubmitting}
                    size="md"
                  >
                    {mode === "create" ? "Create Category" : "Save Changes"}
                  </PrimaryButton>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CategoryDrawer;
