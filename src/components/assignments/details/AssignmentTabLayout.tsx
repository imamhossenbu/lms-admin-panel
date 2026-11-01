import React from "react";

export interface AssignmentTabLayoutProps {
  main: React.ReactNode;
  sidebar: React.ReactNode;
}

/** Two-column tab body: main content (8/12) + right sidebar cards (4/12), stacked below xl. */
export function AssignmentTabLayout({ main, sidebar }: AssignmentTabLayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <div className="min-w-0 space-y-5 xl:col-span-8">{main}</div>
      <aside className="min-w-0 space-y-5 xl:col-span-4">{sidebar}</aside>
    </div>
  );
}

export default AssignmentTabLayout;
