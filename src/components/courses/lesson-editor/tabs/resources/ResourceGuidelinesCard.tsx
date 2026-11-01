import React from "react";
import { Info } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";

const GUIDELINES = [
  "You can upload PDF, DOC, PPT, ZIP and other common files.",
  "Maximum file size: 50 MB per file.",
  "Add clear and descriptive titles for resources.",
  "Resources marked as visible will be available to students.",
  "You can also add external links as resources.",
];

/** Right "Resource Guidelines" info card. */
export function ResourceGuidelinesCard() {
  return (
    <IconSectionCard icon={<Info className="h-5 w-5" />} title="Resource Guidelines">
      <ul className="space-y-2 rounded-xl border border-blue bg-blue-14 p-4">
        {GUIDELINES.map((line) => (
          <li key={line} className="flex items-start gap-2 body-xsm-regular text-primary-400">
            <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />
            {line}
          </li>
        ))}
      </ul>
    </IconSectionCard>
  );
}

export default ResourceGuidelinesCard;
