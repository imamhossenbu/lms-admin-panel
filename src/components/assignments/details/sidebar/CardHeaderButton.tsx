"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface CardHeaderButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

/** Small bordered blue-text button for card headers ("Edit", "View All", "View Instructions"). */
export function CardHeaderButton({ children, onClick, icon, className }: CardHeaderButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-dash bg-white px-3 body-xsm-medium text-blue transition-colors hover:bg-blue-14",
        className
      )}
    >
      {icon}
      {children}
    </motion.button>
  );
}

export default CardHeaderButton;
