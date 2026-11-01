"use client";

import React from "react";
import { Eraser } from "lucide-react";
import type { RolePermissions, TeamRole } from "@/types/team";
import { countPermissions, emptyPermissions, normalizeExtras } from "@/lib/teamPermissions";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { PermissionMatrix } from "../editor/PermissionMatrix";
import { PermissionSourceLegend } from "./PermissionSourceLegend";
import { RoleBadge, ExtraPermissionsBadge } from "./TeamBadges";

export interface ExtraPermissionsPickerProps {
  role: TeamRole;
  /** Extra permissions (pruned against the role before display). */
  value: RolePermissions;
  onChange: (next: RolePermissions) => void;
  error?: string;
  disabled?: boolean;
}

/** "Content Manager + 3 extra permissions" summary line. */
export function extrasSummary(roleName: string, n: number) {
  return n ? `${roleName} + ${n} extra permission${n === 1 ? "" : "s"}` : `${roleName} only — no extra permissions`;
}

/**
 * Compact matrix for granting extra permissions on top of a role: role cells are checked and locked
 * ("Included in role"), the rest can be ticked as extras (View added automatically). Used by the invite
 * modal and the member's "Edit extra permissions" modal.
 */
export function ExtraPermissionsPicker({ role, value, onChange, error, disabled }: ExtraPermissionsPickerProps) {
  const extras = normalizeExtras(value, role.permissions);
  const n = countPermissions(extras);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <RoleBadge role={role} size="md" />
          <ExtraPermissionsBadge count={n} size="md" long />
          <p className="body-sm-regular text-primary-400">{extrasSummary(role.name, n)}</p>
        </div>
        <CardActionButton icon={<Eraser />} disabled={disabled || n === 0} onClick={() => onChange(emptyPermissions())}>
          Clear extras
        </CardActionButton>
      </div>
      <PermissionSourceLegend roleName={role.name} />
      {error && <p className="body-xsm-regular text-red">{error}</p>}
      <PermissionMatrix base={role.permissions} baseLabel={role.name} value={extras} onChange={onChange} readOnly={disabled} compact />
      <p className="body-xsm-regular text-primary-300">
        Greyed-out orange boxes are already included in {role.name}. Extras only add access — they never take anything away. View turns on automatically when you allow another action.
      </p>
    </div>
  );
}

export default ExtraPermissionsPicker;
