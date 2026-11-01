import React from "react";
import type { CommunityMember, CommunityRole } from "@/types/community";
import { initialsOf } from "@/lib/communityStats";
import { cn } from "@/lib/cn";

const ROLE_TINT: Record<CommunityRole, string> = {
  STUDENT: "bg-blue-14 text-blue",
  INSTRUCTOR: "bg-purple-14 text-purple",
  ADMIN: "bg-brand-orange-light text-brand-orange",
};

export interface MemberAvatarProps {
  member: CommunityMember;
  /** Diameter in px (default 36). */
  size?: number;
  className?: string;
}

/** Initials avatar tinted by role (student blue, instructor purple, admin orange). */
export function MemberAvatar({ member, size = 36, className }: MemberAvatarProps) {
  return (
    <span
      title={member.name}
      aria-hidden="true"
      className={cn("inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold!", size < 32 ? "body-2xsm-regular" : "body-xsm-medium", ROLE_TINT[member.role], className)}
      style={{ width: size, height: size }}
    >
      {initialsOf(member.name) || "?"}
    </span>
  );
}

export default MemberAvatar;
