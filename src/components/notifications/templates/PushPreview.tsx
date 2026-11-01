import React from "react";
import type { PreviewContentProps } from "./EmailPreview";

/** Phone lock screen with a push banner (title + first lines of the body). */
export function PushPreview({ subject, body }: PreviewContentProps) {
  const text = body.replace(/\s+/g, " ").trim();
  return (
    <div className="mx-auto w-full max-w-xs rounded-4xl border-4 border-primary-500 bg-primary-500 p-1.5 shadow-md">
      <div className="relative overflow-hidden rounded-3xl bg-brand-navy px-3.5 pb-10 pt-3">
        <div className="mx-auto mb-6 h-5 w-24 rounded-full bg-primary-500" aria-hidden />
        <div className="mb-6 text-center text-white">
          <p className="heading-h2-bold">9:41</p>
          <p className="body-xsm-regular opacity-70">Monday, November 2</p>
        </div>
        <div className="rounded-2xl bg-white px-3.5 py-3 shadow-md">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-orange body-2xsm-regular font-bold! text-white">E</span>
            <span className="flex-1 body-2xsm-regular font-semibold! uppercase tracking-wide text-primary-300">EduPro</span>
            <span className="body-2xsm-regular text-primary-300">now</span>
          </div>
          <p className="line-clamp-1 wrap-break-word body-sm-medium font-semibold! text-primary-500">{subject || "Notification title"}</p>
          <p className="mt-0.5 line-clamp-3 wrap-break-word body-xsm-regular text-primary-400">{text || "Your message will appear here."}</p>
        </div>
        <div className="mx-auto mt-10 h-1 w-24 rounded-full bg-white opacity-60" aria-hidden />
      </div>
    </div>
  );
}

export default PushPreview;
