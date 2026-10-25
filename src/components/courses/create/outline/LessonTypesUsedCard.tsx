"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LESSON_TYPES, type OutlineStats } from "../aiOutline";
import { LESSON_TYPE_STYLE, LessonTypeIcon } from "./LessonTypeIcon";

export interface LessonTypesUsedCardProps {
  byType: OutlineStats["byType"];
}

/** "Lesson Types Used": one row per lesson type with a count above zero. */
export function LessonTypesUsedCard({ byType }: LessonTypesUsedCardProps) {
  const usedTypes = LESSON_TYPES.filter((type) => byType[type] > 0);

  return (
    <section className="rounded-xl border border-dash bg-white p-4">
      <h3 className="mb-3 title-medium text-primary-500">Lesson Types Used</h3>
      {usedTypes.length === 0 ? (
        <p className="body-sm-regular text-primary-300">Add lessons to see the content mix.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {usedTypes.map((type) => (
              <motion.li
                key={type}
                layout
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-3 rounded-lg border border-dash px-2.5 py-2"
              >
                <LessonTypeIcon type={type} size="sm" />
                <span className="flex-1 body-sm-regular text-primary-500">{LESSON_TYPE_STYLE[type].pluralLabel}</span>
                <span className="body-sm-medium text-primary-500">{byType[type]}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}

export default LessonTypesUsedCard;
