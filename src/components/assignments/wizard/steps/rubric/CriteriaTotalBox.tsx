"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Trophy } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { cn } from "@/lib/cn";

/** "Total Points" footer: criteria sum vs. assignment total, with a one-click fix. */
export function CriteriaTotalBox() {
  const {
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<AssignmentWizardValues>();
  const [criteria, total] = useWatch({ control, name: ["criteria", "totalPoints"] });
  const list = criteria ?? [];
  const sum = list.reduce((s, c) => s + (Number.isFinite(c?.points) ? c.points : 0), 0);
  const mismatch = list.length > 0 && sum !== total;
  const rootError = errors.criteria?.message ?? errors.criteria?.root?.message;
  const message = mismatch
    ? (rootError ?? `Criteria add up to ${sum} points — they must equal the total points (${Number.isFinite(total) ? total : "—"})`)
    : list.length === 0
      ? rootError
      : undefined;

  const matchTotal = () => {
    setValue("totalPoints", sum, { shouldDirty: true, shouldValidate: true });
    void trigger(["criteria", "passingScore", "latePenalty"]);
  };

  return (
    <div className={cn("rounded-xl border p-4", mismatch ? "border-red bg-red-14" : "border-blue bg-blue-14")}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue">
          <Trophy className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="body-sm-medium font-semibold! text-primary-500">Total Points</p>
          <p className="mt-0.5 flex items-center gap-1.5 body-xsm-regular text-primary-300">
            {mismatch ? <AlertTriangle className="h-3.5 w-3.5 text-red" /> : <CheckCircle2 className="h-3.5 w-3.5 text-green" />}
            {mismatch ? `Must match the assignment total (${Number.isFinite(total) ? total : "—"})` : `Matches the assignment total (${Number.isFinite(total) ? total : "—"})`}
          </p>
        </div>
        <span className="flex h-11 min-w-20 items-center justify-center rounded-lg border border-dash bg-white px-4 heading-h6 text-primary-500 tabular-nums">{sum}</span>
      </div>
      <AnimatePresence initial={false}>
        {message && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:items-center sm:justify-between">
              <p role="alert" className="body-xsm-regular text-red">
                {message}
              </p>
              {mismatch && sum > 0 && sum <= 1000 && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={matchTotal}
                  className="shrink-0 cursor-pointer rounded-lg border border-dash bg-white px-3 py-1.5 body-xsm-medium text-blue hover:bg-blue-14"
                >
                  Set assignment total to {sum}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CriteriaTotalBox;
