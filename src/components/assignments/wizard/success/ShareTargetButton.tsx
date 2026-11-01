"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface ShareTargetButtonProps {
  label: string;
  /** Token background/text classes for the circle. */
  tone: string;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

/** Round share target (copy, email, WhatsApp, Facebook, X). Links open in a new tab. */
export function ShareTargetButton({ label, tone, href, onClick, children }: ShareTargetButtonProps) {
  const className = cn("flex h-11 w-11 cursor-pointer items-center justify-center rounded-full shadow-2xs transition-opacity hover:opacity-90", tone);
  if (href) {
    return (
      <motion.a whileTap={{ scale: 0.92 }} whileHover={{ y: -2 }} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className={className}>
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button type="button" whileTap={{ scale: 0.92 }} whileHover={{ y: -2 }} onClick={onClick} aria-label={label} title={label} className={className}>
      {children}
    </motion.button>
  );
}

export default ShareTargetButton;
