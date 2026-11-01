"use client";

import React from "react";
import { Controller, useFormContext, type FieldPath } from "react-hook-form";
import { AppSelect, type AppSelectOption } from "@/components/ui/AppSelect";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { WizardField } from "../../shell/WizardField";
import { selectErrorClass } from "./basicOptions";

export interface SelectControllerProps {
  name: FieldPath<AssignmentWizardValues>;
  label: string;
  options: AppSelectOption[];
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  icon?: React.ReactNode;
  /** Map form value → select value (and back) e.g. "" ⇄ "__none". */
  toSelect?: (value: string) => string;
  fromSelect?: (value: string) => string;
}

/** Labelled AppSelect bound to a wizard field, with the field error below. */
export function SelectController({ name, label, options, placeholder, required, optional, icon, toSelect, fromSelect }: SelectControllerProps) {
  const { control } = useFormContext<AssignmentWizardValues>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const raw = String(field.value ?? "");
        return (
          <WizardField label={label} required={required} optional={optional} error={fieldState.error?.message}>
            <AppSelect
              value={toSelect ? toSelect(raw) : raw}
              onValueChange={(v) => {
                field.onChange(fromSelect ? fromSelect(v) : v);
                field.onBlur();
              }}
              options={options}
              placeholder={placeholder}
              icon={icon}
              fullWidth
              triggerClassName={["h-11", selectErrorClass(fieldState.error?.message)].filter(Boolean).join(" ")}
            />
          </WizardField>
        );
      }}
    />
  );
}

export default SelectController;
