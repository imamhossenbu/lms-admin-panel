"use client";

import React from "react";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { PrimaryButton } from "@/components/ui/primary-button";

export interface CertificatesEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  /** Filtered variant: SearchX icon + "Reset Filters". */
  isFiltered?: boolean;
  onReset?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

/** Shared empty state for the three tabs (no data yet, or nothing matches the filters). */
export function CertificatesEmptyState({ icon, title, message, isFiltered, onReset, actionLabel, onAction }: CertificatesEmptyStateProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex flex-col items-center gap-2 px-4 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-bg text-primary-300">{isFiltered ? <SearchX className="h-6 w-6" /> : icon}</span>
      <p className="body-medium font-semibold! text-primary-500">{title}</p>
      <p className="max-w-sm body-sm-regular text-primary-300">{message}</p>
      {isFiltered && onReset ? (
        <SecondaryButton size="sm" className="mt-2" onClick={onReset}>
          Reset Filters
        </SecondaryButton>
      ) : (
        actionLabel &&
        onAction && (
          <PrimaryButton size="sm" className="mt-2" onClick={onAction}>
            {actionLabel}
          </PrimaryButton>
        )
      )}
    </motion.div>
  );
}

export default CertificatesEmptyState;
