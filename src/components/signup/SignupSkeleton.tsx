import React from "react";

const Bar = ({ className = "" }: { className?: string }) => <div className={`rounded-md bg-slate-200 ${className}`} />;
const Soft = ({ className = "" }: { className?: string }) => <div className={`rounded-md bg-slate-100 ${className}`} />;

/** Mirrors the signup wizard: stepper, step heading, three labelled inputs, checklist and actions. */
export function SignupSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-hidden>
      <div className="flex items-start gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 shrink-0 rounded-full bg-slate-200" />
              {i < 3 && <Soft className="h-0.5 flex-1" />}
            </div>
            <Bar className="h-3 w-16" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Soft className="h-3 w-20" />
        <Bar className="h-5 w-56" />
        <Soft className="h-3 w-72 max-w-full" />
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <Bar className="h-3.5 w-24" />
          <div className="flex h-10 items-center gap-2 rounded-lg border border-dash px-3">
            <Soft className="h-4 w-4" />
            <Soft className="h-3 w-1/2" />
          </div>
        </div>
      ))}
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-slate-200" />
            <Soft className="h-3 flex-1" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-dash pt-5">
        <Soft className="h-4 w-40" />
        <div className="h-10 w-28 rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}

export default SignupSkeleton;
