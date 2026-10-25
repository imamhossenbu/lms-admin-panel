"use client";

import React from "react";
import { Info, FileText, ShieldCheck, Tag } from "lucide-react";
import { cn } from "@/lib/cn";

export const SUGGESTED_TAGS = ["Performance", "Meeting", "Issue", "Onboarding", "Payment"];

interface NoteInformationCardProps {
  selectedTags: string[];
  onAddTag: (tag: string) => void;
}

function TipBox({
  icon,
  title,
  className,
  titleClassName,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  className: string;
  titleClassName: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-xl p-5 flex gap-4", className)}>
      <span className={cn("shrink-0 [&>svg]:w-6 [&>svg]:h-6", titleClassName)}>{icon}</span>
      <div className="space-y-1.5 min-w-0">
        <h3 className={cn("body-medium font-semibold", titleClassName)}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

export function NoteInformationCard({ selectedTags, onAddTag }: NoteInformationCardProps) {
  return (
    <aside className="rounded-xl border border-dash bg-white p-5 space-y-4 text-left">
      <div className="flex items-center gap-2.5">
        <Info className="w-5 h-5 text-blue" />
        <h2 className="title-medium font-bold text-primary-500">Note Information</h2>
      </div>

      <TipBox icon={<FileText />} title="Internal Only" className="bg-blue-14" titleClassName="text-blue">
        <p className="body-sm-regular text-primary-400 leading-relaxed">
          This note will only be visible to admins and will not be shown to the instructor or students.
        </p>
      </TipBox>

      <TipBox icon={<ShieldCheck />} title="Use Clear Information" className="bg-green-bg" titleClassName="text-green">
        <p className="body-sm-regular text-primary-400 leading-relaxed">
          Add relevant details, actions, or reminders to keep track of important information.
        </p>
      </TipBox>

      <TipBox icon={<Tag />} title="Suggested Tags" className="bg-yellow-bg" titleClassName="text-yellow">
        <div className="flex flex-wrap gap-2 pt-1">
          {SUGGESTED_TAGS.map((tag) => {
            const isSelected = selectedTags.some((t) => t.toLowerCase() === tag.toLowerCase());
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onAddTag(tag)}
                disabled={isSelected}
                className={cn(
                  "px-2.5 py-1 rounded-md border body-xsm-medium whitespace-nowrap transition-colors",
                  isSelected
                    ? "border-yellow/40 bg-yellow-14 text-yellow cursor-default"
                    : "border-dash bg-white text-primary-400 hover:border-yellow hover:text-yellow cursor-pointer"
                )}
                title={isSelected ? "Already added" : `Add "${tag}" tag`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </TipBox>
    </aside>
  );
}

export default NoteInformationCard;
