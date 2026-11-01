"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import type { NotificationTemplateItem } from "@/types/notification";
import { setTemplateEnabled } from "@/lib/notificationStorage";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { LockedHint } from "./LockedHint";
import { errorText } from "./templateUtils";

/** Enabled toggle for one template (optimistic, loading → success / error toast). Locked templates: lock + disabled toggle. */
export function TemplateEnabledCell({ template }: { template: NotificationTemplateItem }) {
  const [pending, setPending] = useState<boolean | null>(null);
  const checked = pending ?? template.enabled;

  const onChange = async (next: boolean) => {
    setPending(next);
    const toastId = toast.loading(next ? "Turning on..." : "Turning off...", { description: template.name });
    try {
      await setTemplateEnabled(template.id, next);
      toast.success(next ? "Template enabled" : "Template disabled", {
        id: toastId,
        description: next ? `"${template.name}" will be sent automatically.` : `"${template.name}" won't be sent until you turn it back on.`,
      });
    } catch (err) {
      toast.error("Couldn't update the template", { id: toastId, description: errorText(err) });
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <ToggleSwitch
        checked={template.locked ? true : checked}
        onChange={(v) => void onChange(v)}
        disabled={template.locked || pending !== null}
        tone="orange"
      />
      {template.locked && <LockedHint />}
    </div>
  );
}

export default TemplateEnabledCell;
