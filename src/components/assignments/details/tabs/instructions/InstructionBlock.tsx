import React from "react";
import { cn } from "@/lib/cn";

export interface InstructionBlockProps {
  icon: React.ReactNode;
  title: string;
  /** Tinted background for the body (Learning Objectives, Submission Requirements). */
  tinted?: boolean;
  children: React.ReactNode;
}

/** One instruction section: coloured icon on the left, title + body on the right. */
export function InstructionBlock({ icon, title, tinted, children }: InstructionBlockProps) {
  return (
    <section className="flex items-start gap-3.5">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center">{icon}</span>
      <div className={cn("min-w-0 flex-1", tinted && "rounded-xl bg-blue-14 p-4")}>
        <h4 className="body-md-medium font-semibold! text-primary-500">{title}</h4>
        <div className="mt-2">{children}</div>
      </div>
    </section>
  );
}

export default InstructionBlock;
