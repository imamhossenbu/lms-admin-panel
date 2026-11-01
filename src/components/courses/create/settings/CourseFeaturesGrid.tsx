"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { CoursePublishInput } from "@/validations/coursePublishSchema";
import { FeatureToggle } from "./FeatureToggle";
import { COURSE_FEATURE_META } from "./settingsOptions";

/** Two-column grid of feature toggles bound to `features.*`. */
export function CourseFeaturesGrid() {
  const { control } = useFormContext<CoursePublishInput>();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
      {COURSE_FEATURE_META.map((feature) => (
        <Controller
          key={feature.key}
          control={control}
          name={`features.${feature.key}`}
          render={({ field }) => (
            <FeatureToggle
              id={`course-feature-${feature.key}`}
              title={feature.title}
              description={feature.description}
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
      ))}
    </div>
  );
}

export default CourseFeaturesGrid;
