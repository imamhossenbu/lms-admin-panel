import React from "react";

export interface QuizStepLayoutProps {
  main: React.ReactNode;
  side: React.ReactNode;
  /** Full-width footer under both columns. */
  footer?: React.ReactNode;
}

/** Step body: main card(s) ~2/3, side cards ~1/3 (stacked below xl), footer full width underneath. */
export function QuizStepLayout({ main, side, footer }: QuizStepLayoutProps) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="min-w-0 space-y-5 xl:col-span-2">{main}</div>
        <aside className="min-w-0 space-y-5">{side}</aside>
      </div>
      {footer}
    </div>
  );
}

export default QuizStepLayout;
