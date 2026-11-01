"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, MessageSquareText } from "lucide-react";
import { qaStats } from "@/lib/liveClassStats";
import type { LiveQuestion } from "@/types/liveClass";
import { cn } from "@/lib/cn";
import { LiveTabCard } from "./LiveTabCard";

/** Right "Q&A Summary" card shown when no question is open. */
export function QaSummaryCard({ questions, allowQa }: { questions: LiveQuestion[]; allowQa: boolean }) {
  const s = qaStats(questions);
  const chips = [
    { label: "Asked", value: s.asked, icon: MessageSquareText, tone: "bg-purple-14 text-purple" },
    { label: "Answered", value: s.answered, icon: CheckCircle2, tone: "bg-green-bg text-green" },
    { label: "Pending", value: s.pending, icon: Clock, tone: "bg-brand-orange-light text-brand-orange" },
  ];
  return (
    <LiveTabCard variant="side" title="Q&A Summary" subtitle="Select a question to read or answer it.">
      <div className="@container">
        <div className="grid grid-cols-1 gap-2.5 @2xs:grid-cols-3">
          {chips.map((c) => (
            <div key={c.label} className="flex items-center gap-2.5 rounded-xl border border-dash p-3 @2xs:flex-col @2xs:items-start">
              <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", c.tone)}>
                <c.icon className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="heading-h5 font-semibold! text-primary-500">{c.value}</p>
                <p className="body-xsm-regular text-primary-300">{c.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between body-sm-medium">
          <span className="text-primary-400">Answered</span>
          <span className="text-green">{s.answeredPct}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-bg">
          <motion.div className="h-full rounded-full bg-green" initial={{ width: 0 }} animate={{ width: `${s.answeredPct}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
        </div>
        <p className="mt-3 body-xsm-regular text-primary-300">
          {allowQa ? `${s.pending} question${s.pending === 1 ? "" : "s"} still waiting for an answer.` : "Q&A is turned off for this class (see Settings)."}
        </p>
      </div>
    </LiveTabCard>
  );
}

export default QaSummaryCard;
