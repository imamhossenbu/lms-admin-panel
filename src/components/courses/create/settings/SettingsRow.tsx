import React from "react";
import { cn } from "@/lib/cn";

export interface SettingsRowProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

/** Two-column settings row: label + helper text on the left, control on the right. */
export function SettingsRow({ title, description, children, className }: SettingsRowProps) {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6 py-5", className)}>
      <div className="lg:col-span-4 min-w-0">
        <h3 className="body-md-medium font-semibold text-primary-500">{title}</h3>
        <p className="body-xsm-regular text-primary-300 mt-1">{description}</p>
      </div>
      <div className="lg:col-span-8 min-w-0">{children}</div>
    </div>
  );
}

export default SettingsRow;
