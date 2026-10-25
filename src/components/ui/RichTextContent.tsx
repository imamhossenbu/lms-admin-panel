"use client";

import React, { useMemo } from "react";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { cn } from "@/lib/cn";

interface RichTextContentProps {
  html: string;
  className?: string;
}

/** Renders RichTextEditor output safely (sanitized on every render). */
export function RichTextContent({ html, className }: RichTextContentProps) {
  const safe = useMemo(() => sanitizeHtml(html), [html]);
  return (
    <div
      className={cn(
        "body-sm-regular text-primary-400 leading-relaxed space-y-2",
        "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_a]:text-blue [&_a]:underline [&_strong]:text-primary-500 [&_strong]:font-semibold",
        className
      )}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}

export default RichTextContent;
