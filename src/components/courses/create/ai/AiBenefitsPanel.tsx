"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Lightbulb } from "lucide-react";
import { AiRobotIllustration } from "./AiRobotIllustration";
import { AiInfoNote } from "./AiInfoNote";

const BENEFITS = [
  "Generate complete course structure",
  "Suggest lesson titles and descriptions",
  "Recommend lesson types and activities",
  "Save time and focus on teaching",
  "Fully editable after generation",
];

/** Right column of the AI form: illustration, benefit checklist and Pro Tip. */
export function AiBenefitsPanel() {
  return (
    <div className="flex h-full flex-col gap-5">
      <AiRobotIllustration size="md" />

      <div>
        <h3 className="title-medium text-primary-500">Let AI do the heavy lifting</h3>
        <ul className="mt-3 space-y-3">
          {BENEFITS.map((benefit, i) => (
            <motion.li
              key={benefit}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.15 + i * 0.06 }}
              className="flex items-center gap-3"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple text-white">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className="body-sm-regular text-primary-400">{benefit}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <AiInfoNote tone="orange" title="Pro Tip" icon={<Lightbulb className="h-5 w-5" />} className="mt-auto">
        The more details you provide, the better and more relevant the course outline will be.
      </AiInfoNote>
    </div>
  );
}

export default AiBenefitsPanel;
