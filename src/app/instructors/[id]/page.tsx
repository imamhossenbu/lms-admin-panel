"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, Pencil, Unlink } from "lucide-react";
import { toast } from "sonner";

import { InstructorItem, InstructorNoteItem } from "@/types/instructor";
import {
  getStoredInstructors,
  deleteStoredInstructor,
  updateStoredInstructor,
  getInstructorNotes,
  INSTRUCTORS_UPDATED_EVENT,
  INSTRUCTOR_NOTES_UPDATED_EVENT,
} from "@/lib/instructorStorage";
import { useUrlParams } from "@/lib/useUrlParams";
import { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import {
  buildInstructorDetails,
  InstructorCourseRow,
} from "@/components/instructors/details/instructorDetailsData";
import { InstructorDetailsHeader } from "@/components/instructors/details/InstructorDetailsHeader";
import {
  InstructorDetailsTabs,
  InstructorTabKey,
  isInstructorTab,
} from "@/components/instructors/details/InstructorDetailsTabs";
import { InstructorOverviewTab } from "@/components/instructors/details/InstructorOverviewTab";
import { InstructorCoursesTab } from "@/components/instructors/details/InstructorCoursesTab";
import { InstructorStudentsTab } from "@/components/instructors/details/InstructorStudentsTab";
import { InstructorReviewsTab } from "@/components/instructors/details/InstructorReviewsTab";
import { DeleteInstructorModal } from "@/components/instructors/details/DeleteInstructorModal";
import { SendMessageModal } from "@/components/instructors/details/SendMessageModal";
import { InstructorNotFound } from "@/components/instructors/details/InstructorNotFound";
import { InstructorDetailsSkeleton } from "@/components/instructors/details/InstructorDetailsSkeleton";
import { InstructorScheduleTab } from "@/components/instructors/details/InstructorScheduleTab";
import { InstructorNotesTab } from "@/components/instructors/details/InstructorNotesTab";
import { InstructorActivityLogTab } from "@/components/instructors/details/InstructorActivityLogTab";
import { buildActivityLog } from "@/components/instructors/details/activity/activityLogData";

interface PageProps {
  params: Promise<{ id: string }>;
}

const tabStorageKey = (id: string) => `edupro_instructor_tab_${id}`;

function InstructorDetailsContent({ instructorId }: { instructorId: string }) {
  const router = useRouter();
  const { get, set } = useUrlParams();
  const tabFromQuery = get("tab");
  // The URL is the source of truth for the active tab, so reloads and back/forward stay in place
  const activeTab: InstructorTabKey = isInstructorTab(tabFromQuery) ? tabFromQuery : "overview";

  const [instructor, setInstructor] = useState<InstructorItem | null>(null);
  const [notes, setNotes] = useState<InstructorNoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  useEffect(() => {
    // Restore the last tab from sessionStorage when the URL doesn't specify one
    if (!tabFromQuery) {
      try {
        const saved = sessionStorage.getItem(tabStorageKey(instructorId));
        if (isInstructorTab(saved) && saved !== "overview") {
          set({ tab: saved });
        }
      } catch {}
    }

    const load = () =>
      setInstructor(getStoredInstructors().find((i) => i.id === instructorId) ?? null);
    const loadNotes = () => setNotes(getInstructorNotes(instructorId));
    const timer = setTimeout(() => {
      load();
      loadNotes();
      setIsLoading(false);
    }, 200);
    window.addEventListener(INSTRUCTORS_UPDATED_EVENT, load);
    window.addEventListener(INSTRUCTOR_NOTES_UPDATED_EVENT, loadNotes);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(INSTRUCTORS_UPDATED_EVENT, load);
      window.removeEventListener(INSTRUCTOR_NOTES_UPDATED_EVENT, loadNotes);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instructorId]);

  const details = useMemo(() => (instructor ? buildInstructorDetails(instructor) : null), [instructor]);
  const activityLog = useMemo(
    () =>
      details
        ? buildActivityLog(details.instructor, details.courses, details.students, details.reviews, notes)
        : [],
    [details, notes]
  );

  if (isLoading) {
    return <InstructorDetailsSkeleton activeTab={activeTab} />;
  }

  if (!instructor || !details) {
    return <InstructorNotFound />;
  }

  const editHref = `/instructors/${instructor.id}/edit`;

  /** Switch tab, clearing the previous tab's search/filter/page params. */
  const handleTabChange = (tab: InstructorTabKey, params: Record<string, string> = {}) => {
    try {
      sessionStorage.setItem(tabStorageKey(instructorId), tab);
    } catch {}
    set({ tab: tab === "overview" ? null : tab, ...params }, { replaceAll: true });
  };

  const handleUnassignCourse = async (course: InstructorCourseRow) => {
    const previous = instructor.courses;
    const toastId = toast.loading("Unassigning course...", { description: course.title });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const remaining = previous.filter((c) => c.id !== course.id);
      updateStoredInstructor(instructor.id, { courses: remaining, coursesCount: remaining.length });
      toast.success("Course unassigned", {
        id: toastId,
        description: `${instructor.name} no longer teaches "${course.title}".`,
        action: {
          label: "Undo",
          onClick: () =>
            updateStoredInstructor(instructor.id, { courses: previous, coursesCount: previous.length }),
        },
      });
    } catch {
      toast.error("Could not unassign course", {
        id: toastId,
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const getCourseActions = (course: InstructorCourseRow): DropdownActionItem[] => [
    {
      key: "view",
      label: "View Course",
      icon: <Eye className="w-3.5 h-3.5 text-primary-400" />,
      onClick: () => handleTabChange("courses", { q: course.title }),
    },
    {
      key: "edit",
      label: "Edit Assignments",
      icon: <Pencil className="w-3.5 h-3.5 text-primary-400" />,
      onClick: () => router.push(editHref),
    },
    {
      key: "unassign",
      label: "Unassign Course",
      icon: <Unlink className="w-3.5 h-3.5" />,
      danger: true,
      separatorBefore: true,
      onClick: () => handleUnassignCourse(course),
    },
  ];

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting instructor...", {
      description: `Removing ${instructor.name} and unassigning their courses.`,
    });
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      deleteStoredInstructor(instructor.id);
      try {
        sessionStorage.removeItem(tabStorageKey(instructor.id));
      } catch {}
      toast.success("Instructor deleted", {
        id: toastId,
        description: `${instructor.name} has been removed from the platform.`,
      });
      router.push("/instructors");
    } catch (error) {
      toast.error("Could not delete instructor", {
        id: toastId,
        description: "Something went wrong. Please try again.",
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
      <InstructorDetailsHeader
        details={details}
        showSummary={activeTab === "overview"}
        onEdit={() => router.push(editHref)}
        onSendMessage={() => setIsMessageOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
      />

      <InstructorDetailsTabs details={details} notesCount={notes.length} activeTab={activeTab} onTabChange={(tab) => handleTabChange(tab)} />

      {activeTab === "overview" && (
        <InstructorOverviewTab
          details={details}
          onNavigate={handleTabChange}
          getCourseActions={getCourseActions}
        />
      )}
      {activeTab === "courses" && (
        <InstructorCoursesTab
          courses={details.courses}
          onAssignCourse={() => router.push(editHref)}
          getCourseActions={getCourseActions}
        />
      )}
      {activeTab === "students" && (
        <InstructorStudentsTab
          instructorName={instructor.name}
          students={details.students}
          courses={details.courses}
          onViewCourse={(course) => handleTabChange("courses", { q: course.title })}
        />
      )}
      {activeTab === "reviews" && <InstructorReviewsTab reviews={details.reviews} courses={details.courses} />}
      {activeTab === "schedule" && (
        <InstructorScheduleTab
          instructorId={instructor.id}
          instructorEmail={instructor.email}
          courses={details.courses}
        />
      )}
      {activeTab === "notes" && <InstructorNotesTab instructorId={instructor.id} notes={notes} />}
      {activeTab === "activity-log" && <InstructorActivityLogTab entries={activityLog} />}

      <DeleteInstructorModal
        isOpen={isDeleteOpen}
        instructor={instructor}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
      <SendMessageModal
        isOpen={isMessageOpen}
        instructor={instructor}
        onClose={() => setIsMessageOpen(false)}
      />
    </motion.div>
  );
}

export default function InstructorDetailsPage({ params }: PageProps) {
  const { id } = React.use(params);

  return (
    <Suspense fallback={<InstructorDetailsSkeleton />}>
      <InstructorDetailsContent instructorId={id} />
    </Suspense>
  );
}
