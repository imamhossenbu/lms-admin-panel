"use client";

import React from "react";
import { CheckCheck, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

export interface NotificationsHeaderProps {
  unread: number;
  onMarkAllRead: () => void;
  onNewBroadcast: () => void;
}

/** 🏠 › Notifications, title + subtitle, "Mark all as read" (only with unread items) and "+ New Broadcast". */
export function NotificationsHeader({ unread, onMarkAllRead, onNewBroadcast }: NotificationsHeaderProps) {
  return (
    <PageHeader
      className="mb-0"
      breadcrumbs={[{ label: "Notifications" }]}
      title={<span className="heading-h3 font-bold! text-primary-500">Notifications</span>}
      subtitle="Your inbox, student broadcasts and automated messages."
    >
      {unread > 0 && (
        <SecondaryButton leftIcon={<CheckCheck className="h-4 w-4" />} onClick={onMarkAllRead}>
          Mark all as read
        </SecondaryButton>
      )}
      <PrimaryButton leftIcon={<Plus className="h-4 w-4" />} onClick={onNewBroadcast}>
        New Broadcast
      </PrimaryButton>
    </PageHeader>
  );
}

export default NotificationsHeader;
