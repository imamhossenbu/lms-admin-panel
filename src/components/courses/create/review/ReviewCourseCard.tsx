"use client";

import React from "react";
import { motion } from "framer-motion";
import { CircleDollarSign, FileText, FolderOpen, Settings } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { DetailCard } from "@/components/ui/DetailCard";
import type { CoursePublishInput } from "@/validations/coursePublishSchema";
import { formatMinutes } from "../aiOutline";
import { ReviewEditButton } from "./ReviewEditButton";
import { ReviewIssuesAlert } from "./ReviewIssuesAlert";
import { ReviewKeyValue } from "./ReviewKeyValue";
import { ReviewSection } from "./ReviewSection";
import { ReviewThumbnail } from "./ReviewThumbnail";
import {
  accessLabel,
  enabledLabel,
  enrollmentLabel,
  formatPrice,
  priceTypeLabel,
  visibilityLabel,
} from "./reviewLabels";

export interface ReviewCourseCardProps {
  basic: { title: string; categoryName: string; language: string; thumbnail?: string };
  stats: { modules: number; lessons: number; totalMinutes: number };
  levelLabel: string;
  issues?: string[];
  onEditStep: (step: 1 | 2 | 3 | 4) => void;
}

const orDash = (value?: string) => value?.trim() || "—";

/** Step 5 "Review Your Course": read-only summary of every step with jump-back Edit actions. */
export function ReviewCourseCard({ basic, stats, levelLabel, issues, onEditStep }: ReviewCourseCardProps) {
  const { control } = useFormContext<CoursePublishInput>();
  const values = useWatch({ control }) as CoursePublishInput;
  const features = values.features ?? ({} as CoursePublishInput["features"]);

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }}>
      <DetailCard
        title="Review Your Course"
        description="Check all the details before publishing your course."
        action={<ReviewEditButton onClick={() => onEditStep(1)} label="Edit course" />}
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="space-y-4"
        >
          {issues && issues.length > 0 && <ReviewIssuesAlert issues={issues} />}

          <ReviewSection
            icon={<FileText />}
            title="Basic Information"
            subtitle="Course title, description, category and media"
            onEdit={() => onEditStep(1)}
          >
            <ReviewKeyValue
              items={[
                { label: "Course Title", value: orDash(basic.title) },
                { label: "Category", value: orDash(basic.categoryName) },
                { label: "Language", value: orDash(basic.language) },
                { label: "Thumbnail", value: <ReviewThumbnail src={basic.thumbnail} /> },
              ]}
            />
          </ReviewSection>

          <ReviewSection icon={<FolderOpen />} title="Curriculum" subtitle="Modules and lessons" onEdit={() => onEditStep(2)}>
            <ReviewKeyValue
              items={[
                { label: "Total Modules", value: stats.modules },
                { label: "Total Lessons", value: stats.lessons },
                { label: "Total Duration", value: stats.totalMinutes > 0 ? formatMinutes(stats.totalMinutes) : "—" },
              ]}
            />
          </ReviewSection>

          <ReviewSection
            icon={<CircleDollarSign />}
            title="Pricing & Access"
            subtitle="Price, enrollment and access settings"
            onEdit={() => onEditStep(3)}
          >
            <ReviewKeyValue
              items={[
                { label: "Price Type", value: priceTypeLabel(values.priceType) },
                { label: "Price", value: formatPrice(values.priceType === "FREE" ? 0 : values.price) },
                { label: "Enrollment", value: enrollmentLabel(values) },
                { label: "Access Duration", value: accessLabel(values) },
              ]}
            />
          </ReviewSection>

          <ReviewSection
            icon={<Settings />}
            title="Additional Settings"
            subtitle="Visibility, certificate, quizzes and more"
            onEdit={() => onEditStep(4)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
              <ReviewKeyValue
                items={[
                  { label: "Visibility", value: visibilityLabel(values.visibility) },
                  { label: "Difficulty Level", value: orDash(levelLabel) },
                ]}
              />
              <ReviewKeyValue
                items={[
                  { label: "Certificate", value: enabledLabel(!!values.certificateEnabled) },
                  { label: "Discussions", value: enabledLabel(!!features.discussions) },
                  { label: "Assignments", value: enabledLabel(!!features.assignments) },
                  { label: "Student Reviews", value: enabledLabel(!!features.reviews) },
                  { label: "Quizzes", value: enabledLabel(!!features.quizzes) },
                  { label: "Live Classes", value: enabledLabel(!!features.liveClasses) },
                  { label: "Downloads", value: enabledLabel(!!features.downloadableResources) },
                ]}
              />
            </div>
          </ReviewSection>
        </motion.div>
      </DetailCard>
    </motion.div>
  );
}

export default ReviewCourseCard;
