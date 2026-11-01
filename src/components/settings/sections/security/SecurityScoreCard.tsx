"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Lightbulb, ShieldCheck } from "lucide-react";
import type { SecuritySettings } from "@/validations/platformSettingsSchema";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { scoreMeta, securityScore } from "./securityUtils";

const R = 52;
const C = 2 * Math.PI * R;

/** Aside: 0–100 ring computed live from the (unsaved) form values + what to improve. */
export function SecurityScoreCard() {
  const { control } = useFormContext<SecuritySettings>();
  const values = useWatch({ control }) as Partial<SecuritySettings>;
  const { score, items } = securityScore(values);
  const meta = scoreMeta(score);
  const todo = items.filter((i) => !i.met).sort((a, b) => b.points - a.points);

  return (
    <motion.section initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="dashboard-card shadow-2xs p-5">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-bg text-green">
            <ShieldCheck className="h-4.5 w-4.5" />
          </span>
          <h3 className="body-sm-medium font-semibold! text-primary-500">Security score</h3>
        </div>
        <ToneBadge tone={meta.tone} size="sm" variant="pill" dot>
          {meta.label}
        </ToneBadge>
      </header>

      <div className="mt-4 flex justify-center">
        <div className="relative h-36 w-36">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
            <circle cx="60" cy="60" r={R} fill="none" strokeWidth="10" className="stroke-slate-100" />
            <motion.circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: C * (1 - score / 100) }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
              className={cn("transition-colors duration-300", meta.strokeClass)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center" role="img" aria-label={`Security score ${score} out of 100`}>
            <motion.span key={score} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="heading-h3 text-primary-500 tabular-nums">
              {score}
            </motion.span>
            <span className="body-xsm-regular text-primary-300">out of 100</span>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-dash pt-4">
        {todo.length === 0 ? (
          <p className="flex items-center gap-2 body-xsm-medium text-green">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Every recommended protection is on.
          </p>
        ) : (
          <>
            <p className="mb-2.5 flex items-center gap-1.5 body-xsm-medium font-semibold! text-primary-400">
              <Lightbulb className="h-3.5 w-3.5 text-yellow" />
              Suggestions
            </p>
            <ul className="space-y-2">
              <AnimatePresence initial={false}>
                {todo.map((item) => (
                  <motion.li
                    key={item.key}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start justify-between gap-3 overflow-hidden"
                  >
                    <span className="body-xsm-regular text-primary-400">{item.suggestion}</span>
                    <ToneBadge tone="green" size="sm">
                      +{item.points}
                    </ToneBadge>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </>
        )}
      </div>
    </motion.section>
  );
}

export default SecurityScoreCard;
