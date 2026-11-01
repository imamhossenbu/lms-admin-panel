"use client";

import React from "react";
import { motion } from "framer-motion";
import type { AdminNotification } from "@/types/notification";
import { timeAgo } from "@/lib/notificationStats";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { CATEGORY_META, CategoryIcon } from "../shared/CategoryIcon";
import { InboxRowActions, type InboxRowHandlers } from "./InboxRowActions";

export interface InboxRowProps {
  item: AdminNotification;
  index: number;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onOpen: (n: AdminNotification) => void;
  handlers: InboxRowHandlers;
}

/** One inbox notification: checkbox, category tile, title (bold + orange dot when unread), message, meta and hover actions. */
export function InboxRow({ item, index, selected, onSelect, onOpen, handlers }: InboxRowProps) {
  const unread = !item.isRead && !item.isArchived;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2, ease: "easeOut", delay: Math.min(index, 10) * 0.02 }}
      className="@container"
    >
      <div
        role="link"
        tabIndex={0}
        onClick={() => onOpen(item)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onOpen(item);
        }}
        className={cn(
          "group relative flex flex-wrap cursor-pointer items-start gap-3 @lg:flex-nowrap px-3.5 py-3 transition-colors focus:outline-none focus-visible:bg-slate-50",
          selected ? "bg-brand-orange-light" : unread ? "bg-brand-orange-soft hover:bg-slate-50" : "bg-white hover:bg-slate-50"
        )}
      >
        <input
          type="checkbox"
          checked={selected}
          aria-label={`Select "${item.title}"`}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onSelect(e.target.checked)}
          className="mt-2.5 h-4 w-4 shrink-0 cursor-pointer rounded border-dash accent-brand-orange"
        />
        <CategoryIcon category={item.category} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {unread && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-orange" aria-label="Unread" />}
            <p className={cn("min-w-0 truncate body-sm-medium", unread ? "text-primary-500 font-bold!" : "text-primary-400")}>{item.title}</p>
            {item.priority === "HIGH" && (
              <ToneBadge tone="red" size="sm">
                High priority
              </ToneBadge>
            )}
          </div>
          <p className={cn("mt-0.5 line-clamp-2 body-sm-regular", unread ? "text-primary-400" : "text-primary-300")}>{item.message}</p>
          <div className="mt-1 flex items-center gap-2 body-xsm-regular text-primary-300">
            <span>{CATEGORY_META[item.category].label}</span>
            <span aria-hidden>•</span>
            <time dateTime={item.createdAt} title={new Date(item.createdAt).toLocaleString("en-US")}>
              {timeAgo(item.createdAt)}
            </time>
          </div>
        </div>

        <InboxRowActions
          item={item}
          handlers={handlers}
          className="w-full shrink-0 justify-end transition-opacity @lg:w-auto @lg:opacity-0 @lg:group-hover:opacity-100 @lg:group-focus-within:opacity-100"
        />
      </div>
    </motion.li>
  );
}

export default InboxRow;
