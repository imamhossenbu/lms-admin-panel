"use client";

import React from "react";
import { Share2 } from "lucide-react";
import type { QuizItem } from "@/types/quiz";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { InputField } from "@/components/ui/InputField";
import { CopyButton } from "@/components/ui/CopyButton";
import { quizShareUrl } from "../../quizFormat";

/** Read-only public quiz link with a copy button. */
export function ShareQuizLinkCard({ quiz }: { quiz: QuizItem }) {
  const url = quizShareUrl(quiz);
  const isLive = quiz.status === "PUBLISHED";
  return (
    <IconSectionCard icon={<Share2 className="h-5 w-5" />} title="Share Quiz Link" bodyClassName="mt-4 space-y-2">
      <InputField value={url} readOnly aria-label="Quiz link" onFocus={(e) => e.currentTarget.select()} rightElement={<CopyButton value={url} label="Quiz link copied" />} />
      <p className="body-xsm-regular text-primary-300">
        {isLive ? "Share this link with students to take the quiz." : "Publish the quiz first — students can't open the link while it isn't published."}
      </p>
    </IconSectionCard>
  );
}

export default ShareQuizLinkCard;
