import type {
  QuizActivity,
  QuizAttempt,
  QuizCourseRef,
  QuizDifficulty,
  QuizItem,
  QuizQuestionItem,
  QuizStatus,
  QuizStudent,
} from "@/types/quiz";
import { MOCK_LESSON_CONTEXT } from "@/data/mockLessonEditorData";

/**
 * Deterministic mock data for Quizzes (mock-first phase).
 * 24 quizzes (18 published · 4 drafts · 2 archived) across 4 courses; attempts are generated per
 * question (correct/incorrect + time), so every statistic is DERIVED in src/lib/quizStats.ts.
 * Drafts have no attempts (students can't take unpublished quizzes).
 */

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

// ---------------------------------------------------------------- courses
const html = MOCK_LESSON_CONTEXT;
export const MOCK_QUIZ_COURSES: QuizCourseRef[] = [
  { id: html.course.id, title: html.course.title, modules: html.modules.map((m) => ({ id: m.id, title: m.title, order: m.order })) },
  {
    id: "course-javascript-essentials",
    title: "JavaScript Essentials",
    modules: ["Introduction", "Variables & Types", "DOM Manipulation", "Events", "Async JavaScript"].map((t, i) => ({ id: `js-module-${i + 1}`, title: t, order: i + 1 })),
  },
  {
    id: "course-advanced-css",
    title: "Advanced CSS",
    modules: ["Selectors Deep Dive", "Flexbox", "Grid Layout", "Responsive Design", "Accessibility"].map((t, i) => ({ id: `css-module-${i + 1}`, title: t, order: i + 1 })),
  },
  {
    id: "course-css-frameworks",
    title: "CSS Frameworks",
    modules: ["Bootstrap Basics", "Tailwind CSS", "Components", "Theming"].map((t, i) => ({ id: `fw-module-${i + 1}`, title: t, order: i + 1 })),
  },
];

// ---------------------------------------------------------------- students
const FIRST = ["Samira", "Rafiul", "Mushfiqur", "Jannatul", "Mahmudul", "Nusrat", "Alvi", "Sadia", "Irfan", "Tanzim", "Ayesha", "Imran", "Farhana", "Tanvir", "Nabila", "Rakib", "Sumaiya", "Arif", "Tahmina", "Shahriar"];
const LAST = ["Akter", "Tanvir", "Rahman", "Sumi", "Hasan", "Jahan", "Hasan", "Rahman", "Khan", "Khan", "Siddiqua", "Hossain", "Chowdhury", "Ahmed", "Islam", "Karim"];
export const MOCK_QUIZ_STUDENTS: QuizStudent[] = Array.from({ length: 160 }, (_, i) => {
  const first = FIRST[i % FIRST.length];
  const last = LAST[(i * 7 + Math.floor(i / FIRST.length)) % LAST.length];
  const tag = i < FIRST.length ? "" : String(i);
  return { id: `quiz-student-${i + 1}`, name: `${first} ${last}`, email: `${first.toLowerCase()}${tag}@example.com` };
});

// ---------------------------------------------------------------- questions
let qCounter = 0;
const qid = () => `q-${++qCounter}`;
const mc = (text: string, options: string[], correct: number, explanation = "", points = 5): QuizQuestionItem => {
  const opts = options.map((t, i) => ({ id: `${qCounter + 1}-o${i + 1}`, text: t }));
  return { id: qid(), kind: "MULTIPLE_CHOICE", questionHtml: `<p>${text}</p>`, options: opts, correctOptionIds: [opts[correct].id], acceptedAnswers: [], explanationHtml: explanation ? `<p>${explanation}</p>` : "", points, timeLimitSeconds: 60, required: true, shuffleOptions: false };
};
const tf = (text: string, answer: boolean, explanation = "", points = 5): QuizQuestionItem => {
  const opts = [{ id: `${qCounter + 1}-t`, text: "True" }, { id: `${qCounter + 1}-f`, text: "False" }];
  return { id: qid(), kind: "TRUE_FALSE", questionHtml: `<p>${text}</p>`, options: opts, correctOptionIds: [answer ? opts[0].id : opts[1].id], acceptedAnswers: [], explanationHtml: explanation ? `<p>${explanation}</p>` : "", points, timeLimitSeconds: 30, required: true, shuffleOptions: false };
};
const sa = (text: string, answers: string[], explanation = "", points = 5): QuizQuestionItem => ({
  id: qid(), kind: "SHORT_ANSWER", questionHtml: `<p>${text}</p>`, options: [], correctOptionIds: [], acceptedAnswers: answers, explanationHtml: explanation ? `<p>${explanation}</p>` : "", points, timeLimitSeconds: 90, required: true, shuffleOptions: false,
});

