"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Lock, Pencil, Pin, PinOff, Unlock } from "lucide-react";
import type { ThreadView as ThreadStats } from "@/lib/communityStats";
import { timeAgo } from "@/lib/communityStats";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { CategoryBadge } from "../shared/CategoryBadge";
import { ThreadStatusBadges } from "../shared/ThreadStatusBadges";
import type { ThreadActions } from "./hooks/useThreadActions";
import { courseLabels, exactDate } from "./threadFormat";
import { ThreadMoreMenu } from "./ThreadMoreMenu";

export interface ThreadHeaderProps {
  view: ThreadStats;
  actions: ThreadActions;
}

/** Breadcrumb, title + category / status badges, context subtitle and page actions (Edit, Pin, Lock, ⋮). */
export function ThreadHeader({ view, actions }: ThreadHeaderProps) {
  const router = useRouter();
  const { thread } = view;
  const labels = courseLabels(thread.courseId, thread.moduleId);

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: "Community", href: "/community" }, { label: thread.title }]} />
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="heading-h2-bold break-words text-primary-500">{thread.title}</h1>
            <CategoryBadge category={thread.category} size="md" />
            <ThreadStatusBadges view={view} />
          </div>
          <p className="mt-1.5 body-regular text-primary-300">
            {labels.course} · {labels.module} · Started by <span className="text-primary-400">{thread.author.name}</span> ·{" "}
            <time dateTime={thread.createdAt} title={exactDate(thread.createdAt)}>
              {timeAgo(thread.createdAt)}
            </time>
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          <PrimaryButton leftIcon={<Pencil />} onClick={() => router.push(`/community/${thread.id}/edit`)}>
            Edit
          </PrimaryButton>
          <SecondaryButton
            leftIcon={thread.isPinned ? <PinOff /> : <Pin />}
            onClick={() => void actions.togglePin()}
            isLoading={actions.busy === "isPinned"}
            disabled={actions.busy !== null}
          >
            {thread.isPinned ? "Unpin" : "Pin"}
          </SecondaryButton>
          <SecondaryButton
            leftIcon={thread.isLocked ? <Unlock /> : <Lock />}
            onClick={() => void actions.toggleLock()}
            isLoading={actions.busy === "isLocked"}
            disabled={actions.busy !== null}
          >
            {thread.isLocked ? "Unlock" : "Lock"}
          </SecondaryButton>
          <ThreadMoreMenu thread={thread} actions={actions} />
        </div>
      </div>
    </div>
  );
}

export default ThreadHeader;
