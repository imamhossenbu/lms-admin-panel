"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserRound } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { AppSelect } from "@/components/ui/AppSelect";
import SecondaryButton from "@/components/ui/secondary-button";
import type { InstructorItem } from "@/types/instructor";
import type { InstructorPickerProps } from "./previewTypes";

interface PreviewInstructorBlockProps extends InstructorPickerProps {
  instructor: InstructorItem | null;
  /** Shows the bio as well (Instructor tab). */
  detailed?: boolean;
}

/**
 * Instructor card with an inline picker. Preview only: the course API has no
 * instructor field yet, so the choice is not saved with the course.
 */
export function PreviewInstructorBlock({ instructor, instructors, onInstructorChange, detailed }: PreviewInstructorBlockProps) {
  const [isPicking, setIsPicking] = useState(false);

  return (
    <div className="rounded-xl border border-dash p-4 text-left">
      {!detailed && <h4 className="body-md-medium font-semibold text-primary-500 mb-3">Instructor</h4>}
      <div className="flex items-center gap-3">
        {instructor ? (
          <Avatar src={instructor.avatarUrl} name={instructor.name} size={48} />
        ) : (
          <span className="w-12 h-12 rounded-full bg-gray-bg text-primary-300 flex items-center justify-center shrink-0">
            <UserRound className="w-5 h-5" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="body-sm-medium font-semibold text-primary-500 truncate">
            {instructor?.name ?? "No instructor selected"}
          </p>
          <p className="body-xsm-regular text-primary-300 truncate">
            {instructor?.title ?? "Pick who will teach this course"}
          </p>
        </div>
        <SecondaryButton size="sm" onClick={() => setIsPicking((v) => !v)} disabled={!instructors.length}>
          {isPicking ? "Done" : "Change Instructor"}
        </SecondaryButton>
      </div>

      <AnimatePresence initial={false}>
        {isPicking && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              <AppSelect
                fullWidth
                value={instructor?.id ?? ""}
                onValueChange={(id) => {
                  onInstructorChange(id);
                  setIsPicking(false);
                }}
                options={instructors.map((i) => ({ value: i.id, label: `${i.name} — ${i.title}` }))}
                placeholder="Select instructor"
              />
              <p className="body-2xsm-regular text-primary-300 mt-1.5">
                Shown in the preview only; instructor assignment is not saved with the course yet.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {detailed && instructor?.bio && (
        <p className="body-sm-regular text-primary-300 mt-3 pt-3 border-t border-dash">{instructor.bio}</p>
      )}
    </div>
  );
}

export default PreviewInstructorBlock;
