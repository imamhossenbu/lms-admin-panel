"use client";

import React from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import type { TeamMember } from "@/types/team";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { MemberIdentity } from "../shared/MemberIdentity";
import { ExtraPermissionsBadge, MemberStatusBadge } from "../shared/TeamBadges";
import { extraCount } from "@/lib/teamPermissions";

const MAX = 6;

/** People who hold the role (links to their profile); empty state for new roles. */
export function RoleMembersCard({ members, roleId, isNew }: { members: TeamMember[]; roleId?: string; isNew?: boolean }) {
  return (
    <IconSectionCard
      icon={<Users className="h-5 w-5" />}
      tone="blue"
      title="Members assigned"
      description={isNew ? "Assign it from Members after saving." : "Changes apply to them right away."}
      action={<ToneBadge tone="navy" size="sm">{members.length}</ToneBadge>}
    >
      {members.length === 0 ? (
        <p className="rounded-lg border border-dashed border-dash bg-gray-bg px-4 py-5 text-center body-sm-regular text-primary-300">No one has this role yet.</p>
      ) : (
        <ul className="divide-y divide-dash">
          {members.slice(0, MAX).map((m) => (
            <li key={m.id}>
              <Link href={`/users/${m.id}`} className="-mx-2 flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-slate-50">
                <MemberIdentity member={m} size={30} className="flex-1" />
                <ExtraPermissionsBadge count={extraCount(m)} />
                <MemberStatusBadge member={m} />
              </Link>
            </li>
          ))}
          {members.length > MAX && (
            <li className="pt-2">
              <Link href={roleId ? `/users?role=${roleId}` : "/users"} className="body-xsm-medium text-brand-orange hover:underline">
                +{members.length - MAX} more in Members
              </Link>
            </li>
          )}
        </ul>
      )}
    </IconSectionCard>
  );
}

export default RoleMembersCard;
