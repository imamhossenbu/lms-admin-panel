import React from "react";
import { cn } from "@/lib/cn";

/** Small heading above a group of inputs ("Lesson Visibility", "Allowed Plans"). */
export function FieldGroupLabel({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={cn("mb-2.5 block body-sm-medium text-primary-500", className)}>
      {children}
    </label>
  );
}

export default FieldGroupLabel;
