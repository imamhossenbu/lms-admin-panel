import React from "react";
import type { CommunityRole } from "@/types/community";
import { ToneBadge } from "@/components/ui/ToneBadge";

export interface RoleBadgeProps {
  role: CommunityRole;
  className?: string;
}

/** "Instructor" / "Admin" tag next to a name (renders nothing for students). */
export function RoleBadge({ role, className }: RoleBadgeProps) {
  if (role === "STUDENT") return null;
  return (
    <ToneBadge tone={role === "ADMIN" ? "orange" : "purple"} size="sm" variant="pill" className={className}>
      {role === "ADMIN" ? "Admin" : "Instructor"}
    </ToneBadge>
  );
}

export default RoleBadge;
