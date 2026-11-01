"use client";

import React from "react";
import { motion } from "framer-motion";
import { Megaphone, Plus, SearchX } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

export interface BroadcastsEmptyStateProps {
  title: string;
  message: string;
  /** Filtered variant: SearchX icon + "Reset Filters". */
  isFiltered?: boolean;
  onReset?: () => void;
  /** Unfiltered variant: "+ New Broadcast". */
  onCreate?: () => void;
  icon?: React.ReactNode;
}

/** Empty state for the broadcast list and the recipients table. */
export function BroadcastsEmptyState({ title, message, isFiltered, onReset, onCreate, icon }: BroadcastsEmptyStateProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex flex-col items-center gap-2 px-4 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-bg text-primary-300">
        {isFiltered ? <SearchX className="h-6 w-6" /> : (icon ?? <Megaphone className="h-6 w-6" />)}
      </span>
      <p className="body-medium font-semibold! text-primary-500">{title}</p>
      <p className="max-w-sm body-sm-regular text-primary-300">{message}</p>
      {isFiltered && onReset ? (
        <SecondaryButton size="sm" className="mt-2" onClick={onReset}>
          Reset Filters
        </SecondaryButton>
      ) : (
        onCreate && (
          <PrimaryButton size="sm" className="mt-2" leftIcon={<Plus />} onClick={onCreate}>
            New Broadcast
          </PrimaryButton>
        )
      )}
    </motion.div>
  );
}

export default BroadcastsEmptyState;
