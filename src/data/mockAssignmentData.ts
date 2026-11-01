import type {
  AssignmentInstructions,
  AssignmentItem,
  AssignmentRubric,
  AssignmentStudent,
  AssignmentSubmission,
  AssignmentType,
  RubricCriterion,
} from "@/types/assignment";
import { MOCK_LESSON_COURSE_ID, MOCK_LESSON_REFS } from "@/data/mockLessonEditorData";

/**
 * Deterministic mock data for Assignments (mock-first phase).
 * - Course: the same "HTML Fundamentals" mock used by the Edit Lesson page (module/lesson ids match).
 * - 12 assignments, 32 enrolled students; 186 submissions in total, 24 pending, 162 graded.
 * - Due dates are relative to the moment the data is first seeded so "5 days left" stays meaningful.
 * Every number on the pages is DERIVED from these records (see src/lib/assignmentStats.ts) — never hard-coded.
 */

export const ENROLLED_STUDENTS = 32;

// ---------------------------------------------------------------- deterministic RNG
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------- students
const STUDENT_NAMES = [
  "Sarah Rahman", "Mahin Tarek", "Ayesha Faria", "Rakibul Islam", "Sadia Nur", "Imran Hossain", "Nusrat Tahsin", "Ahmed Rony",
  "Fahim Rahman", "Sadia Islam", "Nafis Ahmed", "Ayesha Khan", "Tanvir Hossain", "Nusrat Jahan", "Rafiul Karim", "Meherun Nesa",
  "Tahia Akter", "Zubair Al Mahmud", "Farhana Chowdhury", "Arifur Rahman", "Shamima Nasrin", "Kamrul Hasan", "Sabrina Sultana", "Mahmudul Hasan",
  "Tasnim Ferdous", "Shahriar Kabir", "Nabila Tabassum", "Rashedul Islam", "Jannatul Ferdous", "Tariqul Anam", "Salma Khatun", "Hasibul Alam",
];
const GROUPS = ["Group A", "Group B", "Group C", "Group D"];

export const MOCK_ASSIGNMENT_STUDENTS: AssignmentStudent[] = STUDENT_NAMES.map((name, i) => {
  const first = name.split(" ")[0].toLowerCase();
  return { id: `student-${i + 1}`, name, email: `${first}${i > 7 ? i + 1 : ""}@example.com`, group: GROUPS[i % GROUPS.length] };
});

// ---------------------------------------------------------------- helpers
const pad = (n: number) => String(n).padStart(2, "0");
const toDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const lessonByTitle = (title: string) => {
  const ref = MOCK_LESSON_REFS.find((l) => l.title === title);
  if (!ref) throw new Error(`Mock lesson "${title}" not found`);
  return ref;
};

export const defaultRubricCriteria = (titles: string[], perCriterion: number): RubricCriterion[] =>
  titles.map((title, i) => {
    const good = Math.max(1, Math.round(perCriterion * 0.625));
    const low = Math.max(0, Math.round(perCriterion * 0.25));
    return {
      id: `crit-${i + 1}`,
      title,
      points: perCriterion,
      levels: [
        { id: `crit-${i + 1}-ex`, tone: "EXCELLENT", label: "Excellent", points: perCriterion, description: `${title} is complete, correct and well organised.` },
        { id: `crit-${i + 1}-gd`, tone: "GOOD", label: "Good", points: good, description: `${title} is mostly correct with minor issues.` },
        { id: `crit-${i + 1}-ni`, tone: "NEEDS_IMPROVEMENT", label: "Needs Improvement", points: low, description: `${title} is missing or has major issues.` },
      ],
    };
  });

