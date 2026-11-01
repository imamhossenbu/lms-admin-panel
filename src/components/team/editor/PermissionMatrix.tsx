"use client";

import React from "react";
import { PERMISSION_ACTIONS, TEAM_MODULES, type PermissionAction, type RolePermissions, type TeamModule } from "@/types/team";
import { ACTION_LABEL, MODULE_HINT, MODULE_LABEL, columnState, isApplicable, rowState, setColumn, setRow, toggleCell } from "@/lib/teamPermissions";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { cn } from "@/lib/cn";
import { PermissionCheckbox } from "../shared/PermissionCheckbox";
import { ModuleIcon } from "../shared/moduleIcons";

export interface PermissionMatrixProps {
  value: RolePermissions;
  onChange?: (next: RolePermissions) => void;
  readOnly?: boolean;
  /** Tighter rows, no module hints (member detail). */
  compact?: boolean;
  className?: string;
}

type Row = { id: TeamModule };
const ROWS: Row[] = TEAM_MODULES.map((id) => ({ id }));
const WIDTH: Record<PermissionAction, string> = { view: "60px", manage: "84px", delete: "62px", export: "62px", refund: "62px", moderate: "80px" };

/**
 * Modules × actions grid: checkbox cells, row "All" toggle, column toggles in the header,
 * "View" auto-added when any other action in the row is on (turning View off clears the row), N/A cells.
 */
export function PermissionMatrix({ value, onChange, readOnly, compact, className }: PermissionMatrixProps) {
  const editable = !readOnly && !!onChange;
  const set = (next: RolePermissions) => editable && onChange?.(next);

  const actionColumns: ColumnDef<Row>[] = PERMISSION_ACTIONS.map((action) => ({
    key: action,
    width: WIDTH[action],
    align: "center",
    header: (
      <span className="flex flex-col items-center gap-1.5 whitespace-normal text-center leading-tight">
        <span>{ACTION_LABEL[action]}</span>
        {editable && <PermissionCheckbox size="sm" state={columnState(value, action)} label={`${ACTION_LABEL[action]} for every module`} onChange={(on) => set(setColumn(value, action, on))} />}
      </span>
    ),
    render: (r) =>
      isApplicable(r.id, action) ? (
        <span className="flex justify-center">
          <PermissionCheckbox
            size={compact ? "sm" : "md"}
            readOnly={!editable}
            state={value[r.id].includes(action) ? "on" : "off"}
            label={`${MODULE_LABEL[r.id]}: ${ACTION_LABEL[action]}${action === "view" && value[r.id].length > 1 ? " (required by other actions)" : ""}`}
            onChange={(on) => set(toggleCell(value, r.id, action, on))}
          />
        </span>
      ) : (
        <span className="body-2xsm-regular text-primary-300" title={`${ACTION_LABEL[action]} doesn't apply to ${MODULE_LABEL[r.id]}`}>
          N/A
        </span>
      ),
  }));

  const columns: ColumnDef<Row>[] = [
    {
      key: "module",
      header: "Module",
      render: (r) => {
        const on = value[r.id].length > 0;
        return (
          <div className="flex min-w-0 items-center gap-2.5">
            <span className={cn("flex shrink-0 items-center justify-center rounded-lg", compact ? "h-7 w-7" : "h-8 w-8", on ? "bg-brand-orange-light text-brand-orange" : "bg-gray-bg text-primary-300")}>
              <ModuleIcon module={r.id} />
            </span>
            <div className="min-w-0">
              <p className={cn("truncate body-sm-medium", on ? "font-semibold! text-primary-500" : "text-primary-400")} title={MODULE_LABEL[r.id]}>
                {MODULE_LABEL[r.id]}
              </p>
              {!compact && (
                <p className="truncate body-xsm-regular text-primary-300" title={MODULE_HINT[r.id]}>
                  {MODULE_HINT[r.id]}
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "all",
      header: "All",
      width: "52px",
      align: "center",
      render: (r) => (
        <span className="flex justify-center">
          <PermissionCheckbox size={compact ? "sm" : "md"} readOnly={!editable} state={rowState(value, r.id)} label={`All ${MODULE_LABEL[r.id]} permissions`} onChange={(on) => set(setRow(value, r.id, on))} />
        </span>
      ),
    },
    ...actionColumns,
  ];

  return (
    <div className={cn("overflow-hidden rounded-lg border border-dash", className)}>
      <DataTable
        columns={columns}
        data={ROWS}
        rowKey={(r) => r.id}
        verticalBorders
        containerClassName="border-0 rounded-none"
        headerClassName="bg-slate-50 border-b border-dash"
        tableClassName="table-fixed"
        minWidth="min-w-150"
        thClassName="px-2 py-2.5 body-xsm-medium text-primary-400 font-semibold! normal-case align-bottom"
        cellClassName={compact ? "px-2 py-1.5" : "px-2 py-2"}
      />
    </div>
  );
}

export default PermissionMatrix;
