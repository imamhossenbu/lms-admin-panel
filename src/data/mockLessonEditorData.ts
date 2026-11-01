import type { AiLessonType } from "@/components/courses/create/aiOutline";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import type { LessonEditorContext, LessonEditorLessonRef } from "@/types/lessonEditor";

/**
 * Mock data for the Edit Lesson page (mock-first phase — no API yet).
 * Matches the design: "HTML Fundamentals", 6 modules, 28 lessons, 4 hr 30 min,
 * editing "Introduction to HTML" (Module 1, lesson 1).
 */

export const MOCK_LESSON_COURSE_ID = "course-html-fundamentals";
export const MOCK_LESSON_ID = "lesson-intro-to-html";

const MODULES: { id: string; title: string; lessons: [string, AiLessonType, number][] }[] = [
  {
    id: "module-getting-started",
    title: "Getting Started",
    lessons: [
      ["Introduction to HTML", "VIDEO", 15],
      ["What is HTML?", "VIDEO", 10],
      ["Setting Up Your Editor", "VIDEO", 8],
      ["Your First HTML Page", "CODING", 12],
      ["Getting Started Quiz", "QUIZ", 5],
    ],
  },
  {
    id: "module-html-structure",
    title: "HTML Document Structure",
    lessons: [
      ["The HTML Boilerplate", "VIDEO", 10],
      ["Head vs Body", "TEXT", 6],
      ["Headings and Paragraphs", "VIDEO", 9],
      ["Comments and Whitespace", "TEXT", 5],
      ["Structure Practice", "ASSIGNMENT", 15],
    ],
  },
  {
    id: "module-text-links",
    title: "Text, Links and Lists",
    lessons: [
      ["Formatting Text", "VIDEO", 11],
      ["Creating Links", "VIDEO", 12],
      ["Ordered and Unordered Lists", "CODING", 10],
      ["Links and Lists Quiz", "QUIZ", 6],
    ],
  },
  {
    id: "module-media",
    title: "Images and Media",
    lessons: [
      ["Adding Images", "VIDEO", 10],
      ["Audio and Video Tags", "VIDEO", 9],
      ["Responsive Images", "TEXT", 8],
      ["Media Gallery Project", "ASSIGNMENT", 20],
    ],
  },
  {
    id: "module-forms-tables",
    title: "Forms and Tables",
    lessons: [
      ["Building Tables", "VIDEO", 12],
      ["Form Basics", "VIDEO", 14],
      ["Input Types", "CODING", 11],
      ["Form Validation", "TEXT", 9],
      ["Forms Quiz", "QUIZ", 6],
    ],
  },
  {
    id: "module-semantic-html",
    title: "Semantic HTML and Accessibility",
    lessons: [
      ["Semantic Elements", "VIDEO", 10],
      ["Accessibility Basics", "VIDEO", 9],
      ["ARIA Attributes", "TEXT", 6],
      ["Final Project: Portfolio Page", "ASSIGNMENT", 4],
      ["Course Wrap-up", "VIDEO", 8],
    ],
  },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const MOCK_LESSON_REFS: LessonEditorLessonRef[] = MODULES.flatMap((m) =>
  m.lessons.map(([title, type], i) => ({
    id: i === 0 && m.id === "module-getting-started" ? MOCK_LESSON_ID : `lesson-${slug(title)}`,
    title,
    type,
    moduleId: m.id,
    moduleTitle: m.title,
    order: i + 1,
  }))
);

const TOTAL_MINUTES = MODULES.flatMap((m) => m.lessons).reduce((sum, [, , min]) => sum + min, 0);

export const MOCK_LESSON_CONTEXT: LessonEditorContext = {
  course: {
    id: MOCK_LESSON_COURSE_ID,
    title: "HTML Fundamentals",
    thumbnailUrl: "",
    status: "PUBLISHED",
    moduleCount: MODULES.length,
    lessonCount: MOCK_LESSON_REFS.length,
    totalMinutes: TOTAL_MINUTES,
    publicUrl: "https://lms.yoursite.com/courses/html-fundamentals",
  },
  modules: MODULES.map((m, i) => ({ id: m.id, title: m.title, order: i + 1 })),
  lessons: MOCK_LESSON_REFS,
  plans: [
    { value: "plan-free", label: "Free Plan" },
    { value: "plan-pro", label: "Pro Plan" },
    { value: "plan-premium", label: "Premium Plan" },
    { value: "plan-team", label: "Team Plan" },
  ],
  groups: [
    { value: "group-beginners", label: "Beginner Students" },
    { value: "group-premium", label: "Premium Members" },
    { value: "group-webdev", label: "Web Development Track" },
    { value: "group-free", label: "Free Plan Users" },
    { value: "group-corporate", label: "Corporate Learners" },
  ],
  countries: [
    { value: "BD", label: "Bangladesh" },
    { value: "IN", label: "India" },
    { value: "PK", label: "Pakistan" },
    { value: "US", label: "United States" },
    { value: "GB", label: "United Kingdom" },
    { value: "CA", label: "Canada" },
    { value: "AU", label: "Australia" },
    { value: "DE", label: "Germany" },
    { value: "AE", label: "United Arab Emirates" },
    { value: "SG", label: "Singapore" },
  ],
  subtitleLanguages: [
    { value: "English", label: "English" },
    { value: "Bangla", label: "Bangla" },
    { value: "Hindi", label: "Hindi" },
    { value: "Spanish", label: "Spanish" },
    { value: "Arabic", label: "Arabic" },
    { value: "French", label: "French" },
  ],
  currentUser: "Admin",
};

/** Two starter questions so seeded quiz lessons are valid out of the box. */
const sampleQuizQuestions = (topic: string): LessonEditorValues["quiz"]["questions"] => [
  {
    id: "",
    questionText: `Which statement best describes the main idea of "${topic}"?`,
    questionType: "MCQ",
    options: ["It structures web content", "It styles web pages", "It stores data on a server", "It compiles JavaScript"],
    correctAnswer: "It structures web content",
    marks: 1,
    explanation: "",
  },
  {
    id: "",
    questionText: "True or False: HTML elements are written using tags.",
    questionType: "TRUE_FALSE",
    options: ["True", "False"],
    correctAnswer: "True",
    marks: 1,
    explanation: "",
  },
];

/** Defaults for any lesson that has no saved/seeded values yet. */
export function defaultLessonEditorValues(ref: LessonEditorLessonRef): LessonEditorValues {
  const minutes = MODULES.find((m) => m.id === ref.moduleId)?.lessons[ref.order - 1]?.[2] || 10;
  return {
    content: {
      title: ref.title,
      shortDescription: "",
      moduleId: ref.moduleId,
      type: ref.type,
      durationMinutes: Math.max(1, minutes),
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
      title: `${ref.title} | HTML Fundamentals`.slice(0, 70),
      description: `${ref.title}: a step-by-step lesson from the HTML Fundamentals course with practical examples.`.slice(0, 160),
      slug: slug(ref.title),
      focusKeyword: "",
      metaKeywords: [],
      canonicalUrl: "",
    },
    quiz: {
      enabled: ref.type === "QUIZ",
      id: "",
      title: ref.type === "QUIZ" ? ref.title : "",
      description: "",
      kind: "GRADED",
      passingScore: 70,
      questions: ref.type === "QUIZ" ? sampleQuizQuestions(ref.moduleTitle) : [],
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

/** The fully filled lesson from the design screenshots. */
export function seededIntroLessonValues(): LessonEditorValues {
  const base = defaultLessonEditorValues(MOCK_LESSON_REFS[0]);
  return {
    ...base,
    content: {
      ...base.content,
      title: "Introduction to HTML",
      shortDescription:
        "Learn what HTML is, why it is important and how it works. In this lesson, we will cover the basics with simple examples.",
      durationMinutes: 15,
      body: "<p>In this lesson, we will learn the fundamentals of HTML. You will understand what HTML is, how it works and see some practical examples to get started.</p>",
      status: "PUBLISHED",
      visibility: "PUBLIC",
      publishDate: "2026-10-20",
      publishTime: "12:00",
      order: 1,
    },
    media: {
      ...base.media,
      video: {
        source: "UPLOAD",
        url: "https://res.cloudinary.com/demo/video/upload/lesson-01-introduction-to-html.mp4",
        fileName: "lesson-01-introduction-to-html.mp4",
        fileSize: 245 * 1024 * 1024,
        width: 1280,
        height: 720,
        durationSeconds: 765,
        format: "MP4",
      },
      player: { enabled: true, allowDownload: false, playbackSpeed: true, pictureInPicture: true, showSubtitles: true },
      subtitles: [{ id: "sub-en", language: "English", fileName: "subtitle-en.vtt", url: "https://res.cloudinary.com/demo/raw/upload/subtitle-en.vtt", status: "ACTIVE" }],
    },
    settings: { ...base.settings, freePreview: true, tags: ["html", "basics"] },
    access: {
      ...base.access,
      groupMode: "ALL",
      groupIds: ["group-premium", "group-webdev"],
      planRestriction: { enabled: true, planIds: ["plan-pro", "plan-premium"] },
      dateRestriction: { enabled: true, startDate: "2026-10-25", startTime: "00:00", endDate: "2026-12-31", endTime: "23:59" },
    },
    drip: {
      releaseType: "AFTER_ENROLLMENT",
      releaseValue: 7,
      releaseUnit: "DAYS",
      releaseDate: "",
      releaseTime: "",
      dependencies: { enabled: true, lessonIds: [MOCK_LESSON_REFS[1].id] },
      beforeRelease: "SHOW_MESSAGE",
      lockedMessage: "This lesson will be available 7 days after your enrollment.",
    },
    seo: {
      title: "Introduction to HTML - Learn the Basics of HTML | HTML Fundamentals",
      description:
        "Learn what HTML is, why it is important and how it works. In this lesson, you will cover the basics of HTML with simple examples.",
      slug: "introduction-to-html",
      focusKeyword: "HTML introduction",
      metaKeywords: ["html", "html basics", "learn html", "web development"],
      canonicalUrl: "https://lms.yoursite.com/courses/html-fundamentals/lessons/introduction-to-html",
    },
    quiz: {
      ...base.quiz,
      enabled: true,
      title: "Check Your Understanding: HTML Basics",
      description: "Answer the following questions to test your understanding of the key concepts covered in this lesson.",
      kind: "GRADED",
      passingScore: 70,
      questionOrder: "RANDOM",
      showResults: "AFTER_SUBMISSION",
      showCorrectAnswers: true,
      showExplanations: false,
      timeLimitMinutes: 15,
      attempts: "UNLIMITED",
      requireToComplete: true,
      showInNavigation: true,
      questions: [
        { id: "q1", questionText: "Which tag is used to create a heading in HTML?", questionType: "MCQ", options: ["<p>", "<h1>", "<head>", "<title>"], correctAnswer: "<h1>", marks: 1, explanation: "Headings use <h1> to <h6>; <h1> is the most important." },
        { id: "q2", questionText: "What does HTML stand for?", questionType: "MCQ", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlink Text Mark Language", "Home Tool Markup Language"], correctAnswer: "Hyper Text Markup Language", marks: 1, explanation: "" },
        { id: "q3", questionText: "Which element is used to add a link in HTML?", questionType: "MCQ", options: ["<link>", "<a>", "<href>", "<url>"], correctAnswer: "<a>", marks: 1, explanation: "The anchor element <a> with an href attribute creates a hyperlink." },
        { id: "q4", questionText: "True or False: HTML is a programming language.", questionType: "TRUE_FALSE", options: ["True", "False"], correctAnswer: "False", marks: 1, explanation: "HTML is a markup language, not a programming language." },
      ],
    },
    resources: {
      items: [
        { id: "res-1", kind: "FILE", title: "HTML Cheat Sheet", description: "Quick reference for HTML tags", url: "https://res.cloudinary.com/demo/raw/upload/html-cheat-sheet.pdf", fileName: "html-cheat-sheet.pdf", size: 450 * 1024, format: "PDF", visible: true },
        { id: "res-2", kind: "FILE", title: "Exercise Files", description: "Source files for practice", url: "https://res.cloudinary.com/demo/raw/upload/exercise-files.docx", fileName: "exercise-files.docx", size: Math.round(1.2 * 1024 * 1024), format: "DOCX", visible: true },
        { id: "res-3", kind: "LINK", title: "W3Schools HTML Documentation", description: "Official HTML reference", url: "https://www.w3schools.com/html/", fileName: "", size: 0, format: "LINK", visible: true },
        { id: "res-4", kind: "FILE", title: "Project Starter Template", description: "Complete starter template", url: "https://res.cloudinary.com/demo/raw/upload/project-starter.zip", fileName: "project-starter.zip", size: Math.round(2.5 * 1024 * 1024), format: "ZIP", visible: true },
      ],
    },
    notes: {
      enabled: true,
      showInInstructorView: true,
      items: [
        { id: "note-1", html: "<p><strong>Important: Update Example Code</strong></p><p>Update the HTML structure example with the latest standards (HTML5).</p>", important: true, visibleToAll: true, createdAt: "2026-10-18T10:00:00.000Z", author: "Admin" },
        { id: "note-2", html: "<p><strong>Explain with Real Example</strong></p><p>Use a real website example to make it easier for beginners.</p>", important: false, visibleToAll: true, createdAt: "2026-10-12T10:00:00.000Z", author: "John Doe" },
        { id: "note-3", html: "<p><strong>Check Quiz Questions</strong></p><p>Review quiz questions before publishing.</p>", important: false, visibleToAll: false, createdAt: "2026-10-10T10:00:00.000Z", author: "Admin" },
      ],
    },
  };
}
