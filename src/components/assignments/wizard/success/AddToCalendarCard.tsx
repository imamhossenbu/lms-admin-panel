"use client";

import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, CalendarPlus, ExternalLink } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import type { AssignmentItem } from "@/types/assignment";
import { cn } from "@/lib/cn";
import { googleCalendarUrl, outlookCalendarUrl } from "./calendarLinks";

function CalendarLink({ href, label, tone }: { href: string; label: string; tone: string }) {
  return (
    <motion.a
      whileTap={{ scale: 0.97 }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl border border-dash bg-white px-4 py-3 body-sm-medium text-primary-500 transition-colors hover:bg-blue-14"
    >
      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", tone)}>
        <CalendarPlus className="h-4 w-4" />
      </span>
      <span className="flex-1">{label}</span>
      <ExternalLink className="h-3.5 w-3.5 text-primary-300" />
    </motion.a>
  );
}

/** "Add to Calendar": Google / Outlook events for the due date (open in a new tab). */
export function AddToCalendarCard({ assignment, link }: { assignment: AssignmentItem; link: string }) {
  return (
    <IconSectionCard icon={<CalendarDays className="h-5 w-5" />} title="Add to Calendar" description="Add important dates to your calendar." className="h-full" bodyClassName="mt-4 space-y-3">
      <CalendarLink href={googleCalendarUrl(assignment, link)} label="Add to Google Calendar" tone="bg-green-bg text-green" />
      <CalendarLink href={outlookCalendarUrl(assignment, link)} label="Add to Outlook Calendar" tone="bg-blue-14 text-blue" />
    </IconSectionCard>
  );
}

export default AddToCalendarCard;
