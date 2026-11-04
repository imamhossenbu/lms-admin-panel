"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import type { CommunityThread, ThreadReply } from "@/types/community";
import { useCurrentMember } from "@/lib/communityStorage";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { MemberAvatar } from "../../shared/MemberAvatar";
import { RoleBadge } from "../../shared/RoleBadge";
import type { ReplyActions } from "../hooks/useReplyActions";
import { ReplyComposer } from "./ReplyComposer";

export interface ReplyComposerCardProps {
  thread: CommunityThread;
  actions: ReplyActions;
  /** Called with the new reply after a successful post (scroll + highlight). */
  onPosted: (reply: ThreadReply) => void;
  onUnlock: () => void;
  unlocking: boolean;
}

/** Bottom "Reply as Admin" composer, or a locked notice with an Unlock action. */
export function ReplyComposerCard({ thread, actions, onPosted, onUnlock, unlocking }: ReplyComposerCardProps) {
  const me = useCurrentMember();
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="dashboard-card shadow-2xs p-5"
      aria-label="Write a reply"
    >
      <header className="flex items-center gap-3">
        <MemberAvatar member={me} size={36} />
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <h3 className="body-md-medium font-semibold! text-primary-500">Reply as {me.name}</h3>
          <RoleBadge role={me.role} />
        </div>
      </header>

      <div className="mt-4">
        {thread.isLocked ? (
          <div className="flex flex-col gap-3 rounded-xl border border-yellow bg-yellow-bg p-4 sm:flex-row sm:items-center">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-14 text-yellow">
              <Lock className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="body-sm-medium font-semibold! text-primary-500">This discussion is locked</p>
              <p className="mt-0.5 body-xsm-regular text-primary-400">No one can post new replies until it&apos;s unlocked.</p>
            </div>
            <CardActionButton icon={<Unlock />} onClick={onUnlock} disabled={unlocking}>
              {unlocking ? "Unlocking..." : "Unlock"}
            </CardActionButton>
          </div>
        ) : (
          <ReplyComposer
            placeholder="Write a helpful reply... (code blocks and links supported)"
            submitLabel="Post Reply"
            onSubmit={async (html) => onPosted(await actions.post(html))}
          />
        )}
      </div>
    </motion.section>
  );
}

export default ReplyComposerCard;
