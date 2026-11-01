"use client";

import React from "react";
import { motion } from "framer-motion";
import { Ban, CalendarClock, Copy, FilePen, Pencil, XCircle } from "lucide-react";
import type { Broadcast } from "@/types/notification";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { cn } from "@/lib/cn";
import { formatDateTime, relativeTime } from "./broadcastFormat";

export interface BroadcastStatusCalloutProps {
  broadcast: Broadcast;
  busy: boolean;
  onCancel: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
}

/** Scheduled: "Sends {date} — {in X}" + Cancel · Draft: "Not sent yet" + Edit · Cancelled: notice + Duplicate. */
export function BroadcastStatusCallout({ broadcast: b, busy, onCancel, onEdit, onDuplicate }: BroadcastStatusCalloutProps) {
  if (b.status === "SENT") return null;

  const config =
    b.status === "SCHEDULED"
      ? {
          box: "bg-blue-14 border-blue/30",
          iconBox: "bg-white text-blue",
          icon: <CalendarClock className="h-5 w-5" />,
          title: b.sendAt ? `Sends ${formatDateTime(b.sendAt)} — ${relativeTime(b.sendAt)}` : "Scheduled",
          message: "You can still edit the message or cancel it until then. Delivery analytics appear once it's sent.",
          action: (
            <CardActionButton icon={<Ban />} onClick={onCancel} disabled={busy}>
              Cancel broadcast
            </CardActionButton>
          ),
        }
      : b.status === "DRAFT"
        ? {
            box: "bg-gray-bg border-dash",
            iconBox: "bg-white text-primary-400",
            icon: <FilePen className="h-5 w-5" />,
            title: "Not sent yet",
            message: "This is a draft. Finish the message, then send it now or schedule it.",
            action: (
              <CardActionButton icon={<Pencil />} onClick={onEdit} disabled={busy}>
                Edit draft
              </CardActionButton>
            ),
          }
        : {
            box: "bg-red-14 border-red/30",
            iconBox: "bg-white text-red",
            icon: <XCircle className="h-5 w-5" />,
            title: "This broadcast was cancelled",
            message: "It was never sent. Duplicate it to edit and send it again.",
            action: (
              <CardActionButton icon={<Copy />} onClick={onDuplicate} disabled={busy}>
                Duplicate
              </CardActionButton>
            ),
          };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("@container flex flex-col gap-3 rounded-xl border p-4", config.box)}
    >
      <div className="flex flex-col gap-3 @xl:flex-row @xl:items-center">
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", config.iconBox)}>{config.icon}</span>
        <div className="min-w-0 flex-1">
          <p className="body-medium font-semibold! text-primary-500">{config.title}</p>
          <p className="mt-0.5 body-sm-regular text-primary-400">{config.message}</p>
        </div>
        <div className="shrink-0">{config.action}</div>
      </div>
    </motion.div>
  );
}

export default BroadcastStatusCallout;
