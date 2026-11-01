import React from "react";
import { cn } from "@/lib/cn";

export interface PricingSectionHeaderProps {
  title: string;
  description?: string;
  /** Appends a muted "(Optional)" after the title. */
  optional?: boolean;
  /** Associates the title with an input. */
  htmlFor?: string;
  className?: string;
}

/** Title + description label block for a settings section (Step 3 / Step 4). */
export function PricingSectionHeader({ title, description, optional, htmlFor, className }: PricingSectionHeaderProps) {
  const Title = htmlFor ? "label" : "h3";
  return (
    <div className={cn("mb-3", className)}>
      <Title htmlFor={htmlFor} className="block body-sm-medium text-primary-500">
        {title}
        {optional && <span className="body-sm-regular text-primary-300 ml-1">(Optional)</span>}
      </Title>
      {description && <p className="body-xsm-regular text-primary-300 mt-1">{description}</p>}
    </div>
  );
}

export default PricingSectionHeader;
