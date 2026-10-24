"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { getStoredStudents, saveStoredStudents } from "@/lib/studentStorage";
import {
  DEFAULT_STUDENT_DETAILS,
  StudentFullDetails,
} from "@/components/students/details/mockStudentDetails";
import { StudentDetailsHeader } from "@/components/students/details/StudentDetailsHeader";
import {
  StudentDetailsTabs,
  StudentTabKey,
} from "@/components/students/details/StudentDetailsTabs";
import { StudentInfoOverviewCard } from "@/components/students/details/StudentInfoOverviewCard";
import { LearningProgressCard } from "@/components/students/details/LearningProgressCard";
import { EnrolledCoursesMiniCard } from "@/components/students/details/EnrolledCoursesMiniCard";
import { RecentActivityTimelineCard } from "@/components/students/details/RecentActivityTimelineCard";
import { EnrolledCoursesTabContent } from "@/components/students/details/EnrolledCoursesTabContent";
import { AssignmentsTabContent } from "@/components/students/details/AssignmentsTabContent";
import { StudentTabPlaceholder } from "@/components/students/details/StudentTabPlaceholder";
import { StudentDetailsSkeleton } from "@/components/students/details/StudentDetailsSkeleton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StudentDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const studentId = unwrappedParams.id;

  const [activeTab, setActiveTab] = useState<StudentTabKey>("overview");
  const [student, setStudent] = useState<StudentFullDetails>(DEFAULT_STUDENT_DETAILS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Look up student from storage if matching ID or hydrate
    const stored = getStoredStudents();
    const found = stored.find((s) => s.id === studentId);

    if (found) {
      setStudent((prev) => ({
        ...prev,
        id: found.id,
        name: found.name,
        email: found.email,
        phone: found.phone,
        status: found.status === "Active" ? "Active" : "Inactive",
        joinedDate: found.joinDate,
        initials: found.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      }));
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [studentId]);

  if (isLoading) {
    return <StudentDetailsSkeleton />;
  }

  const handleEdit = () => {
    router.push(`/students/${studentId}/edit`);
  };

  const handleUpdateStudent = (updatedData: Partial<StudentFullDetails>) => {
    setStudent((prev) => ({
      ...prev,
      ...updatedData,
    }));

    // Update in local storage
    const stored = getStoredStudents();
    const idx = stored.findIndex((s) => s.id === studentId);
    if (idx !== -1) {
      stored[idx] = {
        ...stored[idx],
        name: updatedData.name ?? stored[idx].name,
        email: updatedData.email ?? stored[idx].email,
        phone: updatedData.phone ?? stored[idx].phone,
        status: (updatedData.status as any) ?? stored[idx].status,
      };
      saveStoredStudents(stored);
    }
  };

  const handleEnrollNew = () => {
    toast("Opening course catalog to select enrollment...", {
      icon: "📚",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-6 text-left pb-10"
    >
      {/* 1. Header with Breadcrumbs, Avatar & Actions */}
      <StudentDetailsHeader student={student} onEdit={handleEdit} />

      {/* 2. Tab Navigation */}
      <StudentDetailsTabs
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* 3. Tab Contents */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Top Row: Student Information & Learning Progress (Same Alignment & Height) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <StudentInfoOverviewCard
              student={student}
              onSave={handleUpdateStudent}
            />
            <LearningProgressCard student={student} />
          </div>

          {/* Bottom Row: Enrolled Courses (Bigger Left Table) & Recent Activity (Smaller Right Card) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 xl:col-span-8">
              <EnrolledCoursesMiniCard
                courses={student.enrolledCourses}
                onViewAll={() => setActiveTab("enrolled-courses")}
                onViewCourse={(c) =>
                  toast(`Selected course: ${c.title}`, {
                    icon: "📖",
                  })
                }
              />
            </div>
            <div className="lg:col-span-5 xl:col-span-4">
              <RecentActivityTimelineCard
                activities={student.recentActivities}
                onViewAll={() => setActiveTab("activity-log")}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "enrolled-courses" && (
        <EnrolledCoursesTabContent
          courses={student.enrolledCourses}
          onEnrollNew={handleEnrollNew}
        />
      )}

      {activeTab === "assignments" && (
        <AssignmentsTabContent assignments={student.assignments} />
      )}

      {activeTab === "quizzes" && <StudentTabPlaceholder title="Quizzes" />}
      {activeTab === "certificates" && (
        <StudentTabPlaceholder title="Certificates" />
      )}
      {activeTab === "activity-log" && (
        <StudentTabPlaceholder title="Activity Log" />
      )}
      {activeTab === "notes" && <StudentTabPlaceholder title="Notes" />}
    </motion.div>
  );
}
