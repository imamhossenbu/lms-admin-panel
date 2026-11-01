import React from "react";
import { Crown, Lock, ShieldCheck, ShieldOff } from "lucide-react";
import type { TeamMember, TeamRole } from "@/types/team";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { inviteState } from "@/lib/teamStats";
import { ROLE_TONE_META } from "./roleTone";

/** Role name in the role's colour (falls back to grey "Unknown role"). */
export function RoleBadge({ role, size = "sm", className }: { role: Pick<TeamRole, "name" | "tone"> | undefined; size?: "sm" | "md"; className?: string }) {
  if (!role)
    return (
      <ToneBadge tone="gray" size={size} className={className}>
        Unknown role
      </ToneBadge>
    );
  return (
    <ToneBadge tone={ROLE_TONE_META[role.tone].badge} size={size} dot className={className}>
      <span className="min-w-0 truncate" title={role.name}>
        {role.name}
      </span>
    </ToneBadge>
  );
}

/** Active / Suspended / Invited / Invite expired. */
export function MemberStatusBadge({ member, size = "sm" }: { member: TeamMember; size?: "sm" | "md" }) {
  if (member.status === "INVITED") {
    const expired = inviteState(member) === "EXPIRED";
    return (
      <ToneBadge tone={expired ? "red" : "yellow"} size={size} variant="pill" dot>
        {expired ? "Invite expired" : "Invited"}
      </ToneBadge>
    );
  }
  return (
    <ToneBadge tone={member.status === "ACTIVE" ? "green" : "gray"} size={size} variant="pill" dot>
      {member.status === "ACTIVE" ? "Active" : "Suspended"}
    </ToneBadge>
  );
}

/** 2FA on / off (— for invitations). */
export function TwoFactorBadge({ member, size = "sm" }: { member: TeamMember; size?: "sm" | "md" }) {
  if (member.status === "INVITED") return <span className="body-sm-regular text-primary-300">—</span>;
  return member.twoFactorEnabled ? (
    <ToneBadge tone="green" size={size} icon={<ShieldCheck className="h-3 w-3" />}>
      On
    </ToneBadge>
  ) : (
    <ToneBadge tone="red" size={size} icon={<ShieldOff className="h-3 w-3" />}>
      Off
    </ToneBadge>
  );
}

export function OwnerBadge({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <ToneBadge tone="orange" size={size} variant="pill" icon={<Crown className="h-3 w-3" />}>
      Owner
    </ToneBadge>
  );
}

export function SystemRoleBadge({ locked }: { locked?: boolean }) {
  return (
    <ToneBadge tone="navy" size="sm" icon={locked ? <Lock className="h-3 w-3" /> : undefined}>
      {locked ? "Locked" : "System"}
    </ToneBadge>
  );
}
