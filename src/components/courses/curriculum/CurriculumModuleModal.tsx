"use client";

import React, { useState, useEffect } from "react";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { ModuleItem } from "./types";

interface CurriculumModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModule?: { title: string; description?: string | null } | null;
  onSave: (moduleData: { title: string; description?: string }) => Promise<void>;
}

export function CurriculumModuleModal({
  isOpen,
  onClose,
  initialModule,
  onSave,
}: CurriculumModuleModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialModule) {
      setTitle(initialModule.title);
      setDescription(initialModule.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [initialModule, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = Boolean(initialModule);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Module" : "Add Module to Curriculum"}
      subtitle={
        isEditing
          ? "Update module instructional title and description"
          : "Create a structural milestone section for your course lessons"
      }
      maxWidth="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim()}
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
              ? "Update Module"
              : "Create Module"}
          </PrimaryButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <InputField
          label="Module Title"
          required
          placeholder="e.g. Module 1: Foundations & Architecture Design"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <InputField
          label="Module Description (Optional)"
          placeholder="What will learners achieve in this module?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </form>
    </ModalShell>
  );
}