const HTML_BASICS_QUESTIONS = (): QuizQuestionItem[] => [
  mc("What does HTML stand for?", ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlink and Text Markup Language", "Home Tool Markup Language"], 0, "HTML stands for Hyper Text Markup Language. It is the standard language used to create web pages."),
  mc("Which tag is used for a heading?", ["&lt;p&gt;", "&lt;h1&gt;", "&lt;head&gt;", "&lt;title&gt;"], 1, "Headings use &lt;h1&gt; to &lt;h6&gt;."),
  mc("Choose the correct HTML structure.", ["&lt;html&gt;&lt;body&gt;&lt;head&gt;", "&lt;html&gt;&lt;head&gt;&lt;body&gt;", "&lt;head&gt;&lt;html&gt;&lt;body&gt;", "&lt;body&gt;&lt;head&gt;&lt;html&gt;"], 1),
  sa("What is the purpose of the &lt;a&gt; tag?", ["create a link", "hyperlink", "link"], "The anchor tag creates hyperlinks."),
  mc("Which is a semantic HTML element?", ["&lt;div&gt;", "&lt;span&gt;", "&lt;article&gt;", "&lt;b&gt;"], 2, "&lt;article&gt; describes its content's meaning."),
  tf("HTML is a programming language.", false, "HTML is a markup language."),
  mc("Which attribute sets an image's alternative text?", ["title", "src", "alt", "href"], 2),
  mc("Which element creates an unordered list?", ["&lt;ol&gt;", "&lt;ul&gt;", "&lt;li&gt;", "&lt;list&gt;"], 1),
  tf("The &lt;head&gt; element contains metadata about the page.", true),
  mc("Which tag inserts a line break?", ["&lt;break&gt;", "&lt;lb&gt;", "&lt;br&gt;", "&lt;newline&gt;"], 2),
];

const genericQuestions = (topic: string, count: number, points: number): QuizQuestionItem[] =>
  Array.from({ length: count }, (_, i) =>
    i % 4 === 3
      ? tf(`${topic}: statement ${i + 1} is a best practice.`, i % 2 === 0, "", points)
      : mc(`${topic} — question ${i + 1}: choose the correct answer.`, ["Option A", "Option B", "Option C", "Option D"], i % 4, "", points)
  );

// ---------------------------------------------------------------- quiz specs
interface Spec {
  title: string;
  description: string;
  course: number;
  module: number;
  difficulty: QuizDifficulty;
  questions: number;
  points: number;
  passPct: number;
  attempts: number;
  status: QuizStatus;
  daysAgo: number;
}

const SPECS: Spec[] = [
  { title: "HTML Basics Quiz", description: "Test your understanding of HTML fundamentals.", course: 0, module: 0, difficulty: "BEGINNER", questions: 10, points: 5, passPct: 60, attempts: 124, status: "PUBLISHED", daysAgo: 22 },
  { title: "CSS Styling Quiz", description: "Check your CSS knowledge.", course: 0, module: 1, difficulty: "BEGINNER", questions: 15, points: 2, passPct: 70, attempts: 98, status: "PUBLISHED", daysAgo: 24 },
  { title: "JavaScript Basics", description: "Fundamental JavaScript concepts.", course: 1, module: 0, difficulty: "BEGINNER", questions: 12, points: 2, passPct: 60, attempts: 0, status: "DRAFT", daysAgo: 25 },
  { title: "DOM Manipulation Quiz", description: "Test your DOM skills.", course: 1, module: 2, difficulty: "INTERMEDIATE", questions: 10, points: 2, passPct: 70, attempts: 65, status: "PUBLISHED", daysAgo: 26 },
  { title: "Responsive Design Quiz", description: "Media queries and responsive layouts.", course: 2, module: 3, difficulty: "INTERMEDIATE", questions: 15, points: 2, passPct: 70, attempts: 0, status: "DRAFT", daysAgo: 28 },
  { title: "Web Accessibility Quiz", description: "Test your accessibility knowledge.", course: 2, module: 4, difficulty: "INTERMEDIATE", questions: 8, points: 2, passPct: 60, attempts: 38, status: "PUBLISHED", daysAgo: 30 },
  { title: "Bootstrap Framework Quiz", description: "Components and grid system.", course: 3, module: 0, difficulty: "BEGINNER", questions: 12, points: 2, passPct: 65, attempts: 56, status: "ARCHIVED", daysAgo: 32 },
  { title: "Final Assessment", description: "Comprehensive test for the course.", course: 0, module: 5, difficulty: "ADVANCED", questions: 25, points: 2, passPct: 70, attempts: 210, status: "PUBLISHED", daysAgo: 35 },
  { title: "Forms and Tables Quiz", description: "Build and validate HTML forms and tables.", course: 0, module: 4, difficulty: "INTERMEDIATE", questions: 10, points: 3, passPct: 60, attempts: 72, status: "PUBLISHED", daysAgo: 12 },
  { title: "Images and Media Quiz", description: "Images, audio and video in HTML.", course: 0, module: 3, difficulty: "BEGINNER", questions: 8, points: 3, passPct: 60, attempts: 61, status: "PUBLISHED", daysAgo: 14 },
  { title: "Links and Lists Quiz", description: "Navigation with links and lists.", course: 0, module: 2, difficulty: "BEGINNER", questions: 8, points: 2, passPct: 60, attempts: 88, status: "PUBLISHED", daysAgo: 16 },
  { title: "Variables and Types", description: "let, const and JavaScript data types.", course: 1, module: 1, difficulty: "BEGINNER", questions: 10, points: 2, passPct: 60, attempts: 54, status: "PUBLISHED", daysAgo: 18 },
  { title: "Events Quiz", description: "Handling user events in the browser.", course: 1, module: 3, difficulty: "INTERMEDIATE", questions: 10, points: 2, passPct: 70, attempts: 41, status: "PUBLISHED", daysAgo: 9 },
  { title: "Async JavaScript Quiz", description: "Promises, async/await and fetch.", course: 1, module: 4, difficulty: "ADVANCED", questions: 12, points: 3, passPct: 70, attempts: 33, status: "PUBLISHED", daysAgo: 7 },
  { title: "Selectors Deep Dive", description: "Specificity and advanced selectors.", course: 2, module: 0, difficulty: "INTERMEDIATE", questions: 10, points: 2, passPct: 65, attempts: 47, status: "PUBLISHED", daysAgo: 20 },
  { title: "Flexbox Quiz", description: "One-dimensional layouts with flexbox.", course: 2, module: 1, difficulty: "BEGINNER", questions: 10, points: 2, passPct: 60, attempts: 79, status: "PUBLISHED", daysAgo: 19 },
  { title: "Grid Layout Quiz", description: "Two-dimensional layouts with CSS Grid.", course: 2, module: 2, difficulty: "INTERMEDIATE", questions: 10, points: 2, passPct: 65, attempts: 52, status: "PUBLISHED", daysAgo: 17 },
  { title: "Tailwind CSS Quiz", description: "Utility-first styling with Tailwind.", course: 3, module: 1, difficulty: "BEGINNER", questions: 10, points: 2, passPct: 60, attempts: 45, status: "PUBLISHED", daysAgo: 11 },
  { title: "Components Quiz", description: "Reusable UI components.", course: 3, module: 2, difficulty: "INTERMEDIATE", questions: 8, points: 3, passPct: 65, attempts: 29, status: "PUBLISHED", daysAgo: 5 },
  { title: "Theming Quiz", description: "Design tokens and theming.", course: 3, module: 3, difficulty: "ADVANCED", questions: 8, points: 3, passPct: 70, attempts: 0, status: "DRAFT", daysAgo: 3 },
  { title: "Semantic HTML Quiz", description: "Meaningful markup and landmarks.", course: 0, module: 5, difficulty: "INTERMEDIATE", questions: 10, points: 2, passPct: 65, attempts: 36, status: "PUBLISHED", daysAgo: 8 },
  { title: "Head vs Body Quiz", description: "What goes in the head and the body.", course: 0, module: 1, difficulty: "BEGINNER", questions: 6, points: 2, passPct: 60, attempts: 23, status: "ARCHIVED", daysAgo: 40 },
  { title: "JavaScript Functions", description: "Declarations, arrows and scope.", course: 1, module: 1, difficulty: "INTERMEDIATE", questions: 10, points: 2, passPct: 65, attempts: 0, status: "DRAFT", daysAgo: 2 },
  { title: "CSS Variables Quiz", description: "Custom properties in practice.", course: 2, module: 0, difficulty: "BEGINNER", questions: 8, points: 2, passPct: 60, attempts: 27, status: "PUBLISHED", daysAgo: 4 },
];

const INTRO_INSTRUCTIONS = "<ol><li>Read each question carefully.</li><li>Select the best answer.</li><li>You can navigate between questions.</li><li>Click submit when you are finished.</li></ol>";

export interface QuizSeed {
  quizzes: QuizItem[];
  attempts: QuizAttempt[];
  activity: QuizActivity[];
}

const pad = (n: number) => String(n).padStart(2, "0");
const toDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Builds the full seed relative to `now`. Deterministic for a given `now`. */
export function buildQuizSeed(now: Date = new Date()): QuizSeed {
  qCounter = 0;
  const rand = mulberry32(20261101);
  const quizzes: QuizItem[] = [];
  const attempts: QuizAttempt[] = [];
  const activity: QuizActivity[] = [];

  SPECS.forEach((spec, index) => {
    const id = `quiz-${index + 1}`;
    const course = MOCK_QUIZ_COURSES[spec.course];
    const mod = course.modules[Math.min(spec.module, course.modules.length - 1)];
    const questions = index === 0 ? HTML_BASICS_QUESTIONS() : genericQuestions(spec.title.replace(/ Quiz$/, ""), spec.questions, spec.points);
    const totalMarks = questions.reduce((s, q) => s + q.points, 0);
    const passingMarks = Math.ceil((totalMarks * spec.passPct) / 100);
    // Catalogue built up over ~4 months; only the newest few quizzes fall in the last 30 days.
    const createdDaysAgo = spec.daysAgo * 4;
    const created = new Date(now.getTime() - createdDaysAgo * 86400000);
    const updated = new Date(created.getTime() + Math.min(createdDaysAgo - 1, 8) * 86400000 + 4 * 3600000);
    const start = new Date(created.getTime() + 2 * 86400000);
    const end = new Date(now.getTime() + 10 * 86400000);

    quizzes.push({
      id,
      title: spec.title,
      descriptionHtml: `<p>${spec.description}</p>`,
      instructionsHtml: index === 0 ? INTRO_INSTRUCTIONS : "<ol><li>Read each question carefully.</li><li>Submit before the time runs out.</li></ol>",
      courseId: course.id,
      moduleId: mod.id,
      difficulty: spec.difficulty,
      questions,
      passingMarks,
      timeLimitMinutes: index === 0 ? 30 : Math.max(10, spec.questions * 2),
      maxAttempts: index === 0 ? "1" : spec.difficulty === "ADVANCED" ? "2" : "3",
      showCorrectAnswers: true,
      showExplanation: true,
      randomizeQuestions: false,
      randomizeOptions: false,
      startDate: spec.status === "DRAFT" ? "" : toDate(start),
      endDate: spec.status === "DRAFT" ? "" : toDate(end),
      access: "ENROLLED",
      requirePreviousLessons: true,
      showImmediately: spec.status === "PUBLISHED",
      status: spec.status,
      createdBy: "Admin",
      createdAt: created.toISOString(),
      updatedAt: updated.toISOString(),
    });

    // ---- activity
    const act = (kind: QuizActivity["kind"], message: string, at: Date, actor = "Admin") =>
      activity.push({ id: `${id}-act-${activity.length + 1}`, quizId: id, kind, message, actor, at: at.toISOString() });
    act("CREATED", `created the quiz "${spec.title}"`, created);
    act("QUESTION_ADDED", `added ${questions.length} questions`, new Date(created.getTime() + 3600000));
    act("SETTINGS_CHANGED", `set passing marks to ${passingMarks}/${totalMarks}`, new Date(created.getTime() + 2 * 3600000));
    if (spec.status !== "DRAFT") act("PUBLISHED", "published the quiz", new Date(created.getTime() + 86400000));
    if (spec.status === "ARCHIVED") act("ARCHIVED", "archived the quiz", updated);
    else act("UPDATED", "updated the quiz description", updated, index % 3 === 0 ? "John Doe" : "Admin");

    // ---- attempts (published/archived only), spread over the last 60 days, improving slightly over time
    const maxPerStudent = Number(index === 0 ? "1" : spec.difficulty === "ADVANCED" ? "2" : "3");
    const perStudent = new Map<string, number>();
    const baseSkill = spec.difficulty === "BEGINNER" ? 0.78 : spec.difficulty === "INTERMEDIATE" ? 0.7 : 0.62;
    for (let a = 0; a < spec.attempts; a++) {
      let student = MOCK_QUIZ_STUDENTS[Math.floor(rand() * MOCK_QUIZ_STUDENTS.length)];
      let guard = 0;
      while ((perStudent.get(student.id) ?? 0) >= maxPerStudent && guard++ < 50) student = MOCK_QUIZ_STUDENTS[Math.floor(rand() * MOCK_QUIZ_STUDENTS.length)];
      if ((perStudent.get(student.id) ?? 0) >= maxPerStudent) continue;
      const attemptNumber = (perStudent.get(student.id) ?? 0) + 1;
      perStudent.set(student.id, attemptNumber);

      // Attempts only after the quiz was published (created + 1 day), within the last 60 days.
      const daysBack = Math.floor(rand() * Math.max(1, Math.min(60, createdDaysAgo - 2)));
      const submittedAt = new Date(now.getTime() - daysBack * 86400000 - Math.floor(rand() * 20) * 3600000 - 30 * 60000);
      const recency = 1 - daysBack / 60; // later attempts do a bit better
      const skill = Math.min(0.97, baseSkill + (rand() - 0.5) * 0.45 + recency * 0.08 + (attemptNumber - 1) * 0.06);
      const completed = rand() > 0.08;
      const answered = completed ? questions.length : Math.max(1, Math.floor(questions.length * rand()));
      let score = 0;
      let time = 0;
      const answers = questions.slice(0, answered).map((q, qi) => {
        const difficultyByPosition = qi / Math.max(1, questions.length - 1); // later questions slightly harder
        const correct = rand() < skill - difficultyByPosition * 0.18 + 0.05;
        const t = Math.round(8 + rand() * 22 + difficultyByPosition * 18);
        if (correct) score += q.points;
        time += t;
        return { questionId: q.id, correct, timeSeconds: t };
      });
      const limitSeconds = (index === 0 ? 30 : Math.max(10, spec.questions * 2)) * 60;
      // ~4× the per-question reading/answer time; completed attempts always finish within the limit.
      const raw = Math.round(time * 4 + rand() * 180);
      const timeTakenSeconds = completed ? Math.min(raw, limitSeconds - 15) : Math.min(raw, limitSeconds);
      attempts.push({
        id: `${id}-att-${a + 1}`,
        quizId: id,
        student,
        attemptNumber,
        score,
        totalMarks,
        passed: completed && score >= passingMarks,
        completed,
        timeTakenSeconds,
        submittedAt: submittedAt.toISOString(),
        answers,
      });
    }
  });

  attempts.sort((x, y) => y.submittedAt.localeCompare(x.submittedAt));
  activity.sort((x, y) => y.at.localeCompare(x.at));
  return { quizzes, attempts, activity };
}
