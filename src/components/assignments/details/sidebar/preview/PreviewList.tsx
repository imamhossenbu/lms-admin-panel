import React from "react";
import { cn } from "@/lib/cn";
import { InlineCodeText } from "./InlineCodeText";

/** Bulleted or numbered list of plain strings (backticks → inline code). */
export function PreviewList({ items, ordered = false }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={cn("space-y-1.5 pl-5 body-sm-regular text-primary-400", ordered ? "list-decimal" : "list-disc")}>
      {items.map((item, i) => (
        <li key={i}>
          <InlineCodeText text={item} />
        </li>
      ))}
    </Tag>
  );
}

export default PreviewList;
