"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useUrlParams } from "@/lib/useUrlParams";
import { useCan } from "@/lib/usePermission";
import { instructorsApi } from "@/lib/api/instructors";
import { apiErrorMessage } from "@/lib/apiError";
import { useInstructorProfile } from "@/lib/instructors/useInstructorProfile";
import type { InstructorNoteItem } from "@/types/instructor";
import type { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import type { InstructorCourseRow } from "@/components/instructors/details/instructorDetailsData";
import { InstructorDetailsHeader } from "@/components/instructors/details/InstructorDetailsHeader";
import { InstructorDetailsTabs, type InstructorTabKey, isInstructorTab } from "@/components/instructors/details/InstructorDetailsTabs";
import { InstructorOverviewTab } from "@/components/instructors/details/InstructorOverviewTab";
import { InstructorCoursesTab } from "@/components/instructors/details/InstructorCoursesTab";
import { InstructorStudentsTab } from "@/components/instructors/details/InstructorStudentsTab";
import { InstructorReviewsTab } from "@/components/instructors/details/InstructorReviewsTab";
import { InstructorScheduleTab } from "@/components/instructors/details/InstructorScheduleTab";
import { InstructorNotesTab } from "@/components/instructors/details/InstructorNotesTab";
import { InstructorActivityLogTab } from "@/components/instructors/details/InstructorActivityLogTab";
import { DeleteInstructorModal } from "@/components/instructors/details/DeleteInstructorModal";
import { SendMessageModal } from "@/components/instructors/details/SendMessageModal";
import { InstructorNotFound } from "@/components/instructors/details/InstructorNotFound";
import { InstructorDetailsSkeleton } from "@/components/instructors/details/InstructorDetailsSkeleton";

const tabStorageKey = (id: string) => `edupro_instructor_tab_${id}`;

function InstructorDetailsContent({ instructorId }: { instructorId: string }) {
  const router = useRouter();
  const { get, set } = useUrlParams();
  const { state, reload } = useInstructorProfile(instructorId);
  const canManage = useCan("instructors", "manage");
  const canDelete = useCan("instructors", "delete");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  const tabFromQuery = get("tab");
  // The URL is the source of truth for the active tab, so reloads and back/forward stay in place.
  const activeTab: InstructorTabKey = isInstructorTab(tabFromQuery) ? tabFromQuery : "overview";

  // No ?tab= → restore the last tab used for this instructor in this browser session.
  useEffect(() => {
    if (tabFromQuery) return;
    try {
      const saved = sessionStorage.getItem(tabStorageKey(instructorId));
      if (isInstructorTab(saved) && saved !== "overview") set({ tab: saved });
    } catch {
      /* private mode */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instructorId]);

  if (state.kind === "loading") return <InstructorDetailsSkeleton activeTab={activeTab} />;
  if (state.kind === "error") return <InstructorNotFound message={state.status === 404 ? undefined : state.message} />;

  const { details, activity, notes } = state;
  const instructor = details.instructor;
  const editHref = `/instructors/${instructor.id}/edit`;

  /** Switch tab, clearing the previous tab's search / filter / page params. */
  const handleTabChange = (tab: InstructorTabKey, params: Record<string, string> = {}) => {
    try {
      sessionStorage.setItem(tabStorageKey(instructorId), tab);
    } catch {
      /* private mode */
    }
    set({ tab: tab === "overview" ? null : tab, ...params }, { replaceAll: true });
  };

  const getCourseActions = (course: InstructorCourseRow): DropdownActionItem[] => [
    { key: "view", label: "View Course", icon: <Eye className="w-3.5 h-3.5 text-primary-400" />, onClick: () => router.push(`/courses/${course.id}`) },
    ...(canManage ? [{ key: "edit", label: "Edit Assignments", icon: <Pencil className="w-3.5 h-3.5 text-primary-400" />, onClick: () => router.push(editHref) }] : []),
  ];

  const handleDeleteNote = async (note: InstructorNoteItem) => {
    const toastId = toast.loading("Deleting note...", { description: note.title });
    try {
      await instructorsApi.removeNote(instructorId, note.id);
      await reload().catch(() => undefined);
      toast.success("Note deleted", { id: toastId, description: `"${note.title}" was removed.` });
    } catch (err) {
      toast.error("Couldn't delete the note", { id: toastId, description: apiErrorMessage(err) });
      throw err;
    }
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting instructor...", { description: instructor.name });
    try {
      await instructorsApi.remove(instructorId);
      try {
        sessionStorage.removeItem(tabStorageKey(instructorId));
      } catch {
        /* private mode */
      }
      toast.success("Instructor deleted", { id: toastId, description: `${instructor.name} can no longer sign in.` });
      router.push("/instructors");
    } catch (err) {
      toast.error("Couldn't delete the instructor", { id: toastId, description: apiErrorMessage(err) });
      throw err;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-6 text-left pb-10">
      <InstructorDetailsHeader
        details={details}
        showSummary={activeTab === "overview"}
        onEdit={canManage ? () => router.push(editHref) : undefined}
        onSendMessage={() => setIsMessageOpen(true)}
        onDelete={canDelete ? () => setIsDeleteOpen(true) : undefined}
      />

      <InstructorDetailsTabs details={details} notesCount={notes.length} activeTab={activeTab} onTabChange={(tab) => handleTabChange(tab)} />

      {activeTab === "overview" && <InstructorOverviewTab details={details} onNavigate={handleTabChange} getCourseActions={getCourseActions} />}
      {activeTab === "courses" && <InstructorCoursesTab courses={details.courses} onAssignCourse={canManage ? () => router.push(editHref) : undefined} getCourseActions={getCourseActions} />}
      {activeTab === "students" && (
        <InstructorStudentsTab instructorName={instructor.name} students={details.students} courses={details.courses} onViewCourse={(course) => handleTabChange("courses", { q: course.title })} />
      )}
      {activeTab === "reviews" && <InstructorReviewsTab reviews={details.reviews} courses={details.courses} />}
      {activeTab === "schedule" && <InstructorScheduleTab instructorId={instructor.id} instructorEmail={instructor.email} courses={details.courses} />}
      {activeTab === "notes" && <InstructorNotesTab instructorId={instructor.id} notes={notes} onDelete={handleDeleteNote} canManage={canManage} />}
      {activeTab === "activity-log" && <InstructorActivityLogTab entries={activity} />}

      <DeleteInstructorModal isOpen={isDeleteOpen} instructor={instructor} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete} />
      <SendMessageModal isOpen={isMessageOpen} instructor={instructor} onClose={() => setIsMessageOpen(false)} />
    </motion.div>
  );
}

export default function InstructorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  return (
    <Suspense fallback={<InstructorDetailsSkeleton />}>
      <InstructorDetailsContent instructorId={id} />
    </Suspense>
  );
}
