import type { LiveCourseRef, LiveInstructor } from "@/types/liveClass";

/**
 * Course / instructor lookup for the Live Classes screens. Filled from what the Live Classes API returns
 * (every class carries its `course` and `instructor`) and from the course / instructor pickers, so the
 * sync `courseOf()` / `instructorOf()` helpers in liveClassStats can label tiles and cells.
 */

const TONES: LiveCourseRef["tone"][] = ["blue", "purple", "orange", "green", "yellow", "red"];

const courses = new Map<string, LiveCourseRef>();
const instructors = new Map<string, LiveInstructor>();

/** Stable tone per course id (same course → same colour on every screen). */
function toneOf(id: string): LiveCourseRef["tone"] {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return TONES[Math.abs(h) % TONES.length];
}

/** "React for Beginners" → "RB", "Python" → "Py". */
function shortOf(title: string) {
  const words = title.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  const w = words[0] ?? "?";
  return w.length > 1 ? w[0].toUpperCase() + w[1].toLowerCase() : w.toUpperCase();
}

export function rememberLiveCourse(c: { id: string; title: string }) {
  if (!c.id) return;
  courses.set(c.id, { id: c.id, title: c.title, short: shortOf(c.title), tone: toneOf(c.id) });
}

export function rememberLiveInstructor(i: LiveInstructor) {
  if (i.id) instructors.set(i.id, { id: i.id, name: i.name, email: i.email });
}

export const liveCourseRef = (id: string) => courses.get(id);
export const liveInstructorRef = (id: string) => instructors.get(id);
