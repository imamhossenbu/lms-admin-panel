"use client";

import React from "react";
import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/primary-button";

/** 🏠 › Team & Roles, title + subtitle, orange "Invite member". */
export function TeamHeader({ onInvite }: { onInvite: () => void }) {
  return (
    <PageHeader
      className="mb-0"
      breadcrumbs={[{ label: "Team & Roles" }]}
      title={<span className="heading-h3 font-bold! tracking-tight text-primary-500">Team &amp; Roles</span>}
      subtitle="Invite admin-panel staff, assign roles and control exactly what each person can access."
    >
      <PrimaryButton leftIcon={<UserPlus className="h-4 w-4" />} onClick={onInvite}>
        Invite member
      </PrimaryButton>
    </PageHeader>
  );
}

export default TeamHeader;
