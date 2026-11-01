import { z } from "zod";
import { liveClassSchema } from "@/validations/liveClassSchema";
import type { LiveClassItem, LiveClassSettings, ReminderOffset } from "@/types/liveClass";

/**
 * Settings tab form — the settings / reminder / capacity / sendLinkToStudents slice of liveClassSchema
 * (same field rules + the same "sendReminder needs a reminder time" rule) plus: capacity can't drop
 * below the number of students who already attended.
 */
export const buildSettingsSchema = (attended: number) =>
  z
    .object({
      settings: liveClassSchema.shape.settings,
      reminder: liveClassSchema.shape.reminder,
      capacity: liveClassSchema.shape.capacity,
      sendLinkToStudents: liveClassSchema.shape.sendLinkToStudents,
    })
    .superRefine((v, ctx) => {
      if (v.settings.sendReminder && v.reminder === "NONE")
        ctx.addIssue({ code: "custom", path: ["reminder"], message: "Choose when to send the reminder" });
      if (Number.isFinite(v.capacity) && v.capacity < attended)
        ctx.addIssue({
          code: "custom",
          path: ["capacity"],
          message: `Capacity can't be lower than the ${attended} student${attended === 1 ? "" : "s"} who already attended`,
        });
    });

export type LiveSettingsValues = z.infer<ReturnType<typeof buildSettingsSchema>>;

export const settingsValuesOf = (c: LiveClassItem): LiveSettingsValues => ({
  settings: { ...c.settings },
  reminder: c.reminder,
  capacity: c.capacity,
  sendLinkToStudents: c.sendLinkToStudents,
});

export const SETTING_ROWS: { key: keyof LiveClassSettings; title: string; description: string }[] = [
  { key: "allowQa", title: "Allow Q&A", description: "Students can ask questions during the session." },
  { key: "enableChat", title: "Enable Chat", description: "Open the live chat for everyone in the class." },
  { key: "recordClass", title: "Record Class", description: "Record the session so it can be shared as a resource." },
  { key: "makePublic", title: "Make Class Public", description: "Anyone with the link can view the class page." },
  { key: "sendReminder", title: "Send Reminder", description: "Email enrolled students before the class starts." },
  { key: "autoAttendance", title: "Auto Attendance", description: "Mark students attended automatically when they join." },
];

export const REMINDER_OPTIONS: { value: Exclude<ReminderOffset, "NONE">; label: string }[] = [
  { value: "5", label: "5 minutes before" },
  { value: "15", label: "15 minutes before" },
  { value: "30", label: "30 minutes before" },
  { value: "60", label: "1 hour before" },
  { value: "1440", label: "1 day before" },
];
