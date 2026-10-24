"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { createStudentSchema, CreateStudentInput } from "@/validations/studentSchema";
import { saveNewStudent, getStoredStudents } from "@/lib/studentStorage";
import { StudentItem, StudentStatus, EnrolledCourseItem } from "@/types/student";

import { CreateStudentHeader } from "@/components/students/create/CreateStudentHeader";
import { StudentInformationCard } from "@/components/students/create/StudentInformationCard";
import { CourseEnrollmentCard } from "@/components/students/create/CourseEnrollmentCard";
import { StudentAccountSummaryCard } from "@/components/students/create/StudentAccountSummaryCard";
import { StudentNextStepsCard } from "@/components/students/create/StudentNextStepsCard";
import { CreateStudentActions } from "@/components/students/create/CreateStudentActions";
import { ENROLLMENT_COURSES } from "@/components/students/create/mockEnrollmentCourses";

export default function CreateStudentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // By default, match the screenshot where Course 1 & 2 are pre-checked
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([
    "course-1",
    "course-2",
  ]);

  const {
    register,
    handleSubmit,
    control,
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

  const onSubmit = async (data: CreateStudentInput) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Creating student account...");

    try {
      // Simulate network latency for authentic UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      const existingStudents = getStoredStudents();

      // Map selected courses to student's enrolled courses
      const enrolledCourses: EnrolledCourseItem[] = selectedCourseIds.map((id) => {
        const found = ENROLLMENT_COURSES.find((c) => c.id === id);
        return {
          id: id,
          title: found?.title || "General Course",
          progress: 0,
          enrolledDate: "Today",
          completedLessons: 0,
          totalLessons: 20,
          instructor: found?.instructor.name || "EduPro Faculty",
          category: found?.category || "Development",
        };
      });

      const tempPassword = `EduPro#${Math.floor(1000 + Math.random() * 9000)}`;

      const newStudent: StudentItem = {
        id: `std-${Date.now()}`,
        orderNumber: existingStudents.length + 1,
        name: data.name,
        email: data.email,
        phone: data.phone?.trim() || "+880 1712 345678",
        status: (data.status as StudentStatus) || "Active",
        enrolledCoursesCount: selectedCourseIds.length,
        completedCoursesCount: 0,
        completionRate: 0,
        joinDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        totalWatchTime: "0h 0m",
        averageScore: 0,
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80`,
        enrolledCourses,
        recentActivities: [
          {
            id: `act-${Date.now()}-1`,
            action: `Welcome email with temporary password (${tempPassword}) sent to ${data.email}`,
            timestamp: "Just now",
            iconType: "enroll",
          },
          {
            id: `act-${Date.now()}-2`,
            action: `Account registered and enrolled in ${selectedCourseIds.length} course(s)`,
            timestamp: "Just now",
            iconType: "enroll",
          },
        ],
      };

      saveNewStudent(newStudent);

      toast.success(`Student account created for "${data.name}"`, {
        id: toastId,
      });

      router.push("/students");
    } catch {
      toast.error("Failed to create student account", {
        id: toastId,
      });
      setIsSubmitting(false);
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
