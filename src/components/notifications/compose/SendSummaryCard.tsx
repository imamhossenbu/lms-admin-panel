"use client";

import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { ClipboardList, FlaskConical } from "lucide-react";
import type { BroadcastFormValues } from "@/validations/notificationSchema";
import { sendTestNotification, useRecipientEstimate } from "@/lib/notificationStorage";
import { useCourseCatalog } from "@/lib/courseCatalog";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { errorText, sendSummary } from "./composeUtils";

/** "Sends now to ≈ 32 students in HTML Fundamentals via In-app and Email" + Send test. */
export function SendSummaryCard() {
  const { control, getValues } = useFormContext<BroadcastFormValues>();
  const [audience, courseIds, channels, timing, scheduledAt, priority] = useWatch({
    control,
    name: ["audience", "courseIds", "channels", "timing", "scheduledAt", "priority"],
  });
  const [testing, setTesting] = useState(false);
  const v = { audience: audience ?? "ALL_STUDENTS", courseIds: courseIds ?? [], channels: channels ?? [], timing: timing ?? "NOW", scheduledAt: scheduledAt ?? "" };
  useCourseCatalog(); // course titles in the summary
  const estimate = useRecipientEstimate(v.audience, v.courseIds);
  const s = sendSummary(v, estimate ?? 0);

  const sendTest = async () => {
    const { title, messageHtml, ctaLabel, ctaUrl } = getValues();
    if (!title.trim() || !messageHtml.replace(/<[^>]*>/g, "").trim()) {
      toast.error("Nothing to test yet", { description: "Add a title and a message first." });
      return;
    }
    setTesting(true);
    const toastId = toast.loading("Sending test...", { description: "Only you will receive it." });
    try {
      const to = await sendTestNotification({ kind: "broadcast", values: { title, messageHtml, ctaLabel, ctaUrl } });
      toast.success("Test sent", { id: toastId, description: `Check ${to} and your notification bell.` });
    } catch (err) {
      toast.error("Couldn't send the test", { id: toastId, description: errorText(err) });
    } finally {
      setTesting(false);
    }
  };

  return (
    <IconSectionCard
      icon={<ClipboardList className="h-5 w-5" />}
      title="Summary"
      description="Double-check before sending."
      tone="blue"
      action={priority === "HIGH" ? <ToneBadge tone="red" size="sm">High priority</ToneBadge> : undefined}
    >
      <div className="space-y-4">
        <p className="body-sm-regular text-primary-400" aria-live="polite">
          {s.incomplete ? (
            "Select at least one course to see who receives it."
          ) : (
            <>
              <span className="body-sm-medium font-semibold! text-primary-500">{s.when}</span> to{" "}
              <span className="body-sm-medium font-semibold! text-primary-500">
                ≈ {estimate === null ? "…" : s.count.toLocaleString()} {s.noun}
              </span>{" "}
              via <span className="body-sm-medium font-semibold! text-primary-500">{s.via}</span>.
            </>
          )}
        </p>
        <SecondaryButton type="button" fullWidth onClick={sendTest} isLoading={testing} disabled={testing} leftIcon={<FlaskConical className="h-4 w-4" />}>
          {testing ? "Sending test..." : "Send test to me"}
        </SecondaryButton>
      </div>
    </IconSectionCard>
  );
}

export default SendSummaryCard;
