import type { LessonEditorContext, LessonEditorLessonRef } from "@/types/lessonEditor";
import type { AiLessonType } from "@/components/courses/create/aiOutline";
import { MOCK_LESSON_CONTEXT } from "@/data/mockLessonEditorData";
import { MOCK_QUIZ_COURSES } from "@/data/mockQuizData";

/**
 * Mock course catalogue shared by Assignments (and anything else that needs course → modules → lessons).
 * HTML Fundamentals reuses the Edit Lesson mock; the other courses come from the Quizzes mock with
 * 3 generated lessons per module. Swap for the courses API in the backend phase.
 */

const LESSON_TYPES: AiLessonType[] = ["VIDEO", "TEXT", "CODING"];
const LESSON_MINUTES = [12, 9, 15];

function buildContext(courseIndex: number): LessonEditorContext {
  const course = MOCK_QUIZ_COURSES[courseIndex];
  const slug = course.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const lessons: LessonEditorLessonRef[] = course.modules.flatMap((m) =>
    [0, 1, 2].map((i) => ({
      id: `${m.id}-lesson-${i + 1}`,
      title: i === 0 ? `Introduction to ${m.title}` : i === 1 ? `${m.title} in Practice` : `${m.title} Exercise`,
      type: LESSON_TYPES[i],
      moduleId: m.id,
      moduleTitle: m.title,
      order: i + 1,
    }))
  );
  return {
    ...MOCK_LESSON_CONTEXT,
    course: {
      id: course.id,
      title: course.title,
      thumbnailUrl: "",
      status: "PUBLISHED",
      moduleCount: course.modules.length,
      lessonCount: lessons.length,
      totalMinutes: lessons.reduce((s, l) => s + LESSON_MINUTES[l.order - 1], 0),
      publicUrl: `https://lms.yoursite.com/courses/${slug}`,
    },
    modules: course.modules.map((m) => ({ id: m.id, title: m.title, order: m.order })),
    lessons,
  };
}

export const COURSE_CONTEXTS: LessonEditorContext[] = [MOCK_LESSON_CONTEXT, ...MOCK_QUIZ_COURSES.slice(1).map((_, i) => buildContext(i + 1))];

export const COURSE_OPTIONS = COURSE_CONTEXTS.map((c) => ({ value: c.course.id, label: c.course.title }));

/** Context for a course id (falls back to HTML Fundamentals for unknown ids, e.g. real API course ids in the mock phase). */
export function getCourseContext(courseId: string): LessonEditorContext {
  const found = COURSE_CONTEXTS.find((c) => c.course.id === courseId);
  return found ?? { ...MOCK_LESSON_CONTEXT, course: { ...MOCK_LESSON_CONTEXT.course, id: courseId } };
}

export const isKnownCourse = (courseId: string) => COURSE_CONTEXTS.some((c) => c.course.id === courseId);
