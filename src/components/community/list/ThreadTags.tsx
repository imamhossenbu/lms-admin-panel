import React from "react";
import { ToneBadge } from "@/components/ui/ToneBadge";

/** Up to `max` tag chips, then "+N". */
export function ThreadTags({ tags, max = 3 }: { tags: string[]; max?: number }) {
  if (!tags.length) return null;
  const rest = tags.length - max;
  return (
    <>
      {tags.slice(0, max).map((tag) => (
        <ToneBadge key={tag} tone="gray" size="sm" variant="pill">
          #{tag}
        </ToneBadge>
      ))}
      {rest > 0 && (
        <ToneBadge tone="gray" size="sm" variant="pill" className="bg-white">
          +{rest}
        </ToneBadge>
      )}
    </>
  );
}

export default ThreadTags;
