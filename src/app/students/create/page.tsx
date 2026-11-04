"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createStudentSchema, CreateStudentInput } from "@/validations/studentSchema";
import { studentsApi } from "@/lib/api/students";
import { apiErrorMessage } from "@/lib/apiError";
import { useCourseOptions } from "@/lib/students/useCourseOptions";
import { CreateStudentHeader } from "@/components/students/create/CreateStudentHeader";
import { StudentInformationCard } from "@/components/students/create/StudentInformationCard";
import { CourseEnrollmentCard } from "@/components/students/create/CourseEnrollmentCard";
import { StudentAccountSummaryCard } from "@/components/students/create/StudentAccountSummaryCard";
import { StudentNextStepsCard } from "@/components/students/create/StudentNextStepsCard";
import { CreateStudentActions } from "@/components/students/create/CreateStudentActions";
import { CreateStudentSkeleton } from "@/components/students/create/CreateStudentSkeleton";

function CreateStudentContent() {
  const router = useRouter();
  const courses = useCourseOptions();
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateStudentInput>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: { name: "", email: "", phone: "", status: "Active", enrolledCourseIds: [] },
  });

  // Live values for the account summary card
  const watchedName = useWatch({ control, name: "name" });
  const watchedEmail = useWatch({ control, name: "email" });
  const watchedPhone = useWatch({ control, name: "phone" });
  const watchedStatus = useWatch({ control, name: "status" });

  const onSubmit = async (data: CreateStudentInput) => {
    const toastId = toast.loading("Creating student account...", { description: data.email });
    try {
      const student = await studentsApi.create({ name: data.name, email: data.email, phone: data.phone || undefined, status: data.status, enrolledCourseIds: selectedCourseIds });
      toast.success("Student created", {
        id: toastId,
        description: `${student.name} gets an email with a temporary password${selectedCourseIds.length ? ` and access to ${selectedCourseIds.length} course${selectedCourseIds.length === 1 ? "" : "s"}` : ""}.`,
      });
      router.push(`/students/${student.id}`);
    } catch (err) {
      toast.error("Couldn't create the student", { id: toastId, description: apiErrorMessage(err) });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-6 text-left pb-10"
    >
      {/* 1. Header with Breadcrumbs & Title */}
      <CreateStudentHeader />

      {/* 2. Main Form Form Container */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Inputs & Course Enrollment */}
          <div className="lg:col-span-8 space-y-6">
            <StudentInformationCard
              register={register}
              errors={errors}
              control={control}
            />

            <CourseEnrollmentCard
              courses={courses}
              selectedCourseIds={selectedCourseIds}
              onChangeSelectedCourseIds={setSelectedCourseIds}
            />
          </div>

          {/* Right Column (4 cols): Summary & Steps */}
          <div className="lg:col-span-4 space-y-6">
            <StudentAccountSummaryCard
              name={watchedName}
              email={watchedEmail}
              phone={watchedPhone}
              status={watchedStatus}
              enrolledCoursesCount={selectedCourseIds.length}
            />

            <StudentNextStepsCard />

            <CreateStudentActions isSubmitting={isSubmitting} />
          </div>
        </div>
      </form>
    </motion.div>
  );
}

export default function CreateStudentPage() {
  return (
    <Suspense fallback={<CreateStudentSkeleton />}>
      <CreateStudentContent />
    </Suspense>
  );
}
