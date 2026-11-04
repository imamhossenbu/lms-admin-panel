"use client";

import React from "react";
import { motion } from "framer-motion";
import { HardDrive } from "lucide-react";

/** Shown on tabs whose settings the API can't (fully) store yet: those are kept as a draft in this browser. */
export function LocalDraftNotice({ message }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      role="note"
      data-testid="local-draft-notice"
      className="mb-4 flex items-start gap-2.5 rounded-xl border border-yellow bg-yellow-bg px-4 py-3"
    >
      <HardDrive className="mt-0.5 h-4 w-4 shrink-0 text-yellow" />
      <p className="body-xsm-regular text-primary-400">
        <span className="body-xsm-medium font-semibold! text-primary-500">{message ? "Partly saved on this device only." : "Saved on this device only."}</span>{" "}
        {message ?? "These settings aren't stored on the server yet, so they won't reach students or other admins."}
      </p>
    </motion.div>
  );
}

export default LocalDraftNotice;
