"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, Flag, Save, ShieldOff } from "lucide-react";
import type { CommunityThread, ThreadReply } from "@/types/community";
import { useCurrentMember } from "@/lib/communityStorage";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import type { ReplyActions } from "../hooks/useReplyActions";
import { exactDate, replyDomId } from "../threadFormat";
import { AuthorLine } from "./AuthorLine";
import { ReplyActionBar } from "./ReplyActionBar";
import { ReplyComposer } from "./ReplyComposer";

export type ReplyMode = "reply" | "edit";

export interface ReplyItemProps {
  reply: ThreadReply;
  thread: CommunityThread;
  isNested: boolean;
  /** Open reports targeting this reply. */
  openReports: number;
  /** Briefly ring + scroll into view (new reply / jump link). */
  highlighted: boolean;
  /** Which inline composer is open on this reply. */
  mode: ReplyMode | null;
  onModeChange: (mode: ReplyMode | null) => void;
  actions: ReplyActions;
  onAskDelete: (reply: ThreadReply) => void;
  onOpenReports: (reply: ThreadReply) => void;
  onPosted: (reply: ThreadReply) => void;
  /** Nested replies (rendered indented under this one). */
  children?: React.ReactNode;
}

/** One reply card: author, body (or moderator notice), inline reply / edit composer, actions and nested replies. */
export function ReplyItem({
  reply,
  thread,
  isNested,
  openReports,
  highlighted,
  mode,
  onModeChange,
  actions,
  onAskDelete,
  onOpenReports,
  onPosted,
  children,
}: ReplyItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const me = useCurrentMember();
  const isStaff = reply.author.role !== "STUDENT";
  const edited = reply.updatedAt !== reply.createdAt;
  const canAccept = thread.category === "QUESTION" && !isNested && !reply.isRemoved;

  useEffect(() => {
    if (highlighted) ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlighted]);

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div
        ref={ref}
        id={replyDomId(reply.id)}
        className={cn(
          "scroll-mt-24 rounded-xl border bg-white p-4 transition-shadow duration-300",
          reply.isAccepted ? "border-green" : "border-dash",
          isStaff && !reply.isRemoved && "border-l-4 border-l-brand-orange!",
          reply.isRemoved && "bg-gray-bg",
          highlighted && "ring-4 ring-brand-orange/20"
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <AuthorLine
            member={reply.author}
            at={reply.createdAt}
            size={isNested ? 30 : 36}
            isOriginalPoster={reply.author.id === thread.author.id}
            extra={
              edited &&
              !reply.isRemoved && (
                <span title={`Edited ${exactDate(reply.updatedAt)}`} className="cursor-default whitespace-nowrap">
                  · Edited
                </span>
              )
            }
          />
          <div className="flex flex-wrap items-center gap-1.5">
            {reply.isAccepted && (
              <ToneBadge tone="green" size="sm" icon={<CircleCheck className="h-3 w-3" />}>
                Accepted answer
              </ToneBadge>
            )}
            {reply.isRemoved && (
              <ToneBadge tone="gray" size="sm" icon={<ShieldOff className="h-3 w-3" />}>
                Removed
              </ToneBadge>
            )}
            {openReports > 0 && (
              <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => onOpenReports(reply)} title="Review the reports" className="cursor-pointer">
                <ToneBadge tone="red" size="sm" icon={<Flag className="h-3 w-3" />}>
                  Reported{openReports > 1 ? ` (${openReports})` : ""}
                </ToneBadge>
              </motion.button>
            )}
          </div>
        </div>

        <div className="mt-3">
          {reply.isRemoved ? (
            <p className="body-sm-regular italic text-primary-300">This reply was removed by a moderator.</p>
          ) : mode === "edit" ? (
            <ReplyComposer
              initialHtml={reply.bodyHtml}
              submitLabel="Save Changes"
              pendingLabel="Saving..."
              submitIcon={<Save />}
              onCancel={() => onModeChange(null)}
              onSubmit={async (html) => {
                await actions.edit(reply, html);
                onModeChange(null);
              }}
            />
          ) : (
            <RichTextContent html={reply.bodyHtml} />
          )}
        </div>

        {mode !== "edit" && (
          <div className="mt-3.5 border-t border-dash pt-3">
            <ReplyActionBar
              reply={reply}
              canAccept={canAccept}
              canEdit={reply.author.id === me.id}
              isLocked={thread.isLocked}
              replyActive={mode === "reply"}
              onReply={() => onModeChange(mode === "reply" ? null : "reply")}
              onEdit={() => onModeChange("edit")}
              onToggleAccepted={() => void actions.accept(reply.isAccepted ? null : reply)}
              onToggleRemoved={() => void actions.setRemoved(reply, !reply.isRemoved)}
              onDelete={() => onAskDelete(reply)}
            />
          </div>
        )}

        <AnimatePresence initial={false}>
          {mode === "reply" && !thread.isLocked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-xl border border-dash bg-gray-bg p-3">
                <p className="mb-2 body-xsm-medium text-primary-400">Replying to {reply.author.name}</p>
                <ReplyComposer
                  placeholder={`Reply to ${reply.author.name}...`}
                  submitLabel="Post Reply"
                  minHeight="100px"
                  onCancel={() => onModeChange(null)}
                  onSubmit={async (html) => {
                    const created = await actions.post(html, reply);
                    onModeChange(null);
                    onPosted(created);
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {children}
    </motion.div>
  );
}

export default ReplyItem;
