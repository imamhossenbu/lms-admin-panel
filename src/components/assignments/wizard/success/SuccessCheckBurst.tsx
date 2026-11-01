"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/** Confetti dots around the check: position + token colour + shape. */
const CONFETTI = [
  { pos: "top-0 left-1/2", color: "bg-green", shape: "rotate-45 rounded-sm" },
  { pos: "top-6 left-10", color: "bg-blue", shape: "rounded-full" },
  { pos: "top-6 right-10", color: "bg-yellow", shape: "rounded-full" },
  { pos: "top-1/2 left-0", color: "bg-yellow", shape: "rotate-45 rounded-sm" },
  { pos: "top-1/2 right-0", color: "bg-blue", shape: "rotate-12 rounded-sm" },
  { pos: "bottom-6 left-8", color: "bg-green", shape: "rounded-full" },
  { pos: "bottom-6 right-8", color: "bg-red", shape: "rotate-45 rounded-sm" },
  { pos: "bottom-0 left-1/3", color: "bg-purple", shape: "rounded-full" },
];

/** Animated green check in soft rings with popping confetti dots. */
export function SuccessCheckBurst() {
  return (
    <div className="relative mx-auto h-56 w-56" aria-hidden>
      {CONFETTI.map((c, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 1], scale: [0, 1.3, 1], y: [0, -6, 0] }}
          transition={{ duration: 0.6, delay: 0.35 + i * 0.05, ease: "easeOut" }}
          className={cn("absolute h-2.5 w-2.5", c.pos, c.color, c.shape)}
        />
      ))}
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.6, 1.08, 1], opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute inset-8 rounded-full bg-green-bg"
      />
      <motion.span
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute inset-14 rounded-full bg-green/20"
      />
      <motion.span
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.15 }}
        className="absolute inset-18 flex items-center justify-center rounded-full bg-green text-white shadow-lg"
      >
        <Check className="h-10 w-10" strokeWidth={3.5} />
      </motion.span>
    </div>
  );
}

export default SuccessCheckBurst;
