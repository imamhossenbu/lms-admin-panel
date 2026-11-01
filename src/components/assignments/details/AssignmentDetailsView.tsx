"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AssignmentDetailsHeader } from "./AssignmentDetailsHeader";
import { AssignmentDetailTabs } from "./AssignmentDetailTabs";
import { AssignmentDetailPanels } from "./AssignmentDetailPanels";
import { AssignmentDetailsSkeleton } from "./AssignmentDetailsSkeleton";
import { AssignmentNotFound } from "./AssignmentNotFound";
import { StudentPreviewModal } from "./sidebar/StudentPreviewModal";
import { useAssignmentDetails } from "./hooks/useAssignmentDetails";
import { useAssignmentDetailTab } from "./hooks/useAssignmentDetailTab";

export interface AssignmentDetailsViewProps {
  assignmentId: string;
}

/** Assignment Details page: header, URL-synced tab bar and the active tab body. */
export function AssignmentDetailsView({ assignmentId }: AssignmentDetailsViewProps) {
  const router = useRouter();
  const { activeTab, setActiveTab } = useAssignmentDetailTab();
  const { state, setAssignment, setSubmissions } = useAssignmentDetails(assignmentId);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (state.status === "loading") return <AssignmentDetailsSkeleton />;
  if (state.status === "notFound") return <AssignmentNotFound />;

  const { assignment, submissions, context } = state;
  const openPreview = () => setIsPreviewOpen(true);

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-6">
      <AssignmentDetailsHeader
        assignment={assignment}
        submissions={submissions}
        context={context}
        onBack={() => router.push("/assignments")}
        onPreview={openPreview}
        onEdit={() => router.push(`/assignments/${assignment.id}/edit`)}
        onAssignmentChange={setAssignment}
      />
      <AssignmentDetailTabs activeTab={activeTab} onChange={setActiveTab} />
      <AssignmentDetailPanels
        activeTab={activeTab}
        assignment={assignment}
        submissions={submissions}
        context={context}
        onAssignmentChange={setAssignment}
        onSubmissionsChange={setSubmissions}
        onTabChange={setActiveTab}
        onPreview={openPreview}
      />
      <StudentPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} assignment={assignment} />
    </motion.div>
  );
}

export default AssignmentDetailsView;
