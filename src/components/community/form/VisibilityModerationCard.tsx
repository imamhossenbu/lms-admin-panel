"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ShieldCheck } from "lucide-react";
import type { ThreadFormValues } from "@/validations/communitySchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";

const ROWS: { key: "isPinned" | "isLocked"; title: string; description: string }[] = [
  { key: "isPinned", title: "Pin to top", description: "Show above other discussions" },
  { key: "isLocked", title: "Lock replies", description: "Students can't reply" },
];

/** Pin to top + Lock replies toggles. */
export function VisibilityModerationCard() {
  const { control } = useFormContext<ThreadFormValues>();
  return (
    <IconSectionCard icon={<ShieldCheck className="h-5 w-5" />} title="Visibility & Moderation" tone="purple">
      <div className="space-y-4">
        {ROWS.map((row) => (
          <Controller
            key={row.key}
            control={control}
            name={row.key}
            render={({ field }) => (
              <SettingToggleRow id={`thread-${row.key}`} title={row.title} description={row.description} checked={field.value} onChange={field.onChange} />
            )}
          />
        ))}
      </div>
    </IconSectionCard>
  );
}

export default VisibilityModerationCard;
