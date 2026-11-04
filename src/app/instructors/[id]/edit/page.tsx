"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { InstructorFormInput } from "@/validations/instructorSchema";
import { instructorsApi } from "@/lib/api/instructors";
import { apiErrorMessage, parseApiError } from "@/lib/apiError";
import type { InstructorDetails } from "@/types/instructorApi";
import { InstructorFormHeader } from "@/components/instructors/form/InstructorFormHeader";
import { InstructorForm } from "@/components/instructors/form/InstructorForm";
import { InstructorFormSkeleton } from "@/components/instructors/form/InstructorFormSkeleton";
import { InstructorNotFound } from "@/components/instructors/details/InstructorNotFound";

interface PageProps {
  params: Promise<{ id: string }>;
}

const EDIT_STEPS = [
  "Changes are saved to the instructor's profile immediately.",
  "Email changes will be used for future login and notifications.",
  "Newly selected courses move to this instructor.",
  "Setting status to Inactive revokes portal access.",
];

type LoadState = { kind: "loading" } | { kind: "error"; notFound: boolean; message: string } | { kind: "ready"; instructor: InstructorDetails; courseIds: string[] };

export default function EditInstructorPage({ params }: PageProps) {
  const { id: instructorId } = React.use(params);
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    let alive = true;
    Promise.all([instructorsApi.get(instructorId), instructorsApi.courses(instructorId)])
      .then(([instructor, courses]) => alive && setState({ kind: "ready", instructor, courseIds: courses.map((c) => c.id) }))
      .catch((err) => {
        const info = parseApiError(err, "We couldn't load this instructor.");
        if (alive) setState({ kind: "error", notFound: info.status === 404, message: info.message });
      });
    return () => {
      alive = false;
    };
  }, [instructorId]);

  if (state.kind === "loading") return <InstructorFormSkeleton />;
  if (state.kind === "error") return <InstructorNotFound message={state.notFound ? undefined : state.message} />;

  const { instructor, courseIds: current } = state;
  const detailsHref = `/instructors/${instructor.id}`;

  const handleSave = async (data: InstructorFormInput, courseIds: string[]) => {
    const added = courseIds.filter((id) => !current.includes(id));
    const toastId = toast.loading("Saving changes...", { description: `Updating ${data.name}'s profile.` });
    try {
      await instructorsApi.update(instructor.id, { name: data.name, email: data.email, phone: data.phone ?? "", status: data.status });
      if (added.length) await instructorsApi.assignCourses(instructor.id, added);
      toast.success("Instructor updated", {
        id: toastId,
        description: `${data.name}'s profile has been saved${added.length ? ` and ${added.length} course${added.length === 1 ? "" : "s"} assigned` : ""}.`,
      });
      router.push(detailsHref);
    } catch (err) {
      toast.error("Couldn't save changes", { id: toastId, description: apiErrorMessage(err) });
      throw err;
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
        icon={<Edit3 className="w-5 h-5" strokeWidth={2.2} />}
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
        defaultCourseIds={current}
        mode="edit"
        infoDescription="Update the basic information for this instructor. Their password stays unchanged."
        nextSteps={EDIT_STEPS}
        cancelHref={detailsHref}
        submitLabel="Save Changes"
        submittingLabel="Saving Changes..."
        submitIcon={<Check className="w-4 h-4" strokeWidth={2.2} />}
        onSubmit={handleSave}
      />
    </motion.div>
  );
}
