import React from "react";
import type { CommunityMember } from "@/types/community";
import { timeAgo } from "@/lib/communityStats";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { MemberAvatar } from "../../shared/MemberAvatar";
import { RoleBadge } from "../../shared/RoleBadge";
import { exactDate } from "../threadFormat";

export interface AuthorLineProps {
  member: CommunityMember;
  /** ISO datetime shown as "time ago" (exact date on hover). */
  at: string;
  /** Avatar diameter in px. */
  size?: number;
  /** Marks the discussion starter. */
  isOriginalPoster?: boolean;
  /** Extra inline markers after the time ("Edited" …). */
  extra?: React.ReactNode;
}

/** Avatar + name + role badge + relative time (exact date on hover). */
export function AuthorLine({ member, at, size = 36, isOriginalPoster, extra }: AuthorLineProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <MemberAvatar member={member} size={size} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="truncate body-sm-medium font-semibold! text-primary-500">{member.name}</span>
          <RoleBadge role={member.role} />
          {isOriginalPoster && (
            <ToneBadge tone="gray" size="sm" variant="pill">
              Author
            </ToneBadge>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 body-xsm-regular text-primary-300">
          <time dateTime={at} title={exactDate(at)} className="cursor-default whitespace-nowrap">
            {timeAgo(at)}
          </time>
          {extra}
        </div>
      </div>
    </div>
  );
}

export default AuthorLine;
