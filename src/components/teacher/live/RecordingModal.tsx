"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Link2, PlayCircle } from "lucide-react";
import { apiErrorMessage } from "@/lib/apiError";
import { teacherApi } from "@/lib/api/teacher";
import type { TeacherLive } from "@/types/teacher";
import { recordingSchema, type RecordingValues } from "@/validations/teacherContentSchema";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { PrimaryButton } from "@/components/ui/primary-button";

/** Add / change / clear the recording link of a finished class (learners see it on their dashboard). */
export function RecordingModal({ live, onClose, onSaved }: { live: TeacherLive | null; onClose: () => void; onSaved: () => void }) {
  const { register, handleSubmit, reset, formState } = useForm<RecordingValues>({ resolver: zodResolver(recordingSchema) });
  useEffect(() => {
    if (live) reset({ recordingUrl: live.recordingUrl ?? "" });
  }, [live, reset]);

  const onSubmit = async (v: RecordingValues) => {
    if (!live) return;
    const id = toast.loading("Saving the recording…");
    try {
      await teacherApi.setRecording(live.id, v.recordingUrl);
      toast.success(v.recordingUrl ? "Recording added" : "Recording removed", { id, description: live.title });
      onSaved();
      onClose();
    } catch (e) {
      toast.error("Couldn't save the recording", { id, description: apiErrorMessage(e) });
    }
  };

  return (
    <ModalShell
      isOpen={!!live}
      onClose={onClose}
      title="Class recording"
      subtitle={live?.title}
      titleIcon={<PlayCircle className="h-5 w-5" />}
      maxWidth="md"
      footer={
        <div className="flex w-full justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 rounded-lg border border-dash bg-white px-4 body-sm-medium text-primary-500 hover:border-primary-300">
            Cancel
          </button>
          <PrimaryButton type="submit" form="recording-form" isLoading={formState.isSubmitting}>
            Save
          </PrimaryButton>
        </div>
      }
    >
      <form id="recording-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputField id="recording-url" type="url" label="Recording link" placeholder="https://www.youtube.com/watch?v=… (leave empty to remove)" leftElement={<Link2 className="h-4 w-4" />} error={formState.errors.recordingUrl?.message} {...register("recordingUrl")} />
      </form>
    </ModalShell>
  );
}

export default RecordingModal;
