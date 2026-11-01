import React from "react";
import { Bell, Mail, Smartphone, type LucideIcon } from "lucide-react";
import type { NotificationChannel } from "@/types/notification";
import { CHANNEL_LABEL } from "@/lib/notificationStats";
import { ToneBadge, type Tone } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";

export const CHANNEL_ICON: Record<NotificationChannel, LucideIcon> = { IN_APP: Bell, EMAIL: Mail, PUSH: Smartphone };
const CHANNEL_TONE: Record<NotificationChannel, Tone> = { IN_APP: "orange", EMAIL: "blue", PUSH: "purple" };
const ORDER: NotificationChannel[] = ["IN_APP", "EMAIL", "PUSH"];

export interface ChannelBadgesProps {
  channels: NotificationChannel[];
  className?: string;
}

/** Small single-line badges (In-app / Email / Push) with icons, always in the same order. */
export function ChannelBadges({ channels, className }: ChannelBadgesProps) {
  const list = ORDER.filter((c) => channels.includes(c));
  return (
    <span className={cn("inline-flex flex-wrap items-center gap-1.5", className)}>
      {list.map((c) => {
        const Icon = CHANNEL_ICON[c];
        return (
          <ToneBadge key={c} tone={CHANNEL_TONE[c]} size="sm" icon={<Icon className="h-3 w-3" />}>
            {CHANNEL_LABEL[c]}
          </ToneBadge>
        );
      })}
    </span>
  );
}

export default ChannelBadges;
