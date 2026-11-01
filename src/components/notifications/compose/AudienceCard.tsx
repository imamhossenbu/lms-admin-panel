"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, GraduationCap, Moon, UserCheck, Users } from "lucide-react";
import type { BroadcastAudience } from "@/types/notification";
import type { BroadcastFormValues } from "@/validations/notificationSchema";
import { estimateRecipients } from "@/lib/notificationStorage";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import { FieldError, FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import { cn } from "@/lib/cn";
import { CourseChipMultiSelect } from "./CourseChipMultiSelect";
import { audienceNoun } from "./composeUtils";

const ICON = "h-5 w-5 text-brand-orange";

const AUDIENCE_OPTIONS: ChoiceOption<BroadcastAudience>[] = [
  { value: "ALL_STUDENTS", title: "All students", description: "Everyone with an active account.", icon: <Users className={ICON} /> },
  { value: "COURSE", title: "Specific courses", description: "Students enrolled in selected courses.", icon: <BookOpen className={ICON} /> },
  { value: "INSTRUCTORS", title: "Instructors", description: "Everyone who teaches on EduPro.", icon: <GraduationCap className={ICON} /> },
  { value: "INACTIVE_STUDENTS", title: "Inactive students (30+ days)", description: "Win back learners who went quiet.", icon: <Moon className={ICON} /> },
];

/** Who receives the broadcast + live recipient estimate. */
export function AudienceCard() {
  const {
    control,
    formState: { errors },
  } = useFormContext<BroadcastFormValues>();
  const [audience, courseIds] = useWatch({ control, name: ["audience", "courseIds"] });
  const count = estimateRecipients(audience ?? "ALL_STUDENTS", courseIds ?? []);
  const needsCourses = audience === "COURSE" && !(courseIds ?? []).length;

  return (
    <IconSectionCard icon={<Users className="h-5 w-5" />} title="Audience" description="Choose who should receive this broadcast." tone="blue">
      <div className="space-y-4">
        <Controller
          control={control}
          name="audience"
          render={({ field }) => (
            <ChoiceCardGroup name="broadcast-audience" aria-label="Audience" value={field.value} onChange={field.onChange} options={AUDIENCE_OPTIONS} columns={2} />
          )}
        />

        <AnimatePresence initial={false}>
          {audience === "COURSE" && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <FieldLabel label="Courses" required />
              <Controller
                control={control}
                name="courseIds"
                render={({ field, fieldState }) => (
                  <CourseChipMultiSelect id="broadcast-courses" value={field.value} onChange={field.onChange} hasError={!!fieldState.error} />
                )}
              />
              <FieldError message={errors.courseIds?.message} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className={cn("flex items-center gap-2.5 rounded-lg px-3.5 py-2.5", needsCourses ? "border border-dash bg-slate-50" : "bg-blue-14")}>
          <UserCheck className={cn("h-4 w-4 shrink-0", needsCourses ? "text-primary-300" : "text-blue")} />
          <p className="body-sm-regular text-primary-400" aria-live="polite">
            {needsCourses ? (
              "Select at least one course to estimate recipients."
            ) : (
              <>
                <span className="body-sm-medium font-semibold! text-primary-500">≈ {count.toLocaleString()} recipients</span> ·{" "}
                {audienceNoun(audience ?? "ALL_STUDENTS", courseIds ?? [], count)}
              </>
            )}
          </p>
        </div>
      </div>
    </IconSectionCard>
  );
}

export default AudienceCard;
