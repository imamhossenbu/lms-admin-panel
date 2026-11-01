import type { AssignmentItem } from "@/types/assignment";
import { htmlToText } from "@/lib/sanitizeHtml";

/** Google / Outlook "add event" links for an assignment's due date (1-hour block ending at the due time). */

const pad = (n: number) => String(n).padStart(2, "0");

function dueRange(a: Pick<AssignmentItem, "dueDate" | "dueTime">) {
  const [y, m, d] = a.dueDate.split("-").map(Number);
  const [h, min] = (a.dueTime || "23:59").split(":").map(Number);
  const end = new Date(y, (m || 1) - 1, d || 1, h || 0, min || 0);
  const start = new Date(end.getTime() - 60 * 60 * 1000);
  return { start, end };
}

const googleStamp = (dt: Date) =>
  `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
const isoLocal = (dt: Date) =>
  `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}:00`;

export function googleCalendarUrl(a: AssignmentItem, link: string) {
  const { start, end } = dueRange(a);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Due: ${a.title}`,
    dates: `${googleStamp(start)}/${googleStamp(end)}`,
    details: `${htmlToText(a.descriptionHtml)}\n\n${link}`.trim(),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(a: AssignmentItem, link: string) {
  const { start, end } = dueRange(a);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: `Due: ${a.title}`,
    startdt: isoLocal(start),
    enddt: isoLocal(end),
    body: `${htmlToText(a.descriptionHtml)}\n\n${link}`.trim(),
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}
