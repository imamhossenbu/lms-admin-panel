"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createStudentSchema, CreateStudentInput } from "@/validations/studentSchema";
import { studentsApi } from "@/lib/api/students";
import { apiErrorMessage, parseApiError } from "@/lib/apiError";
import { useCourseOptions } from "@/lib/students/useCourseOptions";
import { EditStudentHeader } from "@/components/students/edit/EditStudentHeader";
import { EditStudentActions } from "@/components/students/edit/EditStudentActions";
import { StudentInformationCard } from "@/components/students/create/StudentInformationCard";
import { CourseEnrollmentCard } from "@/components/students/create/CourseEnrollmentCard";
import { StudentAccountSummaryCard } from "@/components/students/create/StudentAccountSummaryCard";
import { StudentNextStepsCard } from "@/components/students/create/StudentNextStepsCard";
import { CreateStudentSkeleton } from "@/components/students/create/CreateStudentSkeleton";
import { StudentLoadError } from "@/components/students/details/StudentLoadError";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Edit a student: profile fields + enrollments (added courses are enrolled, removed ones unenrolled). */
export default function EditStudentPage({ params }: PageProps) {
  const router = useRouter();
  const { id: studentId } = React.use(params);
  const courses = useCourseOptions();
  const [load, setLoad] = useState<{ kind: "loading" } | { kind: "ready"; enrolled: string[] } | { kind: "error"; notFound: boolean; message: string }>({ kind: "loading" });
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateStudentInput>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: { name: "", email: "", phone: "", status: "Active", enrolledCourseIds: [] },
  });

  const watchedName = useWatch({ control, name: "name" });
  const watchedEmail = useWatch({ control, name: "email" });
  const watchedPhone = useWatch({ control, name: "phone" });
  const watchedStatus = useWatch({ control, name: "status" });

  useEffect(() => {
    let alive = true;
    Promise.all([studentsApi.get(studentId), studentsApi.courses(studentId)])
      .then(([student, enrolled]) => {
        if (!alive) return;
        const ids = enrolled.map((c) => c.id);
        reset({ name: student.name, email: student.email, phone: student.phone, status: student.status, enrolledCourseIds: ids });
        setSelectedCourseIds(ids);
        setLoad({ kind: "ready", enrolled: ids });
      })
      .catch((err) => {
        const info = parseApiError(err, "We couldn't load this student.");
        if (alive) setLoad({ kind: "error", notFound: info.status === 404, message: info.message });
      });
    return () => {
      alive = false;
    };
  }, [studentId, reset]);

  const onSubmit = async (data: CreateStudentInput) => {
    if (load.kind !== "ready") return;
    const added = selectedCourseIds.filter((id) => !load.enrolled.includes(id));
    const removed = load.enrolled.filter((id) => !selectedCourseIds.includes(id));
    const toastId = toast.loading("Saving student...", { description: data.name });
    try {
      await studentsApi.update(studentId, { name: data.name, email: data.email, phone: data.phone ?? "", status: data.status });
      if (added.length) await studentsApi.enroll(studentId, added);
      for (const courseId of removed) await studentsApi.unenroll(studentId, courseId);
      const changes = [added.length && `enrolled in ${added.length}`, removed.length && `removed from ${removed.length}`].filter(Boolean).join(", ");
      toast.success("Student updated", { id: toastId, description: changes ? `Profile saved; ${changes} course${added.length + removed.length === 1 ? "" : "s"}.` : "Profile saved." });
      router.push(`/students/${studentId}`);
    } catch (err) {
      toast.error("Couldn't save the student", { id: toastId, description: apiErrorMessage(err) });
    }
  };

  if (load.kind === "loading") return <CreateStudentSkeleton />;
  if (load.kind === "error") return <StudentLoadError notFound={load.notFound} message={load.message} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-6 text-left pb-10"
    >
      {/* 1. Header with Breadcrumbs & Title */}
      <EditStudentHeader
        studentId={studentId}
        studentName={watchedName || "Student"}
      />

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

            <EditStudentActions
              studentId={studentId}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </form>
    </motion.div>
  );
}
