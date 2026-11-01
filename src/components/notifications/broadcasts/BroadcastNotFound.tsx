"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Megaphone, SearchX } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PrimaryButton } from "@/components/ui/primary-button";

export const BROADCASTS_LIST_HREF = "/notifications?tab=broadcasts";

/** Shown when the broadcast id doesn't exist (or it was deleted). */
export function BroadcastNotFound() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Notifications", href: "/notifications" }, { label: "Broadcasts", href: BROADCASTS_LIST_HREF }, { label: "Broadcast not found" }]} />
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="dashboard-card mx-auto flex max-w-lg flex-col items-center gap-4 p-10 text-center"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-14 text-red">
          <SearchX className="h-8 w-8" />
        </span>
        <div>
          <h1 className="heading-h4 font-bold! text-primary-500">Broadcast not found</h1>
          <p className="mt-1.5 body-sm-regular text-primary-300">It may have been deleted, or the link is incorrect.</p>
        </div>
        <PrimaryButton leftIcon={<Megaphone />} onClick={() => router.push(BROADCASTS_LIST_HREF)}>
          Go to Broadcasts
        </PrimaryButton>
      </motion.div>
    </div>
  );
}

export default BroadcastNotFound;
