"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CalendarClock, FileText, Send } from "lucide-react";
import type { BroadcastFormValues } from "@/validations/notificationSchema";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { COMPOSE_FORM_ID } from "./composeUtils";

export type ComposeBusy = "draft" | "send" | null;

export interface ComposeActionButtonsProps {
  busy: ComposeBusy;
  onSaveDraft: () => void;
}

/** "Save as Draft" + orange "Send Now" / "Schedule Broadcast" (submits the form → confirm modal). */
export function ComposeActionButtons({ busy, onSaveDraft }: ComposeActionButtonsProps) {
  const { control } = useFormContext<BroadcastFormValues>();
  const timing = useWatch({ control, name: "timing" });
  const scheduled = timing === "SCHEDULE";

  return (
    <>
      <SecondaryButton type="button" onClick={onSaveDraft} isLoading={busy === "draft"} disabled={!!busy} leftIcon={<FileText className="h-4 w-4" />}>
        {busy === "draft" ? "Saving..." : "Save as Draft"}
      </SecondaryButton>
      <PrimaryButton
        type="submit"
        form={COMPOSE_FORM_ID}
        isLoading={busy === "send"}
        disabled={!!busy}
        leftIcon={scheduled ? <CalendarClock className="h-4 w-4" /> : <Send className="h-4 w-4" />}
      >
        {busy === "send" ? (scheduled ? "Scheduling..." : "Sending...") : scheduled ? "Schedule Broadcast" : "Send Now"}
      </PrimaryButton>
    </>
  );
}

export default ComposeActionButtons;
