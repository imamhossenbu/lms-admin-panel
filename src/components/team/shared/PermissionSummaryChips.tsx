import React from "react";
import type { RolePermissions } from "@/types/team";
import { MODULE_LABEL, summarizePermissions } from "@/lib/teamPermissions";
import { ToneBadge, type Tone } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";

const GROUPS: { key: "full" | "edit" | "viewOnly" | "none"; label: string; tone: Tone }[] = [
  { key: "full", label: "Full access", tone: "green" },
  { key: "edit", label: "Can edit", tone: "blue" },
  { key: "viewOnly", label: "View only", tone: "gray" },
  { key: "none", label: "No access", tone: "red" },
];

export interface PermissionSummaryChipsProps {
  permissions: RolePermissions;
  /** Hide the "No access" group (compact previews). */
  hideNone?: boolean;
  className?: string;
}

/** Modules grouped by access level as single-line chips (live role summary, invite / change-role previews). */
export function PermissionSummaryChips({ permissions, hideNone, className }: PermissionSummaryChipsProps) {
  const s = summarizePermissions(permissions);
  return (
    <div className={cn("space-y-3", className)}>
      {GROUPS.filter((g) => s[g.key].length > 0 && !(hideNone && g.key === "none")).map((g) => (
        <div key={g.key}>
          <p className="mb-1.5 body-xsm-medium font-semibold! text-primary-400">
            {g.label} <span className="body-xsm-regular text-primary-300">· {s[g.key].length}</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {s[g.key].map((m) => (
              <ToneBadge key={m} tone={g.tone} size="sm">
                {MODULE_LABEL[m]}
              </ToneBadge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PermissionSummaryChips;
