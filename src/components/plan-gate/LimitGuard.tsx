"use client";

import React, { useRef, useState } from "react";
import { useViewportFit } from "@/lib/useViewportFit";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import type { LimitKey } from "@/types/saas";
import { formatLimit, LIMIT_META, useLimitStatus } from "@/lib/planAccess";

export interface LimitState {
  atLimit: boolean;
  used: number;
  /** null = unlimited. */
  limit: number | null;
  /** "You've reached your plan's limit of 50 students — Upgrade". */
  message: string;
}

/** Usage vs plan limit for the current institution, plus a ready-made tooltip message. */
export function useLimit(key: LimitKey): LimitState {
  const { usage, limit, atLimit } = useLimitStatus(key);
  const noun = LIMIT_META[key].label.toLowerCase();
  return {
    atLimit,
    used: usage,
    limit,
    message: `You've reached your plan's limit of ${formatLimit(limit, key)} ${key === "storageGb" ? "of storage" : noun} — Upgrade to add more.`,
  };
}

export interface LimitGuardProps {
  limitKey: LimitKey;
  /** Render the create button; `disabled` is true when the limit is reached. */
  children: (state: { disabled: boolean }) => React.ReactNode;
  className?: string;
}

/**
 * Wraps a "create" action: disables it at the plan limit and shows an animated tooltip with an
 * Upgrade link on hover / focus.
 */
export function LimitGuard({ limitKey, children, className }: LimitGuardProps) {
  const { atLimit, message } = useLimit(limitKey);
  const [open, setOpen] = useState(false);
  const fitRef = useRef<HTMLSpanElement>(null);
  useViewportFit(open, fitRef);

  if (!atLimit) return <>{children({ disabled: false })}</>;

  return (
    <span
      className={`relative inline-flex ${className ?? ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      tabIndex={0}
      aria-label={message}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {/* Disabled buttons swallow hover events — let the wrapper receive them instead. */}
      <span className="pointer-events-none inline-flex">{children({ disabled: true })}</span>
      <AnimatePresence>
        {open && (
          <motion.span
            ref={fitRef}
            role="tooltip"
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 w-72 pt-2 text-left"
          >
            <span className="block rounded-xl border border-dash bg-white p-3 shadow-xl">
            <span className="flex items-start gap-2">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
              <span className="body-xsm-regular text-primary-400">{message}</span>
            </span>
            <Link href="/billing?tab=plans" className="mt-2 inline-flex items-center gap-1 body-xsm-medium text-brand-orange hover:underline">
              Upgrade plan <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export default LimitGuard;
