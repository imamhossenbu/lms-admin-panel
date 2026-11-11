"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, MessageCircle, Send } from "lucide-react";
import { apiErrorMessage } from "@/lib/apiError";
import { teacherApi } from "@/lib/api/teacher";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import type { TeacherQuestion } from "@/types/teacher";
import { Avatar } from "@/components/ui/Avatar";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ago } from "../shared/format";

/** A learner's question with the thread so far and the teacher's reply box. */
export function QuestionCard({ q, onReplied }: { q: TeacherQuestion; onReplied: () => void }) {
  const [open, setOpen] = useState(!q.answered);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const send = async () => {
    if (body.trim().length < 2) return setError("Write your answer");
    setBusy(true);
    const id = toast.loading("Posting your answer…");
    try {
      await teacherApi.reply(q.id, body);
      toast.success("Answer posted", { id, description: `${q.author.name} will see it in the course discussion.` });
      setBody("");
      setError(null);
      onReplied();
    } catch (e) {
      toast.error("Couldn't post your answer", { id, description: apiErrorMessage(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.article layout className="dashboard-card shadow-2xs overflow-hidden">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-start gap-3 p-5 text-left">
        <Avatar name={q.author.name} src={q.author.avatar} size="sm" />
        <span className="min-w-0 flex-1">
          <span className="block body-medium font-semibold text-primary-500">{q.title}</span>
          <span className="block body-xsm-regular text-primary-300">
            {q.author.name} · {q.course} · {ago(q.createdAt)}
          </span>
        </span>
        {q.answered ? (
          <ToneBadge tone="green" size="sm" icon={<CheckCircle2 className="h-3 w-3" />}>
            Answered
          </ToneBadge>
        ) : (
          <ToneBadge tone="orange" size="sm" dot>
            Needs answer
          </ToneBadge>
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="space-y-4 border-t border-dash p-5">
              <div className="prose-sm body-sm-regular text-primary-500" dangerouslySetInnerHTML={{ __html: sanitizeHtml(q.bodyHtml) }} />
              {q.replies.length > 0 && (
                <ul className="space-y-3">
                  {q.replies.map((r) => (
                    <li key={r.id} className={`rounded-lg border p-3 ${r.mine ? "border-brand-orange/30 bg-brand-orange-light" : "border-dash bg-slate-50"}`}>
                      <p className="mb-1 inline-flex items-center gap-2 body-xsm-medium text-primary-400">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {r.mine ? "You" : r.author.name} · {ago(r.createdAt)}
                        {r.isAccepted && <ToneBadge tone="green" size="sm">Accepted</ToneBadge>}
                      </p>
                      <div className="body-sm-regular text-primary-500" dangerouslySetInnerHTML={{ __html: sanitizeHtml(r.bodyHtml) }} />
                    </li>
                  ))}
                </ul>
              )}
              <div>
                <TextAreaField rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your answer…" error={error ?? undefined} aria-label="Your answer" />
                <div className="mt-2 flex justify-end">
                  <PrimaryButton type="button" onClick={send} isLoading={busy} leftIcon={<Send className="h-4 w-4" />}>
                    Post answer
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default QuestionCard;
