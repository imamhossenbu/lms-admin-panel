"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Copy, Info } from "lucide-react";
import type { Broadcast } from "@/types/notification";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { composeBreadcrumbs } from "./ComposeHeader";

export interface BroadcastNotEditableProps {
  broadcast: Broadcast;
}

/** SENT / CANCELLED broadcasts can't be edited — point to the detail page to duplicate instead. */
export function BroadcastNotEditable({ broadcast }: BroadcastNotEditableProps) {
  const router = useRouter();
  const detail = `/notifications/broadcasts/${broadcast.id}`;
  const sent = broadcast.status === "SENT";

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 pb-8">
      <Breadcrumb items={composeBreadcrumbs("edit", broadcast.id, broadcast.title)} />
      <div className="dashboard-card shadow-2xs p-10 flex flex-col items-center text-center gap-3">
        <span className="w-12 h-12 rounded-full bg-blue-14 text-blue flex items-center justify-center">
          <Info className="w-6 h-6" />
        </span>
        <ToneBadge tone={sent ? "green" : "gray"} size="sm" dot>
          {sent ? "Sent" : "Cancelled"}
        </ToneBadge>
        <h2 className="heading-h5 font-bold! text-primary-500">This broadcast can&apos;t be edited</h2>
        <p className="body-sm-regular text-primary-300 max-w-md">
          {sent
            ? "It has already been delivered, so its content is kept as-is for reporting."
            : "It was cancelled before sending."}{" "}
          Duplicate it from the{" "}
          <Link href={detail} className="body-sm-medium text-brand-orange hover:text-brand-orange-hover underline-offset-2 hover:underline">
            broadcast details
          </Link>{" "}
          to send an updated copy.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <SecondaryButton onClick={() => router.push("/notifications?tab=broadcasts")}>All Broadcasts</SecondaryButton>
          <PrimaryButton leftIcon={<Copy className="h-4 w-4" />} onClick={() => router.push(detail)}>
            Duplicate instead
          </PrimaryButton>
        </div>
      </div>
    </motion.div>
  );
}

export default BroadcastNotEditable;
