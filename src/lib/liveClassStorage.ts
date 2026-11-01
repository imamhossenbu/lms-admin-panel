import type { LiveActivity, LiveClassItem, LiveEnrollment, LiveQuestion, LiveResource } from "@/types/liveClass";
import { buildLiveSeed, LIVE_COURSES, LIVE_INSTRUCTORS, type LiveSeed } from "@/data/mockLiveClassData";

/** Mock-first persistence for Live Classes (localStorage + simulated latency). Swap for API calls later. */

const STORAGE_KEY = "edupro_live_classes_v1";
export const LIVE_CLASSES_UPDATED_EVENT = "edupro_live_classes_updated";
const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms));
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export { LIVE_COURSES, LIVE_INSTRUCTORS };

function read(): LiveSeed {
  if (typeof window === "undefined") return buildLiveSeed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as LiveSeed;
      if (Array.isArray(p?.classes) && Array.isArray(p?.enrollments) && Array.isArray(p?.questions) && Array.isArray(p?.resources) && Array.isArray(p?.activity)) return p;
    }
  } catch {
    /* re-seed */
  }
  const seed = buildLiveSeed();
  write(seed);
  return seed;
}

function write(data: LiveSeed) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    throw new Error("Your browser storage is full. Remove some data and try again.");
  }
  window.dispatchEvent(new Event(LIVE_CLASSES_UPDATED_EVENT));
}

const log = (data: LiveSeed, classId: string, kind: LiveActivity["kind"], title: string, detail: string, refId?: string): LiveSeed => ({
  ...data,
  activity: [...data.activity, { id: uid("act"), classId, kind, title, detail, actor: "Admin", at: new Date().toISOString(), refId }],
});

// ---------------------------------------------------------------- reads
export const getLiveClassesSnapshot = () => read().classes;
export const getLiveEnrollmentsSnapshot = (classId?: string) => read().enrollments.filter((e) => !classId || e.classId === classId);

export interface LiveClassBundle {
  liveClass: LiveClassItem;
  enrollments: LiveEnrollment[];
  questions: LiveQuestion[];
  resources: LiveResource[];
  activity: LiveActivity[];
}

export async function fetchLiveClasses(): Promise<LiveClassItem[]> {
  await wait(300);
  return read().classes;
}

export async function fetchLiveClassBundle(id: string): Promise<LiveClassBundle | null> {
  await wait(300);
  const d = read();
  const liveClass = d.classes.find((c) => c.id === id);
  if (!liveClass) return null;
  return {
    liveClass,
    enrollments: d.enrollments.filter((e) => e.classId === id),
    questions: d.questions.filter((q) => q.classId === id),
    resources: d.resources.filter((r) => r.classId === id),
    activity: d.activity.filter((a) => a.classId === id),
  };
}

// ---------------------------------------------------------------- classes
export type LiveClassFields = Omit<LiveClassItem, "id" | "status" | "createdAt" | "updatedAt">;

/** New class: enrolls `capacity` course students (all NOT_JOINED until it happens). */
export async function createLiveClass(fields: LiveClassFields): Promise<LiveClassItem> {
  await wait();
  let d = read();
  const now = new Date().toISOString();
  const item: LiveClassItem = { ...fields, id: uid("live"), status: "ACTIVE", createdAt: now, updatedAt: now };
  const pool = Array.from(new Map(d.enrollments.map((e) => [e.student.id, e.student])).values()).slice(0, fields.capacity);
  const enrollments: LiveEnrollment[] = pool.map((student, i) => ({ id: `${item.id}-enr-${i + 1}`, classId: item.id, student, enrolledAt: now, status: "NOT_JOINED", joinTime: "", leaveTime: "", watchMinutes: 0 }));
  d = { ...d, classes: [item, ...d.classes], enrollments: [...d.enrollments, ...enrollments] };
  d = log(d, item.id, "CLASS_SCHEDULED", "Class Scheduled", `${item.title} was scheduled for ${item.date}.`);
  write(d);
  return item;
}

export async function updateLiveClass(id: string, patch: Partial<LiveClassFields>): Promise<LiveClassItem> {
  await wait();
  let d = read();
  const cur = d.classes.find((c) => c.id === id);
  if (!cur) throw new Error("This live class no longer exists.");
  const next: LiveClassItem = { ...cur, ...patch, updatedAt: new Date().toISOString() };
  d = { ...d, classes: d.classes.map((c) => (c.id === id ? next : c)) };
  const rescheduled = patch.date !== undefined && (patch.date !== cur.date || patch.startTime !== cur.startTime || patch.endTime !== cur.endTime);
  d = log(d, id, "CLASS_UPDATED", rescheduled ? "Class Rescheduled" : "Class Updated", rescheduled ? `Moved to ${next.date} ${next.startTime}–${next.endTime}.` : "Class details were updated.");
  write(d);
  return next;
}

