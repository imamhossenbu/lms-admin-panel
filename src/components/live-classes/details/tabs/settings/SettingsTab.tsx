"use client";

import React, { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ban } from "lucide-react";
import { toast } from "sonner";
import { ProTipCard } from "@/components/ui/ProTipCard";
import { updateLiveClass } from "@/lib/liveClassStorage";
import { attendanceStats } from "@/lib/liveClassStats";
import type { LiveTabProps } from "../../liveTabTypes";
import { LiveTabColumns } from "../qa/LiveTabColumns";
import { errorText } from "../qa/liveTabFormat";
import { ClassSettingsCard } from "./ClassSettingsCard";
import { ReminderSettingsCard } from "./ReminderSettingsCard";
import { SeatsAccessCard } from "./SeatsAccessCard";
import { SettingsSaveBar } from "./SettingsSaveBar";
import { buildSettingsSchema, settingsValuesOf, type LiveSettingsValues } from "./settingsForm";

const FORM_ID = "live-class-settings-form";

/** Settings tab: class toggles, reminder timing, seats & access — saved with updateLiveClass. */
export function SettingsTab({ bundle, status }: LiveTabProps) {
  const { liveClass, enrollments } = bundle;
  const att = attendanceStats(enrollments);
  const schema = useMemo(() => buildSettingsSchema(att.attended), [att.attended]);
  const cancelled = status === "CANCELLED";

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<LiveSettingsValues>({
    resolver: zodResolver(schema),
    defaultValues: settingsValuesOf(liveClass),
  });
  const sendReminder = useWatch({ control, name: "settings.sendReminder" });

  // Pick up changes saved elsewhere (header edit, other tabs) unless the admin has unsaved edits here.
  useEffect(() => {
    if (!isDirty) reset(settingsValuesOf(liveClass));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveClass.updatedAt]);

  const onSubmit = async (values: LiveSettingsValues) => {
    const toastId = toast.loading("Saving settings...", { description: liveClass.title });
    try {
      await updateLiveClass(liveClass.id, {
        settings: values.settings,
        reminder: values.reminder,
        capacity: values.capacity,
        sendLinkToStudents: values.sendLinkToStudents,
      });
      reset(values);
      toast.success("Settings saved", { id: toastId, description: "Class settings were updated for all enrolled students." });
    } catch (e) {
      toast.error("Couldn't save settings", { id: toastId, description: errorText(e) });
    }
  };

  return (
    <LiveTabColumns
      main={
        <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {cancelled && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red/30 bg-red-14 p-3.5">
              <Ban className="mt-0.5 h-4 w-4 shrink-0 text-red" />
              <p className="body-sm-regular text-red-dark">This class is cancelled. Restore it from the header menu to change its settings.</p>
            </div>
          )}
          <ClassSettingsCard control={control} disabled={cancelled} />
          <ReminderSettingsCard control={control} errors={errors} sendReminder={sendReminder} disabled={cancelled} />
          <SeatsAccessCard control={control} register={register} errors={errors} enrolled={att.enrolled} attended={att.attended} disabled={cancelled} />
          <SettingsSaveBar visible={isDirty && !cancelled} isSaving={isSubmitting} onDiscard={() => reset(settingsValuesOf(liveClass))} formId={FORM_ID} />
        </form>
      }
      side={
        <ProTipCard title="Settings tips">
          <ul className="list-disc space-y-1.5 pl-4">
            <li>Keep &quot;Record Class&quot; on so the recording can be shared from the Resources tab.</li>
            <li>A 15-minute reminder gives students time to join without forgetting.</li>
            <li>&quot;Auto Attendance&quot; marks students attended as soon as they join the meeting.</li>
            <li>Turning off Q&amp;A hides the question box for students during the session.</li>
          </ul>
        </ProTipCard>
      }
    />
  );
}

export default SettingsTab;
