"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { coursesApi } from "@/lib/api";
import { AdminCourseItem } from "@/lib/types";
import { apiErrorMessage } from "@/lib/courseView";

const FALLBACK_THUMBNAIL =
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop";

/**
 * AI Syllabus flow: generate an outline, then create (or reuse) the course and save its
 * modules/lessons through the API, and open the course editor.
 */
export function useCourseAiOutline(courses: AdminCourseItem[], onSaved: () => Promise<void> | void) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [targetCourse, setTargetCourse] = useState<AdminCourseItem | null>(null);

  const open = (course?: AdminCourseItem) => {
    setTargetCourse(course ?? null);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setTargetCourse(null);
  };

  const apply = async (courseTitle: string, outline: any) => {
    const existing =
      targetCourse ?? courses.find((c) => c.title.toLowerCase() === courseTitle.toLowerCase()) ?? null;
    const toastId = toast.loading("Saving AI curriculum...", { description: courseTitle });

    try {
      let courseId = existing?.id;
      if (!courseId) {
        const created = await coursesApi.create({
          title: courseTitle,
          slug: courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          price: 99,
          isFree: false,
          status: "DRAFT",
          level: outline.level || "INTERMEDIATE",
          description: outline.summary || "AI generated curriculum outline",
          thumbnail: FALLBACK_THUMBNAIL,
        });
        courseId = created?.id;
      }

      if (courseId && Array.isArray(outline.modules)) {
        for (let i = 0; i < outline.modules.length; i++) {
          const rawModule = outline.modules[i];
          const createdModule = await coursesApi.createModule(courseId, {
            title: (rawModule.title || rawModule.moduleTitle || `Module ${i + 1}`).trim(),
            description: rawModule.description || "",
            order: i + 1,
          });
          if (!createdModule?.id || !Array.isArray(rawModule.lessons)) continue;

          for (let j = 0; j < rawModule.lessons.length; j++) {
            const rawLesson = rawModule.lessons[j];
            const isObject = typeof rawLesson === "object";
            await coursesApi.createLesson(courseId, createdModule.id, {
              title: (isObject ? rawLesson.title || rawLesson.summary || `Lesson ${j + 1}` : rawLesson).trim(),
              type: isObject && rawLesson.type ? rawLesson.type : "VIDEO",
              durationMinutes: isObject && rawLesson.durationMinutes ? Number(rawLesson.durationMinutes) : 15,
              order: j + 1,
              content: isObject ? rawLesson.content || rawLesson.summary || null : null,
            });
          }
        }
      }

      close();
      await onSaved();
      toast.success("AI curriculum saved", { id: toastId, description: `Modules and lessons added to "${courseTitle}".` });
      if (courseId) router.push(`/courses/${courseId}/edit`);
    } catch (error) {
      toast.error("Could not save AI curriculum", {
        id: toastId,
        description: apiErrorMessage(error, "Please try again in a moment."),
      });
      await onSaved();
    }
  };

  return { isOpen, open, close, apply, defaultTitle: targetCourse?.title ?? "" };
}
