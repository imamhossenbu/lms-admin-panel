"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye, Heart, MessageSquare } from "lucide-react";
import type { CommunityThread } from "@/types/community";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { AuthorLine } from "./AuthorLine";
import { exactDate } from "../threadFormat";

export interface OriginalPostCardProps {
  thread: CommunityThread;
  replyCount: number;
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap body-xsm-medium text-primary-300">
      {icon}
      {label}
    </span>
  );
}

/** The discussion starter: author line, rich-text body, tags and likes / views / replies counts. */
export function OriginalPostCard({ thread, replyCount }: OriginalPostCardProps) {
  const edited = thread.updatedAt !== thread.createdAt;
  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="dashboard-card shadow-2xs p-5"
      aria-label="Original post"
    >
      <AuthorLine
        member={thread.author}
        at={thread.createdAt}
        size={40}
        isOriginalPoster
        extra={
          edited && (
            <span title={`Last updated ${exactDate(thread.updatedAt)}`} className="cursor-default whitespace-nowrap">
              · Updated
            </span>
          )
        }
      />
      <RichTextContent html={thread.bodyHtml} className="mt-4 body-regular" />

      {thread.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {thread.tags.map((tag) => (
            <ToneBadge key={tag} tone="gray" size="sm" variant="pill">
              #{tag}
            </ToneBadge>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-dash pt-3.5">
        <Stat icon={<Heart className="h-4 w-4" />} label={`${thread.likes.toLocaleString()} likes`} />
        <Stat icon={<Eye className="h-4 w-4" />} label={`${thread.views.toLocaleString()} views`} />
        <Stat icon={<MessageSquare className="h-4 w-4" />} label={`${replyCount.toLocaleString()} ${replyCount === 1 ? "reply" : "replies"}`} />
      </div>
    </motion.article>
  );
}

export default OriginalPostCard;
