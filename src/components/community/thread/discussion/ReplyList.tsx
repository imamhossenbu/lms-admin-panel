"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownWideNarrow, MessagesSquare, Trash2 } from "lucide-react";
import type { CommunityThread, ThreadReply, ThreadReport } from "@/types/community";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { ReplyActions } from "../hooks/useReplyActions";
import type { ReplySort } from "../hooks/useThreadTab";
import { plural } from "../threadFormat";
import { ReplyItem, type ReplyMode } from "./ReplyItem";

export interface ReplyListProps {
  thread: CommunityThread;
  replies: ThreadReply[];
  reports: ThreadReport[];
  sort: ReplySort;
  onSortChange: (sort: ReplySort) => void;
  actions: ReplyActions;
  highlightId: string | null;
  onPosted: (reply: ThreadReply) => void;
  onOpenReports: (reply: ThreadReply) => void;
}

const byDate = (a: ThreadReply, b: ThreadReply) => a.createdAt.localeCompare(b.createdAt);

/** Replies header (count + "Newest first" toggle) and the threaded list (one level of nesting with a connector line). */
export function ReplyList({ thread, replies, reports, sort, onSortChange, actions, highlightId, onPosted, onOpenReports }: ReplyListProps) {
  const [composer, setComposer] = useState<{ id: string; mode: ReplyMode } | null>(null);
  const [toDelete, setToDelete] = useState<ThreadReply | null>(null);

  const { topLevel, childrenOf } = useMemo(() => {
    const ids = new Set(replies.map((r) => r.id));
    // A nested reply whose parent no longer exists is shown as top-level.
    const isTop = (r: ThreadReply) => !r.parentId || !ids.has(r.parentId);
    const top = replies.filter(isTop).sort(byDate);
    if (sort === "newest") top.reverse();
    const map = new Map<string, ThreadReply[]>();
    replies
      .filter((r) => !isTop(r))
      .sort(byDate)
      .forEach((r) => map.set(r.parentId as string, [...(map.get(r.parentId as string) ?? []), r]));
    return { topLevel: top, childrenOf: map };
  }, [replies, sort]);

  const openReportsOf = useMemo(() => {
    const m = new Map<string, number>();
    reports.forEach((r) => r.status === "OPEN" && r.targetType === "REPLY" && m.set(r.targetId, (m.get(r.targetId) ?? 0) + 1));
    return m;
  }, [reports]);

  const visibleCount = replies.filter((r) => !r.isRemoved).length;
  const nestedOfDeleting = toDelete && !toDelete.parentId ? (childrenOf.get(toDelete.id)?.length ?? 0) : 0;

  const renderItem = (reply: ThreadReply, isNested: boolean, nested?: React.ReactNode) => (
    <ReplyItem
      key={reply.id}
      reply={reply}
      thread={thread}
      isNested={isNested}
      openReports={openReportsOf.get(reply.id) ?? 0}
      highlighted={highlightId === reply.id}
      mode={composer?.id === reply.id ? composer.mode : null}
      onModeChange={(mode) => setComposer(mode ? { id: reply.id, mode } : null)}
      actions={actions}
      onAskDelete={setToDelete}
      onOpenReports={onOpenReports}
      onPosted={onPosted}
    >
      {nested}
    </ReplyItem>
  );

  return (
    <section aria-label="Replies" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="heading-h5 font-semibold! text-primary-500">{plural(visibleCount, "Reply", "Replies")}</h2>
        {replies.length > 1 && (
          <CardActionButton icon={<ArrowDownWideNarrow />} active={sort === "newest"} onClick={() => onSortChange(sort === "newest" ? "oldest" : "newest")}>
            Newest first
          </CardActionButton>
        )}
      </div>

      {replies.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-dash bg-white px-6 py-10 text-center"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-bg text-primary-300">
            <MessagesSquare className="h-6 w-6" />
          </span>
          <p className="mt-3 body-md-medium font-semibold! text-primary-500">No replies yet</p>
          <p className="mt-1 max-w-sm body-sm-regular text-primary-300">
            {thread.isLocked ? "This discussion is locked, so no one can reply." : "Be the first to respond — your reply will appear here."}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {topLevel.map((reply) => {
              const kids = childrenOf.get(reply.id) ?? [];
              return renderItem(
                reply,
                false,
                kids.length > 0 && (
                  <div className="ml-4 mt-3 space-y-3 border-l-2 border-dash pl-4 sm:ml-6 sm:pl-6">
                    <AnimatePresence initial={false}>{kids.map((k) => renderItem(k, true))}</AnimatePresence>
                  </div>
                )
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <ConfirmModal
        isOpen={toDelete !== null}
        title="Delete Reply"
        message={
          <>
            Permanently delete <strong>{toDelete?.author.name}</strong>&apos;s reply
            {nestedOfDeleting > 0 ? ` and its ${plural(nestedOfDeleting, "nested reply", "nested replies")}` : ""}? Reports on it are removed too. Use
            &quot;Remove&quot; instead to keep a moderator notice.
          </>
        }
        confirmLabel="Delete Reply"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 />}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (toDelete) await actions.remove(toDelete);
        }}
      />
    </section>
  );
}

export default ReplyList;
