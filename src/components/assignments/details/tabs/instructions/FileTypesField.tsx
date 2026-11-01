"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TagsInput } from "@/components/ui/TagsInput";
import type { AssignmentInstructionsFormValues } from "@/validations/assignmentSchema";
import { normalizeExtension } from "./instructionsForm";

/** Allowed file extensions as chips (".pdf"); input is normalised, zod validates the format. */
export function FileTypesField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<AssignmentInstructionsFormValues>();
  const fieldErrors = errors.allowedFileTypes;
  const itemError = Array.isArray(fieldErrors) ? fieldErrors.find((e) => e?.message)?.message : undefined;
  const message = fieldErrors?.message ?? itemError;

  return (
    <div>
      <label htmlFor="allowed-file-types" className="mb-2 block body-sm-medium text-primary-500">
        Allowed File Types
      </label>
      <Controller
        control={control}
        name="allowedFileTypes"
        render={({ field }) => (
          <TagsInput
            id="allowed-file-types"
            value={field.value}
            onChange={(tags) => field.onChange(Array.from(new Set(tags.map(normalizeExtension).filter(Boolean))))}
            placeholder="Type an extension like .pdf and press Enter"
            maxTags={20}
            maxLength={12}
            error={message}
          />
        )}
      />
      <p className="mt-1 body-xsm-regular text-primary-300">Leave empty to accept any file type.</p>
    </div>
  );
}

export default FileTypesField;
