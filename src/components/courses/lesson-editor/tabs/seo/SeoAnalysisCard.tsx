"use client";

import React, { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { BarChart3 } from "lucide-react";
import { EditorSectionCard } from "@/components/courses/lesson-editor/shared/EditorSectionCard";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { analyzeSeo } from "./seoAnalysis";
import { SeoChecklist } from "./SeoChecklist";
import { SeoScoreRing } from "./SeoScoreRing";

/** Score ring + checklist computed live from the SEO section and lesson content. */
export function SeoAnalysisCard({ children }: { children?: React.ReactNode }) {
  const { control } = useFormContext<LessonEditorValues>();
  const seo = useWatch({ control, name: "seo" });
  const body = useWatch({ control, name: "content.body" });

  const result = useMemo(
    () =>
      analyzeSeo({
        title: seo.title ?? "",
        description: seo.description ?? "",
        slug: seo.slug ?? "",
        focusKeyword: seo.focusKeyword ?? "",
        metaKeywords: seo.metaKeywords ?? [],
        contentHtml: body ?? "",
      }),
    [seo.title, seo.description, seo.slug, seo.focusKeyword, seo.metaKeywords, body]
  );

  return (
    <EditorSectionCard icon={<BarChart3 className="h-5 w-5" />} title="SEO Analysis" description="Check your lesson's SEO score and suggestions." bodyClassName="space-y-5">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        <SeoScoreRing score={result.score} grade={result.grade} label={result.gradeLabel} />
        <SeoChecklist checks={result.checks} />
      </div>
      {children}
    </EditorSectionCard>
  );
}

export default SeoAnalysisCard;
