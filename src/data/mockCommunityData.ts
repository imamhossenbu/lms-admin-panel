import type { CommunityMember, CommunityThread, ThreadCategory, ThreadReply, ThreadReport } from "@/types/community";
import { COURSE_CONTEXTS } from "@/data/mockCourseCatalog";

/**
 * Deterministic mock data for Community (mock-first phase), relative to "now".
 * 36 threads across the 4 catalogue courses, replies with one level of nesting, accepted answers on
 * some questions, and open/resolved reports. Every number on the pages is DERIVED in
 * src/lib/communityStats.ts.
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

const STUDENT_NAMES = ["Sarah Rahman", "Mahin Tarek", "Ayesha Faria", "Rakibul Islam", "Sadia Nur", "Imran Hossain", "Nusrat Tahsin", "Ahmed Rony", "Fahim Rahman", "Tanvir Hossain", "Nabila Tabassum", "Kamrul Hasan", "Tasnim Ferdous", "Shahriar Kabir", "Jannatul Ferdous", "Hasibul Alam"];
const INSTRUCTORS = ["Arif Hossain", "Faria Islam", "Kazi Rahman"];

const member = (name: string, role: CommunityMember["role"], i: number): CommunityMember => ({
  id: `${role.toLowerCase()}-${i + 1}`,
  name,
  email: `${name.split(" ")[0].toLowerCase()}@${role === "STUDENT" ? "example.com" : "edupro.com"}`,
  role,
});

export const COMMUNITY_STUDENTS = STUDENT_NAMES.map((n, i) => member(n, "STUDENT", i));
export const COMMUNITY_INSTRUCTORS = INSTRUCTORS.map((n, i) => member(n, "INSTRUCTOR", i));
export const COMMUNITY_ADMIN: CommunityMember = { id: "admin-1", name: "Admin", email: "admin@edupro.com", role: "ADMIN" };

interface Spec {
  title: string;
  category: ThreadCategory;
  course: number;
  tags: string[];
  body: string;
  replies: number;
  answered?: boolean;
  pinned?: boolean;
  locked?: boolean;
  byStaff?: boolean;
}

const SPECS: Spec[] = [
  { title: "Welcome to HTML Fundamentals — introduce yourself!", category: "ANNOUNCEMENT", course: 0, tags: ["welcome"], body: "Say hi, tell us what you want to build and where you're learning from.", replies: 14, pinned: true, byStaff: true },
  { title: "Why does my <a> tag open in the same tab?", category: "QUESTION", course: 0, tags: ["links", "html"], body: "I want the link to open in a new tab but it keeps replacing my page. What am I missing?", replies: 5, answered: true },
  { title: "Difference between <section> and <article>?", category: "QUESTION", course: 0, tags: ["semantic-html"], body: "Both look the same in the browser. When should I use which one?", replies: 7, answered: true },
  { title: "My first portfolio page — feedback welcome", category: "SHOWCASE", course: 0, tags: ["portfolio", "feedback"], body: "Here is the page I built after Module 6. Any tips on structure and accessibility?", replies: 9 },
  { title: "Images not showing after uploading to hosting", category: "QUESTION", course: 0, tags: ["images", "deployment"], body: "Images work locally but show broken icons online. Paths are relative.", replies: 0 },
  { title: "Is the form validation lesson missing a video?", category: "FEEDBACK", course: 0, tags: ["course-content"], body: "Lesson 'Form Validation' only has text. Is the video coming?", replies: 2 },
  { title: "How strict should alt text be?", category: "DISCUSSION", course: 0, tags: ["accessibility", "images"], body: "Do decorative images still need alt text? What do screen readers expect?", replies: 6 },
  { title: "Table vs CSS grid for a timetable", category: "DISCUSSION", course: 0, tags: ["tables", "layout"], body: "For the table exercise, is an HTML table still the right choice in 2026?", replies: 4 },
  { title: "Module 3 quiz question 4 seems wrong", category: "FEEDBACK", course: 0, tags: ["quiz"], body: "The answer key says <link> creates a hyperlink, but the lesson says <a>.", replies: 3, answered: true },
  { title: "Can't get the video tag to autoplay", category: "QUESTION", course: 0, tags: ["media"], body: "autoplay is set but the video doesn't start in Chrome.", replies: 0 },
  { title: "Live class recording for this week?", category: "QUESTION", course: 0, tags: ["live-class"], body: "I missed Thursday's live class. Where can I find the recording?", replies: 1 },
  { title: "Study group for the final project", category: "DISCUSSION", course: 0, tags: ["study-group"], body: "Anyone in GMT+6 want to pair up for the final project?", replies: 8 },
  { title: "Office hours moved to Saturday", category: "ANNOUNCEMENT", course: 0, tags: ["schedule"], body: "This week's office hours are on Saturday 10 AM instead of Friday.", replies: 3, byStaff: true, locked: true },
  { title: "var, let and const — still confused", category: "QUESTION", course: 1, tags: ["variables"], body: "When exactly should I use let instead of const?", replies: 6, answered: true },
  { title: "Event delegation explained simply?", category: "QUESTION", course: 1, tags: ["events", "dom"], body: "The lesson mentions event delegation. Can someone explain with a small example?", replies: 4, answered: true },
  { title: "My to-do app (DOM assignment)", category: "SHOWCASE", course: 1, tags: ["dom", "project"], body: "Built with vanilla JS and localStorage. Code review appreciated!", replies: 5 },
  { title: "fetch() returns a Promise — how do I get the data?", category: "QUESTION", course: 1, tags: ["async", "fetch"], body: "console.log shows Promise {<pending>}. How do I read the JSON?", replies: 0 },
  { title: "Async/await vs .then — which do you prefer?", category: "DISCUSSION", course: 1, tags: ["async"], body: "Curious what everyone uses in real projects.", replies: 7 },
  { title: "Bug: code editor in lesson 3 doesn't save", category: "FEEDBACK", course: 1, tags: ["platform"], body: "My code resets every time I refresh the lesson page.", replies: 2 },
  { title: "JavaScript Essentials: new module on modules (ESM)", category: "ANNOUNCEMENT", course: 1, tags: ["course-update"], body: "We've added a short module on ES modules. Check it out!", replies: 4, byStaff: true, pinned: true },
  { title: "Why is `this` undefined in my callback?", category: "QUESTION", course: 1, tags: ["this", "functions"], body: "Inside a setTimeout callback `this` is undefined.", replies: 0 },
  { title: "Best resources to practise array methods?", category: "DISCUSSION", course: 1, tags: ["arrays"], body: "map/filter/reduce click in lessons but I forget them in practice.", replies: 5 },
  { title: "Flexbox: centring a div (yes, again)", category: "QUESTION", course: 2, tags: ["flexbox"], body: "justify-content and align-items are both center but it's still not centred vertically.", replies: 4, answered: true },
  { title: "Grid template areas showcase", category: "SHOWCASE", course: 2, tags: ["grid"], body: "A magazine layout using only grid-template-areas.", replies: 6 },
  { title: "Should I still learn floats?", category: "DISCUSSION", course: 2, tags: ["layout"], body: "Is there any reason to learn floats today?", replies: 5 },
  { title: "Container queries browser support?", category: "QUESTION", course: 2, tags: ["responsive"], body: "Can I use container queries in production now?", replies: 2, answered: true },
  { title: "Accessibility audit checklist", category: "DISCUSSION", course: 2, tags: ["accessibility"], body: "Sharing the checklist I use for audits — add yours!", replies: 3 },
  { title: "Dark mode with CSS variables", category: "QUESTION", course: 2, tags: ["variables", "theming"], body: "What's the cleanest way to switch themes with custom properties?", replies: 0 },
  { title: "Media query breakpoints you use", category: "DISCUSSION", course: 2, tags: ["responsive"], body: "Do you follow device sizes or content breakpoints?", replies: 4 },
  { title: "Bootstrap 5 grid not stacking on mobile", category: "QUESTION", course: 3, tags: ["bootstrap", "grid"], body: "Columns stay side by side even on small screens.", replies: 3, answered: true },
  { title: "Tailwind vs Bootstrap for a client project", category: "DISCUSSION", course: 3, tags: ["tailwind", "bootstrap"], body: "Which would you pick for a small agency site and why?", replies: 9 },
  { title: "Tailwind pricing table — my take", category: "SHOWCASE", course: 3, tags: ["tailwind", "project"], body: "Three tiers with a highlighted plan. Feedback welcome.", replies: 2 },
  { title: "Purge removed my dynamic classes", category: "QUESTION", course: 3, tags: ["tailwind"], body: "Classes built with template strings disappear in production.", replies: 0 },
  { title: "Theming lesson needs more examples", category: "FEEDBACK", course: 3, tags: ["course-content"], body: "Could we get a full example of a themed component?", replies: 1 },
  { title: "Free courses giveaway link (click here)", category: "DISCUSSION", course: 3, tags: ["offtopic"], body: "Get 100 premium courses free at this link!!!", replies: 0 },
  { title: "Component library structure", category: "DISCUSSION", course: 3, tags: ["components"], body: "How do you organise components in a design system repo?", replies: 4 },
];

const REPLY_SNIPPETS = [
  "Great question! The short answer is that it depends on the context — check the lesson notes for an example.",
  "I had the same issue. Clearing the cache fixed it for me.",
  "Here's how I'd approach it: start small, test in the browser, then refactor.",
  "Thanks for sharing — this helped me a lot.",
  "Could you post your code? It's hard to tell without seeing it.",
  "The MDN docs have a really clear explanation of this.",
  "+1, I was wondering the same thing.",
  "Nice work! One suggestion: add a skip-to-content link for keyboard users.",
];

export interface CommunitySeed {
  threads: CommunityThread[];
  replies: ThreadReply[];
  reports: ThreadReport[];
}

export function buildCommunitySeed(now: Date = new Date()): CommunitySeed {
  const rand = mulberry32(20261101);
  const threads: CommunityThread[] = [];
  const replies: ThreadReply[] = [];
  const reports: ThreadReport[] = [];
  const H = 3600000;

  SPECS.forEach((spec, i) => {
    const ctx = COURSE_CONTEXTS[spec.course];
    const id = `thread-${i + 1}`;
    const author = spec.byStaff ? COMMUNITY_INSTRUCTORS[spec.course % COMMUNITY_INSTRUCTORS.length] : COMMUNITY_STUDENTS[(i * 5) % COMMUNITY_STUDENTS.length];
    // Spread over the last ~35 days so there is activity this week and the week before.
    const created = new Date(now.getTime() - Math.round((1 + (i % 12) * 2.6 + rand() * 3) * 24 * H));
    const mod = ctx.modules[Math.floor(rand() * ctx.modules.length)];
    let last = created;
    const threadReplies: ThreadReply[] = [];
    for (let r = 0; r < spec.replies; r++) {
      const isStaff = spec.answered ? r === 1 : rand() < 0.15;
      const who = isStaff ? COMMUNITY_INSTRUCTORS[(i + r) % COMMUNITY_INSTRUCTORS.length] : COMMUNITY_STUDENTS[(i * 3 + r * 7 + 1) % COMMUNITY_STUDENTS.length];
      const at = new Date(Math.min(now.getTime() - 10 * 60000, created.getTime() + (r + 1) * (2 + rand() * 18) * H));
      last = at > last ? at : last;
      const parent = r > 1 && rand() < 0.3 ? threadReplies[Math.floor(rand() * threadReplies.length)] : null;
      threadReplies.push({
        id: `${id}-r${r + 1}`,
        threadId: id,
        parentId: parent && parent.parentId === null ? parent.id : null,
        author: who,
        bodyHtml: `<p>${isStaff && spec.answered ? "Here's the answer: " : ""}${REPLY_SNIPPETS[(i + r) % REPLY_SNIPPETS.length]}</p>`,
        likes: Math.floor(rand() * (isStaff ? 24 : 9)),
        isAccepted: !!spec.answered && r === 1,
        isRemoved: false,
        createdAt: at.toISOString(),
        updatedAt: at.toISOString(),
      });
    }
    replies.push(...threadReplies);
    threads.push({
      id,
      title: spec.title,
      bodyHtml: `<p>${spec.body.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`,
      category: spec.category,
      courseId: ctx.course.id,
      moduleId: spec.category === "ANNOUNCEMENT" ? "" : mod.id,
      tags: spec.tags,
      author,
      isPinned: !!spec.pinned,
      isLocked: !!spec.locked,
      isHidden: false,
      views: 20 + spec.replies * 14 + Math.floor(rand() * 120),
      likes: Math.floor(rand() * 30),
      createdAt: created.toISOString(),
      updatedAt: last.toISOString(),
    });
  });

  // ---- reports: the spam thread, an abusive reply, an off-topic reply (+ one already dismissed)
  const spam = threads.find((t) => t.title.startsWith("Free courses giveaway"))!;
  const at = (h: number) => new Date(now.getTime() - h * H).toISOString();
  reports.push(
    { id: "report-1", targetId: spam.id, targetType: "THREAD", threadId: spam.id, reporter: COMMUNITY_STUDENTS[2], reason: "SPAM", note: "Looks like a phishing link.", status: "OPEN", createdAt: at(5) },
    { id: "report-2", targetId: spam.id, targetType: "THREAD", threadId: spam.id, reporter: COMMUNITY_STUDENTS[6], reason: "SPAM", note: "", status: "OPEN", createdAt: at(4) }
  );
  const tailwindVs = threads.find((t) => t.title.startsWith("Tailwind vs Bootstrap"))!;
  const rude = replies.find((r) => r.threadId === tailwindVs.id && r.author.role === "STUDENT")!;
  rude.bodyHtml = "<p>Only beginners use Bootstrap, honestly this question is stupid.</p>";
  reports.push({ id: "report-3", targetId: rude.id, targetType: "REPLY", threadId: tailwindVs.id, reporter: COMMUNITY_STUDENTS[9], reason: "ABUSIVE", note: "Insulting other learners.", status: "OPEN", createdAt: at(20) });
  const floats = threads.find((t) => t.title.startsWith("Should I still learn floats"))!;
  const off = replies.find((r) => r.threadId === floats.id)!;
  reports.push({ id: "report-4", targetId: off.id, targetType: "REPLY", threadId: floats.id, reporter: COMMUNITY_STUDENTS[4], reason: "OFF_TOPIC", note: "", status: "DISMISSED", createdAt: at(72) });

  return { threads, replies, reports };
}
