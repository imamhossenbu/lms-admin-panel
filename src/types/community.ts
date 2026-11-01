/** Community (course discussions) — mock-first, API-ready shapes. Swap src/lib/communityStorage.ts for real calls later. */

export type CommunityRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";
export type ThreadCategory = "QUESTION" | "DISCUSSION" | "ANNOUNCEMENT" | "SHOWCASE" | "FEEDBACK";
export type ReportReason = "SPAM" | "ABUSIVE" | "OFF_TOPIC" | "PLAGIARISM" | "OTHER";
export type ReportStatus = "OPEN" | "DISMISSED" | "ACTIONED";

export interface CommunityMember {
  id: string;
  name: string;
  email: string;
  role: CommunityRole;
}

export interface ThreadReport {
  id: string;
  /** Thread id, or the reply id when the report targets a reply. */
  targetId: string;
  targetType: "THREAD" | "REPLY";
  threadId: string;
  reporter: CommunityMember;
  reason: ReportReason;
  note: string;
  status: ReportStatus;
  /** ISO datetime. */
  createdAt: string;
  /** Moderator's note when the report was resolved. */
  resolutionNote?: string;
  /** ISO datetime of resolution. */
  resolvedAt?: string;
}

export interface ThreadReply {
  id: string;
  threadId: string;
  /** null = top-level reply; otherwise the reply it answers (one level of nesting). */
  parentId: string | null;
  author: CommunityMember;
  /** Sanitized-on-render rich text HTML. */
  bodyHtml: string;
  likes: number;
  /** Marked as the accepted answer (QUESTION threads, at most one per thread). */
  isAccepted: boolean;
  /** Soft-deleted by a moderator: kept for context, body replaced. */
  isRemoved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityThread {
  id: string;
  title: string;
  bodyHtml: string;
  category: ThreadCategory;
  courseId: string;
  /** "" = course-wide. */
  moduleId: string;
  tags: string[];
  author: CommunityMember;
  isPinned: boolean;
  /** Locked = no new replies. */
  isLocked: boolean;
  /** Hidden from students (moderation). */
  isHidden: boolean;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}
