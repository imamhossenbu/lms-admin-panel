"use client";

import React from "react";
import { Eraser, Eye, KeyRound, ListChecks } from "lucide-react";
import { TEAM_MODULES, type RolePermissions } from "@/types/team";
import { emptyPermissions, fullPermissions } from "@/lib/teamPermissions";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { SettingsCallout } from "@/components/settings/sections/security/SettingsCallout";
import { PermissionMatrix } from "./PermissionMatrix";

export interface PermissionsCardProps {
  value: RolePermissions;
  onChange?: (next: RolePermissions) => void;
  readOnly?: boolean;
  error?: string;
}

const viewEverywhere = (): RolePermissions => Object.fromEntries(TEAM_MODULES.map((m) => [m, ["view"]])) as unknown as RolePermissions;

/** Permission matrix card with quick presets (Everything / View only / Clear) and the "at least one" error. */
export function PermissionsCard({ value, onChange, readOnly, error }: PermissionsCardProps) {
  return (
    <div id="role-permissions" className="scroll-mt-6">
    <IconSectionCard
      icon={<KeyRound className="h-5 w-5" />}
      tone="purple"
      title="Permissions"
      description={readOnly ? "What people with this role can see and do." : "Tick what this role can do in each area. Use the header boxes to set a whole column."}
      action={
        !readOnly && onChange ? (
          <div className="flex flex-wrap justify-end gap-2">
            <CardActionButton icon={<ListChecks />} onClick={() => onChange(fullPermissions())}>
              Everything
            </CardActionButton>
            <CardActionButton icon={<Eye />} onClick={() => onChange(viewEverywhere())}>
              View only
            </CardActionButton>
            <CardActionButton icon={<Eraser />} onClick={() => onChange(emptyPermissions())}>
              Clear
            </CardActionButton>
          </div>
        ) : undefined
      }
    >
      <div className="space-y-3">
        {error && <SettingsCallout tone="danger" title={error} />}
        <PermissionMatrix value={value} onChange={onChange} readOnly={readOnly} />
        {!readOnly && (
          <p className="body-xsm-regular text-primary-300">
            <span className="font-semibold text-primary-400">View</span> turns on automatically when any other action in a row is allowed; turning View off clears the row. N/A means the action doesn&apos;t exist for that area.
          </p>
        )}
      </div>
    </IconSectionCard>
    </div>
  );
}

export default PermissionsCard;
