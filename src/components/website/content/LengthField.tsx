"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { CharCounter } from "@/components/ui/CharCounter";
import type { WebsiteFormValues } from "@/validations/websiteSchema";

type Path = Parameters<ReturnType<typeof useFormContext<WebsiteFormValues>>["register"]>[0];

interface LengthFieldProps {
  name: Path;
  id: string;
  max: number;
  placeholder?: string;
  rows?: number;
  error?: string;
  leftElement?: React.ReactNode;
}

/** Text input (or textarea when `rows` is set) bound to the website form, with a live character counter. */
export function LengthField({ name, id, max, placeholder, rows, error, leftElement }: LengthFieldProps) {
  const { register, control } = useFormContext<WebsiteFormValues>();
  const value = (useWatch({ control, name }) as string | undefined) ?? "";
  return (
    <div>
      {rows ? (
        <TextAreaField id={id} rows={rows} placeholder={placeholder} error={error} {...register(name)} />
      ) : (
        <InputField id={id} placeholder={placeholder} error={error} aria-invalid={!!error} leftElement={leftElement} {...register(name)} />
      )}
      <CharCounter count={value.length} max={max} className="mt-1" />
    </div>
  );
}

export default LengthField;
