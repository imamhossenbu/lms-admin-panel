"use client";

import React from "react";
import { motion } from "framer-motion";
import { ListChecks } from "lucide-react";
import type { RolePermissions } from "@/types/team";
import { TOTAL_PERMISSIONS, describePermissions, summarizePermissions } from "@/lib/teamPermissions";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { SettingsCallout } from "@/components/settings/sections/security/SettingsCallout";
import { PermissionSummaryChips } from "../shared/PermissionSummaryChips";

/** Live plain-English summary of the matrix: coverage bar, sentence, grouped module chips, sensitive grants. */
export function RoleSummaryCard({ permissions }: { permissions: RolePermissions }) {
  const s = summarizePermissions(permissions);
  const pct = Math.round((s.granted / TOTAL_PERMISSIONS) * 100);
  return (
    <IconSectionCard icon={<ListChecks className="h-5 w-5" />} tone="orange" title="Access summary" description="Updates as you change permissions.">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <p className="heading-h4 font-bold! text-primary-500 tabular-nums">
              {s.granted}
              <span className="body-sm-regular text-primary-300"> / {TOTAL_PERMISSIONS} permissions</span>
            </p>
            <span className="body-sm-medium font-semibold! text-primary-500 tabular-nums">{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div className="h-full rounded-full bg-brand-orange" animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 200, damping: 30 }} />
          </div>
        </div>
        <p className="body-sm-regular text-primary-400">{describePermissions(permissions)}</p>
        <PermissionSummaryChips permissions={permissions} />
        {s.sensitive.length > 0 && (
          <SettingsCallout tone="warning" title="Sensitive permissions">
            People with this role can {s.sensitive.join(", ")}. Only give it to people you trust.
          </SettingsCallout>
        )}
      </div>
    </IconSectionCard>
  );
}

export default RoleSummaryCard;
