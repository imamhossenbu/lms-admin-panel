"use client";

import React from "react";

interface InstructorFormCardHeaderProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}

/** Icon tile + title/description row shared by every card on the instructor form. */
export function InstructorFormCardHeader({
  icon,
  title,
  description,
}: InstructorFormCardHeaderProps) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <h2 className="title-medium font-bold text-primary-500">{title}</h2>
        {description && (
          <p className="body-sm-regular text-primary-300">{description}</p>
        )}
      </div>
    </div>
  );
}

export default InstructorFormCardHeader;
