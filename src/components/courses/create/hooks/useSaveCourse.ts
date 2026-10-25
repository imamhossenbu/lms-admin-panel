"use client";

import { useState } from "react";
import { toast } from "sonner";
import { coursesApi } from "@/lib/api";
import { apiErrorMessage } from "@/lib/courseView";
import type { CourseBasicInfoInput } from "@/validations/courseSchema";
import { outlineStats, saveOutlineToCourse, type AiOutline } from "../aiOutline";
import { listItemsFromHtml, slugify } from "../createCourseOptions";

export type SaveIntent = "draft" | "continue";

const isSlugConflict = (err: unknown) => {
  const e = err as { response?: { status?: number }; message?: string };
  const message = apiErrorMessage(err, e?.message ?? "").toLowerCase();
  return e?.response?.status === 409 || /slug|unique|already exists/.test(message);
};

/**
 * Serialization (matches the backend's string columns):
 *   tags             → comma-joined (the course search does `tags contains`), subcategory included
 *   learningOutcomes → JSON string array
 */
export const buildCoursePayload = (values: CourseBasicInfoInput, outline: AiOutline | null, slug: string) => {
  const tags = Array.from(new Set([...values.tags, values.subcategory].map((t) => t.trim()).filter(Boolean)));
  const outcomes = outline?.learningOutcomes.length ? outline.learningOutcomes : listItemsFromHtml(values.description, 20);

  return {
    title: values.title.trim(),
    slug,
    description: values.description,
    shortDescription: values.shortDescription.trim(),
    categoryId: values.categoryId,
    level: values.level,
    language: values.language,
    price: 0,
    isFree: true,
    durationMinutes: outline ? outlineStats(outline).totalMinutes : 0,
    thumbnail: values.thumbnail,
    status: "DRAFT" as const,
    ...(outcomes.length ? { learningOutcomes: JSON.stringify(outcomes) } : {}),
    ...(tags.length ? { tags: tags.join(",") } : {}),
  };
};

/** Creates the course as a DRAFT, then saves the accepted AI outline as modules/lessons. */
export function useSaveCourse() {
  const [savingIntent, setSavingIntent] = useState<SaveIntent | null>(null);

  const save = async (
    values: CourseBasicInfoInput,
    outline: AiOutline | null,
    intent: SaveIntent
  ): Promise<string | null> => {
    setSavingIntent(intent);
    const toastId = toast.loading("Saving course draft...", { description: `"${values.title.trim()}"` });

    try {
      const baseSlug = slugify(values.title) || "course";
      let created: { id?: string; title?: string };
      try {
        created = await coursesApi.create(buildCoursePayload(values, outline, baseSlug));
      } catch (err) {
        if (!isSlugConflict(err)) throw err;
        const uniqueSlug = `${baseSlug}-${Date.now().toString(36).slice(-5)}`;
        created = await coursesApi.create(buildCoursePayload(values, outline, uniqueSlug));
      }
      if (!created?.id) throw new Error("The server did not return the new course.");

      if (outline?.modules.length) {
        toast.loading("Adding AI curriculum...", {
          id: toastId,
          description: "Creating modules and lessons for your course.",
        });
        try {
          await saveOutlineToCourse(created.id, outline);
        } catch (err) {
          toast.error("Course saved, but the curriculum wasn't fully added", {
            id: toastId,
            description: apiErrorMessage(err, "You can add the remaining modules from the course editor."),
          });
          return created.id;
        }
      }

      toast.success(intent === "draft" ? "Draft saved" : "Course created", {
        id: toastId,
        description:
          intent === "draft"
            ? `"${values.title.trim()}" was saved as a draft.`
            : "Now build your curriculum, pricing and settings.",
      });
      return created.id;
    } catch (err) {
      toast.error("Couldn't save the course", {
        id: toastId,
        description: apiErrorMessage(err, "Please check your connection and try again."),
      });
      return null;
    } finally {
      setSavingIntent(null);
    }
  };

  return { save, savingIntent };
}
