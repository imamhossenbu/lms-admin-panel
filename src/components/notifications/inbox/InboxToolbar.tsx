"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { INBOX_STATUS_OPTIONS, type InboxFilters, type InboxStatus } from "./inboxUtils";

export interface InboxToolbarProps {
  filters: InboxFilters;
  isFiltered: boolean;
  onQueryChange: (q: string) => void;
  onStatusChange: (status: InboxStatus) => void;
  onHighOnlyChange: (on: boolean) => void;
  onReset: () => void;
}

/** Search + Unread / All / Archived + "High priority" toggle + Reset (container queries — lives in the 9/12 column). */
export function InboxToolbar({ filters, isFiltered, onQueryChange, onStatusChange, onHighOnlyChange, onReset }: InboxToolbarProps) {
  return (
    <div className="@container">
      <div className="flex flex-col gap-3 @3xl:flex-row @3xl:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-300" />
          <input
            type="search"
            value={filters.q}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search notifications..."
            aria-label="Search notifications"
            className="h-10 w-full rounded-lg border border-dash bg-white pl-10 pr-3.5 body-sm-regular text-primary-500 transition-colors placeholder:text-primary-300 focus:border-brand-orange focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl<InboxStatus> className="h-10" value={filters.status} onChange={onStatusChange} options={INBOX_STATUS_OPTIONS} />
          <ToggleSwitch checked={filters.highOnly} onChange={onHighOnlyChange} tone="orange" label="High priority" className="whitespace-nowrap" />
          <motion.button
            type="button"
            whileTap={isFiltered ? { scale: 0.96 } : undefined}
            onClick={onReset}
            disabled={!isFiltered}
            className="h-10 shrink-0 cursor-pointer rounded-lg border border-dash bg-white px-5 body-sm-medium text-blue transition-colors hover:bg-blue-14 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reset
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default InboxToolbar;
