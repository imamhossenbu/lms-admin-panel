"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LessonEditorTabProps } from "@/components/courses/lesson-editor/tabTypes";
import { AccessSettingsCard } from "./AccessSettingsCard";
import { DateRestrictionCard } from "./DateRestrictionCard";
import { GeoRestrictionCard } from "./GeoRestrictionCard";
import { PlanAccessCard } from "./PlanAccessCard";
import { UserGroupsCard } from "./UserGroupsCard";
import { useLessonOptions } from "./lessonOptions";

/** Edit Lesson → Access tab (form section `access`). */
export function AccessTab({ context, lessonId }: LessonEditorTabProps) {
  const lessonOptions = useLessonOptions(context, lessonId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3"
    >
      <div className="min-w-0 space-y-5 lg:col-span-2">
        <AccessSettingsCard lessonOptions={lessonOptions} />
        <UserGroupsCard groups={context.groups} />
      </div>
      <div className="min-w-0 space-y-5">
        <PlanAccessCard plans={context.plans} />
        <DateRestrictionCard />
        <GeoRestrictionCard countries={context.countries} />
      </div>
    </motion.div>
  );
}

export default AccessTab;
