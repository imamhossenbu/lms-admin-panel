"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CalendarDays, Clock, Info, Lock } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { InputField } from "@/components/ui/InputField";
import { FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import type { LiveClassFormValues } from "@/validations/liveClassSchema";
import { cn } from "@/lib/cn";
import { durationLabel, formDuration } from "./liveFormUtils";

export interface DateTimeCardProps {
  /** Class already started / finished: date & time are read-only. */
  locked?: boolean;
}

/** Date, Start Time, End Time + live "Class duration" strip. */
export function DateTimeCard({ locked = false }: DateTimeCardProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<LiveClassFormValues>();
  const [startTime, endTime] = useWatch({ control, name: ["startTime", "endTime"] });
  const minutes = formDuration(startTime ?? "", endTime ?? "");

  const fields = [
    { name: "date" as const, label: "Date", type: "date", icon: <CalendarDays className="h-4 w-4" /> },
    { name: "startTime" as const, label: "Start Time", type: "time", icon: <Clock className="h-4 w-4" /> },
    { name: "endTime" as const, label: "End Time", type: "time", icon: <Clock className="h-4 w-4" /> },
  ];

  return (
    <IconSectionCard icon={<CalendarDays className="h-5 w-5" />} title="Date & Time" description="When the session starts and ends (your local time)." tone="purple">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {fields.map((f) => (
            <div key={f.name}>
              <FieldLabel htmlFor={`live-${f.name}`} label={f.label} required />
              <InputField
                id={`live-${f.name}`}
                type={f.type}
                readOnly={locked}
                aria-readonly={locked}
                aria-invalid={!!errors[f.name]}
                leftElement={f.icon}
                className={cn(locked && "bg-slate-50 text-primary-300 cursor-not-allowed")}
                error={errors[f.name]?.message}
                {...register(f.name)}
              />
            </div>
          ))}
        </div>

        <div className={cn("flex items-center gap-2.5 rounded-lg px-3.5 py-2.5", minutes ? "bg-blue-14" : "bg-slate-50 border border-dash")}>
          <Info className={cn("h-4 w-4 shrink-0", minutes ? "text-blue" : "text-primary-300")} />
          <p className="body-sm-regular text-primary-400">
            {minutes ? (
              <>
                Class duration: <span className="body-sm-medium font-semibold! text-primary-500">{durationLabel(minutes)}</span>
              </>
            ) : (
              "Class duration will be calculated automatically."
            )}
          </p>
        </div>

        {locked && (
          <div className="flex items-start gap-2.5 rounded-lg border border-yellow/30 bg-yellow-bg px-3.5 py-2.5">
            <Lock className="h-4 w-4 shrink-0 text-yellow mt-0.5" />
            <p className="body-sm-regular text-primary-400">
              This class has already started, so its date and time can&apos;t be changed. You can still update the other details.
            </p>
          </div>
        )}
      </div>
    </IconSectionCard>
  );
}

export default DateTimeCard;
