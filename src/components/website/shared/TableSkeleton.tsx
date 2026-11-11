import React from "react";

/** Table placeholder with header cells, column borders and rows (avatar-less two-line first cell, badges, actions). */
export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-dash">
      <div className="grid divide-x divide-dash border-b border-dash bg-slate-50" style={{ gridTemplateColumns: `2fr repeat(${cols - 1}, 1fr)` }}>
        {Array.from({ length: cols }, (_, i) => (
          <div key={i} className="px-3.5 py-3">
            <span className="block h-3 w-20 rounded bg-slate-200" />
          </div>
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="grid divide-x divide-dash border-b border-dash last:border-0" style={{ gridTemplateColumns: `2fr repeat(${cols - 1}, 1fr)` }}>
          <div className="space-y-2 px-3.5 py-3">
            <span className="block h-3.5 w-40 rounded bg-slate-200" />
            <span className="block h-3 w-28 rounded bg-slate-100" />
          </div>
          {Array.from({ length: cols - 1 }, (_, c) => (
            <div key={c} className="flex items-center px-3.5 py-3">
              <span className={`block h-5 rounded-md bg-slate-100 ${c % 2 ? "w-16" : "w-24"}`} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default TableSkeleton;
