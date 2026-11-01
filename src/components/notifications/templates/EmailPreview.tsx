import React from "react";

export interface PreviewContentProps {
  subject: string;
  body: string;
}

/** Email client-style card: sender, recipient, subject line, branded body and footer. */
export function EmailPreview({ subject, body }: PreviewContentProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-dash bg-white shadow-2xs">
      <div className="space-y-1 border-b border-dash bg-gray-bg px-4 py-3">
        <p className="body-xsm-regular text-primary-300">
          <span className="text-primary-400">From:</span> EduPro &lt;no-reply@edupro.com&gt;
        </p>
        <p className="body-xsm-regular text-primary-300">
          <span className="text-primary-400">To:</span> Sarah Rahman &lt;sarah@example.com&gt;
        </p>
        <p className="pt-1 body-sm-medium font-semibold! text-primary-500 wrap-break-word">{subject || "Subject line"}</p>
      </div>
      <div className="h-1 bg-brand-orange" />
      <div className="space-y-4 px-5 py-5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-orange body-sm-medium font-bold! text-white">E</span>
          <span className="body-sm-medium font-semibold! text-primary-500">EduPro</span>
        </div>
        <p className="whitespace-pre-line wrap-break-word body-sm-regular text-primary-400">{body || "Your message will appear here."}</p>
      </div>
      <div className="border-t border-dash px-5 py-3 body-2xsm-regular text-primary-300">You received this email because you have an EduPro account. Manage notification settings in your profile.</div>
    </div>
  );
}

export default EmailPreview;
