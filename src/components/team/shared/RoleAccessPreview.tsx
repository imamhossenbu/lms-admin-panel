"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { TeamRole } from "@/types/team";
import { TOTAL_PERMISSIONS, countPermissions, describePermissions, summarizePermissions } from "@/lib/teamPermissions";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { PermissionSummaryChips } from "./PermissionSummaryChips";
import { RoleBadge } from "./TeamBadges";

/** "What can this role do?" box shown under role pickers (invite, change role). */
export function RoleAccessPreview({ role }: { role: TeamRole | undefined }) {
  return (
    <AnimatePresence mode="wait">
      {role && (
        <motion.div
          key={role.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="space-y-3 rounded-xl border border-dash bg-gray-bg p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <RoleBadge role={role} size="md" />
            <ToneBadge tone="navy" size="sm">
              {countPermissions(role.permissions)} of {TOTAL_PERMISSIONS} permissions
            </ToneBadge>
          </div>
          <p className="body-sm-regular text-primary-400">{describePermissions(role.permissions)}</p>
          <PermissionSummaryChips permissions={role.permissions} hideNone />
          {summarizePermissions(role.permissions).sensitive.length > 0 && (
            <p className="flex items-start gap-2 body-xsm-regular text-yellow">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>Sensitive: can {summarizePermissions(role.permissions).sensitive.join(", ")}.</span>
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default RoleAccessPreview;
