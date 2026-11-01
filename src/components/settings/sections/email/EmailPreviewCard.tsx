"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useFormContext, useWatch } from "react-hook-form";
import { Eye, GraduationCap, LayoutTemplate } from "lucide-react";
import type { EmailSettings } from "@/validations/platformSettingsSchema";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { cn } from "@/lib/cn";

/** Inbox preview built from the live sender fields + platform name. */
export function EmailPreviewCard({ platformName }: { platformName: string }) {
  const router = useRouter();
  const { control } = useFormContext<EmailSettings>();
  const [senderName, senderEmail, replyTo] = useWatch({ control, name: ["senderName", "senderEmail", "replyTo"] });
  const name = senderName?.trim() || platformName;
  const from = senderEmail?.trim() || "no-reply@example.com";
  const reply = replyTo?.trim();

  return (
    <IconSectionCard icon={<Eye className="h-5 w-5" />} title="Email preview" description="Updates as you type." tone="purple">
      <div>
        <div className="overflow-hidden rounded-xl border border-dash bg-white">
          <div className="space-y-1 border-b border-dash bg-slate-50 px-4 py-3">
            <p className="flex min-w-0 gap-1.5 body-xsm-regular text-primary-300">
              <span className="w-14 shrink-0">From</span>
              <span className={cn("min-w-0 truncate body-xsm-medium", senderName?.trim() ? "text-primary-500" : "text-primary-300")}>
                {name} &lt;{from}&gt;
              </span>
            </p>
            <p className="flex min-w-0 gap-1.5 body-xsm-regular text-primary-300">
              <span className="w-14 shrink-0">Reply-to</span>
              <span className="min-w-0 truncate body-xsm-medium text-primary-400">{reply || from}</span>
            </p>
            <p className="flex min-w-0 gap-1.5 body-xsm-regular text-primary-300">
              <span className="w-14 shrink-0">Subject</span>
              <span className="min-w-0 truncate body-xsm-medium text-primary-500">Welcome to {platformName}</span>
            </p>
          </div>
          <div className="px-4 py-4">
            <span className="flex items-center gap-2 body-sm-medium font-semibold! text-brand-orange">
              <GraduationCap className="h-5 w-5" /> {platformName}
            </span>
            <p className="mt-3 body-sm-regular text-primary-500">Hi Sarah,</p>
            <p className="mt-2 body-xsm-regular text-primary-400">
              Your account is ready. Start your first lesson today and keep your streak going — we&apos;ll send a weekly digest with your progress.
            </p>
            <span className="mt-3 inline-flex items-center rounded-lg bg-brand-orange px-3.5 py-1.5 body-xsm-medium text-white">Go to my courses</span>
            <p className="mt-4 border-t border-dash pt-3 body-2xsm-regular text-primary-300">
              Sent by {name} · Reply to this email to reach {reply || from}.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-start gap-3">
          <p className="body-xsm-regular text-primary-300">Welcome, reset and receipt emails use these sender details.</p>
          <CardActionButton icon={<LayoutTemplate />} onClick={() => router.push("/notifications?tab=templates")}>
            Edit automated templates
          </CardActionButton>
        </div>
      </div>
    </IconSectionCard>
  );
}

export default EmailPreviewCard;
