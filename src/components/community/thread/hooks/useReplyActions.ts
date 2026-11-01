"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { addReply, deleteReply, setAcceptedReply, setReplyRemoved, updateReply } from "@/lib/communityStorage";
import type { CommunityThread, ThreadReply } from "@/types/community";
import { errorText } from "../threadFormat";

/** Reply-level actions (post, edit, accept, remove/restore, delete) with the standard toast lifecycle. Rejects on failure. */
export function useReplyActions(thread: CommunityThread) {
  const post = useCallback(
    async (bodyHtml: string, parent: ThreadReply | null = null) => {
      const toastId = toast.loading("Posting reply...", { description: parent ? `Replying to ${parent.author.name}.` : thread.title });
      try {
        const reply = await addReply(thread.id, bodyHtml, parent?.id ?? null);
        toast.success("Reply posted", { id: toastId, description: "Your reply is now visible in the discussion." });
        return reply;
      } catch (e) {
        toast.error("Couldn't post your reply", { id: toastId, description: errorText(e) });
        throw e;
      }
    },
    [thread.id, thread.title]
  );

  const edit = useCallback(async (reply: ThreadReply, bodyHtml: string) => {
    const toastId = toast.loading("Saving changes...");
    try {
      await updateReply(reply.id, bodyHtml);
      toast.success("Reply updated", { id: toastId, description: "Your changes were saved." });
    } catch (e) {
      toast.error("Couldn't update the reply", { id: toastId, description: errorText(e) });
      throw e;
    }
  }, []);

  const accept = useCallback(
    async (reply: ThreadReply | null) => {
      const toastId = toast.loading(reply ? "Marking as answer..." : "Removing accepted answer...");
      try {
        await setAcceptedReply(thread.id, reply?.id ?? null);
        toast.success(reply ? "Marked as accepted answer" : "Accepted answer removed", {
          id: toastId,
          description: reply ? `${reply.author.name}'s reply now shows as the answer.` : "This question is unresolved again.",
        });
      } catch (e) {
        toast.error("Couldn't update the accepted answer", { id: toastId, description: errorText(e) });
      }
    },
    [thread.id]
  );

  const setRemoved = useCallback(async (reply: ThreadReply, removed: boolean) => {
    const toastId = toast.loading(removed ? "Removing reply..." : "Restoring reply...");
    try {
      await setReplyRemoved(reply.id, removed);
      toast.success(removed ? "Reply removed" : "Reply restored", {
        id: toastId,
        description: removed ? "Members now see a moderator notice instead of the reply." : `${reply.author.name}'s reply is visible again.`,
      });
    } catch (e) {
      toast.error(removed ? "Couldn't remove the reply" : "Couldn't restore the reply", { id: toastId, description: errorText(e) });
    }
  }, []);

  const remove = useCallback(async (reply: ThreadReply) => {
    const toastId = toast.loading("Deleting reply...");
    try {
      await deleteReply(reply.id);
      toast.success("Reply deleted", { id: toastId, description: reply.parentId ? "The reply was permanently deleted." : "The reply and its nested replies were permanently deleted." });
    } catch (e) {
      toast.error("Couldn't delete the reply", { id: toastId, description: errorText(e) });
      throw e;
    }
  }, []);

  return { post, edit, accept, setRemoved, remove };
}

export type ReplyActions = ReturnType<typeof useReplyActions>;
