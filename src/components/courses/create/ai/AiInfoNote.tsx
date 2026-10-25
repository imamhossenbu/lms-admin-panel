import React from "react";
import { cn } from "@/lib/cn";

export interface AiInfoNoteProps {
  /** Pre-sized icon (h-5 w-5 for "sm", h-7 w-7 for "md"). */
  icon: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  tone?: "purple" | "orange";
  size?: "sm" | "md";
  className?: string;
}

const TONES = {
  purple: { box: "bg-purple-14 border-purple/20", icon: "text-purple", title: "text-primary-500" },
  orange: { box: "bg-brand-orange-light border-brand-orange/20", icon: "text-brand-orange", title: "text-brand-orange" },
} as const;

/** Tinted callout used for the AI info box, Pro Tip and "Did you know?" notes. */
export function AiInfoNote({ icon, title, children, tone = "purple", size = "sm", className }: AiInfoNoteProps) {
  const t = TONES[tone];
  const isMd = size === "md";

  return (
    <div className={cn("flex items-start gap-3 rounded-xl border", isMd ? "p-5" : "p-4", t.box, className)}>
      <span className={cn("shrink-0", t.icon)}>{icon}</span>
      <div className="min-w-0">
        {title && <p className={cn(isMd ? "title-medium" : "body-sm-medium", t.title)}>{title}</p>}
        <div className={cn("text-primary-400", isMd ? "body-sm-regular mt-1" : "body-xsm-regular", title && !isMd && "mt-0.5")}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AiInfoNote;
