"use client";

import React from "react";
import { Trophy } from "lucide-react";
import type { topContributors } from "@/lib/communityStats";
import { MemberAvatar } from "../shared/MemberAvatar";
import { RoleBadge } from "../shared/RoleBadge";
import { SidebarCard } from "./SidebarCard";

export type Contributor = ReturnType<typeof topContributors>[number];

/** Ranked list of the most helpful members: avatar, name + role, "N replies · N accepted". */
export function TopContributorsCard({ contributors, index }: { contributors: Contributor[]; index?: number }) {
  return (
    <SidebarCard index={index} icon={<Trophy className="h-4 w-4" />} iconClassName="bg-yellow-bg text-yellow" title="Top Contributors">
      {contributors.length === 0 ? (
        <p className="rounded-lg border border-dashed border-dash px-3 py-5 text-center body-sm-regular text-primary-300">No replies yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {contributors.map((c, i) => (
            <li key={c.member.id} className="flex items-center gap-3">
              <span className="w-4 shrink-0 text-center body-xsm-medium font-semibold! text-primary-300 tabular-nums">{i + 1}</span>
              <MemberAvatar member={c.member} size={34} />
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-1.5">
                  <p className="truncate body-sm-medium font-semibold! text-primary-500" title={c.member.name}>
                    {c.member.name}
                  </p>
                  <RoleBadge role={c.member.role} />
                </div>
                <p className="truncate body-xsm-regular text-primary-300 tabular-nums">
                  {c.replies} repl{c.replies === 1 ? "y" : "ies"} · {c.accepted} accepted
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SidebarCard>
  );
}

export default TopContributorsCard;
