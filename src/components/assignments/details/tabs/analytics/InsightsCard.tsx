"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

/** Blue "Insights" box with computed bullet points. */
export function InsightsCard({ insights }: { insights: string[] }) {
  return (
    <section className="rounded-xl border border-blue/20 bg-blue-14 p-5">
      <h3 className="flex items-center gap-2.5 body-md-medium font-semibold! text-primary-500">
        <Lightbulb className="h-5 w-5 text-blue" />
        Insights
      </h3>
      {insights.length === 0 ? (
        <p className="mt-3 body-xsm-regular text-primary-400">Insights appear once some submissions have been graded.</p>
      ) : (
        <ul className="mt-3 list-disc space-y-2 pl-5 body-xsm-regular text-primary-400 marker:text-blue">
          {insights.map((text, i) => (
            <motion.li key={text} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: i * 0.05 }}>
              {text}
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default InsightsCard;
