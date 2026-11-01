"use client";

import React from "react";
import { Pencil } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { ToneBadge } from "@/components/ui/ToneBadge";

export interface ReviewSectionProps {
  icon: React.ReactNode;
  title: string;
  onEdit: () => void;
  /** Red border + "Needs attention" badge. */
  hasIssues?: boolean;
  children: React.ReactNode;
}

/** Review card for one wizard step with an "Edit" button that jumps back to it. */
export function ReviewSection({ icon, title, onEdit, hasIssues, children }: ReviewSectionProps) {
  return (
    <IconSectionCard
      icon={icon}
      title={title}
      tone={hasIssues ? "red" : "blue"}
      className={hasIssues ? "border-red!" : undefined}
      bodyClassName="mt-4"
      action={
        <div className="flex items-center gap-2">
          {hasIssues && (
            <ToneBadge tone="red" size="sm" dot>
              Needs attention
            </ToneBadge>
          )}
          <CardActionButton icon={<Pencil />} onClick={onEdit} aria-label={`Edit ${title}`}>
            Edit
          </CardActionButton>
        </div>
      }
    >
      {children}
    </IconSectionCard>
  );
}

export default ReviewSection;
