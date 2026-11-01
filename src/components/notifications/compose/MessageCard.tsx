"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Link2, MessageSquareText, MousePointerClick, Pin } from "lucide-react";
import type { NotificationPriority } from "@/types/notification";
import { BROADCAST_MESSAGE_MAX, BROADCAST_TITLE_MAX, PUSH_MESSAGE_MAX, type BroadcastFormValues } from "@/validations/notificationSchema";
import { plainLength } from "@/lib/notificationStats";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { InputField } from "@/components/ui/InputField";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { CharCounter } from "@/components/ui/CharCounter";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import { FieldError, FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import { cn } from "@/lib/cn";

const CTA_LABEL_MAX = 30;

const PRIORITY_OPTIONS: ChoiceOption<NotificationPriority>[] = [
  { value: "NORMAL", title: "Normal" },
  { value: "HIGH", title: "High" },
];

/** Title, rich-text message (with push limit), priority and optional call-to-action. */
export function MessageCard() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BroadcastFormValues>();
  const [title, messageHtml, channels, priority, ctaLabel] = useWatch({ control, name: ["title", "messageHtml", "channels", "priority", "ctaLabel"] });
  const length = plainLength(messageHtml ?? "");
  const pushOn = (channels ?? []).includes("PUSH");
  const pushOver = pushOn && length > PUSH_MESSAGE_MAX;

  return (
    <IconSectionCard icon={<MessageSquareText className="h-5 w-5" />} title="Message" description="What recipients will read." tone="orange">
      <div className="space-y-4">
        <div>
          <FieldLabel htmlFor="broadcast-title" label="Title" required count={(title ?? "").length} max={BROADCAST_TITLE_MAX} />
          <InputField
            id="broadcast-title"
            placeholder="e.g. New course: Advanced React Patterns is live"
            maxLength={BROADCAST_TITLE_MAX + 20}
            aria-invalid={!!errors.title}
            error={errors.title?.message}
            {...register("title")}
          />
        </div>

        <div id="broadcast-message">
          <FieldLabel label="Message" required />
          <Controller
            control={control}
            name="messageHtml"
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} placeholder="Write the announcement your students will see..." minHeight="140px" />
            )}
          />
          <div className="mt-1 flex items-start justify-between gap-3">
            <FieldError message={errors.messageHtml?.message} />
            <div className="ml-auto flex shrink-0 items-center gap-3">
              {pushOn && (
                <p className={cn("body-xsm-regular tabular-nums whitespace-nowrap", pushOver ? "text-red" : "text-primary-300")} aria-live="polite">
                  Push: {length}/{PUSH_MESSAGE_MAX}
                </p>
              )}
              <CharCounter count={length} max={BROADCAST_MESSAGE_MAX} />
            </div>
          </div>
          <AnimatePresence initial={false}>
            {pushOver && !errors.messageHtml && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="mt-2 flex items-start gap-2 rounded-lg border border-yellow/30 bg-yellow-bg px-3 py-2 body-xsm-regular text-yellow"
              >
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Push notifications are cut off after {PUSH_MESSAGE_MAX} characters. Shorten the message or turn off Push.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <FieldLabel label="Priority" />
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <ChoiceCardGroup name="broadcast-priority" aria-label="Priority" variant="inline" value={field.value} onChange={field.onChange} options={PRIORITY_OPTIONS} />
            )}
          />
          <AnimatePresence initial={false}>
            {priority === "HIGH" && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <span className="mt-2.5 flex items-center gap-2 rounded-lg bg-red-14 px-3 py-2 body-xsm-regular text-red">
                  <Pin className="h-3.5 w-3.5 shrink-0" />
                  Shown pinned and with a red badge.
                </span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="rounded-xl border border-dash p-4">
          <p className="body-sm-medium font-semibold! text-primary-500">
            Call-to-action <span className="body-xsm-regular text-primary-300">(Optional)</span>
          </p>
          <p className="mt-0.5 body-xsm-regular text-primary-300">Adds a button to the in-app card and email. Fill in both fields or leave both empty.</p>
          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="md:col-span-2">
              <FieldLabel htmlFor="broadcast-cta-label" label="Button label" count={(ctaLabel ?? "").length} max={CTA_LABEL_MAX} />
              <InputField
                id="broadcast-cta-label"
                placeholder="e.g. View course"
                maxLength={CTA_LABEL_MAX + 10}
                leftElement={<MousePointerClick className="h-4 w-4" />}
                aria-invalid={!!errors.ctaLabel}
                error={errors.ctaLabel?.message}
                {...register("ctaLabel")}
              />
            </div>
            <div className="md:col-span-3">
              <FieldLabel htmlFor="broadcast-cta-url" label="Link" />
              <InputField
                id="broadcast-cta-url"
                placeholder="https://… or /courses/advanced-react"
                leftElement={<Link2 className="h-4 w-4" />}
                aria-invalid={!!errors.ctaUrl}
                error={errors.ctaUrl?.message}
                {...register("ctaUrl")}
              />
            </div>
          </div>
        </div>
      </div>
    </IconSectionCard>
  );
}

export default MessageCard;
