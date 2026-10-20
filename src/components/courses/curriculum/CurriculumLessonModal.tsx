"use client";

import React, { useState, useEffect } from "react";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { LessonItem } from "./types";

interface CurriculumLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string | null;
  moduleTitle?: string;
  initialLesson?: LessonItem | null;
  onSave: (moduleId: string, lessonData: Partial<LessonItem>) => Promise<void>;
}

export function CurriculumLessonModal({
  isOpen,
  onClose,
  moduleId,
  moduleTitle,
  initialLesson,
  onSave,
}: CurriculumLessonModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<string>("VIDEO");
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [isPreview, setIsPreview] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialLesson) {
      setTitle(initialLesson.title);
      setType(initialLesson.type);
      setDurationMinutes(initialLesson.durationMinutes);
      setIsPreview(Boolean(initialLesson.isPreview));
      setVideoUrl(initialLesson.videoUrl || "");
    } else {
      setTitle("");
      setType("VIDEO");
      setDurationMinutes(15);
      setIsPreview(false);
      setVideoUrl("");
    }
  }, [initialLesson, isOpen]);

  if (!isOpen || !moduleId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave(moduleId, {
        ...(initialLesson ? { id: initialLesson.id } : {}),
        title: title.trim(),
        type,
        durationMinutes: Number(durationMinutes) || 15,
        isPreview,
        videoUrl: videoUrl.trim() || undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions = [
    { label: "Video Lesson (MP4 / Stream)", value: "VIDEO" },
    { label: "Article / Text Reading", value: "TEXT" },
    { label: "Assessment Quiz", value: "QUIZ" },
  ];

  const isEditing = Boolean(initialLesson);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Lesson" : "Add Lesson"}
      subtitle={moduleTitle ? `Target Module: ${moduleTitle}` : undefined}
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
              ? "Update Lesson"
              : "Add Lesson to Module"}
          </PrimaryButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <InputField
          label="Lesson Title"
          required
          placeholder="e.g. 01. Setting up Turbopack & Project Layout"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DropdownSelect
            label="Lesson Type"
            options={typeOptions}
            value={type}
            onChange={(val) => setType(val)}
          />

          <InputField
            label="Duration (Minutes)"
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            placeholder="15"
          />
        </div>

        <InputField
          label="Video Stream URL (Optional)"
          placeholder="https://..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="lessonIsPreview"
            checked={isPreview}
            onChange={(e) => setIsPreview(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#1C4D8D] focus:ring-[#1C4D8D] cursor-pointer"
          />
          <label
            htmlFor="lessonIsPreview"
            className="body-sm-medium text-primary-500 cursor-pointer"
          >
            Mark as Free Preview (Allow unauthenticated students to watch)
          </label>
        </div>
      </form>
    </ModalShell>
  );
}
