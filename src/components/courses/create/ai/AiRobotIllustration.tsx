"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Image as ImageIcon, ListChecks, Play, Sparkle } from "lucide-react";
import { cn } from "@/lib/cn";

export interface AiRobotIllustrationProps {
  /** "md" fits a side panel, "lg" is the hero size used while generating. */
  size?: "md" | "lg";
  className?: string;
}

const SIZES = {
  md: {
    frame: "h-52 w-64",
    halo: "h-44 w-44",
    head: "h-24 w-28 rounded-3xl",
    visor: "h-12 w-20 rounded-2xl gap-3",
    eye: "h-3.5 w-3.5",
    antenna: "h-3 w-3",
    tile: "h-10 w-10 rounded-xl",
    tileIcon: "h-5 w-5",
    sparkle: "h-4 w-4",
  },
  lg: {
    frame: "h-64 w-80",
    halo: "h-56 w-56",
    head: "h-28 w-32 rounded-3xl",
    visor: "h-14 w-24 rounded-2xl gap-4",
    eye: "h-4 w-4",
    antenna: "h-3.5 w-3.5",
    tile: "h-12 w-12 rounded-2xl",
    tileIcon: "h-6 w-6",
    sparkle: "h-5 w-5",
  },
} as const;

const TILES = [
  { Icon: FileText, tone: "bg-purple-14 text-purple", position: "left-6 top-0", delay: 0 },
  { Icon: Play, tone: "bg-brand-orange-light text-brand-orange", position: "right-6 top-2", delay: 0.6 },
  { Icon: ImageIcon, tone: "bg-blue-14 text-blue", position: "left-0 top-1/2", delay: 1.1 },
  { Icon: ListChecks, tone: "bg-green-bg text-green", position: "right-0 top-1/3", delay: 0.3 },
];

const SPARKLES = [
  { tone: "text-purple", position: "left-12 top-1/4", delay: 0 },
  { tone: "text-red", position: "bottom-6 right-10", delay: 0.8 },
];

/** Animated AI robot with floating content tiles — built from lucide icons, no image assets. */
export function AiRobotIllustration({ size = "md", className }: AiRobotIllustrationProps) {
  const s = SIZES[size];

  return (
    <div className={cn("relative mx-auto flex items-center justify-center", s.frame, className)} aria-hidden="true">
      <motion.div
        className={cn("absolute rounded-full bg-purple-14", s.halo)}
        animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative flex flex-col items-center"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className={cn("rounded-full bg-brand-navy", s.antenna)} />
        <span className="h-2 w-0.5 bg-brand-navy" />
        <div className={cn("flex items-center justify-center border border-dash bg-white shadow-lg", s.head)}>
          <div className={cn("flex items-center justify-center bg-brand-navy", s.visor)}>
            {[0, 1].map((eye) => (
              <motion.span
                key={eye}
                className={cn("rounded-full bg-blue", s.eye)}
                animate={{ scaleY: [1, 1, 0.15, 1, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
              />
            ))}
          </div>
        </div>
        <span className="mt-2 h-3 w-3 rounded-full bg-brand-navy" />
      </motion.div>

      {TILES.map(({ Icon, tone, position, delay }, i) => (
        <motion.div
          key={i}
          className={cn("absolute flex items-center justify-center shadow-sm", s.tile, tone, position)}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { duration: 0.4, delay: delay * 0.3 },
            scale: { duration: 0.4, delay: delay * 0.3 },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay },
          }}
        >
          <Icon className={s.tileIcon} />
        </motion.div>
      ))}

      {SPARKLES.map(({ tone, position, delay }, i) => (
        <motion.span
          key={i}
          className={cn("absolute", tone, position)}
          animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 45, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay }}
        >
          <Sparkle className={cn("fill-current", s.sparkle)} />
        </motion.span>
      ))}
    </div>
  );
}

export default AiRobotIllustration;
