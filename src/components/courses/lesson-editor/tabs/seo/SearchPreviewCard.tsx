"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Eye } from "lucide-react";
import { EditorSectionCard } from "@/components/courses/lesson-editor/shared/EditorSectionCard";
import { SEO_DESCRIPTION_MAX, SEO_TITLE_MAX, type LessonEditorValues } from "@/validations/lessonEditorSchema";
import { previewBreadcrumb, truncateText } from "./seoAnalysis";

/** Google-like live search result preview. */
export function SearchPreviewCard({ publicUrl }: { publicUrl: string }) {
  const { control } = useFormContext<LessonEditorValues>();
  const [seoTitle, seoDescription, slug, lessonTitle] = useWatch({ control, name: ["seo.title", "seo.description", "seo.slug", "content.title"] });
  const title = truncateText(seoTitle || lessonTitle || "Untitled lesson", SEO_TITLE_MAX);
  const description = truncateText(seoDescription || "Add an SEO description to control the text shown in search results.", SEO_DESCRIPTION_MAX);
  const crumbs = previewBreadcrumb(publicUrl, slug ?? "");

  return (
    <EditorSectionCard icon={<Eye className="h-5 w-5" />} title="Search Preview" description="This is how your lesson may appear in search results.">
      <div className="rounded-xl border border-dash bg-white p-4">
        <p className="truncate body-xsm-regular text-primary-300">{crumbs.join(" › ")}</p>
        <p className="mt-1.5 break-words body-md-medium font-semibold! text-blue">{title}</p>
        <p className="mt-1 break-words body-sm-regular text-primary-400">{description}</p>
      </div>
    </EditorSectionCard>
  );
}

export default SearchPreviewCard;
