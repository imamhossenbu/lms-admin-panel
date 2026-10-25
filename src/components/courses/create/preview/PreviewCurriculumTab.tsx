import React from "react";
import { Layers } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { formatMinutes, moduleMinutes, type AiOutline } from "../aiOutline";
import { PreviewEmptyState } from "./PreviewEmptyState";

/** Modules of the accepted AI outline (or an empty state until one exists). */
export function PreviewCurriculumTab({ outline }: { outline: AiOutline | null }) {
  if (!outline?.modules.length) {
    return (
      <div className="rounded-xl border border-dash">
        <PreviewEmptyState
          icon={<Layers />}
          title="No curriculum yet"
          description="Generate one with AI or add modules and lessons in the next step."
        />
      </div>
    );
  }

  return (
    <ol className="rounded-xl border border-dash divide-y divide-dash text-left">
      {outline.modules.map((module, index) => (
        <li key={module.id} className="flex items-center gap-3 px-4 py-3">
          <span className="w-7 h-7 rounded-lg bg-brand-orange-light text-brand-orange body-xsm-medium font-semibold flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="body-sm-medium text-primary-500 truncate">{module.title}</p>
            <p className="body-xsm-regular text-primary-300">
              {module.lessons.length} lessons · {formatMinutes(moduleMinutes(module))}
            </p>
          </div>
          <ToneBadge tone="purple" size="sm" variant="pill">
            AI
          </ToneBadge>
        </li>
      ))}
    </ol>
  );
}

export default PreviewCurriculumTab;
