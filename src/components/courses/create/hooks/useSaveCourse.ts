"use client";

import { useState } from "react";
import { toast } from "sonner";
import { coursesApi } from "@/lib/api";
import { apiErrorMessage } from "@/lib/courseView";
import type { CourseBasicInfoInput } from "@/validations/courseSchema";
import type { CoursePublishInput } from "@/validations/coursePublishSchema";
import { outlineStats, saveOutlineToCourse, type AiOutline } from "../aiOutline";
import { listItemsFromHtml, slugify } from "../createCourseOptions";

export type SaveIntent = "draft" | "publish";

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
export const buildCoursePayload = (
  values: CourseBasicInfoInput,
  outline: AiOutline | null,
  slug: string,
  publish: CoursePublishInput | null,
  status: "DRAFT" | "PUBLISHED"
) => {
  const isFree = !publish || publish.priceType === "FREE";
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
    price: isFree ? 0 : publish.price,
    isFree,
    durationMinutes: outline ? outlineStats(outline).totalMinutes : 0,
    thumbnail: values.thumbnail,
    status,
    ...(outcomes.length ? { learningOutcomes: JSON.stringify(outcomes) } : {}),
    ...(tags.length ? { tags: tags.join(",") } : {}),
  };
};

/**
 * Creates the course (DRAFT or PUBLISHED), then saves the curriculum as modules/lessons/resources.
 * Enrollment, access duration, visibility and feature toggles have no backend columns yet and are not sent.
 */
export function useSaveCourse() {
  const [savingIntent, setSavingIntent] = useState<SaveIntent | null>(null);

  const save = async (
    values: CourseBasicInfoInput,
    outline: AiOutline | null,
    intent: SaveIntent,
    publish: CoursePublishInput | null = null
  ): Promise<string | null> => {
    setSavingIntent(intent);
    const status = intent === "publish" ? "PUBLISHED" : "DRAFT";
    const toastId = toast.loading(intent === "publish" ? "Publishing course..." : "Saving course draft...", {
      description: `"${values.title.trim()}"`,
    });

    try {
      const baseSlug = slugify(values.title) || "course";
      let created: { id?: string; title?: string };
      try {
        created = await coursesApi.create(buildCoursePayload(values, outline, baseSlug, publish, status));
      } catch (err) {
        if (!isSlugConflict(err)) throw err;
        const uniqueSlug = `${baseSlug}-${Date.now().toString(36).slice(-5)}`;
        created = await coursesApi.create(buildCoursePayload(values, outline, uniqueSlug, publish, status));
      }
      if (!created?.id) throw new Error("The server did not return the new course.");

      if (outline?.modules.length) {
        toast.loading("Adding curriculum...", {
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

      toast.success(intent === "draft" ? "Draft saved" : "Course published", {
        id: toastId,
        description:
          intent === "draft"
            ? `"${values.title.trim()}" was saved as a draft.`
            : `"${values.title.trim()}" is now live for students.`,
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
