import React from "react";

/** Mirrors the accept-invite card: preview box + three fields + checklist + button. */
export function AcceptInviteSkeleton() {
  return (
    <div className="animate-pulse space-y-5" aria-hidden>
      <div className="space-y-3 rounded-xl border border-dash bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-40 rounded-md bg-slate-200" />
          <div className="h-6 w-20 rounded-full bg-slate-200" />
        </div>
        <div className="h-3 w-56 rounded-md bg-slate-100" />
        <div className="h-3 w-64 rounded-md bg-slate-100" />
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-28 rounded-md bg-slate-200" />
          <div className="h-13 rounded-xl border border-dash bg-slate-100" />
        </div>
      ))}
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-slate-200" />
            <div className="h-3 w-32 rounded-md bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="h-13 rounded-xl bg-slate-200" />
    </div>
  );
}

export default AcceptInviteSkeleton;
