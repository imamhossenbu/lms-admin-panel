"use client";

import React, { useMemo, useState } from "react";
import { BookPlus } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { CourseEnrollmentCard } from "@/components/students/create/CourseEnrollmentCard";
import { useCourseOptions } from "@/lib/students/useCourseOptions";

interface EnrollCoursesModalProps {
  isOpen: boolean;
  studentName: string;
  /** Courses the student is already in (hidden from the picker). */
  enrolledCourseIds: string[];
  onClose: () => void;
  /** Resolves when enrolled; rejects (after its own error toast) to keep the modal open. */
  onEnroll: (courseIds: string[]) => Promise<void>;
}

/** "Enroll in Course" from the student details page: pick workspace courses, enroll in one call. */
export function EnrollCoursesModal({ isOpen, studentName, enrolledCourseIds, onClose, onEnroll }: EnrollCoursesModalProps) {
  const all = useCourseOptions();
  const [selected, setSelected] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const available = useMemo(() => (all ? all.filter((c) => !enrolledCourseIds.includes(c.id)) : null), [all, enrolledCourseIds]);

  const close = () => {
    if (isSubmitting) return;
    setSelected([]);
    onClose();
  };

  const submit = async () => {
    setIsSubmitting(true);
    try {
      await onEnroll(selected);
      setSelected([]);
      onClose();
    } catch {
      /* keep the selection so the admin can retry */
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={close}
      title="Enroll in courses"
      subtitle={`Choose the courses ${studentName} should get access to.`}
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <SecondaryButton type="button" onClick={close} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="button" onClick={submit} disabled={isSubmitting || selected.length === 0} icon={<BookPlus className="w-4 h-4" />}>
            {isSubmitting ? "Enrolling..." : selected.length ? `Enroll in ${selected.length} course${selected.length === 1 ? "" : "s"}` : "Enroll"}
          </PrimaryButton>
        </div>
      }
    >
      <CourseEnrollmentCard courses={available} selectedCourseIds={selected} onChangeSelectedCourseIds={setSelected} />
    </ModalShell>
  );
}

export default EnrollCoursesModal;
