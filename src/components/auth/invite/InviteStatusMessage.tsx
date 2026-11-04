"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, LinkIcon } from "lucide-react";

/** Shown instead of the form when the link is invalid / already used, or expired. */
export function InviteStatusMessage({ kind, message }: { kind: "invalid" | "expired"; message?: string }) {
  const Icon = kind === "expired" ? Clock : LinkIcon;
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-4 text-center">
      <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${kind === "expired" ? "bg-yellow-bg text-yellow" : "bg-red-14 text-red"}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <p className="title-medium text-primary-500">{kind === "expired" ? "This invitation has expired" : "This invitation link isn't valid"}</p>
        <p className="body-sm-regular text-primary-300">
          {message ?? (kind === "expired" ? "Ask the person who invited you to send a new invitation." : "It may have been used already, revoked, or copied incompletely.")}
        </p>
      </div>
      <Link href="/login" className="inline-flex body-sm-medium text-brand-orange hover:text-brand-orange-hover hover:underline">
        Go to sign in
      </Link>
    </motion.div>
  );
}

export default InviteStatusMessage;
