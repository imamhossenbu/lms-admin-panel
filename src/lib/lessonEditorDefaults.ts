import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import type { LessonEditorLessonRef } from "@/types/lessonEditor";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);

/** Starting values for a lesson the editor hasn't saved yet (the API fields are filled in from the lesson row). */
export function defaultLessonEditorValues(ref: LessonEditorLessonRef, courseTitle = ""): LessonEditorValues {
  const suffix = courseTitle ? ` | ${courseTitle}` : "";
  const seoSlug = slugify(ref.title);
  return {
    content: {
      title: ref.title,
      shortDescription: "",
      moduleId: ref.moduleId,
      type: ref.type,
      durationMinutes: 10,
      body: "",
      status: "DRAFT",
      visibility: "PUBLIC",
      publishDate: "",
      publishTime: "",
      thumbnailUrl: "",
      order: ref.order,
    },
    media: {
      video: { source: "UPLOAD", url: "", fileName: "", fileSize: 0, width: 0, height: 0, durationSeconds: 0, format: "" },
      player: { enabled: true, allowDownload: false, playbackSpeed: true, pictureInPicture: true, showSubtitles: true },
      posterUrl: "",
      subtitles: [],
    },
    settings: {
      freePreview: false,
      allowComments: true,
      allowQuestions: true,
      showInCurriculum: true,
      downloadableContent: false,
      completion: "MANUAL",
      watchThreshold: 90,
      difficulty: "BEGINNER",
      tags: [],
    },
    access: {
      visibility: "PUBLIC",
      accessType: "AFTER_ENROLLMENT",
      prerequisiteLessonId: "",
      groupMode: "ALL",
      groupIds: [],
      planRestriction: { enabled: false, planIds: [] },
      dateRestriction: { enabled: false, startDate: "", startTime: "", endDate: "", endTime: "" },
      geoRestriction: { enabled: false, countries: [] },
    },
    drip: {
      releaseType: "IMMEDIATE",
      releaseValue: 7,
      releaseUnit: "DAYS",
      releaseDate: "",
      releaseTime: "",
      dependencies: { enabled: false, lessonIds: [] },
      beforeRelease: "SHOW_MESSAGE",
      lockedMessage: "",
    },
    seo: {
      // The SEO schema needs ≥ 10 characters.
      title: (`${ref.title}${suffix}`.length >= 10 ? `${ref.title}${suffix}` : `${ref.title} | Lesson`).slice(0, 70),
      description: `${ref.title}: a step-by-step lesson${courseTitle ? ` from the ${courseTitle} course` : ""} with practical examples.`.slice(0, 160),
      slug: seoSlug.length >= 3 ? seoSlug : `lesson-${seoSlug || "page"}`,
      focusKeyword: "",
      metaKeywords: [],
      canonicalUrl: "",
    },
    quiz: {
      enabled: false,
      id: "",
      title: ref.type === "QUIZ" ? ref.title : "",
      description: "",
      kind: "GRADED",
      passingScore: 70,
      questions: [],
      questionOrder: "SEQUENTIAL",
      showResults: "AFTER_SUBMISSION",
      showCorrectAnswers: true,
      showExplanations: false,
      timeLimitMinutes: null,
      attempts: "UNLIMITED",
      requireToComplete: false,
      showInNavigation: true,
    },
    resources: { items: [] },
    notes: { enabled: true, showInInstructorView: true, items: [] },
  };
}
