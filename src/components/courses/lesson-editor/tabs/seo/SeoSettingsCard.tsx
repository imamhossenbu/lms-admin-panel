"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Search } from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { TagsInput } from "@/components/ui/TagsInput";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { EditorSectionCard } from "@/components/courses/lesson-editor/shared/EditorSectionCard";
import { SEO_DESCRIPTION_MAX, SEO_TITLE_MAX, type LessonEditorValues } from "@/validations/lessonEditorSchema";
import { fieldErrorMessage } from "../access/fieldError";
import { FieldMeta } from "./FieldMeta";
import { SlugField } from "./SlugField";

const LABEL = "mb-2 block body-sm-regular text-primary-400";

/** Left column: SEO title, description, slug, focus keyword, meta keywords, canonical URL. */
export function SeoSettingsCard({ publicUrl }: { publicUrl: string }) {
  const { control, register, formState } = useFormContext<LessonEditorValues>();
  const errors = formState.errors.seo;
  const title = useWatch({ control, name: "seo.title" }) ?? "";
  const description = useWatch({ control, name: "seo.description" }) ?? "";

  return (
    <EditorSectionCard icon={<Search className="h-5 w-5" />} title="SEO Settings" description="Optimize this lesson for search engines and learners." bodyClassName="space-y-5">
      <div>
        <InputField id="seo-title" label="SEO Title" required placeholder="e.g. Introduction to HTML - Learn the Basics" error={errors?.title?.message} {...register("seo.title")} />
        <FieldMeta hint={`Keep it under ${SEO_TITLE_MAX} characters and include the primary keyword.`} count={title.length} max={SEO_TITLE_MAX} />
      </div>

      <div>
        <label htmlFor="seo-description" className={LABEL}>
          SEO Description<span className="ml-0.5 text-red">*</span>
        </label>
        <TextAreaField
          id="seo-description"
          rows={3}
          placeholder="Summarize what students will learn in this lesson..."
          error={errors?.description?.message}
          {...register("seo.description")}
        />
        <FieldMeta
          hint={`Keep it under ${SEO_DESCRIPTION_MAX} characters. Write a clear and engaging description for better search visibility.`}
          count={description.length}
          max={SEO_DESCRIPTION_MAX}
        />
      </div>

      <SlugField publicUrl={publicUrl} />

      <div>
        <InputField id="seo-focus-keyword" label="Focus Keyword" placeholder="e.g. HTML introduction" error={errors?.focusKeyword?.message} {...register("seo.focusKeyword")} />
        <FieldMeta hint="Add the primary keyword to help with SEO optimization." />
      </div>

      <div>
        <label htmlFor="seo-meta-keywords" className={LABEL}>
          Meta Keywords (Optional)
        </label>
        <Controller
          control={control}
          name="seo.metaKeywords"
          render={({ field }) => (
            <TagsInput
              id="seo-meta-keywords"
              value={field.value}
              onChange={field.onChange}
              maxTags={15}
              maxLength={40}
              placeholder="Add keyword and press Enter..."
              error={fieldErrorMessage(errors?.metaKeywords)}
              renderTag={(tag) => <ToneBadge tone="blue">{tag}</ToneBadge>}
            />
          )}
        />
      </div>

      <div>
        <InputField
          id="seo-canonical-url"
          type="url"
          label="Canonical URL (Optional)"
          placeholder={`${publicUrl.replace(/\/+$/, "")}/lessons/your-lesson`}
          error={errors?.canonicalUrl?.message}
          {...register("seo.canonicalUrl")}
        />
        <FieldMeta hint="Use a canonical URL if this lesson is also published at a different URL." />
      </div>
    </EditorSectionCard>
  );
}

export default SeoSettingsCard;
