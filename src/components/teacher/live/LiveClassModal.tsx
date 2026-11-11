"use client";

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { toast } from "sonner";
import { CalendarPlus, Link2, Pencil } from "lucide-react";
import { apiErrorMessage } from "@/lib/apiError";
import { teacherApi } from "@/lib/api/teacher";
import { LIVE_PLATFORMS } from "@/types/teacher";
import { PLATFORM_LABEL, teacherLiveSchema, type TeacherLiveValues } from "@/validations/teacherContentSchema";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { SelectField } from "@/components/ui/SelectField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { useTeacherCourses } from "../shared/useTeacherCourses";

const DURATIONS = [
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1 h 30 min" },
  { value: "120", label: "2 hours" },
  { value: "180", label: "3 hours" },
];
const pad = (n: number) => String(n).padStart(2, "0");
/** Tomorrow 19:00 local — a sensible default slot. */
const defaults = (): z.input<typeof teacherLiveSchema> => {
  const t = new Date(Date.now() + 864e5);
  return { courseId: "", title: "", description: "", date: `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`, startTime: "19:00", durationMinutes: 60, platform: "GOOGLE_MEET", meetingUrl: "" };
};

/** Schedule a live class (target "new") or edit an upcoming one (target = id). */
export function LiveClassModal({ target, onClose, onSaved }: { target: "new" | string | null; onClose: () => void; onSaved: () => void }) {
  const { courses } = useTeacherCourses();
  const editing = !!target && target !== "new";
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const loading = editing && loadedFor !== target;
  const { register, handleSubmit, reset, control, formState } = useForm<z.input<typeof teacherLiveSchema>, unknown, TeacherLiveValues>({ resolver: zodResolver(teacherLiveSchema), defaultValues: defaults() });

  useEffect(() => {
    if (!target) return;
    if (target === "new") return void reset(defaults());
    let alive = true;
    teacherApi
      .liveClass(target)
      .then((l) => {
        if (!alive) return;
        reset({ courseId: l.courseId, title: l.title, description: l.description, date: l.date, startTime: l.startTime, durationMinutes: l.durationMinutes, platform: l.platform, meetingUrl: l.meetingUrl });
        setLoadedFor(target);
      })
      .catch((e) => {
        if (!alive) return;
        toast.error("Couldn't open the class", { description: apiErrorMessage(e) });
        onClose();
      });
    return () => {
      alive = false;
    };
  }, [target, reset, onClose]);

  const close = () => {
    setLoadedFor(null);
    onClose();
  };

  const onSubmit = async (v: TeacherLiveValues) => {
    const id = toast.loading(editing ? "Saving the class…" : "Scheduling the class…");
    try {
      if (editing && target) await teacherApi.updateLive(target, v);
      else await teacherApi.scheduleLive(v);
      toast.success(editing ? "Class updated" : "Class scheduled", { id, description: `${v.title} · ${v.date} at ${v.startTime}. Enrolled learners see it on their dashboard.` });
      onSaved();
      close();
    } catch (e) {
      toast.error(editing ? "Couldn't save the class" : "Couldn't schedule the class", { id, description: apiErrorMessage(e) });
    }
  };

  const err = formState.errors;
  return (
    <ModalShell
      isOpen={!!target}
      onClose={close}
      title={editing ? "Edit live class" : "Schedule a live class"}
      subtitle="Learners enrolled in the course get the join link 15 minutes before the start."
      titleIcon={editing ? <Pencil className="h-5 w-5" /> : <CalendarPlus className="h-5 w-5" />}
      maxWidth="xl"
      footer={
        <div className="flex w-full justify-end gap-2">
          <button type="button" onClick={close} className="h-10 rounded-lg border border-dash bg-white px-4 body-sm-medium text-primary-500 hover:border-primary-300">
            Cancel
          </button>
          <PrimaryButton type="submit" form="live-form" isLoading={formState.isSubmitting} disabled={loading}>
            {editing ? "Save changes" : "Schedule class"}
          </PrimaryButton>
        </div>
      }
    >
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <span className="block h-3 w-24 rounded bg-slate-100" />
              <span className="block h-10 rounded-lg border border-dash bg-slate-100" />
            </div>
          ))}
        </div>
      ) : (
        <form id="live-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <Controller control={control} name="courseId" render={({ field }) => <SelectField id="live-course" label="Course" options={[{ value: "", label: courses ? "Choose a course" : "Loading your courses…" }, ...(courses ?? []).map((c) => ({ value: c.id, label: c.title }))]} value={field.value} onChange={(v: string) => field.onChange(v)} error={err.courseId?.message} />} />
          <InputField id="live-title" label="Title" required placeholder="e.g. Weekly Q&A" error={err.title?.message} {...register("title")} />
          <div className="grid gap-4 sm:grid-cols-3">
            <InputField id="live-date" type="date" label="Date" error={err.date?.message} {...register("date")} />
            <InputField id="live-start" type="time" label="Start time" error={err.startTime?.message} {...register("startTime")} />
            <Controller control={control} name="durationMinutes" render={({ field }) => <SelectField id="live-duration" label="Duration" options={DURATIONS} value={String(field.value)} onChange={(v: string) => field.onChange(Number(v))} error={err.durationMinutes?.message} />} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Controller control={control} name="platform" render={({ field }) => <SelectField id="live-platform" label="Platform" options={LIVE_PLATFORMS.map((p) => ({ value: p, label: PLATFORM_LABEL[p] }))} value={field.value} onChange={(v: string) => field.onChange(v)} error={err.platform?.message} />} />
            <InputField id="live-link" type="url" label="Meeting link" required placeholder="https://meet.google.com/abc-defg-hij" leftElement={<Link2 className="h-4 w-4" />} containerClassName="sm:col-span-2" error={err.meetingUrl?.message} {...register("meetingUrl")} />
          </div>
          <div>
            <label htmlFor="live-desc" className="mb-2 block body-sm-regular text-primary-400">
              Description (optional)
            </label>
            <TextAreaField id="live-desc" rows={3} placeholder="What you'll cover, what to prepare…" error={err.description?.message} {...register("description")} />
          </div>
        </form>
      )}
    </ModalShell>
  );
}

export default LiveClassModal;
