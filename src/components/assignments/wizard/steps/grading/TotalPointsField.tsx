"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { WizardField } from "../../shell/WizardField";

const clamp = (n: number) => Math.min(1000, Math.max(1, n));

/** "Total Points *" number input with up/down stepper buttons. */
export function TotalPointsField() {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<AssignmentWizardValues>();
  const total = useWatch({ control, name: "totalPoints" });
  const bump = (d: number) => setValue("totalPoints", clamp((Number.isFinite(total) ? total : 0) + d), { shouldDirty: true, shouldValidate: true });

  const btn = "flex h-4 w-6 cursor-pointer items-center justify-center rounded text-primary-400 hover:bg-gray-bg hover:text-primary-500";
  return (
    <WizardField label="Total Points" htmlFor="wizard-total-points" required>
      <InputField
        id="wizard-total-points"
        type="number"
        min={1}
        max={1000}
        className="h-11"
        error={errors.totalPoints?.message}
        rightElement={
          <span className="flex flex-col">
            <motion.button type="button" whileTap={{ scale: 0.9 }} aria-label="Increase total points" onClick={() => bump(1)} className={btn}>
              <ChevronUp className="h-3.5 w-3.5" />
            </motion.button>
            <motion.button type="button" whileTap={{ scale: 0.9 }} aria-label="Decrease total points" onClick={() => bump(-1)} className={btn}>
              <ChevronDown className="h-3.5 w-3.5" />
            </motion.button>
          </span>
        }
        {...register("totalPoints", { valueAsNumber: true })}
      />
    </WizardField>
  );
}

export default TotalPointsField;
