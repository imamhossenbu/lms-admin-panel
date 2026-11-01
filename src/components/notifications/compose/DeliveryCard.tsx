"use client";

import React, { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, Globe2, Send, Zap } from "lucide-react";
import type { BroadcastFormValues } from "@/validations/notificationSchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { InputField } from "@/components/ui/InputField";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import { FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import { localTimeZone, minScheduleInput } from "./composeUtils";

const ICON = "h-5 w-5 text-brand-orange";

const TIMING_OPTIONS: ChoiceOption<BroadcastFormValues["timing"]>[] = [
  { value: "NOW", title: "Send now", description: "Delivered as soon as you confirm.", icon: <Zap className={ICON} /> },
  { value: "SCHEDULE", title: "Schedule", description: "Pick a date and time to send it.", icon: <CalendarClock className={ICON} /> },
];

/** Send now / Schedule (+ datetime-local, at least 5 minutes ahead). */
export function DeliveryCard() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<BroadcastFormValues>();
  const timing = useWatch({ control, name: "timing" });
  const [min] = useState(minScheduleInput);
  const [zone] = useState(localTimeZone);

  return (
    <IconSectionCard icon={<Send className="h-5 w-5" />} title="Delivery" description="Send it right away or schedule it for later." tone="green">
      <div className="space-y-4">
        <Controller
          control={control}
          name="timing"
          render={({ field }) => (
            <ChoiceCardGroup name="broadcast-timing" aria-label="Delivery" value={field.value} onChange={field.onChange} options={TIMING_OPTIONS} columns={2} />
          )}
        />
        <AnimatePresence initial={false}>
          {timing === "SCHEDULE" && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="sm:max-w-sm">
                <FieldLabel htmlFor="broadcast-scheduled-at" label="Send on" required />
                <InputField
                  id="broadcast-scheduled-at"
                  type="datetime-local"
                  min={min}
                  leftElement={<CalendarClock className="h-4 w-4" />}
                  aria-invalid={!!errors.scheduledAt}
                  error={errors.scheduledAt?.message}
                  {...register("scheduledAt")}
                />
                <p className="mt-1.5 flex items-center gap-1.5 body-xsm-regular text-primary-300">
                  <Globe2 className="h-3.5 w-3.5 shrink-0" />
                  Your local time{zone ? ` (${zone})` : ""}. At least 5 minutes from now.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </IconSectionCard>
  );
}

export default DeliveryCard;
