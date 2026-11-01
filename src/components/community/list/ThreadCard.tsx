"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, MessageSquare } from "lucide-react";
import { timeAgo, type ThreadView } from "@/lib/communityStats";
import { cn } from "@/lib/cn";
import { CategoryBadge } from "../shared/CategoryBadge";
import { MemberAvatar } from "../shared/MemberAvatar";
import { RoleBadge } from "../shared/RoleBadge";
import { ThreadStatusBadges } from "../shared/ThreadStatusBadges";
import { ThreadTags } from "./ThreadTags";
import { ThreadRowActions, type ThreadRowHandlers } from "./ThreadRowActions";
import { courseTitleOf, moduleLabelOf, plainText } from "./communityListUtils";

export interface ThreadCardProps {
  view: ThreadView;
  handlers: ThreadRowHandlers;
}

const Dot = () => <span className="text-primary-300" aria-hidden="true">·</span>;

/** List-view row: avatar, title + excerpt + meta + tags/status on the left, category / counts / last activity / ⋮ on the right. */
export function ThreadCard({ view, handlers }: ThreadCardProps) {
  const t = view.thread;
  const href = `/community/${t.id}`;
  const excerpt = plainText(t.bodyHtml);
  const course = courseTitleOf(t.courseId);
  const moduleLabel = moduleLabelOf(t.courseId, t.moduleId);
  const lastBy = view.lastReplier ?? t.author;
  return (
    <motion.article
      whileHover={{ y: -2 }}
      onClick={() => handlers.onView(t)}
      className={cn(
        "@container dashboard-card shadow-2xs cursor-pointer p-4 transition-shadow hover:shadow-md",
        t.isPinned && "border-brand-orange-20 bg-brand-orange-soft",
        t.isHidden && "bg-slate-50"
      )}
    >
      <div className="flex gap-3.5">
        <MemberAvatar member={t.author} size={40} />
        <div className="flex min-w-0 flex-1 flex-col gap-3 @xl:flex-row @xl:gap-5">
          {/* Left: content */}
          <div className="min-w-0 flex-1">
            <Link
              href={href}
              onClick={(e) => e.stopPropagation()}
              title={t.title}
              className="block truncate body-medium font-semibold! text-primary-500 transition-colors hover:text-brand-orange"
            >
              {t.title}
            </Link>
            {excerpt && (
              <p className="mt-0.5 truncate body-sm-regular text-primary-300" title={excerpt}>
                {excerpt}
              </p>
            )}
            <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 body-xsm-regular text-primary-300">
              <span className="body-xsm-medium font-semibold! text-primary-400">{t.author.name}</span>
              <RoleBadge role={t.author.role} />
              <Dot />
              <span className="max-w-full truncate" title={course}>
                {course}
              </span>
              {moduleLabel && (
                <>
                  <Dot />
                  <span className="max-w-full truncate" title={moduleLabel}>
                    {moduleLabel}
                  </span>
                </>
              )}
              <Dot />
              <span className="whitespace-nowrap">{timeAgo(t.createdAt)}</span>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <ThreadTags tags={t.tags} />
              <ThreadStatusBadges view={view} />
            </div>
          </div>

          {/* Right: category, counts, last activity, menu */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-dash pt-3 @xl:w-44 @xl:flex-col @xl:flex-nowrap @xl:items-end @xl:justify-start @xl:border-t-0 @xl:pt-0">
            <div className="flex items-center gap-2">
              <CategoryBadge category={t.category} />
              <ThreadRowActions thread={t} handlers={handlers} />
            </div>
            <div className="flex items-center gap-3.5 body-sm-medium text-primary-400 tabular-nums">
              <span className="inline-flex items-center gap-1.5" title={`${view.replyCount} replies`}>
                <MessageSquare className="h-4 w-4 text-primary-300" />
                {view.replyCount.toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1.5" title={`${t.views} views`}>
                <Eye className="h-4 w-4 text-primary-300" />
                {t.views.toLocaleString()}
              </span>
            </div>
            <p className="max-w-full truncate body-xsm-regular text-primary-300 @xl:text-right" title={`Last activity ${timeAgo(view.lastActivityAt)} by ${lastBy.name}`}>
              {timeAgo(view.lastActivityAt)} by <span className="body-xsm-medium text-primary-400">{lastBy.name}</span>
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default ThreadCard;
