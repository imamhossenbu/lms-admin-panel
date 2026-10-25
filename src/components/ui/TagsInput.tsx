"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  maxLength?: number;
  error?: string;
  id?: string;
  /** Optional custom chip renderer (e.g. coloured ToneBadge). */
  renderTag?: (tag: string) => React.ReactNode;
}

/** Free-text tag entry: Enter or comma adds, Backspace on empty input removes the last tag. */
export function TagsInput({
  value,
  onChange,
  placeholder = "Add tags (press Enter)",
  maxTags = 10,
  maxLength = 30,
  error,
  id,
  renderTag,
}: TagsInputProps) {
  const [draft, setDraft] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim().slice(0, maxLength);
    if (!tag || value.length >= maxTags) return;
    if (value.some((t) => t.toLowerCase() === tag.toLowerCase())) return;
    onChange([...value, tag]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
      setDraft("");
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div>
      <div
        className={cn(
          "min-h-11 w-full rounded-lg border bg-white px-3 py-1.5 flex flex-wrap items-center gap-2 transition-colors focus-within:border-blue",
          error ? "border-red bg-red-14" : "border-dash"
        )}
      >
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 shrink-0">
            {renderTag ? renderTag(tag) : (
              <span className="inline-flex items-center rounded-md border border-dash bg-slate-50 px-2 py-0.5 body-xsm-medium text-primary-500 whitespace-nowrap">
                {tag}
              </span>
            )}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              aria-label={`Remove ${tag}`}
              className="p-0.5 rounded text-primary-300 hover:text-red hover:bg-red-14 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        <input
          id={id}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            addTag(draft);
            setDraft("");
          }}
          disabled={value.length >= maxTags}
          placeholder={value.length >= maxTags ? `Maximum ${maxTags} tags` : value.length ? "" : placeholder}
          className="flex-1 min-w-32 h-8 bg-transparent body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none"
        />
      </div>
      {error && <p className="body-xsm-regular text-red mt-1">{error}</p>}
    </div>
  );
}

export default TagsInput;
