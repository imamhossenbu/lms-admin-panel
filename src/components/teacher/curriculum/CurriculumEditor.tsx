"use client";

import React, { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { FolderPlus, Layers, Trash2 } from "lucide-react";
import { apiErrorMessage } from "@/lib/apiError";
import { teacherApi } from "@/lib/api/teacher";
import type { TeacherCourseDetail } from "@/types/teacher";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyRow } from "../shared/EmptyRow";
import { ModuleCard } from "./ModuleCard";
import { ModuleTitleModal } from "./ModuleTitleModal";
import { LessonFormModal, type LessonFormTarget } from "./LessonFormModal";

type Module = TeacherCourseDetail["modules"][number];
type Lesson = Module["lessons"][number];
type Pending = { kind: "module"; mod: Module } | { kind: "lesson"; lesson: Lesson };

const swap = <T,>(list: T[], i: number, dir: -1 | 1) => {
  const next = [...list];
  [next[i], next[i + dir]] = [next[i + dir], next[i]];
  return next;
};

/** Teacher › course › Curriculum: add / rename / reorder / delete modules and add / edit / reorder / delete lessons. */
export function CurriculumEditor({ course, onChanged }: { course: TeacherCourseDetail; onChanged: () => void }) {
  const [moduleModal, setModuleModal] = useState<{ mod?: Module } | null>(null);
  const [lessonTarget, setLessonTarget] = useState<LessonFormTarget | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [busy, setBusy] = useState(false);
  const modules = course.modules.map((m) => ({ id: m.id, title: m.title }));
  const closeLesson = useCallback(() => setLessonTarget(null), []);

  const reorder = async (label: string, run: () => Promise<unknown>) => {
    setBusy(true);
    const id = toast.loading("Updating the order…");
    try {
      await run();
      toast.success("Order updated", { id, description: label });
      onChanged();
    } catch (e) {
      toast.error("Couldn't change the order", { id, description: apiErrorMessage(e) });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!pending) return;
    const id = toast.loading("Deleting…");
    try {
      if (pending.kind === "module") await teacherApi.deleteModule(course.id, pending.mod.id);
      else await teacherApi.deleteLesson(course.id, pending.lesson.id);
      toast.success(pending.kind === "module" ? "Module deleted" : "Lesson deleted", { id, description: pending.kind === "module" ? pending.mod.title : pending.lesson.title });
      onChanged();
    } catch (e) {
      toast.error("Couldn't delete it", { id, description: apiErrorMessage(e) });
      throw e;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="body-l-medium font-semibold text-primary-500">Curriculum</h2>
          <p className="body-sm-regular text-primary-300">Draft lessons stay hidden from learners until you publish them. Pricing and course publishing are handled by your admin.</p>
        </div>
        <PrimaryButton leftIcon={<FolderPlus className="h-4 w-4" />} onClick={() => setModuleModal({})}>
          Add module
        </PrimaryButton>
      </div>

      {course.modules.length === 0 ? (
        <div className="dashboard-card">
          <EmptyRow icon={<Layers className="h-6 w-6" />} title="No modules yet" text="Add a module, then add lessons to it." />
        </div>
      ) : (
        <AnimatePresence initial={false}>
          {course.modules.map((m, i) => (
            <ModuleCard
              key={m.id}
              mod={m}
              index={i}
              count={course.modules.length}
              busy={busy}
              onMove={(d) => reorder(m.title, () => teacherApi.reorderModules(course.id, swap(course.modules, i, d).map((x) => x.id)))}
              onRename={() => setModuleModal({ mod: m })}
              onDelete={() => setPending({ kind: "module", mod: m })}
              onAddLesson={() => setLessonTarget({ courseId: course.id, modules, moduleId: m.id })}
              onMoveLesson={(li, d) => reorder(m.lessons[li].title, () => teacherApi.reorderLessons(course.id, m.id, swap(m.lessons, li, d).map((x) => x.id)))}
              onEditLesson={(l) => setLessonTarget({ courseId: course.id, modules, moduleId: m.id, lessonId: l.id })}
              onDeleteLesson={(l) => setPending({ kind: "lesson", lesson: l })}
            />
          ))}
        </AnimatePresence>
      )}

      <ModuleTitleModal
        open={!!moduleModal}
        initial={moduleModal?.mod?.title}
        onClose={() => setModuleModal(null)}
        onSave={async (title) => {
          if (moduleModal?.mod) await teacherApi.renameModule(course.id, moduleModal.mod.id, title);
          else await teacherApi.addModule(course.id, title);
          onChanged();
        }}
      />
      <LessonFormModal target={lessonTarget} onClose={closeLesson} onSaved={onChanged} />
      <ConfirmModal
        isOpen={!!pending}
        title={pending?.kind === "module" ? "Delete this module?" : "Delete this lesson?"}
        message={
          pending?.kind === "module"
            ? `"${pending.mod.title}" will be removed. Only empty modules can be deleted — move or delete its lessons first.`
            : pending
              ? `"${pending.lesson.title}" will be removed. Lessons learners have already started can't be deleted — set them to Draft instead.`
              : ""
        }
        confirmLabel="Delete"
        pendingLabel="Deleting…"
        confirmIcon={<Trash2 className="h-4 w-4" />}
        onClose={() => setPending(null)}
        onConfirm={remove}
      />
    </div>
  );
}

export default CurriculumEditor;