const INTRO_RUBRIC: AssignmentRubric = {
  enabled: true,
  title: "HTML Page Grading Rubric",
  totalPoints: 32,
  description: "This rubric will be used to evaluate your HTML page submission based on structure, content, links and code quality.",
  visibleToStudents: true,
  criteria: [
    { id: "crit-1", title: "HTML Structure", points: 8, levels: [
      { id: "crit-1-ex", tone: "EXCELLENT", label: "Excellent", points: 8, description: "Proper HTML5 structure with all required elements (doctype, html, head, body)." },
      { id: "crit-1-gd", tone: "GOOD", label: "Good", points: 5, description: "Most structure elements are present with minor issues." },
      { id: "crit-1-ni", tone: "NEEDS_IMPROVEMENT", label: "Needs Improvement", points: 2, description: "Missing several key elements or incorrect structure." },
    ] },
    { id: "crit-2", title: "Headings & Paragraphs", points: 8, levels: [
      { id: "crit-2-ex", tone: "EXCELLENT", label: "Excellent", points: 8, description: "Uses correct heading tags (h1, h2, etc.) and well structured paragraphs." },
      { id: "crit-2-gd", tone: "GOOD", label: "Good", points: 5, description: "Uses headings and paragraphs with minor issues." },
      { id: "crit-2-ni", tone: "NEEDS_IMPROVEMENT", label: "Needs Improvement", points: 2, description: "Incorrect or missing headings/paragraphs." },
    ] },
    { id: "crit-3", title: "Hyperlink", points: 8, levels: [
      { id: "crit-3-ex", tone: "EXCELLENT", label: "Excellent", points: 8, description: "Includes a working hyperlink with correct anchor tag." },
      { id: "crit-3-gd", tone: "GOOD", label: "Good", points: 5, description: "Includes a hyperlink with minor issues." },
      { id: "crit-3-ni", tone: "NEEDS_IMPROVEMENT", label: "Needs Improvement", points: 2, description: "Missing hyperlink or incorrect implementation." },
    ] },
    { id: "crit-4", title: "Code Quality", points: 8, levels: [
      { id: "crit-4-ex", tone: "EXCELLENT", label: "Excellent", points: 8, description: "Clean, well formatted code with proper indentation." },
      { id: "crit-4-gd", tone: "GOOD", label: "Good", points: 5, description: "Code is readable with minor formatting issues." },
      { id: "crit-4-ni", tone: "NEEDS_IMPROVEMENT", label: "Needs Improvement", points: 2, description: "Poorly formatted code, difficult to read." },
    ] },
  ],
};

const INTRO_INSTRUCTIONS: AssignmentInstructions = {
  overview:
    "In this assignment, you will create a simple HTML page using the concepts learned in this module. The page should include a proper structure, headings, paragraphs and a link.",
  objectives: [
    "Understand the basic structure of an HTML document",
    "Use headings and paragraphs correctly",
    "Create and use a hyperlink",
    "Apply basic HTML best practices",
  ],
  tasks: [
    "Create a new HTML file named `index.html`",
    "Add a proper HTML structure (DOCTYPE, html, head, body)",
    "Include a main heading `h1` with a welcome message",
    "Add at least one paragraph describing yourself",
    "Include a hyperlink to any website (e.g. Google)",
  ],
  requirements: [
    "Upload your HTML file (e.g. `index.html`)",
    "Make sure the file is complete and working",
    "You can also upload a ZIP file if you include additional files (e.g. images, CSS)",
  ],
  allowedFileTypes: [".html", ".htm", ".zip", ".pdf", ".doc", ".docx", ".txt", ".png", ".jpg"],
  maxFileSizeMb: 50,
  gradingNotes: ["Correct HTML structure", "Proper use of headings and paragraphs", "Working hyperlink", "Clean and readable code"],
};

const genericInstructions = (title: string, type: AssignmentType): AssignmentInstructions => ({
  overview: `In this assignment, "${title}", you will practise the concepts from this module by building a small, working example.`,
  objectives: ["Apply the module concepts in a real example", "Write valid, semantic HTML", "Keep your code clean and readable"],
  tasks: ["Read the lesson notes for this module", `Complete the "${title}" task`, "Test your work in a browser", "Submit before the due date"],
  requirements:
    type === "FILE_UPLOAD"
      ? ["Upload your HTML file or a ZIP of your project", "Make sure all files open correctly"]
      : ["Paste your HTML code or answer in the text box", "Format code so it is easy to read"],
  allowedFileTypes: type === "FILE_UPLOAD" ? [".html", ".zip", ".pdf", ".png", ".jpg"] : [],
  maxFileSizeMb: 50,
  gradingNotes: ["Correct use of HTML elements", "Completeness of the task", "Code quality"],
});

// ---------------------------------------------------------------- assignment specs (order = list order)
interface Spec {
  title: string;
  description: string;
  lesson: string;
  type: AssignmentType;
  dueInDays: number;
  published: boolean;
  submitted: number;
  pending: number;
  late: number;
  criteria?: string[];
}

