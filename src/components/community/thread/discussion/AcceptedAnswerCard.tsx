"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, CircleCheck } from "lucide-react";
import type { ThreadReply } from "@/types/community";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { AuthorLine } from "./AuthorLine";

export interface AcceptedAnswerCardProps {
  reply: ThreadReply;
  onJump: (replyId: string) => void;
}

/** Green highlighted copy of the accepted answer, pinned under the question with a jump link. */
export function AcceptedAnswerCard({ reply, onJump }: AcceptedAnswerCardProps) {
  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="rounded-xl border border-green bg-green-bg/40 p-5"
      aria-label="Accepted answer"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToneBadge tone="green" icon={<CircleCheck className="h-3.5 w-3.5" />}>
          Accepted answer
        </ToneBadge>
        <CardActionButton icon={<ArrowDownRight />} onClick={() => onJump(reply.id)}>
          Jump to reply
        </CardActionButton>
      </div>
      <div className="mt-4">
        <AuthorLine member={reply.author} at={reply.createdAt} size={32} />
      </div>
      <RichTextContent html={reply.bodyHtml} className="mt-3 line-clamp-6" />
    </motion.section>
  );
}

export default AcceptedAnswerCard;
