"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { Plus, Sparkles, Layers } from "lucide-react";
import { toast } from "sonner";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { OutlineLessonInput } from "@/validations/courseOutlineSchema";
import { outlineStats, formatMinutes, type AiOutline, type AiOutlineLesson, type AiOutlineModule } from "../aiOutline";
import { LessonFormModal } from "../outline/LessonFormModal";
import {
  addLesson,
  lessonToForm,
  removeLesson,
  removeModule,
  reorderLessons,
  reorderModules,
  restoreLesson,
  updateLesson,
} from "../outline/outlineEditing";
import { duplicateLesson, duplicateModule, moveLesson, moveModule } from "./curriculumEditing";
import { CurriculumModuleItem } from "./CurriculumModuleItem";

interface CourseCurriculumCardProps {
  curriculum: AiOutline;
  onChange: (next: AiOutline) => void;
  /** Module currently open in the side panel (highlighted). */
  activeModuleId?: string;
  onAddModule: () => void;
  onEditModule: (module: AiOutlineModule) => void;
  onGenerateAi: () => void;
}

type LessonTarget = { moduleId: string; lesson?: AiOutlineLesson } | null;

/** Step 2: modules and lessons with drag-and-drop, inline actions and lesson editing. */
export function CourseCurriculumCard({
  curriculum,
  onChange,
  activeModuleId,
  onAddModule,
  onEditModule,
  onGenerateAi,
}: CourseCurriculumCardProps) {
  const [expanded, setExpanded] = useState<string[]>(() => (curriculum.modules[0] ? [curriculum.modules[0].id] : []));
  const [lessonTarget, setLessonTarget] = useState<LessonTarget>(null);
  const [moduleToDelete, setModuleToDelete] = useState<AiOutlineModule | null>(null);

  const stats = outlineStats(curriculum);
  const toggle = (id: string) => setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const lessonModule = lessonTarget ? curriculum.modules.find((m) => m.id === lessonTarget.moduleId) : undefined;

  const handleLessonSubmit = (values: OutlineLessonInput) => {
    if (!lessonTarget) return;
    if (lessonTarget.lesson) {
      onChange(updateLesson(curriculum, lessonTarget.moduleId, lessonTarget.lesson.id, values));
      toast.success("Lesson updated", { description: values.title });
    } else {
      onChange(addLesson(curriculum, lessonTarget.moduleId, values));
      setExpanded((prev) => (prev.includes(lessonTarget.moduleId) ? prev : [...prev, lessonTarget.moduleId]));
      toast.success("Lesson added", { description: values.title });
    }
    setLessonTarget(null);
  };

  const handleDeleteLesson = (module: AiOutlineModule, lesson: AiOutlineLesson) => {
    const index = module.lessons.findIndex((l) => l.id === lesson.id);
    const next = removeLesson(curriculum, module.id, lesson.id);
    onChange(next);
    toast.success("Lesson deleted", {
      description: lesson.title,
      action: { label: "Undo", onClick: () => onChange(restoreLesson(next, module.id, lesson, index)) },
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="dashboard-card shadow-2xs p-5 text-left space-y-4"
    >
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
        <div>
          <h2 className="heading-h5 font-bold text-primary-500">Course Curriculum</h2>
          <p className="body-sm-regular text-primary-400 mt-1">
            Organize your course content into modules and lessons. You can drag and drop to reorder them.
          </p>
          {stats.moduleCount > 0 && (
            <p className="body-xsm-medium text-primary-300 mt-2">
              {stats.moduleCount} Modules · {stats.lessonCount} Lessons · {formatMinutes(stats.totalMinutes)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={onGenerateAi}
            className="h-11 px-4 rounded-lg border border-purple/30 bg-purple-14 body-sm-medium text-purple hover:bg-purple hover:text-white inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Generate with AI
          </motion.button>
          <PrimaryButton type="button" size="lg" onClick={onAddModule} leftIcon={<Plus className="w-4 h-4" />}>
            Add Module
          </PrimaryButton>
        </div>
      </div>

      {curriculum.modules.length > 0 ? (
        <Reorder.Group axis="y" values={curriculum.modules} onReorder={(modules) => onChange(reorderModules(curriculum, modules))} className="space-y-3">
          <AnimatePresence initial={false}>
            {curriculum.modules.map((module, index) => (
              <CurriculumModuleItem
                key={module.id}
                module={module}
                index={index}
                total={curriculum.modules.length}
                isExpanded={expanded.includes(module.id)}
                isActive={module.id === activeModuleId}
                onToggle={() => toggle(module.id)}
                onEdit={() => onEditModule(module)}
                onDuplicate={() => {
                  onChange(duplicateModule(curriculum, module.id));
                  toast.success("Module duplicated", { description: module.title });
                }}
                onDelete={() => setModuleToDelete(module)}
                onMove={(direction) => onChange(moveModule(curriculum, module.id, direction))}
                onAddLesson={() => setLessonTarget({ moduleId: module.id })}
                onEditLesson={(lesson) => setLessonTarget({ moduleId: module.id, lesson })}
                onDuplicateLesson={(lesson) => {
                  onChange(duplicateLesson(curriculum, module.id, lesson.id));
                  toast.success("Lesson duplicated", { description: lesson.title });
                }}
                onDeleteLesson={(lesson) => handleDeleteLesson(module, lesson)}
                onMoveLesson={(lesson, direction) => onChange(moveLesson(curriculum, module.id, lesson.id, direction))}
                onReorderLessons={(lessons) => onChange(reorderLessons(curriculum, module.id, lessons))}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      ) : (
        <div className="rounded-xl border border-dashed border-dash py-12 flex flex-col items-center text-center gap-3">
          <span className="w-12 h-12 rounded-full bg-brand-orange-light text-brand-orange flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </span>
          <p className="body-medium font-semibold text-primary-500">No modules yet</p>
          <p className="body-sm-regular text-primary-300 max-w-sm">
            Add your first module, or let AI generate a complete curriculum you can edit.
          </p>
        </div>
      )}

      <motion.button
        type="button"
        whileTap={{ scale: 0.99 }}
        onClick={onAddModule}
        className="w-full h-14 rounded-xl border-2 border-dashed border-dash body-medium font-semibold text-brand-orange hover:border-brand-orange hover:bg-brand-orange-light inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <Plus className="w-5 h-5" />
        Add New Module
      </motion.button>

      <LessonFormModal
        isOpen={!!lessonTarget}
        moduleTitle={lessonModule?.title}
        initialValues={lessonTarget?.lesson ? lessonToForm(lessonTarget.lesson) : undefined}
        onClose={() => setLessonTarget(null)}
        onSubmit={handleLessonSubmit}
      />
      <ConfirmModal
        isOpen={!!moduleToDelete}
        title="Delete Module"
        subtitle={moduleToDelete ? `"${moduleToDelete.title}"` : undefined}
        message={
          moduleToDelete
            ? `This module and its ${moduleToDelete.lessons.length} lesson(s) will be removed from the curriculum.`
            : ""
        }
        confirmLabel="Delete Module"
        onClose={() => setModuleToDelete(null)}
        onConfirm={async () => {
          if (!moduleToDelete) return;
          onChange(removeModule(curriculum, moduleToDelete.id));
          toast.success("Module deleted", { description: moduleToDelete.title });
        }}
      />
    </motion.section>
  );
}

export default CourseCurriculumCard;
