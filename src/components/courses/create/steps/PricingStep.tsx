"use client";

import React from "react";
import { motion } from "framer-motion";
import { PricingAccessCard } from "../pricing/PricingAccessCard";
import { CourseSummaryCard } from "../pricing/CourseSummaryCard";
import { CreateCourseStepFooter } from "../CreateCourseStepFooter";
import { stepMotion, type CourseStepFacts } from "./stepTypes";

interface PricingStepProps {
  facts: CourseStepFacts;
  onBack: () => void;
  onNext: () => void;
  onEditBasics: () => void;
}

/** Step 3 — Pricing & Access form + Course Summary side card. */
export function PricingStep({ facts, onBack, onNext, onEditBasics }: PricingStepProps) {
  return (
    <motion.div key="pricing" {...stepMotion} className="dashboard-card shadow-2xs p-5 space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8 min-w-0">
          <PricingAccessCard />
        </div>
        <div className="lg:col-span-4 min-w-0 lg:sticky lg:top-6">
          <CourseSummaryCard
            heading="Course Summary"
            subheading="Here's a quick overview of your course."
            title={facts.title}
            shortDescription={facts.shortDescription}
            thumbnail={facts.thumbnail}
            moduleCount={facts.moduleCount}
            lessonCount={facts.lessonCount}
            totalMinutes={facts.totalMinutes}
            levelLabel={facts.levelLabel}
            language={facts.language}
            onEdit={onEditBasics}
            onEditThumbnail={onEditBasics}
            onEditPricing={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
        </div>
      </div>
      <CreateCourseStepFooter onBack={onBack} onNext={onNext} nextLabel="Next: Additional Settings" />
    </motion.div>
  );
}

export default PricingStep;
