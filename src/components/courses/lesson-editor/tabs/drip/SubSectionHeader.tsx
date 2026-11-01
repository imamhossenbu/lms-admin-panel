import React from "react";

/** Small icon tile + title + helper used for nested drip sections ("Dependencies", "Access Before Release"). */
export function SubSectionHeader({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-14 text-blue">{icon}</span>
      <div className="min-w-0">
        <p className="body-sm-medium font-semibold! text-primary-500">{title}</p>
        <p className="mt-0.5 body-xsm-regular text-primary-300">{description}</p>
      </div>
    </div>
  );
}

export default SubSectionHeader;
