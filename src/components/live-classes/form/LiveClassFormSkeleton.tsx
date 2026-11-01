import React from "react";
import { cn } from "@/lib/cn";

const Bar = ({ className }: { className: string }) => <div className={cn("rounded bg-slate-200", className)} />;
const Soft = ({ className }: { className: string }) => <div className={cn("rounded bg-slate-100", className)} />;

function Input({ className, icon }: { className?: string; icon?: boolean }) {
  return (
    <div className={cn("h-10 rounded-lg border border-dash bg-white flex items-center gap-2 px-3.5", className)}>
      {icon && <Soft className="w-4 h-4 rounded" />}
      <Soft className="h-3.5 w-2/5" />
    </div>
  );
}

function Field({ className, icon, width = "w-20" }: { className?: string; icon?: boolean; width?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Soft className={cn("h-3.5", width)} />
      <Input icon={icon} />
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

/** Mirrors the Schedule / Edit form: header, Basic Information, Date & Time, Meeting Platform, settings column. */
export function LiveClassFormSkeleton() {
  return (
    <div className="space-y-5 pb-8 animate-pulse" aria-busy="true" aria-label="Loading form">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Soft className="w-4 h-4" />
            <Soft className="h-3.5 w-20" />
            <Soft className="h-3.5 w-32" />
          </div>
          <Bar className="h-7 w-56" />
          <Soft className="h-4 w-72" />
        </div>
        <Bar className="h-10 w-40 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <div className="dashboard-card p-5">
            <CardHead />
            <div className="space-y-4">
              <Field width="w-24" />
              <Field width="w-16" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field />
                <Field />
              </div>
              <div className="space-y-2">
                <Soft className="h-3.5 w-24" />
                <div className="rounded-lg border border-dash">
                  <div className="flex items-center gap-3 border-b border-dash p-3">
                    {Array.from({ length: 6 }, (_, i) => (
                      <Soft key={i} className="w-5 h-5" />
                    ))}
                  </div>
                  <div className="p-3.5 space-y-2 h-28">
                    <Soft className="h-3.5 w-3/4" />
                    <Soft className="h-3.5 w-1/2" />
                  </div>
                </div>
              </div>
              <Field className="max-w-xs" width="w-28" />
            </div>
          </div>

          <div className="dashboard-card p-5">
            <CardHead title="w-28" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field icon />
              <Field icon />
              <Field icon />
            </div>
            <div className="mt-4 h-10 rounded-lg bg-slate-100 flex items-center gap-2.5 px-3.5">
              <Bar className="w-4 h-4 rounded-full" />
              <Bar className="h-3.5 w-64" />
            </div>
          </div>

          <div className="dashboard-card p-5">
            <CardHead title="w-40" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="rounded-xl border border-dash p-3.5 flex items-start gap-3">
                  <Bar className="w-9 h-9 rounded-lg" />
                  <div className="space-y-1.5 flex-1">
                    <Soft className="h-3.5 w-20" />
                    <Soft className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <Field className="flex-1" icon width="w-24" />
              <div className="h-10 w-48 self-end rounded-lg border border-dash" />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="dashboard-card p-5">
            <CardHead />
            <div className="space-y-4">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Bar className="w-10 h-5 rounded-full" />
                  <div className="space-y-1.5">
                    <Soft className="h-3.5 w-28" />
                    <Soft className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="dashboard-card p-5">
            <CardHead title="w-40" />
            <Field width="w-24" />
          </div>
          <div className="dashboard-card p-5">
            <CardHead />
            <div className="rounded-xl border-2 border-dashed border-dash aspect-video flex flex-col items-center justify-center gap-2">
              <Bar className="w-8 h-8 rounded-lg" />
              <Soft className="h-3.5 w-32" />
              <Soft className="h-3 w-40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveClassFormSkeleton;
