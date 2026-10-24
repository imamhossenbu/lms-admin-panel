"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

const VALID_STUDENT_TABS: StudentTabKey[] = [
  "overview",
  "enrolled-courses",
  "assignments",
  "quizzes",
  "certificates",
  "activity-log",
  "notes",
];

interface PageProps {
  params: Promise<{ id: string }>;
}

function StudentDetailsContent({ studentId }: { studentId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read active tab from URL search params with fallback to sessionStorage & default
  const tabFromQuery = searchParams.get("tab") as StudentTabKey;
  const initialTab =
    tabFromQuery && VALID_STUDENT_TABS.includes(tabFromQuery)
      ? tabFromQuery
      : "overview";

  const [activeTab, setActiveTab] = useState<StudentTabKey>(initialTab);
  const [student, setStudent] = useState<StudentFullDetails>(DEFAULT_STUDENT_DETAILS);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state if URL query param changes (browser back/forward or direct navigation)
  useEffect(() => {
    if (tabFromQuery && VALID_STUDENT_TABS.includes(tabFromQuery)) {
      setActiveTab(tabFromQuery);
    }
  }, [tabFromQuery]);

  // Tab change handler that keeps URL synchronized so refreshing stays on the active tab
  const handleTabChange = (newTab: StudentTabKey) => {
    setActiveTab(newTab);
    try {
      sessionStorage.setItem(`edupro_student_tab_${studentId}`, newTab);
    } catch {}

    const params = new URLSearchParams(window.location.search);
    params.set("tab", newTab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    // Check session storage on initial mount if URL didn't have tab
    if (!tabFromQuery && typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(`edupro_student_tab_${studentId}`) as StudentTabKey;
        if (saved && VALID_STUDENT_TABS.includes(saved) && saved !== "overview") {
          setActiveTab(saved);
          const params = new URLSearchParams(window.location.search);
          params.set("tab", saved);
          router.replace(`?${params.toString()}`, { scroll: false });
        }
      } catch {}
    }

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
  }, [studentId, tabFromQuery, router]);

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

      {/* 2. Tab Navigation (URL-synchronized) */}
      <StudentDetailsTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
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
                onViewAll={() => handleTabChange("enrolled-courses")}
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
                onViewAll={() => handleTabChange("activity-log")}
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

export default function StudentDetailsPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const studentId = unwrappedParams.id;

  return (
    <Suspense fallback={<StudentDetailsSkeleton />}>
      <StudentDetailsContent studentId={studentId} />
    </Suspense>
  );
}
