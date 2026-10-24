"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { createStudentSchema, CreateStudentInput } from "@/validations/studentSchema";
import { getStoredStudents, saveStoredStudents } from "@/lib/studentStorage";
import { EnrolledCourseItem } from "@/types/student";

import { EditStudentHeader } from "@/components/students/edit/EditStudentHeader";
import { EditStudentActions } from "@/components/students/edit/EditStudentActions";
import { StudentInformationCard } from "@/components/students/create/StudentInformationCard";
import { CourseEnrollmentCard } from "@/components/students/create/CourseEnrollmentCard";
import { StudentAccountSummaryCard } from "@/components/students/create/StudentAccountSummaryCard";
import { StudentNextStepsCard } from "@/components/students/create/StudentNextStepsCard";
import { CreateStudentSkeleton } from "@/components/students/create/CreateStudentSkeleton";
import { ENROLLMENT_COURSES } from "@/components/students/create/mockEnrollmentCourses";
import { DEFAULT_STUDENT_DETAILS } from "@/components/students/details/mockStudentDetails";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditStudentPage({ params }: PageProps) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const studentId = unwrappedParams.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([
    "course-1",
    "course-2",
  ]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateStudentInput>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "Active",
      enrolledCourseIds: ["course-1", "course-2"],
    },
  });

  // Watch fields for live synchronization with Account Summary Card
  const watchedName = useWatch({ control, name: "name" });
  const watchedEmail = useWatch({ control, name: "email" });
  const watchedPhone = useWatch({ control, name: "phone" });
  const watchedStatus = useWatch({ control, name: "status" });

  useEffect(() => {
    const stored = getStoredStudents();
    const found = stored.find((s) => s.id === studentId);

    if (found) {
      reset({
        name: found.name,
        email: found.email,
        phone: found.phone,
        status: found.status === "Active" ? "Active" : "Inactive",
        enrolledCourseIds: found.enrolledCourses?.map((c) => c.id) || ["course-1", "course-2"],
      });
      if (found.enrolledCourses && found.enrolledCourses.length > 0) {
        setSelectedCourseIds(found.enrolledCourses.map((c) => c.id));
      }
    } else {
      // Fallback to mock details
      reset({
        name: DEFAULT_STUDENT_DETAILS.name,
        email: DEFAULT_STUDENT_DETAILS.email,
        phone: DEFAULT_STUDENT_DETAILS.phone,
        status: DEFAULT_STUDENT_DETAILS.status === "Active" ? "Active" : "Inactive",
        enrolledCourseIds: ["course-1", "course-2", "course-3"],
      });
      setSelectedCourseIds(["course-1", "course-2", "course-3"]);
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [studentId, reset]);

  const onSubmit = async (data: CreateStudentInput) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Saving student updates...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const stored = getStoredStudents();
      const existingIdx = stored.findIndex((s) => s.id === studentId);

      const enrolledCourses: EnrolledCourseItem[] = selectedCourseIds.map((id) => {
        const found = ENROLLMENT_COURSES.find((c) => c.id === id);
        return {
          id: id,
          title: found?.title || "General Course",
          progress: 50,
          enrolledDate: "Active",
          completedLessons: 10,
          totalLessons: 20,
          instructor: found?.instructor.name || "EduPro Faculty",
          category: found?.category || "Development",
        };
      });

      if (existingIdx !== -1) {
        stored[existingIdx] = {
          ...stored[existingIdx],
          name: data.name,
          email: data.email,
          phone: data.phone?.trim() || stored[existingIdx].phone,
          status: (data.status as any) || stored[existingIdx].status,
          enrolledCoursesCount: selectedCourseIds.length,
          enrolledCourses,
        };
        saveStoredStudents(stored);
      }

      toast.success("Student details updated successfully", {
        id: toastId,
      });

      router.push(`/students/${studentId}`);
    } catch {
      toast.error("Failed to update student", {
        id: toastId,
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <CreateStudentSkeleton />;
  }

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