export async function cancelLiveClass(id: string): Promise<LiveClassItem> {
  await wait();
  let d = read();
  const cur = d.classes.find((c) => c.id === id);
  if (!cur) throw new Error("This live class no longer exists.");
  const next: LiveClassItem = { ...cur, status: "CANCELLED", updatedAt: new Date().toISOString() };
  d = log({ ...d, classes: d.classes.map((c) => (c.id === id ? next : c)) }, id, "CLASS_CANCELLED", "Class Cancelled", "The class was cancelled and students were notified.");
  write(d);
  return next;
}

export async function restoreLiveClass(id: string): Promise<LiveClassItem> {
  await wait();
  let d = read();
  const cur = d.classes.find((c) => c.id === id);
  if (!cur) throw new Error("This live class no longer exists.");
  const next: LiveClassItem = { ...cur, status: "ACTIVE", updatedAt: new Date().toISOString() };
  d = log({ ...d, classes: d.classes.map((c) => (c.id === id ? next : c)) }, id, "CLASS_UPDATED", "Class Restored", "The class was re-activated.");
  write(d);
  return next;
}

export async function duplicateLiveClass(id: string): Promise<LiveClassItem> {
  const d = read();
  const src = d.classes.find((c) => c.id === id);
  if (!src) throw new Error("This live class no longer exists.");
  const { id: _i, status: _s, createdAt: _c, updatedAt: _u, ...fields } = src;
  void _i; void _s; void _c; void _u;
  return createLiveClass({ ...fields, title: `${src.title} (Copy)`.slice(0, 120) });
}

export async function deleteLiveClass(id: string): Promise<void> {
  await wait();
  const d = read();
  write({
    classes: d.classes.filter((c) => c.id !== id),
    enrollments: d.enrollments.filter((e) => e.classId !== id),
    questions: d.questions.filter((q) => q.classId !== id),
    resources: d.resources.filter((r) => r.classId !== id),
    activity: d.activity.filter((a) => a.classId !== id),
  });
}

// ---------------------------------------------------------------- Q&A / resources / attendance
export async function answerLiveQuestion(questionId: string, answerHtml: string, status: LiveQuestion["status"]): Promise<LiveQuestion> {
  await wait();
  let d = read();
  const cur = d.questions.find((q) => q.id === questionId);
  if (!cur) throw new Error("This question no longer exists.");
  const next: LiveQuestion = { ...cur, answerHtml, status };
  d = { ...d, questions: d.questions.map((q) => (q.id === questionId ? next : q)) };
  if (status === "ANSWERED" && cur.status !== "ANSWERED") d = log(d, cur.classId, "QUESTION_ANSWERED", "Instructor Answered", "Admin answered a question.", questionId);
  write(d);
  return next;
}

export async function addLiveResource(classId: string, r: Omit<LiveResource, "id" | "classId" | "addedAt">): Promise<LiveResource> {
  await wait();
  let d = read();
  const item: LiveResource = { ...r, id: uid("res"), classId, addedAt: new Date().toISOString() };
  d = log({ ...d, resources: [...d.resources, item] }, classId, "RESOURCE_SHARED", "Resource Shared", `${item.title} was shared.`, item.id);
  write(d);
  return item;
}

export async function updateLiveResource(id: string, patch: Partial<Omit<LiveResource, "id" | "classId">>): Promise<LiveResource> {
  await wait();
  const d = read();
  const cur = d.resources.find((r) => r.id === id);
  if (!cur) throw new Error("This resource no longer exists.");
  const next = { ...cur, ...patch };
  write({ ...d, resources: d.resources.map((r) => (r.id === id ? next : r)) });
  return next;
}

export async function deleteLiveResource(id: string): Promise<void> {
  await wait();
  const d = read();
  write({ ...d, resources: d.resources.filter((r) => r.id !== id) });
}

/** Manual attendance override (e.g. mark a student attended). */
export async function setAttendance(enrollmentId: string, status: LiveEnrollment["status"]): Promise<LiveEnrollment> {
  await wait();
  const d = read();
  const cur = d.enrollments.find((e) => e.id === enrollmentId);
  if (!cur) throw new Error("This student is no longer enrolled.");
  const next: LiveEnrollment = status === "ATTENDED" ? { ...cur, status } : { ...cur, status, joinTime: "", leaveTime: "", watchMinutes: 0 };
  write({ ...d, enrollments: d.enrollments.map((e) => (e.id === enrollmentId ? next : e)) });
  return next;
}

/** Mock: returns how many students would receive the reminder. */
export async function sendLiveReminder(classId: string, onlyNotJoined = false): Promise<number> {
  await wait(700);
  return read().enrollments.filter((e) => e.classId === classId && (!onlyNotJoined || e.status !== "ATTENDED")).length;
}

export function resetLiveMockData() {
  write(buildLiveSeed());
}
