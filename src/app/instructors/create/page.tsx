"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { InstructorFormInput } from "@/validations/instructorSchema";
import { InstructorItem } from "@/types/instructor";
import { getStoredInstructors, saveNewInstructor } from "@/lib/instructorStorage";
import { InstructorFormHeader } from "@/components/instructors/form/InstructorFormHeader";
import { InstructorForm } from "@/components/instructors/form/InstructorForm";
import { InstructorFormSkeleton } from "@/components/instructors/form/InstructorFormSkeleton";
import { applyCourseSelection } from "@/components/instructors/form/assignedCourses";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80";

export default function CreateInstructorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleCreate = async (data: InstructorFormInput, courseIds: string[]) => {
    const toastId = toast.loading("Creating instructor...", {
      description: "Generating a secure password and sending login details.",
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const existing = getStoredInstructors();
      if (existing.some((i) => i.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error("An instructor with this email address already exists.");
      }

      const courses = applyCourseSelection([], courseIds);
      const now = Date.now();
      const newInstructor: InstructorItem = {
        id: `inst-${now}`,
        orderNumber: existing.length + 1,
        name: data.name,
        title: "Instructor",
        expertise: courses[0]?.category ?? "General",
        email: data.email,
        phone: data.phone ?? "",
        avatarUrl: DEFAULT_AVATAR,
        coursesCount: courses.length,
        studentsCount: courses.reduce((sum, c) => sum + c.studentsCount, 0),
        totalRevenue: "$0",
        numericRevenue: 0,
        rating: 0,
        reviewsCount: 0,
        status: data.status,
        joinDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        bio: "",
        skills: [],
        courses,
        recentActivities: [
          {
            id: `act-${now}-1`,
            action: `Welcome email with login details sent to ${data.email}`,
            timestamp: "Just now",
            iconType: "message",
          },
          {
            id: `act-${now}-2`,
            action: `Account created and assigned to ${courses.length} course(s)`,
            timestamp: "Just now",
            iconType: "course",
          },
        ],
      };

      saveNewInstructor(newInstructor);

      toast.success("Instructor created", {
        id: toastId,
        description: `Login details have been emailed to ${data.email}.`,
      });
      router.push("/instructors");
    } catch (error) {
      toast.error("Could not create instructor", {
        id: toastId,
        description:
          error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
      throw error;
    }
  };

  if (isLoading) {
    return <InstructorFormSkeleton />;
  }

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
        backHref="/instructors"
        backLabel="Back to Instructors"
        icon={<UserPlus className="w-5 h-5 stroke-[2.2]" />}
        title="Add New Instructor"
        subtitle="Create a new instructor account and assign courses."
      />

      <InstructorForm
        defaultValues={{ name: "", email: "", phone: "", status: "Active" }}
        cancelHref="/instructors"
        submitLabel="Create Instructor"
        submittingLabel="Creating Instructor..."
        submitIcon={<UserPlus className="w-4 h-4 stroke-[2.2]" />}
        onSubmit={handleCreate}
      />
    </motion.div>
  );
}
