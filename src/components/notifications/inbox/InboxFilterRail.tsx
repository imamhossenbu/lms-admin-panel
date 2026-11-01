"use client";

import React from "react";
import { motion } from "framer-motion";
import { Inbox } from "lucide-react";
import type { NotificationCategory } from "@/types/notification";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { CATEGORY_META, CategoryIcon, NOTIFICATION_CATEGORIES } from "../shared/CategoryIcon";
import type { InboxCategoryFilter } from "./inboxUtils";

export interface InboxFilterRailProps {
  active: InboxCategoryFilter;
  unreadTotal: number;
  unreadByCategory: Partial<Record<NotificationCategory, number>>;
  onChange: (category: InboxCategoryFilter) => void;
}

/** Category list with unread counts (All + 7 categories). Stacks into a grid below xl. */
export function InboxFilterRail({ active, unreadTotal, unreadByCategory, onChange }: InboxFilterRailProps) {
  const items: { id: InboxCategoryFilter; label: string; count: number; icon: React.ReactNode }[] = [
    {
      id: "ALL",
      label: "All notifications",
      count: unreadTotal,
      icon: (
        <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-primary-500">
          <Inbox className="h-4 w-4" />
        </span>
      ),
    },
    ...NOTIFICATION_CATEGORIES.map((c) => ({ id: c as InboxCategoryFilter, label: CATEGORY_META[c].label, count: unreadByCategory[c] ?? 0, icon: <CategoryIcon category={c} size="sm" /> })),
  ];

  return (
    <nav aria-label="Notification categories" className="dashboard-card shadow-2xs p-3">
      <p className="px-2 pb-2 body-xsm-medium font-semibold! uppercase tracking-wide text-primary-300">Categories</p>
      <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => onChange(item.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors",
                  isActive ? "bg-brand-orange-light" : "hover:bg-slate-50"
                )}
              >
                {item.icon}
                <span className={cn("min-w-0 flex-1 truncate body-sm-medium", isActive ? "text-brand-orange font-semibold!" : "text-primary-400")}>{item.label}</span>
                {item.count > 0 && (
                  <ToneBadge tone={isActive ? "orange" : "navy"} size="sm" variant="pill">
                    {item.count}
                  </ToneBadge>
                )}
              </motion.button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default InboxFilterRail;
