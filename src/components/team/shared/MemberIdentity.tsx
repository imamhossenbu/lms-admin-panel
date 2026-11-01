import React from "react";
import { Mail } from "lucide-react";
import type { TeamMember } from "@/types/team";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import { OwnerBadge } from "./TeamBadges";

export interface MemberIdentityProps {
  member: TeamMember;
  size?: number;
  /** Show the "You" marker (the signed-in admin). */
  isYou?: boolean;
  className?: string;
}

/** Avatar (initials, or a mail tile for invitations) + name/Owner badge + email; truncates safely in table cells. */
export function MemberIdentity({ member, size = 32, isYou, className }: MemberIdentityProps) {
  const invited = member.status === "INVITED";
  const title = invited ? member.email : member.name;
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      {invited ? (
        <span className="flex shrink-0 items-center justify-center rounded-full border border-dashed border-yellow/60 bg-yellow-bg text-yellow" style={{ width: size, height: size }}>
          <Mail className="h-3.5 w-3.5" />
        </span>
      ) : (
        <Avatar name={member.name} size={size} className={member.status === "SUSPENDED" ? "opacity-60" : undefined} />
      )}
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-1.5">
          <p className="truncate body-sm-medium font-semibold! text-primary-500" title={title}>
            {title}
          </p>
          {member.isOwner && <OwnerBadge />}
          {isYou && !member.isOwner && <span className="shrink-0 body-xsm-regular text-primary-300">(you)</span>}
        </div>
        <p className="truncate body-xsm-regular text-primary-300" title={invited ? "Invitation not accepted yet" : member.email}>
          {invited ? "Invitation not accepted yet" : member.email}
        </p>
      </div>
    </div>
  );
}

export default MemberIdentity;
