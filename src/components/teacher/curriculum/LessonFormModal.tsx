"use client";

import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import { FilePlus2, Pencil } from "lucide-react";
import { apiErrorMessage } from "@/lib/apiError";
import { teacherApi } from "@/lib/api/teacher";
import { TEACHER_LESSON_TYPES, type TeacherLessonType } from "@/types/teacher";
import { teacherLessonSchema, type TeacherLessonValues } from "@/validations/teacherContentSchema";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { SelectField } from "@/components/ui/SelectField";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { PrimaryButton } from "@/components/ui/primary-button";
import { VideoUrlField } from "./VideoUrlField";
import { LESSON_TYPE_META } from "./lessonTypes";

export interface LessonFormTarget {
  courseId: string;
  modules: { id: string; title: string }[];
  /** Module to add into (new lesson) … */
  moduleId: string;
  /** … or the lesson being edited. */
  lessonId?: string;
}

const EMPTY = (moduleId: string): TeacherLessonValues => ({ moduleId, title: "", type: "VIDEO", durationMinutes: 10, videoUrl: "", content: "", isPreview: false, status: "DRAFT" });

/** Add / edit one lesson: module, title, type, length, video link (upload), written content, free preview, status. */
export function LessonFormModal({ target, onClose, onSaved }: { target: LessonFormTarget | null; onClose: () => void; onSaved: () => void }) {
  const editing = !!target?.lessonId;
  // Derived: an edited lesson is "loading" until its row has been fetched into the form.
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const loading = !!target?.lessonId && loadedFor !== target.lessonId;
  const { register, handleSubmit, reset, control, formState } = useForm<z.input<typeof teacherLessonSchema>, unknown, TeacherLessonValues>({ resolver: zodResolver(teacherLessonSchema), defaultValues: EMPTY("") });
  const close = () => {
    setLoadedFor(null);
    onClose();
  };
  const type = useWatch({ control, name: "type" });

  useEffect(() => {
    if (!target) return;
    if (!target.lessonId) return void reset(EMPTY(target.moduleId));
    let alive = true;
    const lessonId = target.lessonId;
    teacherApi
      .lesson(target.courseId, target.lessonId)
      .then((l) => {
        if (!alive) return;
        const t = (TEACHER_LESSON_TYPES as readonly string[]).includes(l.type) ? (l.type as TeacherLessonType) : "TEXT";
        reset({ moduleId: l.moduleId, title: l.title, type: t, durationMinutes: l.durationMinutes, videoUrl: l.videoUrl ?? "", content: l.content ?? "", isPreview: l.isPreview, status: l.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT" });
        setLoadedFor(lessonId);
      })
      .catch((e) => {
        if (!alive) return;
        toast.error("Couldn't open the lesson", { description: apiErrorMessage(e) });
        onClose();
      });
    return () => {
      alive = false;
    };
  }, [target, reset, onClose]);

  const onSubmit = async (v: TeacherLessonValues) => {
    if (!target) return;
    const id = toast.loading(editing ? "Saving the lesson…" : "Adding the lesson…");
    try {
      if (target.lessonId) await teacherApi.updateLesson(target.courseId, target.lessonId, v);
      else await teacherApi.addLesson(target.courseId, v);
      toast.success(editing ? "Lesson saved" : "Lesson added", { id, description: v.status === "PUBLISHED" ? `${v.title} is live for learners.` : `${v.title} is saved as a draft.` });
      onSaved();
      close();
    } catch (e) {
      toast.error(editing ? "Couldn't save the lesson" : "Couldn't add the lesson", { id, description: apiErrorMessage(e) });
    }
  };

  const err = formState.errors;
  const written = type === "TEXT" || type === "CODING";
  return (
    <ModalShell
      isOpen={!!target}
      onClose={close}
      title={editing ? "Edit lesson" : "Add lesson"}
      subtitle={LESSON_TYPE_META[type]?.hint}
      titleIcon={editing ? <Pencil className="h-5 w-5" /> : <FilePlus2 className="h-5 w-5" />}
      maxWidth="2xl"
      footer={
        <div className="flex w-full justify-end gap-2">
          <button type="button" onClick={close} className="h-10 rounded-lg border border-dash bg-white px-4 body-sm-medium text-primary-500 hover:border-primary-300">
            Cancel
          </button>
          <PrimaryButton type="submit" form="lesson-form" isLoading={formState.isSubmitting} disabled={loading}>
            {editing ? "Save lesson" : "Add lesson"}
          </PrimaryButton>
        </div>
      }
    >
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <span className="block h-3 w-24 rounded bg-slate-100" />
              <span className="block h-10 rounded-lg border border-dash bg-slate-100" />
            </div>
          ))}
          <span className="block h-48 rounded-xl border border-dash bg-slate-100" />
        </div>
      ) : (
        <form id="lesson-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <InputField id="lesson-title" label="Lesson title" required placeholder="e.g. Setting up your editor" error={err.title?.message} {...register("title")} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Controller control={control} name="moduleId" render={({ field }) => <SelectField id="lesson-module" label="Module" options={target?.modules.map((m) => ({ value: m.id, label: m.title })) ?? []} value={field.value} onChange={(v: string) => field.onChange(v)} error={err.moduleId?.message} />} />
            <Controller control={control} name="type" render={({ field }) => <SelectField id="lesson-type" label="Type" options={TEACHER_LESSON_TYPES.map((t) => ({ value: t, label: LESSON_TYPE_META[t].label }))} value={field.value} onChange={(v: string) => field.onChange(v)} error={err.type?.message} />} />
            <InputField id="lesson-duration" type="number" min={0} max={600} label="Length (minutes)" error={err.durationMinutes?.message} {...register("durationMinutes")} />
          </div>
          {type === "VIDEO" && <Controller control={control} name="videoUrl" render={({ field }) => <VideoUrlField value={field.value} onChange={field.onChange} error={err.videoUrl?.message} />} />}
          <div>
            <Controller control={control} name="content" render={({ field }) => <RichTextEditor label={written ? "Lesson content" : "Notes for learners (optional)"} required={written} value={field.value} onChange={field.onChange} minHeight={written ? "260px" : "140px"} placeholder={written ? "Write the lesson…" : "Anything learners should read alongside this lesson…"} />} />
            {err.content?.message && <p className="mt-1.5 body-xsm-regular text-red">{err.content.message}</p>}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dash bg-slate-50 p-4">
            <Controller control={control} name="isPreview" render={({ field }) => <ToggleSwitch id="lesson-preview" checked={field.value} onChange={field.onChange} tone="orange" label={<span className="body-sm-medium text-primary-500">Free preview <span className="body-xsm-regular text-primary-300">— visitors can watch it before buying</span></span>} />} />
            <Controller control={control} name="status" render={({ field }) => <SegmentedControl options={[{ value: "DRAFT", label: "Draft" }, { value: "PUBLISHED", label: "Published" }]} value={field.value} onChange={field.onChange} />} />
          </div>
        </form>
      )}
    </ModalShell>
  );
}

export default LessonFormModal;
