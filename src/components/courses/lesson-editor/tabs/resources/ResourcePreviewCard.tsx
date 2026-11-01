"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, ExternalLink, Eye } from "lucide-react";
import { EditorSectionCard } from "@/components/courses/lesson-editor/shared/EditorSectionCard";
import { isSafeHttpUrl } from "@/components/courses/create/lesson/resources/resourceUtils";
import type { LessonEditorResource } from "@/validations/lessonEditorSchema";
import { ResourceIcon } from "./ResourceIcon";
import { resourceSizeLabel, resourceTypeLabel } from "./resourceDisplay";

/** Right "Resource Preview": what students see (visible resources only). */
export function ResourcePreviewCard({ items }: { items: LessonEditorResource[] }) {
  const visible = items.filter((r) => r.visible);

  return (
    <EditorSectionCard icon={<Eye className="h-5 w-5" />} title="Resource Preview" description="This is how the resources will appear to students.">
      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-dash bg-gray-bg px-4 py-6 text-center body-xsm-regular text-primary-300">
          No visible resources yet. Students won&apos;t see a resources section.
        </p>
      ) : (
        <ul className="divide-y divide-dash rounded-xl border border-dash">
          <AnimatePresence initial={false}>
            {visible.map((r) => {
              const isLink = r.kind === "LINK";
              const safe = isSafeHttpUrl(r.url);
              return (
                <motion.li
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-3 px-3 py-2.5"
                >
                  <ResourceIcon resource={r} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate body-sm-medium text-primary-500">{r.title}</p>
                    <p className="body-xsm-regular text-primary-300">{isLink ? "External Link" : `${resourceTypeLabel(r)} • ${resourceSizeLabel(r)}`}</p>
                  </div>
                  {safe && (
                    <motion.a
                      whileTap={{ scale: 0.92 }}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={isLink ? undefined : r.fileName || true}
                      aria-label={isLink ? `Open ${r.title}` : `Download ${r.title}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-dash text-blue hover:bg-blue-14"
                    >
                      {isLink ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                    </motion.a>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </EditorSectionCard>
  );
}

export default ResourcePreviewCard;
