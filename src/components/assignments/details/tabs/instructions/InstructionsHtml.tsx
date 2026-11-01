"use client";

import React from "react";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { htmlToText } from "@/lib/sanitizeHtml";
import { cn } from "@/lib/cn";

/** True when the wizard's rich-text instructions contain any visible text. */
export const hasInstructionsHtml = (html: string | undefined) => !!html && htmlToText(html).length > 0;

/**
 * Sanitized wizard instructions. Re-uses the global `.tiptap` typography (headings, lists, code, pre,
 * blockquote) so the read view matches the editor exactly.
 */
export function InstructionsHtml({ html, className }: { html: string; className?: string }) {
  return <RichTextContent html={html} className={cn("tiptap min-h-0! space-y-0", className)} />;
}

export default InstructionsHtml;
