"use client";

import React from "react";
import { Bell, ChevronRight, GraduationCap, Megaphone, Pin } from "lucide-react";
import type { NotificationPriority } from "@/types/notification";
import { PUSH_MESSAGE_MAX } from "@/validations/notificationSchema";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { cn } from "@/lib/cn";
import { htmlToText, truncate } from "./composeUtils";

export interface PreviewContent {
  title: string;
  messageHtml: string;
  priority: NotificationPriority;
  ctaLabel: string;
  ctaUrl: string;
}

const TITLE_FALLBACK = "Your broadcast title";
const BODY_FALLBACK = "Your message will appear here as you type.";

/** Bell dropdown row as students see it in the app. */
export function InAppPreview({ title, messageHtml, priority, ctaLabel, ctaUrl }: PreviewContent) {
  const text = htmlToText(messageHtml);
  const high = priority === "HIGH";
  return (
    <div className="overflow-hidden rounded-xl border border-dash bg-white">
      <div className="flex items-center justify-between border-b border-dash px-4 py-2.5">
        <span className="flex items-center gap-2 body-sm-medium font-semibold! text-primary-500">
          <Bell className="h-4 w-4 text-primary-400" /> Notifications
        </span>
        <ToneBadge tone="orange" size="sm" variant="pill">
          1 new
        </ToneBadge>
      </div>
      <div className={cn("flex items-start gap-3 px-4 py-3.5", high ? "bg-red-14" : "bg-brand-orange-light")}>
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", high ? "bg-white text-red" : "bg-white text-brand-orange")}>
          <Megaphone className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className={cn("min-w-0 truncate body-sm-medium font-semibold!", title.trim() ? "text-primary-500" : "text-primary-300")}>{title.trim() || TITLE_FALLBACK}</p>
            {high && (
              <ToneBadge tone="red" size="sm" icon={<Pin className="h-3 w-3" />}>
                High
              </ToneBadge>
            )}
          </div>
          <p className={cn("mt-0.5 line-clamp-2 break-words body-xsm-regular", text ? "text-primary-400" : "text-primary-300")}>{text || BODY_FALLBACK}</p>
          <div className="mt-1.5 flex items-center gap-2 body-2xsm-regular text-primary-300">
            <span>Just now</span>
            {ctaLabel.trim() && ctaUrl.trim() && (
              <span className="inline-flex items-center gap-0.5 body-xsm-medium text-brand-orange">
                {ctaLabel.trim()} <ChevronRight className="h-3 w-3" />
              </span>
            )}
          </div>
        </div>
        <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", high ? "bg-red" : "bg-brand-orange")} aria-label="Unread" />
      </div>
      <div className="flex items-start gap-3 px-4 py-3.5 opacity-50" aria-hidden>
        <span className="h-9 w-9 shrink-0 rounded-full bg-gray-bg" />
        <div className="flex-1 space-y-1.5 pt-1">
          <div className="h-2.5 w-2/3 rounded bg-slate-200" />
          <div className="h-2.5 w-5/6 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

/** Email card: sender, subject, body and the CTA button. */
export function EmailPreview({ title, messageHtml, priority, ctaLabel, ctaUrl }: PreviewContent) {
  const hasBody = htmlToText(messageHtml).length > 0;
  return (
    <div className="overflow-hidden rounded-xl border border-dash bg-white">
      <div className="space-y-1 border-b border-dash bg-slate-50 px-4 py-3">
        <p className="body-xsm-regular text-primary-300">
          From <span className="body-xsm-medium text-primary-400">EduPro &lt;no-reply@edupro.com&gt;</span>
        </p>
        <div className="flex items-center gap-1.5">
          <p className="body-xsm-regular text-primary-300 shrink-0">Subject</p>
          <p className={cn("min-w-0 truncate body-sm-medium font-semibold!", title.trim() ? "text-primary-500" : "text-primary-300")}>
            {priority === "HIGH" && title.trim() ? "[Important] " : ""}
            {title.trim() || TITLE_FALLBACK}
          </p>
        </div>
      </div>
      <div className="px-5 py-5">
        <span className="flex items-center gap-2 body-sm-medium font-semibold! text-brand-orange">
          <GraduationCap className="h-5 w-5" /> EduPro
        </span>
        <p className="mt-4 body-sm-regular text-primary-500">Hi Sarah,</p>
        {hasBody ? (
          <RichTextContent html={messageHtml} className="mt-2 break-words" />
        ) : (
          <p className="mt-2 body-sm-regular text-primary-300">{BODY_FALLBACK}</p>
        )}
        {ctaLabel.trim() && ctaUrl.trim() && (
          <span className="mt-4 inline-flex items-center rounded-lg bg-brand-orange px-4 py-2 body-sm-medium font-semibold! text-white">{ctaLabel.trim()}</span>
        )}
        <p className="mt-5 border-t border-dash pt-3 body-2xsm-regular text-primary-300">
          You&apos;re receiving this because you have an EduPro account. Manage email preferences in your profile.
        </p>
      </div>
    </div>
  );
}

/** Lock-screen banner on a phone frame (text truncated like devices do). */
export function PushPreview({ title, messageHtml }: PreviewContent) {
  const text = htmlToText(messageHtml);
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-xs rounded-3xl border-4 border-primary-500 bg-gray-bg px-3 pb-10 pt-3">
        <div className="mx-auto h-1.5 w-16 rounded-full bg-primary-500" />
        <p className="mt-4 text-center heading-h3 font-bold! text-primary-500">9:41</p>
        <p className="text-center body-xsm-regular text-primary-300">Lock screen</p>
        <div className="mt-5 rounded-2xl border border-dash bg-white p-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-orange text-white">
              <GraduationCap className="h-3.5 w-3.5" />
            </span>
            <span className="body-2xsm-regular text-primary-400 font-semibold!">EDUPRO</span>
            <span className="ml-auto body-2xsm-regular text-primary-300">now</span>
          </div>
          <p className={cn("mt-1.5 truncate body-sm-medium font-semibold!", title.trim() ? "text-primary-500" : "text-primary-300")}>{title.trim() || TITLE_FALLBACK}</p>
          <p className={cn("mt-0.5 line-clamp-2 break-words body-xsm-regular", text ? "text-primary-400" : "text-primary-300")}>
            {text ? truncate(text, PUSH_MESSAGE_MAX) : BODY_FALLBACK}
          </p>
        </div>
      </div>
      <p className="mt-2.5 text-center body-xsm-regular text-primary-300">Devices show about two lines — put the key point first.</p>
    </div>
  );
}
