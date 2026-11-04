"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { StudentDetailsHeader } from "@/components/students/details/StudentDetailsHeader";
import { StudentDetailsTabs, type StudentTabKey } from "@/components/students/details/StudentDetailsTabs";
import { StudentInfoOverviewCard } from "@/components/students/details/StudentInfoOverviewCard";
import { LearningProgressCard } from "@/components/students/details/LearningProgressCard";
import { EnrolledCoursesMiniCard } from "@/components/students/details/EnrolledCoursesMiniCard";
import { RecentActivityTimelineCard } from "@/components/students/details/RecentActivityTimelineCard";
import { EnrolledCoursesTabContent } from "@/components/students/details/EnrolledCoursesTabContent";
import { AssignmentsTabContent } from "@/components/students/details/AssignmentsTabContent";
import { QuizzesTabContent } from "@/components/students/details/QuizzesTabContent";
import { CertificatesTabContent } from "@/components/students/details/CertificatesTabContent";
import { ActivityLogTabContent } from "@/components/students/details/ActivityLogTabContent";
import { NotesTabContent } from "@/components/students/details/NotesTabContent";
import { EnrollCoursesModal } from "@/components/students/details/EnrollCoursesModal";
import { StudentLoadError } from "@/components/students/details/StudentLoadError";
import { StudentDetailsSkeleton } from "@/components/students/details/StudentDetailsSkeleton";
import { studentsApi } from "@/lib/api/students";
import { apiErrorMessage } from "@/lib/apiError";
import { useCan } from "@/lib/usePermission";
import { useStudentProfile } from "@/lib/students/useStudentProfile";
import { downloadStudentsCsv } from "@/lib/students/studentCsv";
import type { StudentNoteCategory } from "@/types/studentDetails";
import type { StudentInfoInput } from "@/validations/studentSchema";

const TABS: StudentTabKey[] = ["overview", "enrolled-courses", "assignments", "quizzes", "certificates", "activity-log", "notes"];
const tabKey = (studentId: string) => `edupro_student_tab_${studentId}`;

/**
 * Runs an API change with the standard toast lifecycle, then refreshes the profile.
 * Rethrows so forms / modals can stay open on failure.
 */
async function withToast<T>(loading: [string, string], success: [string, string], errorTitle: string, run: () => Promise<T>, refresh: () => Promise<void>) {
  const id = toast.loading(loading[0], { description: loading[1] });
  try {
    const result = await run();
    await refresh().catch(() => undefined);
    toast.success(success[0], { id, description: success[1] });
    return result;
  } catch (err) {
    toast.error(errorTitle, { id, description: apiErrorMessage(err) });
    throw err;
  }
}

