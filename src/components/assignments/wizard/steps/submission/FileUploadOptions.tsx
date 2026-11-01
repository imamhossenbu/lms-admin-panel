"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { AppSelect } from "@/components/ui/AppSelect";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { WizardField } from "../../shell/WizardField";
import { FieldError } from "./kit/FieldError";
import { FileTypesMultiSelect } from "./FileTypesMultiSelect";

const MAX_FILE_OPTIONS = Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: `${i + 1} File${i ? "s" : ""}` }));

/** File Upload only: Allowed File Types (+ max size per file) and Maximum Files per Submission. */
export function FileUploadOptions() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<AssignmentWizardValues>();
  const maxFiles = useWatch({ control, name: "maxFiles" });
  const typesError = errors.allowedFileTypes?.message ?? (Array.isArray(errors.allowedFileTypes) ? errors.allowedFileTypes.find((e) => e?.message)?.message : undefined);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
      <WizardField label="Allowed File Types" htmlFor="wizard-file-types" error={typesError} className="md:col-span-3">
        <Controller
          control={control}
          name="allowedFileTypes"
          render={({ field }) => <FileTypesMultiSelect id="wizard-file-types" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={typesError} />}
        />
        <div className="mt-2 flex flex-wrap items-center gap-2 body-xsm-regular text-primary-300">
          <label htmlFor="wizard-max-file-size">Maximum file size:</label>
          <input
            id="wizard-max-file-size"
            type="number"
            min={1}
            max={500}
            aria-invalid={!!errors.maxFileSizeMb}
            className={
              "h-7 w-16 rounded-md border px-2 body-xsm-medium text-primary-500 outline-none focus:border-blue " +
              (errors.maxFileSizeMb ? "border-red bg-red-14" : "border-dash bg-white")
            }
            {...register("maxFileSizeMb", { valueAsNumber: true })}
          />
          <span>MB per file</span>
        </div>
        <FieldError message={errors.maxFileSizeMb?.message} />
      </WizardField>

      <WizardField label="Maximum Files per Submission" error={errors.maxFiles?.message} className="md:col-span-2">
        <Controller
          control={control}
          name="maxFiles"
          render={({ field }) => (
            <AppSelect value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))} options={MAX_FILE_OPTIONS} fullWidth triggerClassName="h-11" />
          )}
        />
        <p className="mt-2 body-xsm-regular text-primary-300">
          Students can upload up to {maxFiles} file{maxFiles === 1 ? "" : "s"}
        </p>
      </WizardField>
    </div>
  );
}

export default FileUploadOptions;
