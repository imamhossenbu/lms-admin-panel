import React from "react";

/** Header, capsule tabs, then content cards (icon + title, label/field rows) beside the status card. */
export function WebsiteSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <span className="block h-7 w-32 rounded-lg bg-slate-200" />
          <span className="block h-4 w-96 max-w-full rounded bg-slate-100" />
        </div>
        <span className="h-10 w-36 rounded-lg bg-slate-200" />
      </div>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-10 w-32 rounded-full bg-slate-100" />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          {[0, 1].map((c) => (
            <div key={c} className="rounded-xl border border-dash bg-white">
              <div className="flex items-center gap-3 border-b border-dash p-5">
                <span className="h-10 w-10 rounded-xl bg-slate-200" />
                <div className="space-y-2">
                  <span className="block h-4 w-28 rounded bg-slate-200" />
                  <span className="block h-3 w-56 rounded bg-slate-100" />
                </div>
              </div>
              {[0, 1, 2].map((r) => (
                <div key={r} className="grid gap-4 border-b border-dash p-5 last:border-0 md:grid-cols-[220px_1fr]">
                  <div className="space-y-2">
                    <span className="block h-4 w-24 rounded bg-slate-200" />
                    <span className="block h-3 w-40 rounded bg-slate-100" />
                  </div>
                  <span className="block h-10 rounded-lg border border-dash bg-slate-50" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-dash bg-white p-5">
          <span className="block h-4 w-28 rounded bg-slate-200" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="mt-4 flex items-center justify-between">
              <span className="h-4 w-32 rounded bg-slate-100" />
              <span className="h-5 w-16 rounded-md bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WebsiteSkeleton;
