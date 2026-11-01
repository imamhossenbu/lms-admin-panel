import React from "react";
import { cn } from "@/lib/cn";

const Bar = ({ className }: { className: string }) => <div className={cn("rounded bg-slate-200", className)} />;
const Soft = ({ className }: { className: string }) => <div className={cn("rounded bg-slate-100", className)} />;

function Field({ className, width = "w-20", counter }: { className?: string; width?: string; counter?: boolean }) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Soft className={cn("h-3.5", width)} />
        {counter && <Soft className="h-3 w-12" />}
      </div>
      <div className="h-10 rounded-lg border border-dash bg-white flex items-center px-3.5">
        <Soft className="h-3.5 w-2/5" />
      </div>
    </div>
  );
}

function CardHead({ title = "w-36" }: { title?: string }) {
  return (
    <div className="flex items-center gap-3.5 mb-5">
      <Bar className="w-11 h-11 rounded-xl" />
      <div className="space-y-1.5">
        <Bar className={cn("h-4", title)} />
        <Soft className="h-3 w-52" />
      </div>
    </div>
  );
}

/** Mirrors the New / Edit Discussion form: header, Discussion Type, Details, action bar, moderation, preview and tips column. */
export function DiscussionFormSkeleton() {
  return (
    <div className="space-y-5 pb-8 animate-pulse" aria-busy="true" aria-label="Loading form">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Soft className="w-4 h-4" />
            <Soft className="h-3.5 w-20" />
            <Soft className="h-3.5 w-28" />
          </div>
          <Bar className="h-7 w-52" />
          <Soft className="h-4 w-80" />
        </div>
        <Bar className="h-10 w-44 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <div className="dashboard-card p-5">
            <CardHead title="w-32" />
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className={cn("rounded-xl border p-3.5 space-y-2.5", i === 0 ? "border-brand-orange/30" : "border-dash")}>
                  <Bar className="w-5 h-5 rounded" />
                  <Soft className="h-3.5 w-20" />
                  <Soft className="h-3 w-full" />
                  <Soft className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card p-5">
            <CardHead title="w-20" />
            <div className="space-y-4">
              <Field width="w-12" counter />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field width="w-16" />
                <Field width="w-32" />
              </div>
              <div className="space-y-2">
                <Soft className="h-3.5 w-12" />
                <div className="rounded-lg border border-dash">
                  <div className="flex items-center gap-3 border-b border-dash p-3">
                    {Array.from({ length: 8 }, (_, i) => (
                      <Soft key={i} className="w-5 h-5" />
                    ))}
                  </div>
                  <div className="p-3.5 space-y-2 h-48">
                    <Soft className="h-3.5 w-3/4" />
                    <Soft className="h-3.5 w-1/2" />
                    <Soft className="h-3.5 w-2/3" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Soft className="h-3 w-16" />
                </div>
              </div>
              <div className="space-y-2">
                <Soft className="h-3.5 w-24" />
                <div className="h-11 rounded-lg border border-dash bg-white flex items-center gap-2 px-3">
                  <Soft className="h-6 w-14 rounded-md" />
                  <Soft className="h-6 w-20 rounded-md" />
                  <Soft className="h-3.5 w-32" />
                </div>
                <Soft className="h-3 w-72" />
              </div>
            </div>
          </div>

          <div className="dashboard-card p-4 flex items-center justify-between gap-3">
            <Soft className="h-3 w-56" />
            <div className="flex gap-3">
              <div className="h-10 w-24 rounded-lg border border-dash" />
              <Bar className="h-10 w-44 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="dashboard-card p-5">
            <CardHead title="w-44" />
            <div className="space-y-4">
              {Array.from({ length: 2 }, (_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Bar className="w-10 h-5 rounded-full" />
                  <div className="space-y-1.5">
                    <Soft className="h-3.5 w-24" />
                    <Soft className="h-3 w-44" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card p-5">
            <CardHead title="w-28" />
            <div className="rounded-xl border border-dash p-4 space-y-2.5">
              <Soft className="h-5 w-24 rounded-md" />
              <Bar className="h-4 w-4/5" />
              <Soft className="h-3 w-full" />
              <Soft className="h-3 w-2/3" />
              <Soft className="h-3 w-40" />
              <div className="flex gap-1.5">
                <Soft className="h-5 w-14 rounded-md" />
                <Soft className="h-5 w-16 rounded-md" />
              </div>
              <div className="border-t border-dash pt-2.5">
                <Soft className="h-3 w-32" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-brand-orange/20 bg-brand-orange-light p-4 flex items-start gap-3">
            <Bar className="w-5 h-5 rounded" />
            <div className="flex-1 space-y-2">
              <Bar className="h-3.5 w-40" />
              {Array.from({ length: 4 }, (_, i) => (
                <Soft key={i} className={cn("h-3", i % 2 ? "w-3/4" : "w-full")} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscussionFormSkeleton;
