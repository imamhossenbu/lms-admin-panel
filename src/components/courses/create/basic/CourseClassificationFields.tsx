"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { AppSelect } from "@/components/ui/AppSelect";
import type { CourseBasicInfoInput } from "@/validations/courseSchema";
import type { CategoryOption } from "@/components/courses/constants";
import { FieldError, FieldLabel } from "./FieldLabel";
import { LANGUAGE_OPTIONS, LEVEL_OPTIONS, subcategoryOptionsFor } from "../createCourseOptions";

interface CourseClassificationFieldsProps {
  categories: CategoryOption[];
}

const errorTrigger = "border-red bg-red-14";

/** Category / Subcategory / Language / Level selects row. */
export function CourseClassificationFields({ categories }: CourseClassificationFieldsProps) {
  const { control, setValue, formState } = useFormContext<CourseBasicInfoInput>();
  const { errors } = formState;
  const categoryId = useWatch({ control, name: "categoryId" });
  const categoryName = categories.find((c) => c.id === categoryId)?.name;
  const subcategories = subcategoryOptionsFor(categoryName);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div>
        <FieldLabel label="Category" required />
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <AppSelect
              fullWidth
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                setValue("subcategory", "", { shouldDirty: true });
              }}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              placeholder={categories.length ? "Select category" : "No categories available"}
              disabled={!categories.length}
              triggerClassName={errors.categoryId ? errorTrigger : undefined}
            />
          )}
        />
        <FieldError message={errors.categoryId?.message} />
      </div>

      <div>
        <FieldLabel label="Subcategory" />
        <Controller
          control={control}
          name="subcategory"
          render={({ field }) => (
            <AppSelect
              fullWidth
              value={field.value}
              onValueChange={field.onChange}
              options={subcategories}
              placeholder={categoryId ? "Select subcategory" : "Choose a category first"}
              disabled={!categoryId}
            />
          )}
        />
      </div>

      <div>
        <FieldLabel label="Language" required />
        <Controller
          control={control}
          name="language"
          render={({ field }) => (
            <AppSelect
              fullWidth
              value={field.value}
              onValueChange={field.onChange}
              options={LANGUAGE_OPTIONS}
              placeholder="Select language"
              triggerClassName={errors.language ? errorTrigger : undefined}
            />
          )}
        />
        <FieldError message={errors.language?.message} />
      </div>

      <div>
        <FieldLabel label="Level" required />
        <Controller
          control={control}
          name="level"
          render={({ field }) => (
            <AppSelect
              fullWidth
              value={field.value}
              onValueChange={field.onChange}
              options={LEVEL_OPTIONS}
              placeholder="Select level"
              triggerClassName={errors.level ? errorTrigger : undefined}
            />
          )}
        />
        <FieldError message={errors.level?.message} />
      </div>
    </div>
  );
}

export default CourseClassificationFields;
