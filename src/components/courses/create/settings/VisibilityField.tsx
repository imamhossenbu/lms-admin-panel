"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Globe, Lock, UserRound } from "lucide-react";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import type { CoursePublishInput } from "@/validations/coursePublishSchema";
import { FieldError } from "../basic/FieldLabel";

type Visibility = CoursePublishInput["visibility"];

const iconClass = "h-5 w-5";

const VISIBILITY_OPTIONS: ChoiceOption<Visibility>[] = [
  { value: "PUBLIC", title: "Public", description: "Visible to everyone", icon: <Globe className={iconClass} /> },
  { value: "PRIVATE", title: "Private", description: "Only accessible via direct link", icon: <Lock className={iconClass} /> },
  { value: "UNLISTED", title: "Unlisted", description: "Hidden from search engines", icon: <UserRound className={iconClass} /> },
];

/** Public / Private / Unlisted icon cards bound to `visibility`. */
export function VisibilityField() {
  const { control, formState } = useFormContext<CoursePublishInput>();

  return (
    <>
      <Controller
        control={control}
        name="visibility"
        render={({ field }) => (
          <ChoiceCardGroup
            name="course-visibility"
            aria-label="Course visibility"
            value={field.value}
            onChange={field.onChange}
            options={VISIBILITY_OPTIONS}
            columns={3}
          />
        )}
      />
      <FieldError message={formState.errors.visibility?.message} />
    </>
  );
}

export default VisibilityField;
