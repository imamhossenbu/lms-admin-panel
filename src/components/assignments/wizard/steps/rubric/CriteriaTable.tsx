"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Pencil, Trash2 } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { EditorIconButton } from "@/components/courses/lesson-editor/tabs/quiz/EditorIconButton";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { cn } from "@/lib/cn";
import type { CriterionField } from "./rubricTypes";

export interface CriteriaTableProps {
  fields: CriterionField[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  /** Called after an inline points edit (re-validate the sum). */
  onPointsChange?: () => void;
}

/** Rubric criteria DataTable: #, Criteria, Description, inline Points, edit / delete. */
export function CriteriaTable({ fields, onEdit, onDelete, onPointsChange }: CriteriaTableProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<AssignmentWizardValues>();
  const rowErrors = Array.isArray(errors.criteria) ? errors.criteria : [];

  const columns: ColumnDef<CriterionField>[] = [
    { key: "num", header: "#", width: "3rem", align: "center", render: (_, i) => <span className="body-sm-regular text-primary-400">{i + 1}</span> },
    {
      key: "title",
      header: "Criteria",
      width: "22%",
      render: (row, i) => (
        <div className="min-w-0">
          <p className="body-sm-medium text-primary-500">{row.title}</p>
          {(rowErrors[i]?.title || rowErrors[i]?.description) && <p className="body-xsm-regular text-red">Has errors — edit to fix.</p>}
        </div>
      ),
    },
    { key: "description", header: "Description", render: (row) => <p className="body-sm-regular text-primary-400">{row.description}</p> },
    {
      key: "points",
      header: "Points",
      width: "7rem",
      render: (_, i) => {
        const err = rowErrors[i]?.points?.message;
        const reg = register(`criteria.${i}.points`, { valueAsNumber: true });
        return (
          <div>
            <input
              type="number"
              min={1}
              max={1000}
              aria-label={`Points for criterion ${i + 1}`}
              aria-invalid={!!err}
              title={err}
              className={cn(
                "h-9 w-20 rounded-lg border px-2.5 body-sm-regular text-primary-500 outline-none transition-colors focus:border-blue",
                err ? "border-red bg-red-14" : "border-dash bg-white"
              )}
              {...reg}
              onChange={(e) => {
                void reg.onChange(e);
                onPointsChange?.();
              }}
            />
            {err && <p className="mt-1 body-xsm-regular text-red">{err}</p>}
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      width: "7rem",
      align: "center",
      render: (_, i) => (
        <div className="flex items-center justify-center gap-2">
          <EditorIconButton label={`Edit criterion ${i + 1}`} icon={<Pencil className="h-4 w-4" />} onClick={() => onEdit(i)} />
          <EditorIconButton label={`Delete criterion ${i + 1}`} tone="red" icon={<Trash2 className="h-4 w-4" />} onClick={() => onDelete(i)} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={fields}
      rowKey={(row) => row.fieldKey}
      minWidth="min-w-160"
      emptyMessage="No criteria yet — add one or apply a template."
    />
  );
}

export default CriteriaTable;
