"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { DRIP_MESSAGE_MAX, type LessonEditorValues } from "@/validations/lessonEditorSchema";
import { RadioOptionList } from "../access/RadioOptionList";
import { BEFORE_RELEASE_OPTIONS } from "./dripOptions";
import { SubSectionHeader } from "./SubSectionHeader";

/** "Access Before Release": locked message vs hidden + message textarea. */
export function BeforeReleaseSection() {
  const { control, register, formState } = useFormContext<LessonEditorValues>();
  const mode = useWatch({ control, name: "drip.beforeRelease" });
  const message = useWatch({ control, name: "drip.lockedMessage" }) ?? "";
  const error = formState.errors.drip?.lockedMessage?.message;

  return (
    <div className="rounded-xl border border-dash p-4">
      <SubSectionHeader icon={<Lock className="h-4 w-4" />} title="Access Before Release" description="Control what students see before this lesson is available." />
      <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
        <Controller
          control={control}
          name="drip.beforeRelease"
          render={({ field }) => (
            <RadioOptionList name="drip-before-release" aria-label="Access before release" value={field.value} onChange={field.onChange} options={BEFORE_RELEASE_OPTIONS} />
          )}
        />
        <AnimatePresence initial={false}>
          {mode === "SHOW_MESSAGE" && (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.2 }}>
              <label htmlFor="drip-locked-message" className="mb-2 block body-sm-regular text-primary-400">
                Locked Message
              </label>
              <TextAreaField
                id="drip-locked-message"
                rows={3}
                maxLength={DRIP_MESSAGE_MAX}
                placeholder="e.g. This lesson will be available 7 days after your enrollment."
                error={error}
                {...register("drip.lockedMessage")}
              />
              <p className={cn("mt-1 text-right body-xsm-regular", message.length > DRIP_MESSAGE_MAX ? "text-red" : "text-primary-300")}>
                {message.length}/{DRIP_MESSAGE_MAX}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default BeforeReleaseSection;
