"use client";

import React, { useState, useEffect } from "react";
import { ModalShell } from "@/components/ui/ModalShell";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { AppSelect } from "@/components/ui/AppSelect";
import {
  StudentNoteCategory,
  StudentNoteItem,
} from "./mockStudentDetails";
import toast from "react-hot-toast";

interface AddEditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: {
    category: StudentNoteCategory;
    categoryLabel: string;
    content: string;
  }) => void;
  initialNote?: StudentNoteItem | null;
}

const CATEGORY_OPTIONS: { value: StudentNoteCategory; label: string }[] = [
  { value: "good_progress", label: "Good Progress" },
  { value: "needs_improvement", label: "Needs Improvement" },
  { value: "student_support", label: "Student Support" },
  { value: "counseling_call", label: "Counseling Call" },
  { value: "payment_issue", label: "Payment Issue" },
  { value: "general", label: "General Note" },
];

export function AddEditNoteModal({
  isOpen,
  onClose,
  onSave,
  initialNote,
}: AddEditNoteModalProps) {
  const [category, setCategory] = useState<StudentNoteCategory>("good_progress");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialNote) {
      setCategory(initialNote.category);
      setContent(initialNote.content);
    } else {
      setCategory("good_progress");
      setContent("");
    }
    setError(null);
  }, [initialNote, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Note content cannot be empty.");
      return;
    }

    if (content.trim().length < 5) {
      setError("Note content must be at least 5 characters long.");
      return;
    }

    setIsSubmitting(true);
    const categoryOption =
      CATEGORY_OPTIONS.find((c) => c.value === category) || CATEGORY_OPTIONS[0];

    setTimeout(() => {
      onSave({
        category,
        categoryLabel: categoryOption.label,
        content: content.trim(),
      });
      setIsSubmitting(false);
      onClose();
      toast.success(
        initialNote ? "Note updated successfully!" : "New note added successfully!"
      );
    }, 200);
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={initialNote ? "Edit Internal Note" : "Add Internal Note"}
      subtitle="Visible only to platform admins and instructors."
      maxWidth="md"
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <SecondaryButton
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : initialNote
              ? "Update Note"
              : "Save Note"}
          </PrimaryButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Note Category Selection */}
        <div className="space-y-1.5">
          <label className="body-sm-medium text-primary-500 font-semibold">
            Note Category
          </label>
          <AppSelect
            value={
              CATEGORY_OPTIONS.find((c) => c.value === category)?.label ||
              "Good Progress"
            }
            onValueChange={(selectedLabel) => {
              const match = CATEGORY_OPTIONS.find(
                (c) => c.label === selectedLabel
              );
              if (match) setCategory(match.value);
            }}
            options={CATEGORY_OPTIONS.map((c) => c.label)}
          />
        </div>

        {/* Note Content Textarea */}
        <div className="space-y-1.5">
          <label className="body-sm-medium text-primary-500 font-semibold">
            Note Description
          </label>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (error) setError(null);
            }}
            rows={4}
            placeholder="Write specific feedback, support notes, or observation about this student..."
            className={`w-full p-3.5 rounded-xl border bg-slate-50 body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none focus:bg-white transition-colors resize-none ${
              error
                ? "border-red focus:border-red"
                : "border-dash focus:border-brand-orange"
            }`}
          />
          {error && (
            <p className="body-2xsm-regular text-red font-medium">{error}</p>
          )}
        </div>
      </form>
    </ModalShell>
  );
}
