import React from "react";
import { ToneBadge } from "@/components/ui/ToneBadge";

interface ContentSectionHeaderProps {
  title: string;
  description: string;
  optional?: boolean;
}

/** "Video Content" / "Lesson Content" title + helper line. */
export function ContentSectionHeader({ title, description, optional }: ContentSectionHeaderProps) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        <h3 className="heading-h6 text-primary-500">{title}</h3>
        {optional && (
          <ToneBadge tone="gray" size="sm" variant="pill">
            Optional
          </ToneBadge>
        )}
      </div>
      <p className="body-sm-regular text-primary-300 mt-0.5">{description}</p>
    </div>
  );
}

export default ContentSectionHeader;
