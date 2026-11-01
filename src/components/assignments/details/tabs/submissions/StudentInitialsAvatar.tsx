import React from "react";
import { initials } from "@/lib/assignmentStats";
import { cn } from "@/lib/cn";

const TONES = ["bg-red-14 text-red", "bg-blue-14 text-blue", "bg-brand-orange-light text-brand-orange", "bg-green-bg text-green", "bg-purple-14 text-purple"];

const toneFor = (name: string) => TONES[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % TONES.length];

/** Round initials avatar with a stable tint per student name. */
export function StudentInitialsAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold!",
        size === "sm" ? "h-8 w-8 body-2xsm-regular" : size === "lg" ? "h-12 w-12 body-medium" : "h-10 w-10 body-sm-medium",
        toneFor(name)
      )}
    >
      {initials(name)}
    </span>
  );
}

export default StudentInitialsAvatar;
