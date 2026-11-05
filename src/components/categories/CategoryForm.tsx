"use client";

import React, { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { CategoryItem } from "@/types/category";
import { createCategory, updateCategory } from "@/lib/categoryStorage";
import { apiErrorMessage } from "@/lib/apiError";
import { InputField } from "@/components/ui/InputField";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { CategoryIconPicker } from "./CategoryIconPicker";
import { categorySchema, type CategorySchemaValues } from "./categorySchema";
import { slugify } from "./categoryIcons";

const STATUS_OPTIONS = [
  { value: "Active", label: "Active (Published)" },
  { value: "Inactive", label: "Inactive (Draft)" },
];

const EMPTY: CategorySchemaValues = { name: "", slug: "", description: "", status: "Active", iconId: "code", parentId: "" };
const TOP_LEVEL = "__top__";

interface CategoryFormProps {
  /** null = create. */
  category: CategoryItem | null;
  /** Every category of the workspace (for the parent picker). */
  categories: CategoryItem[];
  onCancel: () => void;
  onSaved: (item: CategoryItem) => void;
}

/** Create / edit form of the category drawer (zod-validated; slug follows the name until edited). */
export function CategoryForm({ category, categories, onCancel, onSaved }: CategoryFormProps) {
  const isEdit = !!category;
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<CategorySchemaValues>({ resolver: zodResolver(categorySchema), mode: "onTouched", defaultValues: EMPTY });

  useEffect(() => {
    reset(category ? { name: category.name, slug: category.slug, description: category.description, status: category.status, iconId: category.iconId, parentId: category.parentId ?? "" } : EMPTY);
  }, [category, reset]);

  const description = useWatch({ control, name: "description" }) || "";
  // Parents: top-level categories other than this one. A category with sub-categories stays top level.
  const hasChildren = !!category && category.subCategoryCount > 0;
  const parentOptions = [
    { value: TOP_LEVEL, label: "None (top-level category)" },
    ...categories
      .filter((c) => !c.parentId && c.id !== category?.id)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((c) => ({ value: c.id, label: c.name })),
  ];
  const nameField = register("name");

  const onSubmit = async (values: CategorySchemaValues) => {
    const id = toast.loading(isEdit ? "Updating category..." : "Creating category...", { description: values.name });
    try {
      const saved = isEdit ? await updateCategory(category.id, values) : await createCategory(values);
      toast.success(isEdit ? "Category updated" : "Category created", { id, description: `"${saved.name}" was saved.` });
      onSaved(saved);
    } catch (err) {
      toast.error(isEdit ? "Couldn't update the category" : "Couldn't create the category", { id, description: apiErrorMessage(err, "Please check the fields and try again.") });
    }
  };

  return (
    <form id="category-drawer-form" noValidate onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <InputField
          id="cat-name"
          label="Category Name"
          required
          placeholder="e.g. Artificial Intelligence"
          {...nameField}
          onChange={(e) => {
            void nameField.onChange(e);
            if (!isEdit && !dirtyFields.slug) setValue("slug", slugify(e.target.value), { shouldValidate: !!errors.slug });
          }}
          error={errors.name?.message}
        />

        <InputField id="cat-slug" label="URL Slug" required placeholder="e.g. artificial-intelligence" {...register("slug")} error={errors.slug?.message} />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="cat-desc" className="body-sm-regular text-primary-400 select-none">
              Description
            </label>
            <span className={`body-2xsm-regular ${description.length > 300 ? "text-red" : "text-primary-300"}`}>{description.length}/300</span>
          </div>
          <textarea
            id="cat-desc"
            rows={3}
            placeholder="Write a clear and concise description for learners..."
            {...register("description")}
            className={`w-full p-3 rounded-lg border body-sm-regular text-primary-500 outline-none transition-all placeholder:text-primary-300 focus:border-brand-orange focus:bg-white resize-none ${
              errors.description ? "border-red bg-red-14/10" : "border-dash bg-white"
            }`}
          />
          {errors.description && <p className="mt-1 body-2xsm-regular text-red">{errors.description.message}</p>}
        </div>

        <Controller name="iconId" control={control} render={({ field }) => <CategoryIconPicker value={field.value} onChange={field.onChange} error={errors.iconId?.message} />} />

        <div>
          <Controller
            name="parentId"
            control={control}
            render={({ field }) => (
              <DropdownSelect
                fieldLabel="Parent Category"
                options={parentOptions}
                value={field.value || TOP_LEVEL}
                onChange={(v) => field.onChange(v === TOP_LEVEL ? "" : v)}
                disabled={hasChildren}
                className="w-full"
              />
            )}
          />
          <p className="mt-1 body-2xsm-regular text-primary-300">
            {hasChildren ? "This category has sub-categories, so it stays a top-level category." : "Pick a parent to make this a sub-category."}
          </p>
        </div>

        <Controller
          name="status"
          control={control}
          render={({ field }) => <DropdownSelect fieldLabel="Publishing Status *" options={STATUS_OPTIONS} value={field.value} onChange={field.onChange} className="w-full" />}
        />
      </div>

      <div className="p-4 border-t border-dash bg-slate-50/50 flex items-center justify-between gap-3">
        <SecondaryButton onClick={onCancel} disabled={isSubmitting} size="md">
          Cancel
        </SecondaryButton>
        <PrimaryButton type="submit" isLoading={isSubmitting} disabled={isSubmitting} size="md">
          {isEdit ? (isSubmitting ? "Saving..." : "Save Changes") : isSubmitting ? "Creating..." : "Create Category"}
        </PrimaryButton>
      </div>
    </form>
  );
}

export default CategoryForm;
