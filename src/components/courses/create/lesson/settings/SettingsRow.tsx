import React from "react";
import { cn } from "@/lib/cn";

interface SettingsRowProps {
  title: string;
  description: string;
  optional?: boolean;
  /** Greys out the label column (e.g. Drip Duration when release type isn't Drip). */
  muted?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}

/** Two-column settings row: label + description on the left, control on the right. */
export function SettingsRow({ title, description, optional, muted, htmlFor, children }: SettingsRowProps) {
  const Label = htmlFor ? "label" : "div";
  return (
    <div className="grid grid-cols-1 gap-3 border-b border-dash py-5 last:border-b-0 md:grid-cols-12 md:gap-6">
      <Label htmlFor={htmlFor} className={cn("md:col-span-4 transition-opacity", muted && "opacity-60")}>
        <span className="block body-medium text-primary-500">
          {title}
          {optional && <span className="text-primary-300"> (Optional)</span>}
        </span>
        <span className="mt-1 block body-sm-regular text-primary-300">{description}</span>
      </Label>
      <div className="min-w-0 md:col-span-8">{children}</div>
    </div>
  );
}

export default SettingsRow;
