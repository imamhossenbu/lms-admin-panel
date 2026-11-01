"use client";

import React from "react";
import { PERMISSION_ACTIONS, TEAM_MODULES, type PermissionAction, type RolePermissions, type TeamModule } from "@/types/team";
import {
  ACTION_LABEL,
  MODULE_ACTIONS,
  MODULE_HINT,
  MODULE_LABEL,
  columnState,
  isApplicable,
  mergePermissions,
  normalizeExtras,
  rowState,
  setColumn,
  setRow,
  toggleCell,
  type ToggleState,
} from "@/lib/teamPermissions";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { cn } from "@/lib/cn";
import { PermissionCheckbox } from "../shared/PermissionCheckbox";
import { ModuleIcon } from "../shared/moduleIcons";

export interface PermissionMatrixProps {
  /** Role mode: the role's permissions. Extras mode (`base` set): the member's extra permissions. */
  value: RolePermissions;
  onChange?: (next: RolePermissions) => void;
  readOnly?: boolean;
  /** Tighter rows, no module hints (member detail, modals). */
  compact?: boolean;
  /**
   * Extras mode: permissions already granted by the role. Those cells show checked (orange) and can't be
   * changed ("Included in role"); `value` cells show blue. `onChange` always receives extras pruned against `base`.
   */
  base?: RolePermissions;
  /** Name used in "Included in <role>" hints (extras mode). */
  baseLabel?: string;
  className?: string;
}

type Row = { id: TeamModule };
const ROWS: Row[] = TEAM_MODULES.map((id) => ({ id }));
const WIDTH: Record<PermissionAction, string> = { view: "60px", manage: "84px", delete: "62px", export: "62px", refund: "62px", moderate: "80px" };

/**
 * Modules × actions grid: checkbox cells, row "All" toggle, column toggles in the header,
 * "View" auto-added when any other action in the row is on (turning View off clears the row), N/A cells.
 * With `base` it edits extra permissions on top of a role (role cells locked, extras in blue).
 */
export function PermissionMatrix({ value, onChange, readOnly, compact, base, baseLabel = "role", className }: PermissionMatrixProps) {
  const editable = !readOnly && !!onChange;
  const shown = base ? mergePermissions(base, value) : value;
  const set = (next: RolePermissions) => editable && onChange?.(base ? normalizeExtras(next, base) : next);
  const inBase = (m: TeamModule, a: PermissionAction) => !!base?.[m].includes(a);

  const rowFull = (m: TeamModule) => !!base && MODULE_ACTIONS[m].every((a) => inBase(m, a));
  const colFull = (a: PermissionAction) => !!base && TEAM_MODULES.filter((m) => isApplicable(m, a)).every((m) => inBase(m, a));
  /** Extras mode: column toggles skip modules where the role already grants the action. */
  const toggleColumn = (action: PermissionAction, on: boolean) =>
    base ? set(TEAM_MODULES.reduce((acc, m) => (isApplicable(m, action) && !inBase(m, action) ? toggleCell(acc, m, action, on) : acc), value)) : set(setColumn(value, action, on));
  /** A cell is "extra" when it's on but not granted by the role. */
  const cellTone = (m: TeamModule, a: PermissionAction) => (base && !inBase(m, a) ? "extra" : "role");
  const aggregateTone = (state: ToggleState, hasExtra: boolean) => (base && state !== "off" && hasExtra ? "extra" : "role");

  const actionColumns: ColumnDef<Row>[] = PERMISSION_ACTIONS.map((action) => ({
    key: action,
    width: WIDTH[action],
    align: "center",
    header: (
      <span className="flex flex-col items-center gap-1.5 whitespace-normal text-center leading-tight">
        <span>{ACTION_LABEL[action]}</span>
        {editable && (
          <PermissionCheckbox
            size="sm"
            state={columnState(shown, action)}
            tone={aggregateTone(columnState(shown, action), TEAM_MODULES.some((m) => value[m].includes(action)))}
            disabled={colFull(action)}
            label={`${ACTION_LABEL[action]} for every module`}
            onChange={(on) => toggleColumn(action, on)}
          />
        )}
      </span>
    ),
    render: (r) => {
      if (!isApplicable(r.id, action))
        return (
          <span className="body-2xsm-regular text-primary-300" title={`${ACTION_LABEL[action]} doesn't apply to ${MODULE_LABEL[r.id]}`}>
            N/A
          </span>
        );
      const locked = inBase(r.id, action);
      const on = shown[r.id].includes(action);
      const label = `${MODULE_LABEL[r.id]}: ${ACTION_LABEL[action]}${
        base ? (locked ? ` (included in ${baseLabel})` : on ? " (extra permission)" : "") : action === "view" && shown[r.id].length > 1 ? " (required by other actions)" : ""
      }`;
      return (
        <span className="flex justify-center">
          <PermissionCheckbox
            size={compact ? "sm" : "md"}
            readOnly={!editable}
            disabled={editable && locked}
            tone={cellTone(r.id, action)}
            state={on ? "on" : "off"}
            label={label}
            onChange={(next) => set(toggleCell(value, r.id, action, next))}
          />
        </span>
      );
    },
  }));

  const columns: ColumnDef<Row>[] = [
    {
      key: "module",
      header: "Module",
      render: (r) => {
        const on = shown[r.id].length > 0;
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
          <PermissionCheckbox
            size={compact ? "sm" : "md"}
            readOnly={!editable}
            disabled={editable && rowFull(r.id)}
            tone={aggregateTone(rowState(shown, r.id), value[r.id].length > 0)}
            state={rowState(shown, r.id)}
            label={rowFull(r.id) ? `All ${MODULE_LABEL[r.id]} permissions (included in ${baseLabel})` : `All ${MODULE_LABEL[r.id]} permissions`}
            onChange={(on) => set(setRow(value, r.id, on))}
          />
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
