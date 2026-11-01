import type {
  LiveActivity,
  LiveClassItem,
  LiveCourseRef,
  LiveEnrollment,
  LiveInstructor,
  LivePlatform,
  LiveQuestion,
  LiveResource,
  LiveStudent,
} from "@/types/liveClass";

/**
 * Deterministic mock data for Live Classes (mock-first phase).
 * 48 classes spread from ~60 days ago to ~30 days ahead (relative to "now"), 4 cancelled.
 * Per class: enrollments (attendance rows), Q&A, resources and an activity timeline — generated only
 * for classes that already happened (no attendance/Q&A in the future). Every number on the pages
 * is DERIVED in src/lib/liveClassStats.ts.
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

export const LIVE_COURSES: LiveCourseRef[] = [
  { id: "live-course-js", title: "JavaScript Essentials", short: "JS", tone: "yellow" },
  { id: "live-course-uiux", title: "UI/UX Design Basics", short: "UI", tone: "purple" },
  { id: "live-course-react", title: "React for Beginners", short: "Re", tone: "blue" },
  { id: "live-course-marketing", title: "Digital Marketing Mastery", short: "DM", tone: "red" },
  { id: "live-course-python", title: "Python for Data Science", short: "Py", tone: "blue" },
  { id: "live-course-html", title: "HTML & CSS Basics", short: "H5", tone: "orange" },
  { id: "live-course-wp", title: "WordPress for Beginners", short: "WP", tone: "blue" },
  { id: "live-course-shopify", title: "Shopify Store Setup", short: "S", tone: "green" },
  { id: "live-course-graphic", title: "Graphic Design Masterclass", short: "Ai", tone: "orange" },
];

export const LIVE_INSTRUCTORS: LiveInstructor[] = [
  "Arif Hossain", "Faria Islam", "Tanvir Ahmed", "Samira Akter", "Nusrat Jahan", "Kazi Rahman", "Rahat Mia", "Mahjabin Laboni", "Tanjim Hossain", "Sadia Rahman",
].map((name, i) => ({ id: `live-instructor-${i + 1}`, name, email: `${name.split(" ")[0].toLowerCase()}@edupro.com` }));

const FIRST = ["Tanvir", "Faria", "Nusrat", "Arif", "Samira", "Rahat", "Kazi", "Mahjabin", "Tanjim", "Sadia", "Imran", "Ayesha", "Rafiul", "Jannatul", "Mushfiqur", "Alvi", "Irfan", "Tahmina", "Sumaiya", "Shahriar"];
const LAST = ["Ahmed", "Islam", "Jahan", "Hossain", "Akter", "Mia", "Rahman", "Laboni", "Khan", "Chowdhury", "Karim", "Siddiqua"];
export const LIVE_STUDENTS: LiveStudent[] = Array.from({ length: 240 }, (_, i) => {
  const first = FIRST[i % FIRST.length];
  const last = LAST[(i * 5 + Math.floor(i / FIRST.length)) % LAST.length];
  return { id: `live-student-${i + 1}`, name: `${first} ${last}`, email: `${first.toLowerCase()}${i < FIRST.length ? "" : i}@gmail.com` };
});

const TITLES: [string, number][] = [
  ["JavaScript Q&A Session", 0], ["UI/UX Live Workshop", 1], ["React Project Walkthrough", 2], ["Figma to Website Design", 3], ["Python for Data Analysis", 4],
  ["Facebook Ads Strategy", 3], ["HTML & CSS Live Coding", 5], ["WordPress Theme Build", 6], ["Shopify Store Setup", 7], ["Graphic Design Masterclass", 8],
  ["Async JavaScript Deep Dive", 0], ["Design Systems 101", 1], ["React Hooks in Practice", 2], ["SEO Fundamentals", 3], ["Pandas Data Cleaning", 4],
  ["Flexbox & Grid Lab", 5], ["Custom WordPress Plugins", 6], ["Shopify Theme Customisation", 7], ["Logo Design Workshop", 8], ["DOM Events Live", 0],
  ["Wireframing Session", 1], ["State Management with Redux", 2], ["Email Marketing Live", 3], ["Matplotlib Visualisation", 4], ["Responsive Layouts", 5],
];

const PLATFORMS: LivePlatform[] = ["ZOOM", "GOOGLE_MEET", "ZOOM", "GOOGLE_MEET", "ZOOM", "TEAMS"];
const SLOTS: [string, string][] = [["10:00", "11:00"], ["14:00", "15:30"], ["11:00", "12:30"], ["15:00", "16:30"], ["19:00", "20:30"], ["10:00", "12:00"], ["15:00", "17:00"]];
const capacityFor = (i: number) => [150, 100, 100, 120, 100, 150][i % 6];

const QUESTIONS = [
  ["Can you explain the difference between var, let and const?", "<p>Sure! Here's a quick summary:</p><ul><li><code>var</code>: function scoped, can be re-declared and updated.</li><li><code>let</code>: block scoped, can be updated but not re-declared.</li><li><code>const</code>: block scoped, cannot be re-declared or updated.</li></ul><pre><code>var x = 10; // function scoped\nlet y = 20; // block scoped\nconst z = 30; // block scoped (constant)</code></pre>"],
  ["What is closure in JavaScript?", "<p>A closure is a function that remembers the variables of the scope it was created in, even after that scope has finished.</p>"],
  ["How does the event loop work in JavaScript?", "<p>The event loop takes callbacks from the task queue and runs them when the call stack is empty.</p>"],
  ["Can you give an example of debouncing in real projects?", ""],
  ["What is the difference between == and ===?", "<p><code>==</code> converts types before comparing; <code>===</code> compares value and type.</p>"],
  ["How can we handle API errors properly?", ""],
  ["Can you explain async/await with a practical example?", "<p><code>await</code> pauses an async function until the promise settles, so asynchronous code reads top to bottom.</p>"],
  ["What are higher-order functions in JavaScript?", ""],
  ["How to optimize performance in a large JavaScript application?", "<p>Split code, memoise expensive work, avoid layout thrashing and measure with the Performance panel.</p>"],
  ["Can you show a real-world example of using Promises?", ""],
  ["Best practices for error handling?", "<p>Catch errors where you can handle them, show friendly messages and log details for debugging.</p>"],
  ["When should I use map vs forEach?", "<p>Use <code>map</code> when you need a new array; <code>forEach</code> for side effects only.</p>"],
];

const pad = (n: number) => String(n).padStart(2, "0");
const toDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addMinutes = (hhmm: string, mins: number) => {
  const [h, m] = hhmm.split(":").map(Number);
  const t = Math.max(0, h * 60 + m + mins);
  return `${pad(Math.floor(t / 60) % 24)}:${pad(t % 60)}`;
};
const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export interface LiveSeed {
  classes: LiveClassItem[];
  enrollments: LiveEnrollment[];
  questions: LiveQuestion[];
  resources: LiveResource[];
  activity: LiveActivity[];
}

export function buildLiveSeed(now: Date = new Date()): LiveSeed {
  const rand = mulberry32(20261020);
  const classes: LiveClassItem[] = [];
  const enrollments: LiveEnrollment[] = [];
  const questions: LiveQuestion[] = [];
  const resources: LiveResource[] = [];
  const activity: LiveActivity[] = [];

  for (let i = 0; i < 48; i++) {
    const [title, courseIdx] = TITLES[i % TITLES.length];
    const course = LIVE_COURSES[courseIdx];
    const instructor = LIVE_INSTRUCTORS[i % LIVE_INSTRUCTORS.length];
    // Day offset: first class (the design's "JavaScript Q&A Session") is 2 days ago; others spread −45 … +30 days.
    const dayOffset = i === 0 ? -2 : i === 3 ? 0 : Math.round(-60 + (i / 47) * 90 + (rand() - 0.5) * 4);
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);
    let [startTime, endTime] = SLOTS[i % SLOTS.length];
    if (i === 3) {
      // One class is live right now.
      const cur = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      startTime = addMinutes(cur, -30);
      endTime = addMinutes(cur, 60);
      if (toMin(endTime) <= toMin(startTime)) [startTime, endTime] = ["00:00", "23:59"];
    }
    const id = `live-${i + 1}`;
    const platform = PLATFORMS[i % PLATFORMS.length];
    const meetingId = `${100 + i}${pad((i * 37) % 100)} ${4000 + i * 13} ${7000 + i * 29}`.slice(0, 13);
    const link =
      platform === "ZOOM" ? `https://zoom.us/j/${meetingId.replace(/\s/g, "")}` : platform === "GOOGLE_MEET" ? `https://meet.google.com/abc-${pad(i)}x-${pad(i * 3)}y` : `https://teams.microsoft.com/l/meetup-join/${id}`;
    const cancelled = [7, 19, 30, 41].includes(i);
    const created = new Date(day.getTime() - (10 + (i % 7)) * 86400000);
    const capacity = capacityFor(i);
    classes.push({
      id,
      title,
      descriptionHtml: `<p>${i === 0 ? "An interactive Q&amp;A session to clear your doubts, practice coding problems and get real-world advice from the instructor." : `A live ${title.toLowerCase()} session for the ${course.title} course.`}</p>`,
      courseId: course.id,
      instructorId: instructor.id,
      type: i % 5 === 0 ? "QA" : i % 5 === 1 ? "WORKSHOP" : i % 5 === 2 ? "WEBINAR" : "INTERACTIVE",
      date: toDate(day),
      startTime,
      endTime,
      platform,
      meetingLink: link,
      meetingId: platform === "ZOOM" ? meetingId : "",
      passcode: platform === "ZOOM" ? `edupro${2026 + (i % 3)}` : "",
      sendLinkToStudents: true,
      capacity,
      settings: { allowQa: true, enableChat: true, recordClass: i % 4 !== 3, makePublic: false, sendReminder: true, autoAttendance: true },
      reminder: "15",
      thumbnailUrl: "",
      status: cancelled ? "CANCELLED" : "ACTIVE",
      createdAt: created.toISOString(),
      updatedAt: created.toISOString(),
    });

    const act = (kind: LiveActivity["kind"], t: string, detail: string, at: Date, actor = instructor.name, refId?: string) =>
      activity.push({ id: `${id}-act-${activity.length + 1}`, classId: id, kind, title: t, detail, actor, at: at.toISOString(), refId });
    act("CLASS_SCHEDULED", "Class Scheduled", `${title} was scheduled for ${toDate(day)}.`, created, "Admin");
    if (cancelled) act("CLASS_CANCELLED", "Class Cancelled", "The class was cancelled and students were notified.", new Date(day.getTime() - 86400000), "Admin");

    // ---- enrollments: every class has `capacity` enrolled students (seats filled).
    const startAt = new Date(`${toDate(day)}T${startTime}`);
    const endAt = new Date(`${toDate(day)}T${endTime}`);
    const happened = !cancelled && startAt.getTime() <= now.getTime();
    const isLive = happened && endAt.getTime() > now.getTime();
    const durationMin = toMin(endTime) - toMin(startTime);
    const pool = [...LIVE_STUDENTS].sort(() => rand() - 0.5).slice(0, capacity);
    const attendRate = i === 0 ? 0.8 : 0.62 + rand() * 0.3;
    const absentRate = i === 0 ? 0.1334 : 0.08 + rand() * 0.08;
    let joinedCount = 0;
    pool.forEach((student, s) => {
      const r = s / capacity;
      const status = !happened ? "NOT_JOINED" : r < attendRate ? "ATTENDED" : r < attendRate + absentRate ? "ABSENT" : "NOT_JOINED";
      let joinTime = "";
      let leaveTime = "";
      let watch = 0;
      if (status === "ATTENDED") {
        joinedCount++;
        const lateBy = Math.floor(rand() * 6);
        const endCap = isLive ? Math.max(lateBy + 1, Math.floor((now.getTime() - startAt.getTime()) / 60000)) : durationMin;
        const leaveEarly = isLive ? 0 : Math.floor(rand() * 12);
        watch = Math.max(1, endCap - lateBy - leaveEarly);
        joinTime = addMinutes(startTime, lateBy);
        leaveTime = isLive ? "" : addMinutes(startTime, lateBy + watch);
      }
      enrollments.push({
        id: `${id}-enr-${s + 1}`,
        classId: id,
        student,
        enrolledAt: new Date(created.getTime() + Math.floor(rand() * 8) * 86400000).toISOString(),
        status,
        joinTime,
        leaveTime,
        watchMinutes: watch,
      });
    });

    if (!happened) continue;

    // ---- activity timeline, Q&A and resources for classes that took place.
    const at = (mins: number) => new Date(startAt.getTime() + mins * 60000);
    act("CLASS_STARTED", "Class Started", "The live class session has started.", at(0));
    act("STUDENTS_JOINED", `${Math.min(joinedCount, 12)} students joined`, "New students joined the class.", at(2), "Students");
    const qCount = i === 0 ? 18 : Math.floor(rand() * 9);
    const attendees = enrollments.filter((e) => e.classId === id && e.status === "ATTENDED");
    const window = isLive ? Math.max(1, Math.floor((now.getTime() - startAt.getTime()) / 60000)) : durationMin;
    for (let q = 0; q < qCount && attendees.length; q++) {
      const [text, answer] = QUESTIONS[q % QUESTIONS.length];
      const minute = Math.min(window - 1, 5 + Math.floor((q / Math.max(1, qCount)) * (window - 8)));
      const student = attendees[(q * 7) % attendees.length].student;
      const qId = `${id}-q-${q + 1}`;
      const answered = i === 0 ? q < 18 && answer !== "" ? true : q % 3 !== 0 : answer !== "";
      questions.push({ id: qId, classId: id, student, question: text, askedAt: addMinutes(startTime, minute), status: answered ? "ANSWERED" : "PENDING", answerHtml: answered ? answer || "<p>Answered live during the session.</p>" : "" });
      act("QUESTION_ASKED", "New Question", `${student.name} asked: "${text}"`, at(minute), student.name, qId);
      if (answered) act("QUESTION_ANSWERED", "Instructor Answered", `${instructor.name} answered a question.`, at(Math.min(window - 1, minute + 3)), instructor.name, qId);
    }
    act("SCREEN_SHARED", "Screen Shared", "Instructor started screen sharing.", at(Math.min(18, window - 1)));
    if (!isLive) {
      const res: [LiveResource["type"], string, string, number][] = [
        ["RECORDING", `${title} Recording`, "Full session recording video", 480 * 1024 * 1024],
        ["DOCUMENT", "Session Notes", "Key questions and answers from the session", Math.round(2.4 * 1024 * 1024)],
        ["CODE", "Code Examples", "All code examples used in the session", Math.round(1.8 * 1024 * 1024)],
        ["LINK", "Useful Learning Resources", "Links to documentation, tools and articles", 0],
        ["DOCUMENT", "Practice Exercise", "Extra practice problems for students", Math.round(1.2 * 1024 * 1024)],
      ];
      const n = i === 0 ? 5 : 1 + Math.floor(rand() * 4);
      res.slice(0, n).forEach(([type, t, d, size], r) => {
        if (type === "RECORDING" && !classes[classes.length - 1].settings.recordClass) return;
        const rid = `${id}-res-${r + 1}`;
        const addedAt = new Date(endAt.getTime() + (2 + r * 6) * 60000);
        resources.push({ id: rid, classId: id, type, title: t, description: d, url: type === "LINK" ? "https://developer.mozilla.org/" : `https://res.cloudinary.com/demo/raw/upload/${rid}`, size, visibility: "ALL_STUDENTS", addedAt: addedAt.toISOString() });
        if (r === 2) act("RESOURCE_SHARED", "Resource Shared", `${t} was shared.`, at(Math.min(25, window - 1)), instructor.name, rid);
      });
      act("CLASS_ENDED", "Class Ended", "The live class session has ended.", at(durationMin - 2));
    }
  }

  activity.sort((a, b) => a.at.localeCompare(b.at));
  return { classes, enrollments, questions, resources, activity };
}
