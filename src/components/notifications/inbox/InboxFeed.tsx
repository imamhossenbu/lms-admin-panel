"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import type { AdminNotification } from "@/types/notification";
import { groupByDay } from "@/lib/notificationStats";
import { InboxRow } from "./InboxRow";
import type { InboxRowHandlers } from "./InboxRowActions";

export interface InboxFeedProps {
  items: AdminNotification[];
  selectedIds: string[];
  onSelect: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onOpen: (n: AdminNotification) => void;
  handlers: InboxRowHandlers;
}

/** Select-all header + notifications grouped into Today / Yesterday / Earlier this week / Earlier. */
export function InboxFeed({ items, selectedIds, onSelect, onSelectAll, onOpen, handlers }: InboxFeedProps) {
  const groups = groupByDay(items);
  const allSelected = items.length > 0 && items.every((n) => selectedIds.includes(n.id));
  let index = 0;

  return (
    <div className="space-y-4">
      <label className="flex w-fit cursor-pointer items-center gap-3 px-3.5 body-sm-medium text-primary-400 select-none">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) => onSelectAll(e.target.checked)}
          className="h-4 w-4 cursor-pointer rounded border-dash accent-brand-orange"
        />
        Select all on this page
      </label>

      {groups.map((group) => (
        <section key={group.label} aria-label={group.label} className="space-y-2">
          <h3 className="px-1 body-xsm-medium font-semibold! uppercase tracking-wide text-primary-300">{group.label}</h3>
          <ul className="divide-y divide-dash overflow-hidden rounded-xl border border-dash">
            <AnimatePresence initial={false}>
              {group.items.map((n) => (
                <InboxRow
                  key={n.id}
                  item={n}
                  index={index++}
                  selected={selectedIds.includes(n.id)}
                  onSelect={(checked) => onSelect(n.id, checked)}
                  onOpen={onOpen}
                  handlers={handlers}
                />
              ))}
            </AnimatePresence>
          </ul>
        </section>
      ))}
    </div>
  );
}

export default InboxFeed;
