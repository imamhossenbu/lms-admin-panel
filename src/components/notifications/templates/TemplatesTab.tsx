"use client";

import React from "react";
import { Zap } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { useNotificationsStore } from "../shared/useNotificationsStore";
import { TemplatesTable } from "./TemplatesTable";

/** Templates tab: automated messages sent on platform events (enrollment, payment, grading …). */
export function TemplatesTab() {
  const { templates } = useNotificationsStore();
  const enabled = templates.filter((t) => t.enabled).length;

  return (
    <section className="dashboard-card shadow-2xs space-y-4 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange-light text-brand-orange">
            <Zap className="h-5 w-5" />
          </span>
          <div>
            <h2 className="body-medium font-semibold! text-primary-500">Automated messages</h2>
            <p className="mt-0.5 body-sm-regular text-primary-300">Sent automatically when something happens on the platform. Edit the wording or turn them off.</p>
          </div>
        </div>
        <ToneBadge tone="green" variant="pill" dot>
          {enabled} of {templates.length} enabled
        </ToneBadge>
      </div>
      <TemplatesTable templates={templates} />
    </section>
  );
}

export default TemplatesTab;
