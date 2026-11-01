import React from "react";
import { Activity, BookOpen, CalendarPlus, Eye, Info, Layers, MessageSquare, Tag, Users } from "lucide-react";
import type { ThreadView as ThreadStats } from "@/lib/communityStats";
import { timeAgo } from "@/lib/communityStats";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CategoryBadge } from "../../shared/CategoryBadge";
import { courseLabels, exactDate, shortDate } from "../threadFormat";
import { InfoRow } from "./InfoRow";

export interface DiscussionInfoCardProps {
  view: ThreadStats;
}

/** Category, course, module, created, last activity, views, replies and participants. */
export function DiscussionInfoCard({ view }: DiscussionInfoCardProps) {
  const { thread } = view;
  const labels = courseLabels(thread.courseId, thread.moduleId);
  return (
    <IconSectionCard icon={<Info className="h-5 w-5" />} title="Discussion Info" tone="blue" bodyClassName="mt-3">
      <dl className="divide-y divide-dash">
        <InfoRow icon={Tag} label="Category">
          <CategoryBadge category={thread.category} />
        </InfoRow>
        <InfoRow icon={BookOpen} label="Course" title={labels.course}>
          <span className="truncate">{labels.course}</span>
        </InfoRow>
        <InfoRow icon={Layers} label="Module" title={labels.module}>
          <span className="truncate">{labels.module}</span>
        </InfoRow>
        <InfoRow icon={CalendarPlus} label="Created" title={exactDate(thread.createdAt)}>
          {shortDate(thread.createdAt)}
        </InfoRow>
        <InfoRow icon={Activity} label="Last activity" title={exactDate(view.lastActivityAt)}>
          {timeAgo(view.lastActivityAt)}
        </InfoRow>
        <InfoRow icon={Eye} label="Views">
          {thread.views.toLocaleString()}
        </InfoRow>
        <InfoRow icon={MessageSquare} label="Replies">
          {view.replyCount.toLocaleString()}
        </InfoRow>
        <InfoRow icon={Users} label="Participants">
          {view.participants.length.toLocaleString()}
        </InfoRow>
      </dl>
    </IconSectionCard>
  );
}

export default DiscussionInfoCard;
