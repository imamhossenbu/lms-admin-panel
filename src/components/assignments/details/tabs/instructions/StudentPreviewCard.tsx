"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Eye } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import type { AssignmentItem } from "@/types/assignment";
import { CardHeaderButton } from "../../sidebar/CardHeaderButton";

const WIDTHS = ["w-4/5", "w-3/5", "w-2/3", "w-1/2", "w-3/4"];

/** Mini "student page" illustration built from the instructions (title, overview lines, one bar per task). */
function PreviewIllustration({ assignment }: { assignment: AssignmentItem }) {
  const tasks = assignment.instructions.tasks.slice(0, 5);
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="grid grid-cols-5 gap-3 overflow-hidden rounded-xl border border-dash bg-gray-bg p-3"
      aria-hidden
    >
      <div className="col-span-3 space-y-2 rounded-lg bg-white p-3">
        <p className="truncate body-2xsm-regular font-semibold! text-primary-500">{assignment.title}</p>
        <div className="h-1.5 w-full rounded-full bg-slate-200" />
        <div className="h-1.5 w-4/5 rounded-full bg-slate-200" />
        <div className="space-y-1.5 pt-1">
          {(tasks.length ? tasks : ["", "", ""]).map((_, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />
              <div className={`h-1.5 rounded-full bg-slate-200 ${WIDTHS[i % WIDTHS.length]}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-2 space-y-2 rounded-lg bg-white p-3">
        <p className="body-2xsm-regular text-primary-300">Upload</p>
        <div className="flex h-10 items-center justify-center rounded-md border border-dashed border-blue/40 bg-blue-14">
          <span className="h-1.5 w-8 rounded-full bg-blue/40" />
        </div>
        <div className="h-5 rounded-md bg-brand-orange" />
      </div>
    </motion.div>
  );
}

/** "Student Preview" card: illustration + "View as Student" (opens StudentPreviewModal). */
export function StudentPreviewCard({ assignment, onPreview }: { assignment: AssignmentItem; onPreview: () => void }) {
  return (
    <IconSectionCard
      icon={<Eye className="h-5 w-5" />}
      title="Student Preview"
      description="This is how the instructions will appear to students."
      action={
        <CardHeaderButton icon={<ExternalLink className="h-3.5 w-3.5" />} onClick={onPreview}>
          View as Student
        </CardHeaderButton>
      }
    >
      <button type="button" onClick={onPreview} className="block w-full cursor-pointer text-left" aria-label="Open student preview">
        <PreviewIllustration assignment={assignment} />
      </button>
    </IconSectionCard>
  );
}

export default StudentPreviewCard;
