"use client";

import React from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/primary-button";

/** Breadcrumb (Home › Quizzes), title + subtitle and the orange "+ Create Quiz" button. */
export function QuizzesHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <PageHeader
      className="mb-0"
      breadcrumbs={[{ label: "Quizzes" }]}
      title={<span className="heading-h3 font-bold! text-primary-500">Quizzes</span>}
      subtitle="Create and manage quizzes for your courses. Track performance and analyze results."
      action={
        <PrimaryButton size="lg" leftIcon={<Plus />} onClick={onCreate}>
          Create Quiz
        </PrimaryButton>
      }
    />
  );
}

export default QuizzesHeader;
