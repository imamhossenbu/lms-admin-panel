import React from "react";
import { cn } from "@/lib/cn";

const Bar = ({ className }: { className: string }) => <div className={cn("rounded bg-slate-200", className)} />;
const Soft = ({ className }: { className: string }) => <div className={cn("rounded bg-slate-100", className)} />;

function Input({ className }: { className?: string }) {
  return (
    <div className={cn("h-10 rounded-lg border border-dash bg-white flex items-center px-3.5", className)}>
      <Soft className="h-3.5 w-2/5" />
    </div>
  );
}

function Field({ className, width = "w-24" }: { className?: string; width?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Soft className={cn("h-3.5", width)} />
        <Soft className="h-3 w-10" />
      </div>
      <Input />
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

function Toggle({ wide }: { wide?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <Bar className="w-10 h-5 rounded-full" />
      <div className="space-y-1.5">
        <Soft className="h-3.5 w-28" />
        <Soft className={cn("h-3", wide ? "w-56" : "w-40")} />
      </div>
    </div>
  );
}

/** Mini certificate: frame, heading, name, body lines, signers + seal. */
function CertificateShape({ size }: { size: "sm" | "md" }) {
  const md = size === "md";
  return (
    <div className={cn("rounded-lg border border-dash bg-white", md ? "p-2" : "p-1")}>
      <div className={cn("aspect-video rounded border border-dash flex flex-col items-center justify-center", md ? "gap-2.5 px-8" : "gap-1 px-3")}>
        <Soft className={cn(md ? "h-3 w-24" : "h-1.5 w-10")} />
        <Bar className={cn(md ? "h-5 w-48" : "h-2 w-16")} />
        <Bar className={cn(md ? "h-6 w-40" : "h-2.5 w-14")} />
        <Soft className={cn(md ? "h-3 w-4/5" : "h-1.5 w-4/5")} />
        {md && <Soft className="h-3 w-3/5" />}
        <div className={cn("flex w-full items-end justify-between", md ? "mt-3" : "mt-1")}>
          <Soft className={cn(md ? "h-3 w-24" : "h-1.5 w-8")} />
          <Bar className={cn("rounded-full", md ? "h-12 w-12" : "h-4 w-4")} />
          <Soft className={cn(md ? "h-3 w-24" : "h-1.5 w-8")} />
        </div>
      </div>
    </div>
  );
}

/** Mirrors the designer: header, five form cards, sticky live preview. */
export function TemplateDesignerSkeleton() {
  return (
    <div className="space-y-5 pb-8 animate-pulse" aria-busy="true" aria-label="Loading template designer">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Soft className="w-4 h-4" />
            <Soft className="h-3.5 w-20" />
            <Soft className="h-3.5 w-20" />
            <Soft className="h-3.5 w-28" />
          </div>
          <Bar className="h-7 w-72" />
          <Soft className="h-4 w-96 max-w-full" />
        </div>
        <Bar className="h-10 w-40 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-7 space-y-5">
          <div className="dashboard-card p-5">
            <CardHead />
            <Field width="w-28" />
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="rounded-xl border border-dash p-3.5 flex items-start gap-3">
                  <Bar className="w-5 h-5 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <Soft className="h-3.5 w-16" />
                    <Soft className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card p-5">
            <CardHead title="w-20" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="rounded-xl border border-dash p-3.5 space-y-2.5">
                  <div className="w-36">
                    <CertificateShape size="sm" />
                  </div>
                  <Soft className="h-3.5 w-16" />
                  <Soft className="h-3 w-28" />
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 2 }, (_, i) => (
                <div key={i} className="rounded-xl border border-dash p-3.5 flex items-start gap-3">
                  <Bar className="w-5 h-5 rounded" />
                  <div className="space-y-1.5 flex-1">
                    <Soft className="h-3.5 w-20" />
                    <Soft className="h-3 w-36" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-4">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <Bar className="w-9 h-9 rounded-full" />
                  <Soft className="h-3 w-10" />
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card p-5">
            <CardHead title="w-24" />
            <Field width="w-20" />
            <div className="mt-4 space-y-2">
              <Soft className="h-3.5 w-24" />
              <div className="h-24 rounded-lg border border-dash bg-white p-3.5 space-y-2">
                <Soft className="h-3.5 w-4/5" />
                <Soft className="h-3.5 w-3/5" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 6 }, (_, i) => (
                  <Soft key={i} className="h-5 w-24 rounded-md" />
                ))}
              </div>
            </div>
            <div className="mt-4 border-t border-dash pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Toggle />
              <Toggle />
              <Toggle />
            </div>
          </div>

          <div className="dashboard-card p-5">
            <div className="flex items-center justify-between">
              <CardHead title="w-28" />
              <Bar className="h-8 w-28 rounded-lg mb-5" />
            </div>
            <div className="rounded-xl border border-dash p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Soft className="h-4 w-20" />
                <div className="flex gap-1.5">
                  <Soft className="h-8 w-8 rounded-lg" />
                  <Soft className="h-8 w-8 rounded-lg" />
                  <Soft className="h-8 w-8 rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field width="w-14" />
                <Field width="w-14" />
              </div>
              <div className="h-14 rounded-lg border border-dashed border-dash flex items-center gap-3 px-3">
                <Bar className="h-9 w-9 rounded-lg" />
                <div className="space-y-1.5">
                  <Soft className="h-3.5 w-40" />
                  <Soft className="h-3 w-56" />
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card p-5">
            <CardHead title="w-44" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }, (_, i) => (
                <Soft key={i} className="h-8 w-36 rounded-full" />
              ))}
            </div>
            <div className="mt-5 border-t border-dash pt-5 space-y-5">
              <Toggle wide />
              <Field className="max-w-56" width="w-32" />
              <Toggle wide />
              <Toggle wide />
              <Toggle wide />
            </div>
          </div>
        </div>

        <div className="xl:col-span-5 space-y-5">
          <div className="dashboard-card p-5">
            <div className="flex items-center justify-between">
              <CardHead title="w-28" />
              <Soft className="h-6 w-16 rounded-md mb-5" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <Soft className="h-4 w-24" />
              <Input className="w-44 h-8" />
            </div>
            <div className="rounded-xl border border-dash bg-gray-bg p-3">
              <CertificateShape size="md" />
            </div>
            <div className="mt-4 rounded-xl border border-dash p-3.5 space-y-2">
              <Soft className="h-4 w-24" />
              <Soft className="h-3 w-full" />
              <Soft className="h-3 w-3/4" />
              <div className="flex gap-1.5 pt-1">
                <Soft className="h-5 w-20 rounded-md" />
                <Soft className="h-5 w-16 rounded-md" />
                <Soft className="h-5 w-20 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateDesignerSkeleton;
