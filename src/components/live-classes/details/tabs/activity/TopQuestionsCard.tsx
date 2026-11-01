"use client";

import React from "react";
import { motion } from "framer-motion";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { formatClock } from "@/lib/liveClassStats";
import type { LiveQuestion } from "@/types/liveClass";
import { LiveTabCard } from "../qa/LiveTabCard";

export interface TopQuestionsCardProps {
  questions: LiveQuestion[];
  onOpen: (id: string) => void;
  onViewAll: () => void;
}

/** 5 most recent answered questions ("Asked by X at 10:05 AM"). */
export function TopQuestionsCard({ questions, onOpen, onViewAll }: TopQuestionsCardProps) {
  const top = questions
    .filter((q) => q.status === "ANSWERED")
    .sort((a, b) => b.askedAt.localeCompare(a.askedAt))
    .slice(0, 5);
  return (
    <LiveTabCard variant="side" title="Top Questions" action={questions.length ? <CardActionButton onClick={onViewAll}>View All Questions</CardActionButton> : undefined}>
      {top.length === 0 ? (
        <p className="rounded-xl border border-dashed border-dash px-4 py-6 text-center body-sm-regular text-primary-300">No answered questions yet.</p>
      ) : (
        <ol className="space-y-1">
          {top.map((q, i) => (
            <motion.li key={q.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i * 0.04 }}>
              <button
                type="button"
                onClick={() => onOpen(q.id)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-1.5 py-2 text-left transition-colors hover:bg-slate-50"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-bg body-xsm-medium text-primary-400">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate body-sm-medium text-primary-500" title={q.question}>
                    {q.question}
                  </span>
                  <span className="block truncate body-xsm-regular text-primary-300">
                    Asked by {q.student.name} at {formatClock(q.askedAt)}
                  </span>
                </span>
                <ToneBadge tone="green" size="sm">
                  Answered
                </ToneBadge>
              </button>
            </motion.li>
          ))}
        </ol>
      )}
    </LiveTabCard>
  );
}

export default TopQuestionsCard;