function StudentDetailsContent({ studentId }: { studentId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, reload } = useStudentProfile(studentId);
  const canManage = useCan("students", "manage");
  const canDelete = useCan("students", "delete");
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fromUrl = searchParams.get("tab") as StudentTabKey | null;
  const activeTab: StudentTabKey = fromUrl && TABS.includes(fromUrl) ? fromUrl : "overview";

  const setTab = (tab: StudentTabKey) => {
    try {
      sessionStorage.setItem(tabKey(studentId), tab);
    } catch {
      /* private mode */
    }
    const params = new URLSearchParams(window.location.search);
    if (tab === "overview") params.delete("tab");
    else params.set("tab", tab);
    router.replace(params.size ? `?${params}` : `/students/${studentId}`, { scroll: false });
  };

  // No ?tab= in the URL → restore the tab last used for this student in this browser session.
  useEffect(() => {
    if (fromUrl) return;
    try {
      const saved = sessionStorage.getItem(tabKey(studentId)) as StudentTabKey | null;
      if (saved && saved !== "overview" && TABS.includes(saved)) router.replace(`?tab=${saved}`, { scroll: false });
    } catch {
      /* private mode */
    }
  }, [fromUrl, studentId, router]);

  if (state.kind === "loading") return <StudentDetailsSkeleton activeTab={activeTab} />;
  if (state.kind === "error") return <StudentLoadError notFound={state.status === 404} message={state.message} />;

  const { student, raw, records } = state;

  const saveInfo = (values: StudentInfoInput) =>
    withToast(["Saving student...", values.name], ["Student updated", `${values.name}'s profile is saved.`], "Couldn't save the student", () => studentsApi.update(studentId, values), reload).then(() => undefined);

  const noteActions = {
    onAdd: (note: { category: StudentNoteCategory; content: string }) =>
      withToast(["Adding note...", student.name], ["Note added", "Visible to your team on this profile."], "Couldn't add the note", () => studentsApi.addNote(studentId, note), reload).then(() => undefined),
    onUpdate: (noteId: string, note: { category: StudentNoteCategory; content: string }) =>
      withToast(["Saving note...", student.name], ["Note updated", "Your changes are saved."], "Couldn't update the note", () => studentsApi.updateNote(studentId, noteId, note), reload).then(() => undefined),
    onDelete: (noteId: string) =>
      withToast(["Deleting note...", student.name], ["Note deleted", "It's no longer on this profile."], "Couldn't delete the note", () => studentsApi.removeNote(studentId, noteId), reload).then(() => undefined),
  };

  const enroll = (courseIds: string[]) =>
    withToast(
      ["Enrolling...", `${courseIds.length} course${courseIds.length === 1 ? "" : "s"} for ${student.name}`],
      ["Enrolled", `${student.name} now has access to the selected course${courseIds.length === 1 ? "" : "s"}.`],
      "Couldn't enroll the student",
      () => studentsApi.enroll(studentId, courseIds),
      reload
    ).then(() => undefined);

  const unenroll = (course: { id: string; title: string }) =>
    withToast(["Removing enrollment...", course.title], ["Enrollment removed", `${student.name} no longer has access to ${course.title}.`], "Couldn't remove the enrollment", () => studentsApi.unenroll(studentId, course.id), reload).then(
      () => undefined
    );

  const deleteStudent = async () => {
    const id = toast.loading("Deleting student...", { description: student.name });
    try {
      await studentsApi.remove(studentId);
      toast.success("Student deleted", { id, description: `${student.name} can no longer sign in. Their records are kept.` });
      router.push("/students");
    } catch (err) {
      toast.error("Couldn't delete the student", { id, description: apiErrorMessage(err) });
      throw err;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-6 text-left pb-10">
      <StudentDetailsHeader
        student={student}
        onEdit={canManage ? () => router.push(`/students/${studentId}/edit`) : undefined}
        onExport={() => {
          downloadStudentsCsv([raw]);
          toast.success("Profile exported", { description: `${student.name}'s record downloaded as CSV.` });
        }}
        onDelete={canDelete ? () => setDeleteOpen(true) : undefined}
      />

      <StudentDetailsTabs
        activeTab={activeTab}
        onTabChange={setTab}
        counts={{
          "enrolled-courses": student.enrolledCourses.length,
          assignments: student.assignments.length,
          quizzes: student.quizzes.length,
          certificates: student.certificates.filter((c) => c.status === "Issued").length,
          notes: student.notes.length,
        }}
      />

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <StudentInfoOverviewCard student={student} onSave={saveInfo} canEdit={canManage} />
            <LearningProgressCard student={student} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 xl:col-span-8">
              <EnrolledCoursesMiniCard courses={student.enrolledCourses} onViewAll={() => setTab("enrolled-courses")} onViewCourse={(c) => router.push(`/courses/${c.id}`)} />
            </div>
            <div className="lg:col-span-5 xl:col-span-4">
              <RecentActivityTimelineCard activities={student.recentActivities} onViewAll={() => setTab("activity-log")} />
            </div>
          </div>
        </div>
      )}

      {activeTab === "enrolled-courses" && (
        <EnrolledCoursesTabContent courses={student.enrolledCourses} onEnrollNew={() => setEnrollOpen(true)} onUnenroll={unenroll} canManage={canManage} />
      )}
      {activeTab === "assignments" && <AssignmentsTabContent assignments={student.assignments} />}
      {activeTab === "quizzes" && <QuizzesTabContent quizzes={student.quizzes} />}
      {activeTab === "certificates" && <CertificatesTabContent certificates={student.certificates} />}
      {activeTab === "activity-log" && <ActivityLogTabContent activities={student.activityLogs} />}
      {activeTab === "notes" && <NotesTabContent notes={student.notes} {...noteActions} />}

      <EnrollCoursesModal isOpen={enrollOpen} studentName={student.name} enrolledCourseIds={records.courses.map((c) => c.id)} onClose={() => setEnrollOpen(false)} onEnroll={enroll} />

      <ConfirmModal
        isOpen={deleteOpen}
        title="Delete this student?"
        subtitle={student.email}
        message={
          <>
            <span className="body-sm-medium text-primary-500">{student.name}</span> won&apos;t be able to sign in any more. Their enrollments, grades and certificates are kept for your records.
          </>
        }
        confirmLabel="Delete student"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 className="w-4 h-4" />}
        onClose={() => setDeleteOpen(false)}
        onConfirm={deleteStudent}
      />
    </motion.div>
  );
}

function StudentDetailsSuspenseFallback() {
  const tab = (useSearchParams().get("tab") as StudentTabKey) || "overview";
  return <StudentDetailsSkeleton activeTab={tab} />;
}

export default function StudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  return (
    <Suspense fallback={<StudentDetailsSuspenseFallback />}>
      <StudentDetailsContent studentId={id} />
    </Suspense>
  );
}
