"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { EditorSectionCard } from "@/components/courses/lesson-editor/shared/EditorSectionCard";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { LessonEditorTabProps } from "@/components/courses/lesson-editor/tabTypes";
import type { LessonEditorResource, LessonEditorValues } from "@/validations/lessonEditorSchema";
import { ResourceForm } from "./ResourceForm";
import { AddedResourcesCard } from "./AddedResourcesCard";
import { ResourceGuidelinesCard } from "./ResourceGuidelinesCard";
import { ResourcePreviewCard } from "./ResourcePreviewCard";
import { ResourceQuickActionsCard } from "./ResourceQuickActionsCard";
import { RESOURCES_MAX } from "./resourceDisplay";

const EMPTY: LessonEditorResource[] = [];

/** Edit Lesson → Resources tab (form section "resources.items"). */
export function ResourcesTab({ onUploadingChange }: LessonEditorTabProps) {
  const {
    control,
    setValue,
    formState: { errors, isSubmitted },
  } = useFormContext<LessonEditorValues>();
  const items = useWatch({ control, name: "resources.items" }) ?? EMPTY;

  /** Snapshot of the resource loaded into the form (not live, so table edits don't reset the form). */
  const [editing, setEditing] = useState<LessonEditorResource | null>(null);
  const [reordering, setReordering] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LessonEditorResource | null>(null);
  const [removeAllOpen, setRemoveAllOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const setItems = (next: LessonEditorResource[]) =>
    setValue("resources.items", next, { shouldDirty: true, shouldValidate: isSubmitted });

  const itemErrors = errors.resources?.items;
  const rowErrors = items.map((_, i) => {
    const e = itemErrors?.[i];
    return e ? (e.url?.message ?? e.title?.message ?? e.description?.message ?? "This resource has errors") : undefined;
  });
  const listError = itemErrors?.message ?? itemErrors?.root?.message;

  const saveResource = (resource: LessonEditorResource) => {
    const exists = items.some((r) => r.id === resource.id);
    setItems(exists ? items.map((r) => (r.id === resource.id ? resource : r)) : [...items, resource]);
    setEditing(null);
  };

  const toggleVisible = (index: number) => {
    const target = items[index];
    setItems(items.map((r, i) => (i === index ? { ...r, visible: !r.visible } : r)));
    toast.success(target.visible ? "Resource hidden" : "Resource visible", {
      description: target.visible ? `"${target.title}" is now for instructors only.` : `Students can now see "${target.title}".`,
    });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setItems(items.filter((r) => r.id !== deleteTarget.id));
    if (editing?.id === deleteTarget.id) setEditing(null);
    toast.success("Resource deleted", { description: `"${deleteTarget.title}" was removed from this lesson.` });
  };

  const confirmRemoveAll = async () => {
    const count = items.length;
    setItems([]);
    setEditing(null);
    setReordering(false);
    toast.success("All resources removed", { description: `${count} resource${count === 1 ? " was" : "s were"} removed from this lesson.` });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="grid grid-cols-1 gap-5 lg:grid-cols-3"
    >
      <div className="min-w-0 space-y-5 lg:col-span-2">
        <div ref={formRef} className="scroll-mt-24">
          <EditorSectionCard
            icon={<FileText className="h-5 w-5" />}
            title={editing ? "Edit Resource" : "Learning Resources"}
            description={editing ? `Editing "${editing.title}". Save to update the table.` : "Add downloadable files, links and external resources for this lesson."}
          >
            <ResourceForm
              editing={editing}
              canAdd={items.length < RESOURCES_MAX}
              onSubmit={saveResource}
              onCancelEdit={() => setEditing(null)}
              onUploadingChange={(uploading) => onUploadingChange?.(uploading)}
            />
          </EditorSectionCard>
        </div>

        <AddedResourcesCard
          items={items}
          editingId={editing?.id ?? null}
          rowErrors={rowErrors}
          listError={listError}
          reordering={reordering}
          onReorder={setItems}
          onDoneReorder={() => setReordering(false)}
          onStartReorder={() => items.length > 1 && setReordering(true)}
          onToggleVisible={toggleVisible}
          onEdit={(r) => {
            setEditing(r);
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          onDelete={setDeleteTarget}
        />
      </div>

      <div className="min-w-0 space-y-5">
        <ResourceGuidelinesCard />
        <ResourcePreviewCard items={items} />
        <ResourceQuickActionsCard
          count={items.length}
          reordering={reordering}
          onToggleReorder={() => setReordering((r) => !r)}
          onRemoveAll={() => setRemoveAllOpen(true)}
        />
      </div>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete Resource"
        message={<>Delete &quot;{deleteTarget?.title}&quot;? Students will no longer be able to access it.</>}
        confirmLabel="Delete Resource"
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
      <ConfirmModal
        isOpen={removeAllOpen}
        title="Remove All Resources"
        message={<>Remove all {items.length} resources from this lesson? Students will lose access to every file and link.</>}
        confirmLabel="Remove All"
        onClose={() => setRemoveAllOpen(false)}
        onConfirm={confirmRemoveAll}
      />
    </motion.div>
  );
}

export default ResourcesTab;
