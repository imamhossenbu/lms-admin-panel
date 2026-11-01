"use client";

import React, { useEffect, useState } from "react";
import { animate, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { SeoGrade } from "./seoAnalysis";

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const GRADE_STROKE: Record<SeoGrade, string> = { good: "stroke-green", fair: "stroke-yellow", poor: "stroke-red" };
const GRADE_TEXT: Record<SeoGrade, string> = { good: "text-green", fair: "text-yellow", poor: "text-red" };

/** Animated circular 0–100 score (green / yellow / red). */
export function SeoScoreRing({ score, grade, label }: { score: number; grade: SeoGrade; label: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(display, score, { duration: 0.6, ease: "easeOut", onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- animate from the current number only when the score changes
  }, [score]);

  return (
    <div className="relative h-36 w-36 shrink-0" role="img" aria-label={`SEO score ${score} out of 100, ${label}`}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={RADIUS} fill="none" strokeWidth="10" className="stroke-slate-100" />
        <motion.circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - score / 100) }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn("transition-colors", GRADE_STROKE[grade])}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="heading-h3 font-bold! text-primary-500">{display}</span>
        <span className={cn("body-sm-medium", GRADE_TEXT[grade])}>{label}</span>
      </div>
    </div>
  );
}

export default SeoScoreRing;
