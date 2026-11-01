/** Live Classes (mock-first). API-ready shapes — swap src/lib/liveClassStorage.ts for real calls later. */

export type LivePlatform = "ZOOM" | "GOOGLE_MEET" | "TEAMS" | "CUSTOM";
export type LiveClassType = "INTERACTIVE" | "WEBINAR" | "WORKSHOP" | "QA";
/**
 * Stored status only distinguishes CANCELLED. Everything else is DERIVED from date/time
 * (see liveStatus() in src/lib/liveClassStats.ts): LIVE / COMPLETED / UPCOMING (≤ 3 days) / SCHEDULED.
 */
export type LiveStoredStatus = "ACTIVE" | "CANCELLED";
export type LiveDisplayStatus = "LIVE" | "COMPLETED" | "UPCOMING" | "SCHEDULED" | "CANCELLED";
export type ReminderOffset = "NONE" | "5" | "15" | "30" | "60" | "1440";

export interface LiveInstructor {
  id: string;
  name: string;
  email: string;
}

export interface LiveCourseRef {
  id: string;
  title: string;
  /** Tile shown next to the class (initials + tone). */
  short: string;
  tone: "yellow" | "purple" | "blue" | "orange" | "green" | "red";
}

export interface LiveClassSettings {
  allowQa: boolean;
  enableChat: boolean;
  recordClass: boolean;
  makePublic: boolean;
  sendReminder: boolean;
  autoAttendance: boolean;
}

export interface LiveClassItem {
  id: string;
  title: string;
  descriptionHtml: string;
  courseId: string;
  instructorId: string;
  type: LiveClassType;
  /** "YYYY-MM-DD" + "HH:mm" (local). */
  date: string;
  startTime: string;
  endTime: string;
  platform: LivePlatform;
  meetingLink: string;
  meetingId: string;
  passcode: string;
  sendLinkToStudents: boolean;
  /** Max seats (= enrolled students invited). */
  capacity: number;
  settings: LiveClassSettings;
  reminder: ReminderOffset;
  thumbnailUrl: string;
  status: LiveStoredStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LiveStudent {
  id: string;
  name: string;
  email: string;
}

/**
 * One row per enrolled student of a class.
 *  - ATTENDED: joined the session (join/leave times, watch minutes).
 *  - ABSENT: confirmed (RSVP) but never joined.
 *  - NOT_JOINED: no RSVP and never joined.
 * Before the class has happened every row is "NOT_JOINED" with no times.
 */
export type AttendanceStatus = "ATTENDED" | "ABSENT" | "NOT_JOINED";

export interface LiveEnrollment {
  id: string;
  classId: string;
  student: LiveStudent;
  enrolledAt: string;
  status: AttendanceStatus;
  /** "HH:mm" or "". */
  joinTime: string;
  leaveTime: string;
  watchMinutes: number;
}

export interface LiveQuestion {
  id: string;
  classId: string;
  student: LiveStudent;
  question: string;
  /** "HH:mm" during the session. */
  askedAt: string;
  status: "ANSWERED" | "PENDING";
  /** Rich-text HTML answer from the instructor ("" while pending). */
  answerHtml: string;
}

export type LiveResourceType = "RECORDING" | "DOCUMENT" | "LINK" | "CODE";

export interface LiveResource {
  id: string;
  classId: string;
  type: LiveResourceType;
  title: string;
  description: string;
  url: string;
  /** Bytes; 0 for links. */
  size: number;
  visibility: "ALL_STUDENTS" | "ATTENDEES" | "HIDDEN";
  addedAt: string;
}

export type LiveActivityKind =
  | "CLASS_STARTED"
  | "STUDENTS_JOINED"
  | "QUESTION_ASKED"
  | "QUESTION_ANSWERED"
  | "SCREEN_SHARED"
  | "RESOURCE_SHARED"
  | "CLASS_ENDED"
  | "CLASS_SCHEDULED"
  | "CLASS_UPDATED"
  | "CLASS_CANCELLED";

export interface LiveActivity {
  id: string;
  classId: string;
  kind: LiveActivityKind;
  title: string;
  detail: string;
  actor: string;
  /** ISO datetime. */
  at: string;
  /** Optional link target inside the page (e.g. question id / resource id). */
  refId?: string;
}
