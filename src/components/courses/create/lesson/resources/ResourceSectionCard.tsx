import React from "react";
import { Plus } from "lucide-react";
import { SecondaryButton } from "@/components/ui/secondary-button";

interface ResourceSectionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  actionDisabled?: boolean;
  children: React.ReactNode;
}

/** Bordered card with icon + title + description header and a "+ Action" button (Upload Files, External Links). */
export function ResourceSectionCard({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionDisabled,
  children,
}: ResourceSectionCardProps) {
  return (
    <section className="rounded-xl border border-dash bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 shrink-0 text-blue [&>svg]:h-6 [&>svg]:w-6">{icon}</span>
          <div className="min-w-0">
            <h4 className="title-medium text-primary-500">{title}</h4>
            <p className="body-sm-regular text-primary-300 mt-0.5">{description}</p>
          </div>
        </div>
        <SecondaryButton
          leftIcon={<Plus />}
          onClick={onAction}
          disabled={actionDisabled}
          className="text-blue"
        >
          {actionLabel}
        </SecondaryButton>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

export default ResourceSectionCard;
