"use client";

import React from "react";
import { motion } from "framer-motion";
import { ProTipCard } from "@/components/ui/ProTipCard";
import { AdditionalSettingsCard, type AdditionalSettingsCardProps } from "../settings/AdditionalSettingsCard";
import { CourseSummaryCard } from "../pricing/CourseSummaryCard";
import { CreateCourseStepFooter } from "../CreateCourseStepFooter";
import { stepMotion, type CourseStepFacts } from "./stepTypes";

interface AdditionalSettingsStepProps {
  facts: CourseStepFacts;
  settings: AdditionalSettingsCardProps;
  onBack: () => void;
  onNext: () => void;
  onEditBasics: () => void;
}

/** Step 4 — Additional Settings form + Course Preview side card. */
export function AdditionalSettingsStep({ facts, settings, onBack, onNext, onEditBasics }: AdditionalSettingsStepProps) {
  return (
    <motion.div key="settings" {...stepMotion} className="dashboard-card shadow-2xs p-5 space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8 min-w-0">
          <AdditionalSettingsCard {...settings} />
        </div>
        <div className="lg:col-span-4 min-w-0 space-y-5 lg:sticky lg:top-6">
          <CourseSummaryCard
            heading="Course Preview"
            subheading="Here's a preview of how your course will appear to students."
            title={facts.title}
            shortDescription={facts.shortDescription}
            thumbnail={facts.thumbnail}
            moduleCount={facts.moduleCount}
            lessonCount={facts.lessonCount}
            totalMinutes={facts.totalMinutes}
            levelLabel={facts.levelLabel}
            language={facts.language}
            onEdit={onEditBasics}
          />
          <ProTipCard>
            Additional settings like certificates, quizzes, and discussions can significantly increase student
            engagement and course completion rates.
          </ProTipCard>
        </div>
      </div>
      <CreateCourseStepFooter onBack={onBack} onNext={onNext} nextLabel="Next: Review & Publish" />
    </motion.div>
  );
}

export default AdditionalSettingsStep;
