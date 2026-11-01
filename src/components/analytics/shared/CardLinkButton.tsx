"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { CardActionButton } from "@/components/ui/CardActionButton";

/** Card-header CardActionButton that navigates to a feature page ("View quizzes" → /quizzes). */
export function CardLinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <CardActionButton icon={<ArrowUpRight className="h-3.5 w-3.5" />} onClick={() => router.push(href)}>
      {children}
    </CardActionButton>
  );
}

export default CardLinkButton;