const SPECS: Spec[] = [
  { title: "Build a Simple HTML Page", description: "Create a simple HTML page using the concepts learned in this module. The page should include a proper structure, headings, paragraphs and a link.", lesson: "Your First HTML Page", type: "FILE_UPLOAD", dueInDays: 5, published: true, submitted: 28, pending: 4, late: 0 },
  { title: "HTML Elements Practice", description: "Practise the most common HTML elements by writing a short article with headings, paragraphs and emphasis.", lesson: "Headings and Paragraphs", type: "TEXT", dueInDays: 2, published: true, submitted: 30, pending: 6, late: 0, criteria: ["Element Usage", "Structure", "Formatting", "Code Quality"] },
  { title: "Create a Personal Profile Page", description: "Build a personal profile page with a bio, a list of your skills and links to your social profiles.", lesson: "Ordered and Unordered Lists", type: "FILE_UPLOAD", dueInDays: 8, published: true, submitted: 18, pending: 5, late: 0, criteria: ["Page Structure", "Lists", "Links", "Code Quality"] },
  { title: "HTML Table Exercise", description: "Recreate the given timetable using an accessible HTML table with headers and captions.", lesson: "Building Tables", type: "TEXT", dueInDays: 13, published: true, submitted: 12, pending: 3, late: 0, criteria: ["Table Markup", "Headers & Captions", "Accessibility", "Code Quality"] },
  { title: "Build a Product Card", description: "Design a product card with an image, title, price and a call-to-action button.", lesson: "Input Types", type: "FILE_UPLOAD", dueInDays: 16, published: false, submitted: 0, pending: 0, late: 0, criteria: ["Layout", "Content", "Semantics", "Code Quality"] },
  { title: "Form Validation Practice", description: "Create a sign-up form that uses built-in HTML validation attributes.", lesson: "Form Validation", type: "TEXT", dueInDays: 21, published: false, submitted: 0, pending: 0, late: 0, criteria: ["Form Fields", "Validation", "Labels", "Code Quality"] },
  { title: "Build a Complete Web Page", description: "Combine everything from the course into a complete multi-section web page.", lesson: "Final Project: Portfolio Page", type: "FILE_UPLOAD", dueInDays: 26, published: false, submitted: 0, pending: 0, late: 0, criteria: ["Structure", "Content", "Semantics", "Code Quality"] },
  { title: "Extra Practice: HTML Basics", description: "Optional extra practice covering the basics from the first module.", lesson: "Introduction to HTML", type: "TEXT", dueInDays: 31, published: false, submitted: 0, pending: 0, late: 0, criteria: ["Accuracy", "Structure", "Formatting", "Code Quality"] },
  { title: "Media Gallery Page", description: "Build a gallery page with images, captions and an embedded video.", lesson: "Media Gallery Project", type: "FILE_UPLOAD", dueInDays: -6, published: true, submitted: 32, pending: 2, late: 3, criteria: ["Images", "Captions", "Video Embed", "Code Quality"] },
  { title: "Link Navigation Menu", description: "Create a navigation menu that links to sections on the same page and to external sites.", lesson: "Creating Links", type: "TEXT", dueInDays: -3, published: true, submitted: 32, pending: 2, late: 2, criteria: ["Navigation", "Anchors", "External Links", "Code Quality"] },
  { title: "Responsive Images Practice", description: "Use srcset and sizes to serve the right image for each screen size.", lesson: "Responsive Images", type: "FILE_UPLOAD", dueInDays: -1, published: true, submitted: 18, pending: 1, late: 1, criteria: ["srcset Usage", "Alt Text", "Performance", "Code Quality"] },
  { title: "Accessibility Audit", description: "Audit a sample page and fix its accessibility issues using semantic HTML and ARIA.", lesson: "Accessibility Basics", type: "TEXT", dueInDays: 1, published: true, submitted: 16, pending: 1, late: 0, criteria: ["Issues Found", "Fixes Applied", "Semantics", "Explanation"] },
];

export interface AssignmentSeed {
  assignments: AssignmentItem[];
  submissions: AssignmentSubmission[];
}

