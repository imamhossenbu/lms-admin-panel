import type { AdminNotification, Broadcast, BroadcastDelivery, NotificationCategory, NotificationChannel, NotificationTemplateItem } from "@/types/notification";
import { COURSE_CONTEXTS } from "@/data/mockCourseCatalog";

/**
 * Deterministic mock data for Notifications (mock-first), relative to "now".
 * - Admin inbox: ~40 notifications over 3 weeks (a few unread & high-priority ones recent).
 * - Broadcasts: sent ones with per-recipient × channel deliveries, plus scheduled & draft.
 * - Automated templates: one per trigger.
 * Counts on the pages (unread, delivery/open/click rates) are DERIVED in src/lib/notificationStats.ts.
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

const NAMES = ["Sarah Rahman", "Mahin Tarek", "Ayesha Faria", "Rakibul Islam", "Sadia Nur", "Imran Hossain", "Nusrat Tahsin", "Ahmed Rony", "Fahim Rahman", "Tanvir Hossain", "Nabila Tabassum", "Kamrul Hasan"];
const course = (i: number) => COURSE_CONTEXTS[i % COURSE_CONTEXTS.length].course;

/** Inbox generators per category (title, message, link). */
const INBOX: { category: NotificationCategory; make: (i: number) => { title: string; message: string; href: string; high?: boolean } }[] = [
  { category: "ENROLLMENT", make: (i) => ({ title: "New student enrolled", message: `${NAMES[i % NAMES.length]} enrolled in ${course(i).title}.`, href: "/students" }) },
  { category: "PAYMENT", make: (i) => ({ title: "Payment received", message: `$${(29 + (i % 5) * 10).toFixed(2)} from ${NAMES[(i + 3) % NAMES.length]} for ${course(i + 1).title}.`, href: "/payments" }) },
  { category: "PAYMENT", make: (i) => ({ title: "Payment failed", message: `Card payment from ${NAMES[(i + 5) % NAMES.length]} was declined.`, href: "/payments", high: true }) },
  { category: "SUBMISSION", make: (i) => ({ title: "New assignment submission", message: `${NAMES[(i + 1) % NAMES.length]} submitted "Build a Simple HTML Page".`, href: "/assignments/assignment-1?tab=submissions" }) },
  { category: "COMMUNITY", make: () => ({ title: "Discussion reported", message: "A post in Community was reported as spam and needs review.", href: "/community?tab=moderation", high: true }) },
  { category: "COMMUNITY", make: (i) => ({ title: "Unanswered question", message: `A question in ${course(i).title} has no reply after 24 hours.`, href: "/community?tab=unanswered" }) },
  { category: "LIVE_CLASS", make: (i) => ({ title: "Live class starting soon", message: `"${course(i).title} Q&A" starts in 15 minutes.`, href: "/live-classes" }) },
  { category: "CERTIFICATE", make: (i) => ({ title: "Certificates waiting", message: `${2 + (i % 4)} learners qualified for a certificate in Advanced CSS.`, href: "/certificates?tab=eligible" }) },
  { category: "SYSTEM", make: () => ({ title: "Backup completed", message: "Nightly database backup finished successfully.", href: "/settings" }) },
  { category: "SYSTEM", make: () => ({ title: "Storage almost full", message: "Media storage is at 86% of your plan.", href: "/settings", high: true }) },
];

export interface NotificationSeed {
  inbox: AdminNotification[];
  broadcasts: Broadcast[];
  deliveries: BroadcastDelivery[];
  templates: NotificationTemplateItem[];
}

