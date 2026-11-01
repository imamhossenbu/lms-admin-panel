import React from "react";
import { ProTipCard } from "@/components/ui/ProTipCard";

/** Three writing tips for broadcasts. */
export function ComposeTipsCard() {
  return (
    <ProTipCard title="Tips for great broadcasts">
      <ul className="list-disc space-y-1 pl-4">
        <li>Lead with the key point in the title — most people only read that.</li>
        <li>Use High priority sparingly so pinned messages stay meaningful.</li>
        <li>Send a test to yourself to check the email and push layout first.</li>
      </ul>
    </ProTipCard>
  );
}

export default ComposeTipsCard;
