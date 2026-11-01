"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { coursesApi } from "@/lib/api";
import { apiErrorMessage } from "@/lib/courseView";
import type { CourseBasicInfoInput } from "@/validations/courseSchema";
import type { CoursePublishInput } from "@/validations/coursePublishSchema";
import type { AiOutline } from "../aiOutline";
import { loadLessonQuiz } from "../lesson/quiz/quizSync";
import {
  courseToBasicInfo,
  courseToOutline,
  courseToPublish,
  snapshotOf,
  type CourseSnapshot,
  type ServerCourse,
} from "./courseToWizard";

export interface EditCourseInitial {
  basic: CourseBasicInfoInput;
  outline: AiOutline;
  publish: CoursePublishInput;
}

/** Attaches each QUIZ lesson's saved quiz (questions live in a separate API). */
async function withQuizzes(outline: AiOutline): Promise<AiOutline> {
  const modules = await Promise.all(
    outline.modules.map(async (m) => ({
      ...m,
      lessons: await Promise.all(
        m.lessons.map(async (l) => {
          if (l.type !== "QUIZ" || !l.details) return l;
          try {
            const quiz = await loadLessonQuiz(l.id);
            return quiz ? { ...l, details: { ...l.details, quiz } } : l;
          } catch {
            return l;
          }
        })
      ),
    }))
  );
  return { ...outline, modules };
}

/** Loads an existing course for the wizard's edit mode. `courseId` undefined = create mode (no-op). */
export function useEditCourseSource(courseId: string | undefined) {
  const [isLoading, setIsLoading] = useState(Boolean(courseId));
  const [notFound, setNotFound] = useState(false);
  const [initial, setInitial] = useState<EditCourseInitial | null>(null);
  const [snapshot, setSnapshot] = useState<CourseSnapshot | null>(null);

  useEffect(() => {
    if (!courseId) return;
    let alive = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const course = (await coursesApi.getOne(courseId)) as ServerCourse | null;
        if (!course?.id) throw new Error("Course not found");
        const outline = await withQuizzes(courseToOutline(course));
        if (!alive) return;
        setInitial({ basic: courseToBasicInfo(course), outline, publish: courseToPublish(course) });
        setSnapshot(snapshotOf(course, outline));
      } catch (err) {
        if (!alive) return;
        setNotFound(true);
        toast.error("Couldn't load the course", { description: apiErrorMessage(err, "Please go back and try again.") });
      } finally {
        if (alive) setIsLoading(false);
      }
    };
    void load();
    return () => {
      alive = false;
    };
  }, [courseId]);

  return { isLoading, notFound, initial, snapshot };
}
