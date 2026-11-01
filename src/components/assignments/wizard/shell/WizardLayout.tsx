import React from "react";

export interface WizardLayoutProps {
  main: React.ReactNode;
  side: React.ReactNode;
}

/** Two-column step body: main card(s) ~2/3, side cards ~1/3 (stacked below xl). */
export function WizardLayout({ main, side }: WizardLayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
      <div className="min-w-0 space-y-5 xl:col-span-2">{main}</div>
      <aside className="min-w-0 space-y-5">{side}</aside>
    </div>
  );
}

export default WizardLayout;
