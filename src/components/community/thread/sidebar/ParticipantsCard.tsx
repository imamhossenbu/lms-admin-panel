import React, { useMemo } from "react";
import { Users } from "lucide-react";
import type { CommunityMember, CommunityThread, ThreadReply } from "@/types/community";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { MemberAvatar } from "../../shared/MemberAvatar";
import { RoleBadge } from "../../shared/RoleBadge";
import { plural } from "../threadFormat";

export interface ParticipantsCardProps {
  thread: CommunityThread;
  replies: ThreadReply[];
}

const STACK = 6;

/** Avatar stack + list of everyone in the discussion with their (non-removed) reply counts. */
export function ParticipantsCard({ thread, replies }: ParticipantsCardProps) {
  const people = useMemo(() => {
    const map = new Map<string, { member: CommunityMember; count: number }>([[thread.author.id, { member: thread.author, count: 0 }]]);
    replies
      .filter((r) => !r.isRemoved)
      .forEach((r) => {
        const cur = map.get(r.author.id) ?? { member: r.author, count: 0 };
        map.set(r.author.id, { ...cur, count: cur.count + 1 });
      });
    const [author, ...rest] = Array.from(map.values());
    return [author, ...rest.sort((a, b) => b.count - a.count || a.member.name.localeCompare(b.member.name))];
  }, [thread.author, replies]);

  const extra = people.length - STACK;

  return (
    <IconSectionCard
      icon={<Users className="h-5 w-5" />}
      title="Participants"
      description={plural(people.length, "person", "people") + " in this discussion"}
      tone="purple"
    >
      <div className="flex items-center -space-x-2">
        {people.slice(0, STACK).map((p) => (
          <MemberAvatar key={p.member.id} member={p.member} size={34} className="ring-2 ring-white" />
        ))}
        {extra > 0 && (
          <span className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-gray-bg body-2xsm-regular font-semibold! text-primary-400 ring-2 ring-white">
            +{extra}
          </span>
        )}
      </div>

      <ul className="mt-4 max-h-72 divide-y divide-dash overflow-y-auto">
        {people.map(({ member, count }) => (
          <li key={member.id} className="flex items-center gap-3 py-2.5">
            <MemberAvatar member={member} size={30} />
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              <span className="truncate body-sm-medium text-primary-500">{member.name}</span>
              <RoleBadge role={member.role} />
              {member.id === thread.author.id && (
                <ToneBadge tone="gray" size="sm" variant="pill">
                  Author
                </ToneBadge>
              )}
            </div>
            <span className="shrink-0 whitespace-nowrap body-xsm-regular text-primary-300">{plural(count, "reply", "replies")}</span>
          </li>
        ))}
      </ul>
    </IconSectionCard>
  );
}

export default ParticipantsCard;
