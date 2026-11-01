"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { ListOrdered } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { EditorSectionCard } from "../../shared/EditorSectionCard";
import { EditorFieldLabel } from "../../fields/FieldLabel";

/** "Lesson Order": position of the lesson inside its module. */
export function LessonOrderCard() {
  const { register, formState: { errors } } = useFormContext<LessonEditorValues>();

  return (
    <EditorSectionCard icon={<ListOrdered className="h-5 w-5" />} title="Lesson Order" description="Set the order of this lesson within the module." tone="blue">
      <EditorFieldLabel htmlFor="lesson-order">Order Number</EditorFieldLabel>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
        <InputField
          id="lesson-order"
          type="number"
          min={1}
          max={999}
          inputMode="numeric"
          containerClassName="sm:max-w-48"
          error={errors.content?.order?.message}
          {...register("content.order", { valueAsNumber: true })}
        />
        <p className="body-xsm-regular text-primary-300 sm:pt-2.5">Set a number to define the lesson order.</p>
      </div>
    </EditorSectionCard>
  );
}

export default LessonOrderCard;
