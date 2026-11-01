"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { AssignmentTabProps } from "../../tabTypes";
import { AssignmentDetailsCard } from "../../sidebar/AssignmentDetailsCard";
import { StudentPreviewModal } from "../../sidebar/StudentPreviewModal";
import { InstructionsCard } from "./InstructionsCard";
import { AttachmentsCard } from "./AttachmentsCard";
import { StudentPreviewCard } from "./StudentPreviewCard";

/** Assignment Details → Instructions tab: read view (edits open the wizard), details, attachments and student preview. */
export function InstructionsTab({ assignment, onAssignmentChange }: AssignmentTabProps) {
  const router = useRouter();
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="grid grid-cols-1 gap-5 lg:grid-cols-3"
    >
      <div className="min-w-0 lg:col-span-2">
        <InstructionsCard assignment={assignment} onEdit={() => router.push(`/assignments/${assignment.id}/edit?step=instructions`)} />
      </div>
      <div className="min-w-0 space-y-5">
        <AssignmentDetailsCard assignment={assignment} onEdit={() => router.push(`/assignments/${assignment.id}/edit`)} />
        <AttachmentsCard assignment={assignment} onAssignmentChange={onAssignmentChange} />
        <StudentPreviewCard assignment={assignment} onPreview={() => setPreviewOpen(true)} />
      </div>

      <StudentPreviewModal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} assignment={assignment} />
    </motion.div>
  );
}

export default InstructionsTab;
