import { coursesApi } from "@/lib/api";
import type { AiOutline, AiOutlineLesson } from "../aiOutline";
import { lessonPayloadForApi, moduleDescriptionForApi } from "../aiOutline";
import { saveLessonQuiz } from "../lesson/quiz/quizSync";
import type { CourseSnapshot } from "./courseToWizard";

/** Plain-text description for the quiz (lesson content is HTML). */
const quizDescription = (lesson: AiOutlineLesson) =>
  (lesson.details?.content ?? lesson.summary ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || undefined;

async function syncQuiz(courseId: string, lessonId: string, lesson: AiOutlineLesson) {
  const quiz = lesson.details?.quiz;
  if (lesson.type !== "QUIZ" || !quiz) return;
  await saveLessonQuiz({ courseId, lessonId, title: lesson.title, description: quizDescription(lesson), quiz });
}

/**
 * Makes the server curriculum match `outline`:
 *   - lessons / modules that existed at load time but are gone → deleted
 *   - ids from the load-time snapshot → updated (order, content, module move)
 *   - everything else (local ids) → created
 * Runs sequentially so order numbers stay consistent.
 */
export async function syncCurriculum(snapshot: CourseSnapshot, outline: AiOutline): Promise<void> {
  const { courseId } = snapshot;
  const keptModuleIds = new Set(outline.modules.map((m) => m.id).filter((id) => snapshot.moduleIds.has(id)));
  const keptLessonIds = new Set(outline.modules.flatMap((m) => m.lessons.map((l) => l.id)).filter((id) => snapshot.lessonModule.has(id)));

  // 1) Deletions (lessons first; modules whose lessons were all removed go afterwards).
  for (const [lessonId, moduleId] of snapshot.lessonModule) {
    if (!keptLessonIds.has(lessonId)) await coursesApi.deleteLesson(courseId, moduleId, lessonId);
  }
  for (const moduleId of snapshot.moduleIds) {
    if (!keptModuleIds.has(moduleId)) await coursesApi.deleteModule(courseId, moduleId);
  }

  // 2) Upserts in display order.
  for (let mi = 0; mi < outline.modules.length; mi++) {
    const outlineModule = outline.modules[mi];
    const moduleData = { title: outlineModule.title, description: moduleDescriptionForApi(outlineModule), order: mi + 1 };

    let moduleId = outlineModule.id;
    if (keptModuleIds.has(moduleId)) {
      await coursesApi.updateModule(courseId, moduleId, moduleData);
    } else {
      const created = await coursesApi.createModule(courseId, moduleData);
      if (!created?.id) throw new Error(`Module "${outlineModule.title}" could not be created.`);
      moduleId = created.id;
    }

    for (let li = 0; li < outlineModule.lessons.length; li++) {
      const lesson = outlineModule.lessons[li];
      const payload = lessonPayloadForApi(lesson, li + 1);
      const previousModuleId = snapshot.lessonModule.get(lesson.id);

      if (keptLessonIds.has(lesson.id) && previousModuleId) {
        // Address the lesson under the module it lived in on the server; moduleId moves it if it changed.
        await coursesApi.updateLesson(courseId, previousModuleId, lesson.id, {
          ...payload,
          ...(previousModuleId !== moduleId ? { moduleId } : {}),
        });
        await syncQuiz(courseId, lesson.id, lesson);
      } else {
        const created = await coursesApi.createLesson(courseId, moduleId, payload);
        if (created?.id) {
          // A new lesson never owns an existing quiz (e.g. copied from another lesson).
          const fresh = lesson.details?.quiz ? { ...lesson, details: { ...lesson.details, quiz: { ...lesson.details.quiz, id: "" } } } : lesson;
          await syncQuiz(courseId, created.id, fresh);
        }
      }
    }
  }
}
