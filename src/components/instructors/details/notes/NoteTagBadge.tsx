import React from "react";
import { ToneBadge, Tone } from "@/components/ui/ToneBadge";

const KNOWN_TONES: Record<string, Tone> = {
  performance: "blue",
  positive: "green",
  completed: "green",
  "content update": "purple",
  "action required": "orange",
  onboarding: "blue",
  meeting: "indigo",
  issue: "red",
  payment: "yellow",
};

const FALLBACK_TONES: Tone[] = ["blue", "green", "purple", "orange", "indigo", "yellow"];

export const getTagTone = (tag: string): Tone => {
  const key = tag.trim().toLowerCase();
  if (KNOWN_TONES[key]) return KNOWN_TONES[key];
  const hash = key.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return FALLBACK_TONES[hash % FALLBACK_TONES.length];
};

interface NoteTagBadgeProps {
  tag: string;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

/** Note tag with a stable colour per tag name. */
export function NoteTagBadge({ tag, size = "lg", icon }: NoteTagBadgeProps) {
  return (
    <ToneBadge tone={getTagTone(tag)} size={size} icon={icon} className="font-medium">
      {tag}
    </ToneBadge>
  );
}

export default NoteTagBadge;
