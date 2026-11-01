"use client";

import React from "react";
import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/primary-button";
import { LimitGuard } from "@/components/plan-gate/LimitGuard";

/** 🏠 › Team & Roles, title + subtitle, orange "Invite member". */
export function TeamHeader({ onInvite }: { onInvite: () => void }) {
  return (
    <PageHeader
      className="mb-0"
      breadcrumbs={[{ label: "Team & Roles" }]}
      title={<span className="heading-h3 font-bold! tracking-tight text-primary-500">Team &amp; Roles</span>}
      subtitle="Invite admin-panel staff, assign roles and control exactly what each person can access."
    >
      <LimitGuard limitKey="teamMembers">
        {({ disabled }) => (
          <PrimaryButton leftIcon={<UserPlus className="h-4 w-4" />} onClick={onInvite} disabled={disabled}>
            Invite member
          </PrimaryButton>
        )}
      </LimitGuard>
    </PageHeader>
  );
}

export default TeamHeader;
