"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { InstructorFormInput } from "@/validations/instructorSchema";
import { instructorsApi } from "@/lib/api/instructors";
import { apiErrorMessage } from "@/lib/apiError";
import { InstructorFormHeader } from "@/components/instructors/form/InstructorFormHeader";
import { InstructorForm } from "@/components/instructors/form/InstructorForm";

/** Add instructor: the API generates a password, emails the login details and assigns the selected courses. */
export default function CreateInstructorPage() {
  const router = useRouter();

  const handleCreate = async (data: InstructorFormInput, courseIds: string[]) => {
    const toastId = toast.loading("Creating instructor...", { description: "Generating a secure password and sending login details." });
    try {
      const instructor = await instructorsApi.create({ name: data.name, email: data.email, phone: data.phone || undefined, status: data.status, courseIds });
      toast.success("Instructor created", {
        id: toastId,
        description: `Login details have been emailed to ${instructor.email}${courseIds.length ? `; ${courseIds.length} course${courseIds.length === 1 ? "" : "s"} assigned` : ""}.`,
      });
      router.push(`/instructors/${instructor.id}`);
    } catch (err) {
      toast.error("Couldn't create the instructor", { id: toastId, description: apiErrorMessage(err) });
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
          { label: "Add New Instructor" },
        ]}
        icon={<UserPlus className="w-5 h-5" strokeWidth={2.2} />}
        title="Add New Instructor"
        subtitle="Create a new instructor account and assign courses."
      />

      <InstructorForm
        defaultValues={{ name: "", email: "", phone: "", status: "Active" }}
        cancelHref="/instructors"
        submitLabel="Create Instructor"
        submittingLabel="Creating Instructor..."
        submitIcon={<UserPlus className="w-4 h-4" strokeWidth={2.2} />}
        onSubmit={handleCreate}
      />
    </motion.div>
  );
}
