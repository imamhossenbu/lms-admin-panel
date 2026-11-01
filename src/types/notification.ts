/** Notifications (mock-first). API-ready shapes — swap src/lib/notificationStorage.ts for real calls later. */

export type NotificationCategory = "ENROLLMENT" | "PAYMENT" | "SUBMISSION" | "COMMUNITY" | "LIVE_CLASS" | "CERTIFICATE" | "SYSTEM";
export type NotificationPriority = "NORMAL" | "HIGH";
export type NotificationChannel = "IN_APP" | "EMAIL" | "PUSH";

/** Admin inbox item (backend `Notification`). */
export interface AdminNotification {
  id: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  message: string;
  /** In-app link to the related page (e.g. "/orders/ORD-1042"). */
  href: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
}

// ---------------------------------------------------------------- Broadcasts (backend `Announcement`)
export type BroadcastAudience = "ALL_STUDENTS" | "COURSE" | "INSTRUCTORS" | "INACTIVE_STUDENTS";
export type BroadcastStatus = "SENT" | "SCHEDULED" | "DRAFT" | "CANCELLED";

export interface Broadcast {
  id: string;
  title: string;
  /** Rich-text HTML. */
  messageHtml: string;
  audience: BroadcastAudience;
  /** Courses when audience = COURSE. */
  courseIds: string[];
  channels: NotificationChannel[];
  priority: NotificationPriority;
  /** Optional call-to-action. */
  ctaLabel: string;
  ctaUrl: string;
  status: BroadcastStatus;
  /** ISO — when it was / will be sent (null for drafts). */
  sendAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type DeliveryStatus = "DELIVERED" | "OPENED" | "CLICKED" | "FAILED";

/** One recipient × channel row of a sent broadcast. */
export interface BroadcastDelivery {
  id: string;
  broadcastId: string;
  recipient: { id: string; name: string; email: string };
  channel: NotificationChannel;
  status: DeliveryStatus;
  /** Failure reason (status FAILED). */
  error: string;
  deliveredAt: string | null;
  openedAt: string | null;
  clickedAt: string | null;
}

// ---------------------------------------------------------------- Automated templates (backend `NotificationTemplate`)
export type TemplateTrigger =
  | "ENROLLMENT_CONFIRMED"
  | "PAYMENT_RECEIPT"
  | "ASSIGNMENT_GRADED"
  | "QUIZ_RESULT"
  | "LIVE_CLASS_REMINDER"
  | "CERTIFICATE_ISSUED"
  | "COMMUNITY_REPLY"
  | "COURSE_COMPLETED"
  | "PASSWORD_RESET";

export interface NotificationTemplateItem {
  id: string;
  /** Unique slug (backend `slug`). */
  slug: string;
  trigger: TemplateTrigger;
  name: string;
  /** Subject/title with {placeholders}. */
  subject: string;
  /** Body text with {placeholders} (plain text with line breaks). */
  body: string;
  channels: NotificationChannel[];
  enabled: boolean;
  /** Security emails (password reset) can't be disabled. */
  locked: boolean;
  /** Sends in the last 30 days (for the table). */
  sentLast30: number;
  updatedAt: string;
}
