"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";

export interface PreviewCardShellProps {
  title: string;
  badge?: "live" | "student";
  children: React.ReactNode;
}

/** Right-column card: eye icon + title + green "Live Preview" / blue "Student View" pill, then an inner bordered card. */
export function PreviewCardShell({ title, badge = "live", children }: PreviewCardShellProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="dashboard-card shadow-2xs p-4"
    >
      <header className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dash bg-blue-14 text-blue">
          <Eye className="h-5 w-5" />
        </span>
        <h3 className="min-w-0 flex-1 truncate body-md-medium font-semibold! text-primary-500">{title}</h3>
        {badge === "live" ? (
          <ToneBadge tone="green">Live Preview</ToneBadge>
        ) : (
          <ToneBadge tone="blue">Student View</ToneBadge>
        )}
      </header>
      <div className="mt-4 rounded-xl border border-dash bg-white p-4">{children}</div>
    </motion.section>
  );
}

export default PreviewCardShell;
