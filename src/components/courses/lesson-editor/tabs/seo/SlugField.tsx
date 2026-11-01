"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import { Link2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { FieldMeta } from "./FieldMeta";
import { slugify } from "./seoAnalysis";

/** URL Slug: read-only course prefix + slug input + "generate from title" button. */
export function SlugField({ publicUrl }: { publicUrl: string }) {
  const { register, setValue, control, formState } = useFormContext<LessonEditorValues>();
  const title = useWatch({ control, name: "content.title" }) ?? "";
  const error = formState.errors.seo?.slug?.message;
  const prefix = `${publicUrl.replace(/\/+$/, "")}/lessons/`;

  const generate = () => {
    const slug = slugify(title);
    if (!slug) {
      toast.error("Lesson title is empty", { description: "Add a lesson title in the Content tab first." });
      return;
    }
    setValue("seo.slug", slug, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  return (
    <div>
      <label htmlFor="seo-slug" className="mb-2 block body-sm-regular text-primary-400">
        URL Slug<span className="ml-0.5 text-red">*</span>
      </label>
      <div className="flex items-stretch gap-2">
        <div
          className={cn(
            "flex h-10 min-w-0 flex-1 overflow-hidden rounded-lg border shadow-xs transition-colors focus-within:border-brand-orange",
            error ? "border-red bg-red-14" : "border-dash bg-white"
          )}
        >
          <span title={prefix} className="hidden max-w-1/2 shrink items-center border-r border-dash bg-slate-50 px-3.5 body-sm-regular text-primary-300 sm:flex">
            <span className="truncate">{prefix}</span>
          </span>
          <input
            id="seo-slug"
            placeholder="introduction-to-html"
            aria-invalid={!!error}
            className="min-w-0 flex-1 bg-transparent px-3.5 body-sm-regular text-primary-500 outline-none placeholder:text-primary-300"
            {...register("seo.slug")}
          />
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={generate}
          title="Generate from lesson title"
          aria-label="Generate slug from lesson title"
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dash bg-white text-blue shadow-xs transition-colors hover:bg-blue-14"
        >
          <Link2 className="h-4 w-4" />
        </motion.button>
      </div>
      {error && <p className="mt-1.5 body-xsm-regular text-red">{error}</p>}
      <FieldMeta hint="Use lowercase letters, numbers and hyphens only. Example: introduction-to-html" />
    </div>
  );
}

export default SlugField;
