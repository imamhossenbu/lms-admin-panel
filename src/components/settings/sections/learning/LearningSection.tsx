"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { GraduationCap } from "lucide-react";
import { ProTipCard } from "@/components/ui/ProTipCard";
import { useSettingsSection } from "../../useSettingsSection";
import { SettingsSectionLayout } from "../../shared/SettingsSectionLayout";
import { SettingsSaveBar } from "../../shared/SettingsSaveBar";
import { EnrollmentCard } from "./EnrollmentCard";
import { ProgressCard } from "./ProgressCard";
import { AssessmentsCard } from "./AssessmentsCard";
import { EngagementCard } from "./EngagementCard";
import { UploadsCard } from "./UploadsCard";
import { LearningSummaryCard } from "./LearningSummaryCard";
import { LEARNING_LABELS } from "./learningUtils";

/** Settings → Learning: enrollment, completion, assessment defaults, engagement and uploads. */
export function LearningSection() {
  const { form, store, isSaving, save, discard } = useSettingsSection("learning", LEARNING_LABELS);

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <SettingsSectionLayout
          title="Learning"
          description="Platform-wide defaults for how students enroll, progress and get assessed."
          icon={<GraduationCap className="h-5 w-5" />}
          updatedAt={store.updatedAt.learning}
          aside={
            <>
              <LearningSummaryCard />
              <ProTipCard title="Defaults, not rules">
                These apply to new courses, quizzes and assignments. Instructors can still override the passing score, penalty and lesson order per course.
              </ProTipCard>
            </>
          }
        >
          <EnrollmentCard />
          <ProgressCard />
          <AssessmentsCard />
          <EngagementCard />
          <UploadsCard />
          <SettingsSaveBar isDirty={form.formState.isDirty} isSaving={isSaving} onSave={save} onDiscard={discard} />
        </SettingsSectionLayout>
      </form>
    </FormProvider>
  );
}

export default LearningSection;
