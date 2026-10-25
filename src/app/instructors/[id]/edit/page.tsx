"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Edit3 } from "lucide-react";
import { toast } from "sonner";

import { InstructorFormInput } from "@/validations/instructorSchema";
import { InstructorItem } from "@/types/instructor";
import { getStoredInstructors, updateStoredInstructor } from "@/lib/instructorStorage";
import { InstructorFormHeader } from "@/components/instructors/form/InstructorFormHeader";
import { InstructorForm } from "@/components/instructors/form/InstructorForm";
import { InstructorFormSkeleton } from "@/components/instructors/form/InstructorFormSkeleton";
import {
  applyCourseSelection,
  getAssignableCourseIds,
} from "@/components/instructors/form/assignedCourses";
import { InstructorNotFound } from "@/components/instructors/details/InstructorNotFound";

interface PageProps {
  params: Promise<{ id: string }>;
}

const EDIT_STEPS = [
  "Changes are saved to the instructor's profile immediately.",
  "Email changes will be used for future login and notifications.",
  "Course assignments update the instructor's dashboard.",
  "Setting status to Inactive revokes portal access.",
];

export default function EditInstructorPage({ params }: PageProps) {
  const { id: instructorId } = React.use(params);
  const router = useRouter();
  const [instructor, setInstructor] = useState<InstructorItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInstructor(getStoredInstructors().find((i) => i.id === instructorId) ?? null);
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [instructorId]);

  if (isLoading) {
    return <InstructorFormSkeleton />;
  }

  if (!instructor) {
    return <InstructorNotFound />;
  }

  const detailsHref = `/instructors/${instructor.id}`;

  const handleSave = async (data: InstructorFormInput, courseIds: string[]) => {
    const toastId = toast.loading("Saving changes...", {
      description: `Updating ${data.name}'s profile.`,
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const emailTaken = getStoredInstructors().some(
        (i) => i.id !== instructor.id && i.email.toLowerCase() === data.email.toLowerCase()
      );
      if (emailTaken) {
        throw new Error("Another instructor is already using this email address.");
      }

      const courses = applyCourseSelection(instructor.courses, courseIds);
      updateStoredInstructor(instructor.id, {
        name: data.name,
        email: data.email,
        phone: data.phone ?? "",
        status: data.status,
        courses,
        coursesCount: courses.length,
      });

      toast.success("Instructor updated", {
        id: toastId,
        description: `${data.name}'s profile has been saved.`,
      });
      router.push(detailsHref);
    } catch (error) {
      toast.error("Could not save changes", {
        id: toastId,
        description:
          error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
      throw error;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-6 text-left pb-10"
    >
      <InstructorFormHeader
        breadcrumbs={[
          { label: "Instructors", href: "/instructors" },
          { label: instructor.name, href: detailsHref },
          { label: "Edit Instructor" },
        ]}
        backHref={detailsHref}
        backLabel="Back to Profile"
        icon={<Edit3 className="w-5 h-5 stroke-[2.2]" />}
        title={`Edit Instructor: ${instructor.name}`}
        subtitle="Update personal details, account status, and course assignments."
      />

      <InstructorForm
        defaultValues={{
          name: instructor.name,
          email: instructor.email,
          phone: instructor.phone,
          status: instructor.status,
        }}
        defaultCourseIds={getAssignableCourseIds(instructor.courses)}
        mode="edit"
        infoDescription="Update the basic information for this instructor. Their password stays unchanged."
        nextSteps={EDIT_STEPS}
        cancelHref={detailsHref}
        submitLabel="Save Changes"
        submittingLabel="Saving Changes..."
        submitIcon={<Check className="w-4 h-4 stroke-[2.2]" />}
        onSubmit={handleSave}
      />
    </motion.div>
  );
}
