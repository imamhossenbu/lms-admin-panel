import React from "react";
import { cn } from "@/lib/cn";

const Bar = ({ className }: { className: string }) => <div className={cn("rounded bg-slate-200", className)} />;
const Soft = ({ className }: { className: string }) => <div className={cn("rounded bg-slate-100", className)} />;

function CardHead({ title = "w-32" }: { title?: string }) {
  return (
    <div className="mb-5 flex items-center gap-3.5">
      <Bar className="h-11 w-11 rounded-xl" />
      <div className="space-y-1.5">
        <Bar className={cn("h-4", title)} />
        <Soft className="h-3 w-52" />
      </div>
    </div>
  );
}

function Field({ width = "w-20", className }: { width?: string; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between">
        <Soft className={cn("h-3.5", width)} />
        <Soft className="h-3 w-10" />
      </div>
      <div className="flex h-10 items-center rounded-lg border border-dash bg-white px-3.5">
        <Soft className="h-3.5 w-2/5" />
      </div>
    </div>
  );
}

function Tile({ check }: { check?: boolean }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-dash p-3.5">
      <Bar className="h-9 w-9 rounded-lg" />
      <div className="flex-1 space-y-1.5">
        <Soft className="h-3.5 w-20" />
        <Soft className="h-3 w-28" />
      </div>
      {check && <Soft className="h-5 w-5 rounded-md" />}
    </div>
  );
}

/** Mirrors Compose / Edit Broadcast: header, Audience, Message, Channels, Delivery, preview column. */
export function BroadcastComposeSkeleton() {
  return (
    <div className="space-y-5 pb-8 animate-pulse" aria-busy="true" aria-label="Loading broadcast form">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Soft className="h-4 w-4" />
            <Soft className="h-3.5 w-24" />
            <Soft className="h-3.5 w-20" />
            <Soft className="h-3.5 w-28" />
          </div>
          <Bar className="h-7 w-52" />
          <Soft className="h-4 w-80" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-36 rounded-lg border border-dash" />
          <Bar className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-7">
          <div className="dashboard-card p-5">
            <CardHead title="w-24" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, i) => (
                <Tile key={i} />
              ))}
            </div>
            <div className="mt-4 flex h-10 items-center gap-2.5 rounded-lg bg-slate-100 px-3.5">
              <Bar className="h-4 w-4 rounded-full" />
              <Bar className="h-3.5 w-56" />
            </div>
          </div>

          <div className="dashboard-card p-5">
            <CardHead title="w-24" />
            <div className="space-y-4">
              <Field width="w-12" />
              <div className="space-y-2">
                <Soft className="h-3.5 w-20" />
                <div className="rounded-lg border border-dash">
                  <div className="flex items-center gap-3 border-b border-dash p-3">
                    {Array.from({ length: 7 }, (_, i) => (
                      <Soft key={i} className="h-5 w-5" />
                    ))}
                  </div>
                  <div className="h-32 space-y-2 p-3.5">
                    <Soft className="h-3.5 w-3/4" />
                    <Soft className="h-3.5 w-2/3" />
                    <Soft className="h-3.5 w-1/2" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Soft className="h-3 w-16" />
                </div>
              </div>
              <div className="flex items-center gap-5">
                <Soft className="h-5 w-20 rounded-full" />
                <Soft className="h-5 w-16 rounded-full" />
              </div>
              <div className="rounded-xl border border-dash p-4">
                <Soft className="h-3.5 w-28" />
                <Soft className="mt-1.5 h-3 w-72" />
                <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-5">
                  <Field width="w-24" className="md:col-span-2" />
                  <Field width="w-12" className="md:col-span-3" />
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card p-5">
            <CardHead title="w-24" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }, (_, i) => (
                <Tile key={i} check />
              ))}
            </div>
          </div>

          <div className="dashboard-card p-5">
            <CardHead title="w-24" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Tile />
              <Tile />
            </div>
          </div>

          <div className="dashboard-card flex items-center justify-between gap-3 p-4">
            <Soft className="h-3 w-48" />
            <div className="flex gap-3">
              <div className="h-10 w-20 rounded-lg border border-dash" />
              <div className="h-10 w-36 rounded-lg border border-dash" />
              <Bar className="h-10 w-28 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="space-y-5 xl:col-span-5">
          <div className="dashboard-card p-5">
            <CardHead title="w-20" />
            <div className="flex gap-1.5 rounded-2xl border border-dash bg-gray-bg p-1.5">
              <div className="h-9 flex-1 rounded-xl border border-dash bg-white" />
              <div className="h-9 flex-1 rounded-xl" />
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-dash">
              <div className="flex items-center justify-between border-b border-dash px-4 py-3">
                <Bar className="h-3.5 w-28" />
                <Soft className="h-4 w-12 rounded-full" />
              </div>
              {Array.from({ length: 2 }, (_, i) => (
                <div key={i} className={cn("flex items-start gap-3 px-4 py-3.5", i === 0 && "bg-slate-50")}>
                  <Bar className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-1.5 pt-0.5">
                    <Bar className="h-3.5 w-2/3" />
                    <Soft className="h-3 w-5/6" />
                    <Soft className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="dashboard-card p-5">
            <CardHead title="w-24" />
            <Soft className="h-3.5 w-full" />
            <Soft className="mt-2 h-3.5 w-2/3" />
            <div className="mt-4 h-10 rounded-lg border border-dash" />
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-dash bg-slate-50 p-4">
            <Bar className="h-5 w-5 rounded-full" />
            <div className="flex-1 space-y-2">
              <Bar className="h-3.5 w-40" />
              <Soft className="h-3 w-full" />
              <Soft className="h-3 w-5/6" />
              <Soft className="h-3 w-4/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BroadcastComposeSkeleton;
