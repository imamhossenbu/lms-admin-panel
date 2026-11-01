"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Eye, KeyRound, UserCog } from "lucide-react";
import type { TeamMember, TeamRole } from "@/types/team";
import { describePermissions } from "@/lib/teamPermissions";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { PermissionMatrix } from "../editor/PermissionMatrix";
import { RoleBadge } from "../shared/TeamBadges";

export interface MemberAccessCardProps {
  member: TeamMember;
  role: TeamRole | undefined;
  onChangeRole: () => void;
}

/** Role + plain-English summary + compact read-only effective-permissions matrix. */
export function MemberAccessCard({ member, role, onChangeRole }: MemberAccessCardProps) {
  const router = useRouter();
  return (
    <IconSectionCard
      icon={<KeyRound className="h-5 w-5" />}
      tone="purple"
      title="Access"
      description={member.status === "INVITED" ? "What they'll be able to do once they accept." : "Effective permissions from their role."}
      action={
        <div className="flex flex-wrap justify-end gap-2">
          {role && (
            <CardActionButton icon={<Eye />} onClick={() => router.push(`/users/roles/${role.id}/edit`)}>
              View role
            </CardActionButton>
          )}
          {!member.isOwner && (
            <CardActionButton icon={<UserCog />} onClick={onChangeRole}>
              Change role
            </CardActionButton>
          )}
        </div>
      }
    >
      {role ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-2 rounded-xl border border-dash bg-gray-bg p-3.5 sm:flex-row sm:items-start">
            <RoleBadge role={role} size="md" />
            <p className="body-sm-regular text-primary-400">{describePermissions(role.permissions)}</p>
          </div>
          <PermissionMatrix value={role.permissions} readOnly compact />
        </div>
      ) : (
        <p className="body-sm-regular text-primary-300">This member&apos;s role no longer exists. Assign a new role to restore access.</p>
      )}
    </IconSectionCard>
  );
}

export default MemberAccessCard;
