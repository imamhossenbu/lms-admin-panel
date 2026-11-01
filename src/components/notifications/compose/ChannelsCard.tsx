"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Bell, Mail, Radio, Smartphone } from "lucide-react";
import type { NotificationChannel } from "@/types/notification";
import type { BroadcastFormValues } from "@/validations/notificationSchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { FieldError } from "@/components/courses/create/basic/FieldLabel";
import { ChannelCheckboxCard } from "./ChannelCheckboxCard";

export const CHANNEL_OPTIONS: { value: NotificationChannel; title: string; description: string; icon: React.ReactNode }[] = [
  { value: "IN_APP", title: "In-app", description: "Bell + inbox", icon: <Bell className="h-4 w-4" /> },
  { value: "EMAIL", title: "Email", description: "Sent to their email", icon: <Mail className="h-4 w-4" /> },
  { value: "PUSH", title: "Push", description: "Mobile & browser", icon: <Smartphone className="h-4 w-4" /> },
];

/** In-app / Email / Push checkbox cards (at least one). Keeps the channel order stable. */
export function ChannelsCard() {
  const { control } = useFormContext<BroadcastFormValues>();

  return (
    <IconSectionCard icon={<Radio className="h-5 w-5" />} title="Channels" description="Where the broadcast is delivered. Pick at least one." tone="purple">
      <Controller
        control={control}
        name="channels"
        render={({ field, fieldState }) => {
          const toggle = (c: NotificationChannel) => {
            const next = field.value.includes(c) ? field.value.filter((x) => x !== c) : [...field.value, c];
            field.onChange(CHANNEL_OPTIONS.map((o) => o.value).filter((v) => next.includes(v)));
          };
          return (
            <div id="broadcast-channels">
              <div role="group" aria-label="Channels" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {CHANNEL_OPTIONS.map((o) => (
                  <ChannelCheckboxCard key={o.value} title={o.title} description={o.description} icon={o.icon} checked={field.value.includes(o.value)} onToggle={() => toggle(o.value)} />
                ))}
              </div>
              <FieldError message={fieldState.error?.message} />
            </div>
          );
        }}
      />
    </IconSectionCard>
  );
}

export default ChannelsCard;
