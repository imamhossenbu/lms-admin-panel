import React from "react";
import type { NotificationCategory } from "@/types/notification";
import { CategoryIcon } from "../shared/CategoryIcon";
import type { PreviewContentProps } from "./EmailPreview";

/** Student-app notification row: category tile, bold title + unread dot, message, "just now". */
export function InAppPreview({ subject, body, category }: PreviewContentProps & { category: NotificationCategory }) {
  return (
    <div className="overflow-hidden rounded-xl border border-dash bg-white shadow-2xs">
      <div className="flex items-center justify-between border-b border-dash px-4 py-3">
        <span className="body-sm-medium font-semibold! text-primary-500">Notifications</span>
        <span className="body-xsm-regular text-brand-orange">Mark all as read</span>
      </div>
      <div className="flex items-start gap-3 bg-brand-orange-soft px-4 py-3.5">
        <CategoryIcon category={category} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 wrap-break-word body-sm-medium font-bold! text-primary-500">{subject || "Notification title"}</p>
            <span className="shrink-0 body-xsm-regular text-primary-300">just now</span>
          </div>
          <p className="mt-0.5 line-clamp-3 whitespace-pre-line wrap-break-word body-sm-regular text-primary-400">{body || "Your message will appear here."}</p>
        </div>
        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-orange" aria-hidden />
      </div>
      <div className="flex items-start gap-3 px-4 py-3.5 opacity-50" aria-hidden>
        <span className="h-9 w-9 shrink-0 rounded-xl bg-gray-bg" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3 w-2/5 rounded bg-slate-200" />
          <div className="h-3 w-4/5 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default InAppPreview;
