"use client";

import React from "react";
import { motion } from "framer-motion";
import { AppSelect } from "@/components/ui/AppSelect";
import { DetailCard } from "@/components/ui/DetailCard";
import { LANGUAGE_OPTIONS } from "../createCourseOptions";
import { FieldError } from "../basic/FieldLabel";
import { CategoryField } from "./CategoryField";
import { CertificateField } from "./CertificateField";
import { CourseFeaturesGrid } from "./CourseFeaturesGrid";
import { DifficultyField } from "./DifficultyField";
import { SettingsRow } from "./SettingsRow";
import { VisibilityField } from "./VisibilityField";

export interface AdditionalSettingsCardProps {
  categories: { id: string; name: string }[];
  categoryId: string;
  language: string;
  level: string;
  onCategoryChange: (id: string) => void;
  onLanguageChange: (language: string) => void;
  onLevelChange: (level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED") => void;
  onCategoryCreated?: (category: { id: string; name: string }) => void;
  errors?: { categoryId?: string; language?: string; level?: string };
}

const rowMotion = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" as const } },
};

/**
 * Step 4 "Additional Settings". Visibility, certificate and features come from the
 * `CoursePublishInput` form context; category / language / level belong to the Step 1
 * form and are controlled through props.
 */
export function AdditionalSettingsCard({
  categories,
  categoryId,
  language,
  level,
  onCategoryChange,
  onLanguageChange,
  onLevelChange,
  onCategoryCreated,
  errors,
}: AdditionalSettingsCardProps) {
  const rows = [
    {
      key: "visibility",
      title: "Course Visibility",
      description: "Control who can find and access this course.",
      content: <VisibilityField />,
    },
    {
      key: "category",
      title: "Course Category",
      description: "Choose a category for your course.",
      content: (
        <CategoryField
          categories={categories}
          value={categoryId}
          onChange={onCategoryChange}
          onCategoryCreated={onCategoryCreated}
          error={errors?.categoryId}
        />
      ),
    },
    {
      key: "language",
      title: "Language",
      description: "Select the primary language for this course.",
      content: (
        <div className="sm:max-w-md">
          <AppSelect
            fullWidth
            value={language}
            onValueChange={onLanguageChange}
            options={LANGUAGE_OPTIONS}
            placeholder="Select language"
            triggerClassName={errors?.language ? "border-red bg-red-14" : undefined}
          />
          <FieldError message={errors?.language} />
        </div>
      ),
    },
    {
      key: "level",
      title: "Difficulty Level",
      description: "Set the difficulty level for this course.",
      content: <DifficultyField value={level} onChange={onLevelChange} error={errors?.level} />,
    },
    {
      key: "certificate",
      title: "Certificate",
      description: "Issue a certificate upon course completion.",
      content: <CertificateField />,
    },
    {
      key: "features",
      title: "Course Features",
      description: "Enable additional features for this course.",
      content: <CourseFeaturesGrid />,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }}>
      <DetailCard
        title="Additional Settings"
        description="Configure advanced options for your course."
        bodyClassName="border-t border-dash -mx-5 px-5"
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
          className="divide-y divide-dash"
        >
          {rows.map((row) => (
            <motion.div key={row.key} variants={rowMotion}>
              <SettingsRow title={row.title} description={row.description} className={row.key === "features" ? "pb-0" : undefined}>
                {row.content}
              </SettingsRow>
            </motion.div>
          ))}
        </motion.div>
      </DetailCard>
    </motion.div>
  );
}

export default AdditionalSettingsCard;
