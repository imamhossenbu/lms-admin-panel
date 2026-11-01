"use client";

import React from "react";
import type { RolePermissions } from "@/types/team";
import { countPermissions, listGrants, subtractPermissions } from "@/lib/teamPermissions";
import { SettingsCallout } from "@/components/settings/sections/security/SettingsCallout";

export interface SystemRoleCalloutProps {
  roleName: string;
  /** Permissions currently in the form. */
  permissions: RolePermissions;
  defaults: RolePermissions;
}

/** Built-in role editor: explains the default preset and lists what differs from it (live). */
export function SystemRoleCallout({ roleName, permissions, defaults }: SystemRoleCalloutProps) {
  const added = subtractPermissions(permissions, defaults);
  const removed = subtractPermissions(defaults, permissions);
  const nAdded = countPermissions(added);
  const nRemoved = countPermissions(removed);
  const modified = nAdded + nRemoved > 0;
  return (
    <SettingsCallout
      tone={modified ? "warning" : "info"}
      title={modified ? `${roleName} differs from its default permissions` : `${roleName} uses its default permissions (${countPermissions(defaults)})`}
    >
      {modified ? (
        <span className="block space-y-0.5">
          {nAdded > 0 && <span className="block">Added: {listGrants(added, 4)}</span>}
          {nRemoved > 0 && <span className="block">Removed: {listGrants(removed, 4)}</span>}
          <span className="block">Use &quot;Reset to default&quot; to go back to the built-in preset.</span>
        </span>
      ) : (
        "This is a built-in role. You can adjust what it allows; the original preset is kept so you can reset it later."
      )}
    </SettingsCallout>
  );
}

export default SystemRoleCallout;
