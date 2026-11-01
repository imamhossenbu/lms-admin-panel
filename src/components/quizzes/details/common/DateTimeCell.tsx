import React from "react";
import { formatDate, formatTime } from "../quizFormat";

/** Two-line "Oct 20, 2026 / 10:24 AM" cell. */
export function DateTimeCell({ iso }: { iso: string }) {
  return (
    <div className="whitespace-nowrap">
      <p className="body-sm-regular text-primary-500">{formatDate(iso)}</p>
      <p className="body-xsm-regular text-primary-300">{formatTime(iso)}</p>
    </div>
  );
}

export default DateTimeCell;