export function buildNotificationSeed(now: Date = new Date()): NotificationSeed {
  const rand = mulberry32(20261103);
  const H = 3600000;

  // ---- inbox: newest first; the 3 most recent are unread (matches the sidebar "3" badge out of the box).
  const inbox: AdminNotification[] = Array.from({ length: 40 }, (_, i) => {
    const g = INBOX[(i * 7 + Math.floor(i / 3)) % INBOX.length];
    const m = g.make(i);
    const hoursAgo = i === 0 ? 0.2 : i < 3 ? i * 1.5 : 4 + i * 11 + rand() * 6;
    return {
      id: `notif-${i + 1}`,
      category: g.category,
      priority: m.high ? "HIGH" : "NORMAL",
      title: m.title,
      message: m.message,
      href: m.href,
      isRead: i >= 3,
      isArchived: i > 34,
      createdAt: new Date(now.getTime() - hoursAgo * H).toISOString(),
    };
  });

  // ---- broadcasts
  const [html, js] = COURSE_CONTEXTS.map((c) => c.course.id);
  const b = (
    id: string,
    title: string,
    msg: string,
    audience: Broadcast["audience"],
    courseIds: string[],
    channels: NotificationChannel[],
    status: Broadcast["status"],
    sendHoursFromNow: number | null,
    extra: Partial<Broadcast> = {}
  ): Broadcast => {
    const sendAt = sendHoursFromNow === null ? null : new Date(now.getTime() + sendHoursFromNow * H).toISOString();
    const created = new Date(now.getTime() + Math.min(sendHoursFromNow ?? -30, -2) * H - 6 * H).toISOString();
    return { id, title, messageHtml: `<p>${msg}</p>`, audience, courseIds, channels, priority: "NORMAL", ctaLabel: "", ctaUrl: "", status, sendAt, createdBy: "Admin", createdAt: created, updatedAt: created, ...extra };
  };
  const broadcasts: Broadcast[] = [
    b("bc-1", "New module: Semantic HTML & Accessibility", "We just published a new module. Jump in and earn your badge!", "COURSE", [html], ["IN_APP", "EMAIL"], "SENT", -26, { ctaLabel: "Start module", ctaUrl: "/courses" }),
    b("bc-2", "Live Q&A this Thursday", "Bring your questions about async JavaScript — see you at 7 PM.", "COURSE", [js], ["IN_APP", "EMAIL", "PUSH"], "SENT", -74, { priority: "HIGH" }),
    b("bc-3", "Platform maintenance on Sunday", "EduPro will be unavailable from 2–3 AM for scheduled maintenance.", "ALL_STUDENTS", [], ["IN_APP", "EMAIL"], "SENT", -170),
    b("bc-4", "We miss you! 20% off your next course", "Come back and continue learning with 20% off any course this week.", "INACTIVE_STUDENTS", [], ["EMAIL"], "SENT", -320, { ctaLabel: "Browse courses", ctaUrl: "/courses" }),
    b("bc-5", "Instructor payout schedule update", "Payouts now run on the 5th of every month.", "INSTRUCTORS", [], ["IN_APP", "EMAIL"], "SENT", -500),
    b("bc-6", "Final project deadline reminder", "The HTML Fundamentals final project is due in 3 days.", "COURSE", [html], ["IN_APP", "PUSH"], "SCHEDULED", 30),
    b("bc-7", "New year learning challenge", "Join the 30-day learning challenge and win certificates.", "ALL_STUDENTS", [], ["IN_APP", "EMAIL"], "SCHEDULED", 120),
    b("bc-8", "Survey: how are we doing?", "Draft — add the survey link before sending.", "ALL_STUDENTS", [], ["EMAIL"], "DRAFT", null),
  ];

  // ---- deliveries for SENT broadcasts (recipient counts depend on audience)
  const audienceSize: Record<Broadcast["audience"], number> = { ALL_STUDENTS: 60, COURSE: 32, INSTRUCTORS: 8, INACTIVE_STUDENTS: 24 };
  const deliveries: BroadcastDelivery[] = [];
  broadcasts
    .filter((x) => x.status === "SENT")
    .forEach((x) => {
      const sent = new Date(x.sendAt!).getTime();
      for (let r = 0; r < audienceSize[x.audience]; r++) {
        const name = x.audience === "INSTRUCTORS" ? ["Arif Hossain", "Faria Islam", "Kazi Rahman", "Samira Akter", "Tanvir Ahmed", "Rahat Mia", "Nusrat Jahan", "Sadia Rahman"][r] : `${NAMES[r % NAMES.length].split(" ")[0]} ${NAMES[(r * 5 + 2) % NAMES.length].split(" ")[1]}`;
        const recipient = { id: `rcp-${x.audience}-${r}`, name, email: `${name.split(" ")[0].toLowerCase()}${r}@example.com` };
        x.channels.forEach((channel) => {
          const fail = rand() < (channel === "EMAIL" ? 0.03 : 0.015);
          const openP = channel === "IN_APP" ? 0.72 : channel === "EMAIL" ? 0.48 : 0.35;
          const opened = !fail && rand() < openP;
          const clicked = opened && !!x.ctaUrl && rand() < 0.4;
          const deliveredAt = fail ? null : new Date(sent + (1 + rand() * 5) * 60000);
          const openedAt = opened ? new Date(Math.min(now.getTime() - 60000, deliveredAt!.getTime() + rand() * 20 * H)) : null;
          deliveries.push({
            id: `${x.id}-${channel}-${r}`,
            broadcastId: x.id,
            recipient,
            channel,
            status: fail ? "FAILED" : clicked ? "CLICKED" : opened ? "OPENED" : "DELIVERED",
            error: fail ? (channel === "EMAIL" ? "Mailbox unavailable (bounced)" : "Device token expired") : "",
            deliveredAt: deliveredAt?.toISOString() ?? null,
            openedAt: openedAt?.toISOString() ?? null,
            clickedAt: clicked && openedAt ? new Date(openedAt.getTime() + 2 * 60000).toISOString() : null,
          });
        });
      }
    });

  // ---- automated templates
  const t = (trigger: NotificationTemplateItem["trigger"], name: string, subject: string, body: string, channels: NotificationChannel[], enabled = true, locked = false): NotificationTemplateItem => ({
    id: `tpl-${trigger.toLowerCase()}`,
    slug: trigger.toLowerCase().replace(/_/g, "-"),
    trigger,
    name,
    subject,
    body,
    channels,
    enabled,
    locked,
    sentLast30: enabled ? 20 + Math.floor(rand() * 400) : 0,
    updatedAt: new Date(now.getTime() - (5 + Math.floor(rand() * 60)) * 24 * H).toISOString(),
  });
  const templates: NotificationTemplateItem[] = [
    t("ENROLLMENT_CONFIRMED", "Enrollment confirmation", "Welcome to {course_title}!", "Hi {student_name},\n\nYou're enrolled in {course_title}. Start learning any time: {course_url}", ["IN_APP", "EMAIL"]),
    t("PAYMENT_RECEIPT", "Payment receipt", "Receipt for order {order_id}", "Hi {student_name},\n\nWe received {amount} via {payment_method}. Thank you!", ["EMAIL"]),
    t("ASSIGNMENT_GRADED", "Assignment graded", "Your assignment was graded", "Hi {student_name},\n\n\"{assignment_title}\" in {course_title} was graded: {score}.", ["IN_APP", "EMAIL", "PUSH"]),
    t("QUIZ_RESULT", "Quiz result", "Your result for {quiz_title}", "Hi {student_name},\n\nYou scored {score} on {quiz_title} — {result}.", ["IN_APP"]),
    t("LIVE_CLASS_REMINDER", "Live class reminder", "{class_title} starts at {start_time}", "Hi {student_name},\n\nYour live class starts soon. Join here: {join_url}", ["IN_APP", "EMAIL", "PUSH"]),
    t("CERTIFICATE_ISSUED", "Certificate issued", "Your certificate for {course_title} is ready 🎓", "Congratulations {student_name}!\n\nDownload your certificate: {certificate_url}", ["IN_APP", "EMAIL"]),
    t("COMMUNITY_REPLY", "Community reply", "{reply_author} replied to your discussion", "Hi {student_name},\n\n{reply_author} replied to \"{discussion_title}\": {discussion_url}", ["IN_APP"], false),
    t("COURSE_COMPLETED", "Course completed", "You completed {course_title}!", "Amazing work, {student_name}! You've completed {course_title}.", ["IN_APP", "EMAIL"]),
    t("PASSWORD_RESET", "Password reset", "Reset your EduPro password", "Hi {student_name},\n\nReset your password here: {reset_url}\nThis link expires in {expires_in}.", ["EMAIL"], true, true),
  ];

  return { inbox, broadcasts, deliveries, templates };
}
