import React from "react";
import { Info } from "lucide-react";

/** Blue info strip shown before the class has happened. */
export function NotStartedNote({ children = "Attendance will be recorded when the class starts." }: { children?: React.ReactNode }) {
  return (
    <div role="note" className="flex items-start gap-2.5 rounded-xl border border-blue/30 bg-blue-14 px-4 py-3">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
      <p className="body-sm-regular text-primary-400">{children}</p>
    </div>
  );
}

export default NotStartedNote;
