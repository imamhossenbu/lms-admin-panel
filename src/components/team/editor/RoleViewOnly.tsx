"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IdCard } from "lucide-react";
import type { TeamMember, TeamRole } from "@/types/team";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ProTipCard } from "@/components/ui/ProTipCard";
import { SettingsCallout } from "@/components/settings/sections/security/SettingsCallout";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { RoleBadge } from "../shared/TeamBadges";
import { fullDate } from "../shared/teamFormat";
import { RoleEditorHeader } from "./RoleEditorHeader";
import { PermissionsCard } from "./PermissionsCard";
import { RoleSummaryCard } from "./RoleSummaryCard";
import { RoleMembersCard } from "./RoleMembersCard";

/** System roles: read-only details + matrix, with "Duplicate to customise" (opens Create role prefilled). */
export function RoleViewOnly({ role, members }: { role: TeamRole; members: TeamMember[] }) {
  const router = useRouter();
  const duplicate = () => router.push(`/users/roles/new?from=${role.id}`);
  const assigned = members.filter((m) => m.roleId === role.id);

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 pb-8 text-left">
      <RoleEditorHeader mode="view" roleName={role.name} locked={role.isLocked} isSubmitting={false} onDuplicate={duplicate} />

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
        <div className="min-w-0 space-y-5 xl:col-span-8">
          <SettingsCallout
            tone={role.isLocked ? "warning" : "info"}
            title={role.isLocked ? "Super Admin always has every permission" : "This is a built-in role"}
            action={
              <CardActionButton onClick={duplicate} aria-label={`Duplicate ${role.name} to customise`}>
                Duplicate to customise
              </CardActionButton>
            }
          >
            {role.isLocked
              ? "It can't be edited or limited, so the workspace owner can never be locked out."
              : "System roles stay the same so everyone knows what they mean. Duplicate it to create a custom role you can change."}
          </SettingsCallout>

          <IconSectionCard icon={<IdCard className="h-5 w-5" />} tone="orange" title="Role details" action={<RoleBadge role={role} size="md" />}>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <dt className="body-xsm-medium text-primary-300">Description</dt>
                <dd className="mt-0.5 body-sm-regular text-primary-500">{role.description || "—"}</dd>
              </div>
              <div>
                <dt className="body-xsm-medium text-primary-300">Type</dt>
                <dd className="mt-0.5 body-sm-regular text-primary-500">{role.isLocked ? "System · locked" : "System"}</dd>
              </div>
              <div>
                <dt className="body-xsm-medium text-primary-300">Created</dt>
                <dd className="mt-0.5 body-sm-regular text-primary-500">{fullDate(role.createdAt)}</dd>
              </div>
              <div>
                <dt className="body-xsm-medium text-primary-300">Members</dt>
                <dd className="mt-0.5 body-sm-regular text-primary-500">{assigned.length}</dd>
              </div>
            </dl>
          </IconSectionCard>

          <PermissionsCard value={role.permissions} readOnly />
        </div>
        <aside className="min-w-0 space-y-5 xl:sticky xl:top-6 xl:col-span-4">
          <RoleSummaryCard permissions={role.permissions} />
          <RoleMembersCard members={assigned} roleId={role.id} />
          <ProTipCard>Need almost the same access with one change? Duplicate this role, adjust it, then move people to the new role.</ProTipCard>
        </aside>
      </div>
    </motion.div>
  );
}

export default RoleViewOnly;
