"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import type { LessonFormValues } from "@/validations/lessonFormSchema";

/** Local "YYYY-MM-DDTHH:mm" for the datetime-local `min` attribute. */
const nowLocalInputValue = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

/** Publish date/time picker shown when visibility is "Scheduled". */
export function ScheduledAtField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<LessonFormValues>();
  const [min] = useState(nowLocalInputValue);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <div className="pt-3 sm:max-w-xs">
        <InputField
          id="lesson-scheduled-at"
          type="datetime-local"
          label="Publish date & time"
          required
          min={min}
          leftElement={<CalendarClock className="h-4 w-4" />}
          error={errors.scheduledAt?.message}
          {...register("scheduledAt")}
        />
      </div>
    </motion.div>
  );
}

export default ScheduledAtField;
