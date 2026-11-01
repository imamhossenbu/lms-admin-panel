"use client";

import React from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import type { CriterionField } from "./rubricTypes";
import { SubSectionHeader } from "../submission/kit/SubSectionHeader";
import { CriteriaTable } from "./CriteriaTable";
import { CriteriaTotalBox } from "./CriteriaTotalBox";

export interface RubricCriteriaSectionProps {
  fields: CriterionField[];
  canAdd: boolean;
  onAdd: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onPointsChange: () => void;
}

/** "Rubric Criteria" header + criteria table + total points box. */
export function RubricCriteriaSection({ fields, canAdd, onAdd, onEdit, onDelete, onPointsChange }: RubricCriteriaSectionProps) {
  return (
    <section className="space-y-4">
      <SubSectionHeader
        className="mb-0"
        title="Rubric Criteria"
        description="Add the criteria and set the maximum points for each."
        action={
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            disabled={!canAdd}
            title={canAdd ? undefined : "Up to 12 criteria"}
            onClick={onAdd}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-dash bg-white px-3.5 body-sm-medium text-blue shadow-2xs transition-colors hover:bg-blue-14 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add Criterion
          </motion.button>
        }
      />
      <CriteriaTable fields={fields} onEdit={onEdit} onDelete={onDelete} onPointsChange={onPointsChange} />
      <CriteriaTotalBox />
    </section>
  );
}

export default RubricCriteriaSection;