/** Builds the full seed relative to `now`. Pure + deterministic for a given `now` day. */
export function buildAssignmentSeed(now: Date = new Date()): AssignmentSeed {
  const rand = mulberry32(20261020);
  const assignments: AssignmentItem[] = [];
  const submissions: AssignmentSubmission[] = [];

  SPECS.forEach((spec, index) => {
    const id = `assignment-${index + 1}`;
    const ref = lessonByTitle(spec.lesson);
    const due = new Date(now.getFullYear(), now.getMonth(), now.getDate() + spec.dueInDays, 23, 59);
    const created = new Date(now.getTime() - (40 - index) * 86400000);
    const isIntro = index === 0;
    const rubric: AssignmentRubric = isIntro
      ? INTRO_RUBRIC
      : {
          enabled: true,
          title: `${spec.title} Rubric`,
          totalPoints: 32,
          description: `Grading rubric for "${spec.title}".`,
          visibleToStudents: true,
          criteria: defaultRubricCriteria(spec.criteria ?? ["Structure", "Content", "Links", "Code Quality"], 8),
        };

    assignments.push({
      id,
      courseId: MOCK_LESSON_COURSE_ID,
      title: spec.title,
      descriptionHtml: `<p>${spec.description}</p>`,
      moduleId: ref.moduleId,
      lessonId: ref.id,
      type: spec.type,
      dueDate: toDate(due),
      dueTime: "23:59",
      totalPoints: 32,
      attempts: "UNLIMITED",
      lateSubmission: "ALLOW",
      gradingType: "POINTS",
      showRubric: true,
      peerReview: false,
      status: spec.published ? "PUBLISHED" : "DRAFT",
      attachments: isIntro
        ? [
            { id: "att-1", name: "starter-template.zip", url: "https://res.cloudinary.com/demo/raw/upload/starter-template.zip", size: Math.round(1.2 * 1024 * 1024), format: "ZIP" },
            { id: "att-2", name: "sample-output.png", url: "https://res.cloudinary.com/demo/image/upload/sample-output.png", size: 856 * 1024, format: "PNG" },
            { id: "att-3", name: "additional-resources.pdf", url: "https://res.cloudinary.com/demo/raw/upload/additional-resources.pdf", size: 420 * 1024, format: "PDF" },
          ]
        : [],
      instructions: isIntro ? INTRO_INSTRUCTIONS : genericInstructions(spec.title, spec.type),
      rubric,
      enrolledCount: ENROLLED_STUDENTS,
      createdAt: created.toISOString(),
      updatedAt: created.toISOString(),
    });

    // ---- submissions: first `submitted` students; the last `pending` of them are ungraded; `late` ones submitted after due.
    for (let s = 0; s < spec.submitted; s++) {
      const student = MOCK_ASSIGNMENT_STUDENTS[s];
      const isPending = s >= spec.submitted - spec.pending;
      const isLate = s < spec.late;
      const latestAllowed = Math.min(now.getTime() - 30 * 60000, due.getTime());
      const submittedAt = isLate
        ? new Date(Math.min(due.getTime() + (1 + Math.floor(rand() * 20)) * 3600000, now.getTime() - 10 * 60000))
        : new Date(latestAllowed - Math.floor(rand() * 7 * 86400000));
      const criterionScores: Record<string, number> = {};
      let score: number | null = null;
      if (!isPending) {
        score = 0;
        for (const c of rubric.criteria) {
          const r = rand();
          const pts = r > 0.55 ? c.points : r > 0.25 ? c.points - 1 - Math.floor(rand() * 2) : r > 0.08 ? Math.round(c.points * 0.6) : Math.round(c.points * 0.3);
          criterionScores[c.id] = Math.max(0, Math.min(c.points, pts));
          score += criterionScores[c.id];
        }
      }
      submissions.push({
        id: `${id}-sub-${s + 1}`,
        assignmentId: id,
        student,
        submittedAt: submittedAt.toISOString(),
        status: isPending ? "PENDING" : "GRADED",
        isLate,
        score,
        criterionScores,
        timeTakenMinutes: isPending && rand() > 0.5 ? null : 40 + Math.floor(rand() * 180),
        feedback: isPending ? "" : score !== null && score >= 28 ? "Excellent work — well structured and clean." : "Good effort. Review the rubric notes to improve.",
        fileName: spec.type === "FILE_UPLOAD" ? `${student.name.split(" ")[0].toLowerCase()}-${index + 1}.zip` : "",
        textAnswer: spec.type === "TEXT" ? "<!DOCTYPE html>\n<html>\n  <body>\n    <h1>My answer</h1>\n  </body>\n</html>" : "",
        gradedAt: isPending ? null : new Date(submittedAt.getTime() + 6 * 3600000).toISOString(),
      });
    }
  });

  return { assignments, submissions };
}
