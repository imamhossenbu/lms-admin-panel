"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWatch } from "react-hook-form";
import { Send } from "lucide-react";
import type { CoursePublishInput } from "@/validations/coursePublishSchema";
import { ReviewCourseCard } from "../review/ReviewCourseCard";
import { CourseReviewPreviewCard } from "../review/CourseReviewPreviewCard";
import { priceTagLabel } from "../review/reviewLabels";
import { CreateCourseStepFooter } from "../CreateCourseStepFooter";
import { stepMotion, type CourseStepFacts, type CourseStepNumber } from "./stepTypes";

interface ReviewStepProps {
  facts: CourseStepFacts;
  issues: string[];
  isPublishing: boolean;
  disabled: boolean;
  onBack: () => void;
  onPublish: () => void;
  onEditStep: (step: CourseStepNumber) => void;
  onViewCourse: () => void;
  publishLabel?: string;
}

/** Step 5 — summary of every step + student-facing preview, then Publish. */
export function ReviewStep({
  facts,
  issues,
  isPublishing,
  disabled,
  onBack,
  onPublish,
  onEditStep,
  onViewCourse,
  publishLabel = "Publish Course",
}: ReviewStepProps) {
  const pricing = useWatch<CoursePublishInput>({ name: ["priceType", "price"] }) as [CoursePublishInput["priceType"], number];
  const stats = { modules: facts.moduleCount, lessons: facts.lessonCount, totalMinutes: facts.totalMinutes };

  return (
    <motion.div key="review" {...stepMotion} className="dashboard-card shadow-2xs p-5 space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 min-w-0">
          <ReviewCourseCard
            basic={{ title: facts.title, categoryName: facts.categoryName, language: facts.language, thumbnail: facts.thumbnail }}
            stats={stats}
            levelLabel={facts.levelLabel}
            issues={issues}
            onEditStep={onEditStep}
          />
        </div>
        <div className="lg:col-span-5 min-w-0 lg:sticky lg:top-6">
          <CourseReviewPreviewCard
            title={facts.title}
            shortDescription={facts.shortDescription}
            thumbnail={facts.thumbnail}
            stats={stats}
            levelLabel={facts.levelLabel}
            language={facts.language}
            priceLabel={priceTagLabel({ priceType: pricing[0], price: pricing[1] })}
            learnItems={facts.learnItems}
            onViewCourse={onViewCourse}
          />
        </div>
      </div>
      <CreateCourseStepFooter
        onBack={onBack}
        onNext={onPublish}
        nextLabel={publishLabel}
        nextIcon={<Send />}
        isLoading={isPublishing}
        loadingLabel="Publishing..."
        disabled={disabled}
      />
    </motion.div>
  );
}

export default ReviewStep;
