"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Eye, FileText, List, Pencil, Zap } from "lucide-react";
import { toast } from "sonner";
import { duplicateAssignment } from "@/lib/assignmentStorage";
import { WizardSideCard } from "../shell/WizardSideCard";
import { NextStepItem } from "./NextStepItem";

/** "Next Steps": view, manage submissions, edit, duplicate, back to list. */
export function NextStepsCard({ assignmentId }: { assignmentId: string }) {
  const router = useRouter();
  const [duplicating, setDuplicating] = useState(false);

  const duplicate = async () => {
    setDuplicating(true);
    const toastId = toast.loading("Duplicating assignment...", { description: "Copying all settings, instructions and rubric." });
    try {
      const copy = await duplicateAssignment(assignmentId);
      toast.success("Assignment duplicated", { id: toastId, description: `"${copy.title}" was created as a copy.` });
      router.push(`/assignments/${copy.id}`);
    } catch (e) {
      toast.error("Couldn't duplicate assignment", { id: toastId, description: e instanceof Error && e.message ? e.message : "Please try again." });
      setDuplicating(false);
    }
  };

  const items = [
    { icon: Eye, title: "View Assignment", description: "See how it looks to students", onClick: () => router.push(`/assignments/${assignmentId}`) },
    { icon: FileText, title: "Manage Submissions", description: "View and grade student submissions", onClick: () => router.push(`/assignments/${assignmentId}?tab=submissions`) },
    { icon: Pencil, title: "Edit Assignment", description: "Make changes to this assignment", onClick: () => router.push(`/assignments/${assignmentId}/edit`) },
    { icon: Copy, title: "Duplicate Assignment", description: "Create a copy with same settings", onClick: () => void duplicate(), disabled: duplicating },
    { icon: List, title: "Go to Assignments List", description: "View all course assignments", onClick: () => router.push("/assignments") },
  ];

  return (
    <WizardSideCard icon={<Zap className="h-5 w-5" />} title="Next Steps">
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <NextStepItem key={item.title} index={i} {...item} />
        ))}
      </ul>
    </WizardSideCard>
  );
}

export default NextStepsCard;
