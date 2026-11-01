import React from "react";
import type { TeamMember } from "@/types/team";
import { Avatar } from "@/components/ui/Avatar";

/** Overlapping initials avatars (+N) for the people holding a role. */
export function AvatarStack({ members, max = 4, size = 28 }: { members: TeamMember[]; max?: number; size?: number }) {
  if (members.length === 0) return <span className="body-xsm-regular text-primary-300">No one yet</span>;
  const shown = members.slice(0, max);
  const extra = members.length - shown.length;
  return (
    <div className="flex items-center -space-x-2" title={members.map((m) => m.name || m.email).join(", ")}>
      {shown.map((m) => (
        <Avatar key={m.id} name={m.name || m.email} size={size} className="border-2 border-white" />
      ))}
      {extra > 0 && (
        <span className="flex shrink-0 items-center justify-center rounded-full border-2 border-white bg-slate-100 body-2xsm-regular font-semibold text-primary-400" style={{ width: size, height: size }}>
          +{extra}
        </span>
      )}
    </div>
  );
}

export default AvatarStack;
