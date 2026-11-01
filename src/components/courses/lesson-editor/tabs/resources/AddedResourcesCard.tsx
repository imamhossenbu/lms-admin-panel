"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Files } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { SecondaryButton } from "@/components/ui/secondary-button";
import type { LessonEditorResource } from "@/validations/lessonEditorSchema";
import { ResourcesTable, type ResourcesTableProps } from "./ResourcesTable";
import { ResourceReorderList } from "./ResourceReorderList";

export interface AddedResourcesCardProps extends ResourcesTableProps {
  reordering: boolean;
  listError?: string;
  onReorder: (next: LessonEditorResource[]) => void;
  onDoneReorder: () => void;
}

/** "Added Resources (N)": DataTable, or the drag list while reorder mode is on. */
export function AddedResourcesCard({ reordering, listError, onReorder, onDoneReorder, ...table }: AddedResourcesCardProps) {
  return (
    <IconSectionCard
      icon={<Files className="h-5 w-5" />}
      title={`Added Resources (${table.items.length})`}
      description={reordering ? "Drag the handles or use the arrows, then click Done." : "Manage and organize lesson resources."}
      action={
        reordering && (
          <SecondaryButton size="sm" leftIcon={<Check />} onClick={onDoneReorder}>
            Done
          </SecondaryButton>
        )
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={reordering ? "reorder" : "table"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {reordering ? <ResourceReorderList items={table.items} onReorder={onReorder} /> : <ResourcesTable {...table} />}
        </motion.div>
      </AnimatePresence>
      {listError && (
        <p role="alert" className="mt-2 body-xsm-regular text-red">
          {listError}
        </p>
      )}
    </IconSectionCard>
  );
}

export default AddedResourcesCard;
