"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Link2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import {
  LESSON_RESOURCE_LINKS_MAX,
  type LessonFormValues,
  type LessonResourceLink,
} from "@/validations/lessonFormSchema";
import { ResourceSectionCard } from "./ResourceSectionCard";
import { ResourceLinkRow } from "./ResourceLinkRow";
import { ResourceLinkModal } from "./ResourceLinkModal";

/** The edited link is captured when the modal opens so its identity stays stable while typing. */
type ModalState = { open: false } | { open: true; index: number | null; link: LessonResourceLink | null };

/** "External Links" card bound to `resourceLinks` (add / edit via modal, delete inline). */
export function ExternalLinksCard() {
  const { control, formState } = useFormContext<LessonFormValues>();
  const { fields, append, update, remove } = useFieldArray({ control, name: "resourceLinks", keyName: "fieldKey" });
  const [modal, setModal] = useState<ModalState>({ open: false });

  const full = fields.length >= LESSON_RESOURCE_LINKS_MAX;
  const fieldError = formState.errors.resourceLinks?.message;

  const save = (link: LessonResourceLink) => {
    if (modal.open && modal.index !== null) {
      update(modal.index, link);
      toast.success("Link updated", { description: `${link.title} was saved.` });
    } else {
      if (full) {
        toast.error("Link limit reached", { description: `You can add up to ${LESSON_RESOURCE_LINKS_MAX} links per lesson.` });
        return;
      }
      append(link);
      toast.success("Link added", { description: `${link.title} is now available to students.` });
    }
    setModal({ open: false });
  };

  const removeLink = (index: number) => {
    const title = fields[index]?.title;
    remove(index);
    toast.success("Link removed", { description: title ? `${title} was removed from this lesson.` : undefined });
  };

  return (
    <ResourceSectionCard
      icon={<Link2 />}
      title="External Links"
      description="Add useful links like documentation, articles, tools or websites."
      actionLabel="Add Link"
      onAction={() => setModal({ open: true, index: null, link: null })}
      actionDisabled={full}
    >
      {fieldError && <p className="body-xsm-regular text-red">{fieldError}</p>}
      {fields.length === 0 ? (
        <p className="rounded-xl border border-dashed border-dash bg-slate-50 px-4 py-5 text-center body-sm-regular text-primary-300">
          No links yet. Add documentation, articles or tools students may find useful.
        </p>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {fields.map((field, index) => (
              <ResourceLinkRow
                key={field.fieldKey}
                link={field}
                onEdit={() => setModal({ open: true, index, link: { id: field.id, title: field.title, url: field.url } })}
                onDelete={() => removeLink(index)}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}

      <ResourceLinkModal
        isOpen={modal.open}
        link={modal.open ? modal.link : null}
        onClose={() => setModal({ open: false })}
        onSave={save}
      />
    </ResourceSectionCard>
  );
}

export default ExternalLinksCard;
