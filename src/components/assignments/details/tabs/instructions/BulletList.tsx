import React from "react";
import { InlineCodeText } from "../../sidebar/preview/InlineCodeText";
import { cn } from "@/lib/cn";

/** Bulleted list; `backtick` text renders as inline code chips. */
export function BulletList({ items, className, empty = "Nothing added yet." }: { items: string[]; className?: string; empty?: string }) {
  if (!items.length) return <p className="body-sm-regular text-primary-300">{empty}</p>;
  return (
    <ul className={cn("list-disc space-y-1.5 pl-5 body-sm-regular text-primary-400 marker:text-primary-500", className)}>
      {items.map((item, i) => (
        <li key={`${i}-${item}`}>
          <InlineCodeText text={item} />
        </li>
      ))}
    </ul>
  );
}

export default BulletList;
