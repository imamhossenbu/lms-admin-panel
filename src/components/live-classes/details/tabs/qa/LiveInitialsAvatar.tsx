import React from "react";
import { initialsOf } from "@/lib/liveClassStats";
import { cn } from "@/lib/cn";

const TONES = [
  "bg-blue-14 text-blue",
  "bg-brand-orange-light text-brand-orange",
  "bg-green-bg text-green",
  "bg-purple-14 text-purple",
  "bg-red-14 text-red",
  "bg-yellow-bg text-yellow",
];

const toneFor = (name: string) => TONES[[...name].reduce((s, ch) => s + ch.charCodeAt(0), 0) % TONES.length];

export interface LiveInitialsAvatarProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  /** White ring (for overlapping avatar stacks). */
  ring?: boolean;
  className?: string;
}

/** Round initials avatar with a stable tint per name (students, instructors, actors). */
export function LiveInitialsAvatar({ name, size = "sm", ring, className }: LiveInitialsAvatarProps) {
  return (
    <span
      title={name}
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold! select-none",
        size === "xs" && "h-7 w-7 body-2xsm-regular",
        size === "sm" && "h-8 w-8 body-xsm-medium",
        size === "md" && "h-10 w-10 body-sm-medium",
        size === "lg" && "h-11 w-11 body-sm-medium",
        ring && "ring-2 ring-white",
        toneFor(name),
        className
      )}
    >
      {initialsOf(name)}
    </span>
  );
}

/** Overlapping avatar stack + "+N" chip. */
export function LiveAvatarStack({ names, total, max = 4, size = "xs" }: { names: string[]; total: number; max?: number; size?: "xs" | "sm" | "md" }) {
  const shown = names.slice(0, max);
  const rest = Math.max(0, total - shown.length);
  return (
    <span className="inline-flex items-center -space-x-2">
      {shown.map((n, i) => (
        <LiveInitialsAvatar key={`${n}-${i}`} name={n} size={size} ring />
      ))}
      {rest > 0 && (
        <span
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-full bg-gray-bg text-primary-400 ring-2 ring-white font-semibold!",
            size === "xs" ? "h-7 min-w-7 px-1 body-2xsm-regular" : size === "sm" ? "h-8 min-w-8 px-1 body-xsm-medium" : "h-10 min-w-10 px-1.5 body-sm-medium"
          )}
        >
          +{rest}
        </span>
      )}
    </span>
  );
}

export default LiveInitialsAvatar;
