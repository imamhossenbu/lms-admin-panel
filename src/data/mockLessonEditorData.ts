import type { AiLessonType } from "@/components/courses/create/aiOutline";
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
