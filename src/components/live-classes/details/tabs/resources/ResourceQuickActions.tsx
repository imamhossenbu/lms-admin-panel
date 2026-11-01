"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { LiveResourceType } from "@/types/liveClass";
import { LiveTabCard } from "../qa/LiveTabCard";
import { RESOURCE_TYPE_META, RESOURCE_TYPES } from "./resourceMeta";
import { ResourceTypeTile } from "./ResourceTypeTile";

/** "Quick Actions" list: opens the Add Resource modal preset to a type. */
export function ResourceQuickActions({ onAdd }: { onAdd: (type: LiveResourceType) => void }) {
  return (
    <LiveTabCard variant="side" title="Quick Actions">
      <div className="space-y-2.5">
        {RESOURCE_TYPES.map((t, i) => {
          const meta = RESOURCE_TYPE_META[t];
          return (
            <motion.button
              key={t}
              type="button"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAdd(t)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-dash p-3 text-left transition-colors hover:border-brand-orange hover:bg-brand-orange-light"
            >
              <ResourceTypeTile type={t} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block body-sm-medium font-semibold! text-primary-500">{meta.action}</span>
                <span className="block truncate body-xsm-regular text-primary-300">{meta.actionHint}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-primary-300" />
            </motion.button>
          );
        })}
      </div>
    </LiveTabCard>
  );
}

export default ResourceQuickActions;
