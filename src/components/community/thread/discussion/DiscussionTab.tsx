"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { ThreadReply } from "@/types/community";
import type { ThreadView as ThreadStats } from "@/lib/communityStats";
import type { ThreadPageData } from "../hooks/useThreadBundle";
import type { ThreadActions } from "../hooks/useThreadActions";
import type { ThreadTabState } from "../hooks/useThreadTab";
import { useReplyActions } from "../hooks/useReplyActions";
import { DiscussionInfoCard } from "../sidebar/DiscussionInfoCard";
import { ModerationCard } from "../sidebar/ModerationCard";
import { ParticipantsCard } from "../sidebar/ParticipantsCard";
import { SimilarDiscussionsCard } from "../sidebar/SimilarDiscussionsCard";
import { AcceptedAnswerCard } from "./AcceptedAnswerCard";
import { OriginalPostCard } from "./OriginalPostCard";
import { ReplyComposerCard } from "./ReplyComposerCard";
import { ReplyList } from "./ReplyList";

export interface DiscussionTabProps {
  data: ThreadPageData;
  view: ThreadStats;
  tabState: ThreadTabState;
  threadActions: ThreadActions;
}

/** Discussion tab: original post, accepted answer, threaded replies + composer (8/12) and the sticky info column (4/12). */
export function DiscussionTab({ data, view, tabState, threadActions }: DiscussionTabProps) {
  const { thread, replies, reports } = data.bundle;
  const replyActions = useReplyActions(thread);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const accepted = thread.category === "QUESTION" ? replies.find((r) => r.isAccepted && !r.isRemoved) : undefined;

  const focusReply = useCallback((id: string) => setHighlightId(id), []);
  const onPosted = useCallback((reply: ThreadReply) => setHighlightId(reply.id), []);

  // Clear the highlight ring after a moment (the reply scrolls itself into view when highlighted).
  useEffect(() => {
    if (!highlightId) return;
    const t = setTimeout(() => setHighlightId(null), 2200);
    return () => clearTimeout(t);
  }, [highlightId]);

  const openReplyReports = useCallback(
    (reply: ThreadReply) => {
      const open = reports.find((r) => r.targetId === reply.id && r.status === "OPEN");
      if (open) tabState.openReview(open.id);
      else tabState.setActiveTab("reports");
    },
    [reports, tabState]
  );

  return (
    <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
      <div className="min-w-0 space-y-5 xl:col-span-8">
        <OriginalPostCard thread={thread} replyCount={view.replyCount} />
        <AnimatePresence initial={false}>{accepted && <AcceptedAnswerCard key={accepted.id} reply={accepted} onJump={focusReply} />}</AnimatePresence>
        <ReplyList
          thread={thread}
          replies={replies}
          reports={reports}
          sort={tabState.replySort}
          onSortChange={tabState.setReplySort}
          actions={replyActions}
          highlightId={highlightId}
          onPosted={onPosted}
          onOpenReports={openReplyReports}
        />
        <ReplyComposerCard
          thread={thread}
          actions={replyActions}
          onPosted={onPosted}
          onUnlock={() => void threadActions.setFlag("isLocked", false)}
          unlocking={threadActions.busy === "isLocked"}
        />
      </div>

      <aside className="min-w-0 space-y-5 xl:sticky xl:top-6 xl:col-span-4">
        <DiscussionInfoCard view={view} />
        <ParticipantsCard thread={thread} replies={replies} />
        <ModerationCard thread={thread} actions={threadActions} />
        <SimilarDiscussionsCard related={data.related} />
      </aside>
    </div>
  );
}

export default DiscussionTab;
