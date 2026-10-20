import React from "react";
import { cn } from "@/lib/cn";

export interface SectionCardProps {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  id?: string;
  divider?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function SectionCard({
  title,
  description,
  action,
  id,
  divider = false,
  className,
  children,
}: SectionCardProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-6 rounded-xl border border-[#EDEDED] bg-white p-5",
        className
      )}
    >
      <div
        className={cn(
          "mb-4 flex items-start justify-between gap-3",
          divider && "border-b border-[#F0F0F0] pb-4"
        )}
      >
        <div>
          <h2 className="body-medium text-primary-500 font-semibold">{title}</h2>
          {description && (
            <p className="body-sm-regular subtext-500 mt-0.5">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default SectionCard;
