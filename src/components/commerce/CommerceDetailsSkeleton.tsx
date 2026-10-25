"use client";

import React from "react";

const Bar = ({ className }: { className: string }) => <div className={`rounded bg-slate-200 ${className}`} />;
const SoftBar = ({ className }: { className: string }) => <div className={`rounded bg-slate-100 ${className}`} />;

function CardShell({ titleWidth, action = true, children }: { titleWidth: string; action?: boolean; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-dash shadow-2xs p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Bar className={`h-6 ${titleWidth}`} />
        {action && <div className="h-9 w-28 rounded-lg border border-dash" />}
      </div>
      {children}
    </div>
  );
}

function CoursesTable() {
  return (
    <div className="rounded-lg border border-dash overflow-hidden">
      <div className="flex bg-slate-50 border-b border-dash divide-x divide-dash">
        {["w-4", "w-16", "w-10", "w-10", "w-14", "w-12"].map((w, i) => (
          <div key={i} className={`py-3 px-3.5 ${i === 0 ? "w-12" : "flex-1"}`}>
            <Bar className={`h-3.5 ${w}`} />
          </div>
        ))}
      </div>
      <div className="flex items-center divide-x divide-dash">
        <div className="w-12 py-3 px-3.5"><SoftBar className="h-3.5 w-3" /></div>
        <div className="flex-1 py-3 px-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-200 shrink-0" />
          <div className="space-y-1.5 flex-1">
            <Bar className="h-4 w-32" />
            <SoftBar className="h-3 w-24" />
          </div>
        </div>
        {["w-20", "w-12", "w-24"].map((w, i) => (
          <div key={i} className="flex-1 py-3 px-3.5"><SoftBar className={`h-4 ${w}`} /></div>
        ))}
        <div className="flex-1 py-3 px-3.5"><SoftBar className="h-6 w-16 rounded-md" /></div>
      </div>
    </div>
  );
}

function StudentBlock() {
  return (
    <CardShell titleWidth="w-44">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex items-center gap-4">
          <div className="w-22 h-22 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-2">
            <Bar className="h-5 w-32" />
            <SoftBar className="h-4 w-40" />
            <SoftBar className="h-4 w-28" />
          </div>
        </div>
        <div className="space-y-3 md:pl-6 md:border-l md:border-dash">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-slate-100" />
              <SoftBar className="h-4 w-24" />
              <Bar className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </CardShell>
  );
}

function Breakdown() {
  return (
    <div className="space-y-3">
      {["w-16", "w-20", "w-14"].map((w, i) => (
        <div key={i} className="flex justify-between">
          <SoftBar className={`h-4 ${w}`} />
          <SoftBar className="h-4 w-12" />
        </div>
      ))}
      <div className="flex justify-between pt-3 border-t border-dashed border-dash">
        <Bar className="h-5 w-28" />
        <Bar className="h-6 w-24" />
      </div>
    </div>
  );
}

interface CommerceDetailsSkeletonProps {
  /** "order" renders the Order Details layout, "payment" the Payment Details layout. */
  variant: "order" | "payment";
}

/** Skeleton for the Order / Payment details pages (header, summary strip, cards, timeline, notes). */
export function CommerceDetailsSkeleton({ variant }: CommerceDetailsSkeletonProps) {
  return (
    <div className="space-y-5 animate-pulse text-left pb-10">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bar className="h-4 w-16" />
          <Bar className="h-4 w-2" />
          <Bar className="h-4 w-28" />
        </div>
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="h-11 w-40 rounded-lg border border-dash bg-white" />
          <div className="flex gap-2.5">
            <div className="h-11 w-11 rounded-lg border border-dash bg-white" />
            {(variant === "order" ? ["w-36", "w-32"] : ["w-24", "w-36"]).map((w, i) => (
              <div key={i} className={`h-11 ${w} rounded-lg border border-dash bg-white`} />
            ))}
            <div className="h-11 w-36 rounded-lg bg-slate-200" />
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <div className="bg-white rounded-xl border border-dash shadow-2xs p-5 flex flex-col lg:flex-row gap-5">
        <div className={`w-20 h-20 shrink-0 ${variant === "order" ? "rounded-2xl bg-slate-100" : "rounded-2xl bg-slate-200"}`} />
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-5 gap-5 lg:divide-x lg:divide-dash">
          {[
            ["w-16", "w-40"],
            ["w-20", "w-28"],
            ["w-20", "w-24"],
            ["w-24", "w-28"],
            ["w-16", "w-24"],
          ].map(([a, b], i) => (
            <div key={i} className="space-y-2.5 lg:px-6 first:pl-0">
              <SoftBar className={`h-4 ${a}`} />
              <Bar className={`h-7 ${b}`} />
              <SoftBar className="h-3.5 w-16" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-8 space-y-5">
          {variant === "order" ? (
            <>
              <CardShell titleWidth="w-48"><CoursesTable /></CardShell>
              <StudentBlock />
              <CardShell titleWidth="w-48">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-slate-200" />
                    <div className="space-y-2"><Bar className="h-5 w-20" /><SoftBar className="h-3.5 w-28" /></div>
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2"><SoftBar className="h-4 w-24" /><Bar className="h-5 w-28" /></div>
                  ))}
                </div>
              </CardShell>
              <CardShell titleWidth="w-36" action={false}><Breakdown /></CardShell>
            </>
          ) : (
            <>
              <StudentBlock />
              <CardShell titleWidth="w-44">
                <div className="grid grid-cols-3 gap-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2"><SoftBar className="h-4 w-20" /><Bar className="h-5 w-32" /></div>
                  ))}
                </div>
              </CardShell>
              <CardShell titleWidth="w-48"><CoursesTable /></CardShell>
              <CardShell titleWidth="w-40" action={false}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex gap-4"><SoftBar className="h-4 w-28" /><Bar className="h-4 w-32" /></div>
                    ))}
                  </div>
                  <Breakdown />
                </div>
              </CardShell>
            </>
          )}
        </div>

        <div className="xl:col-span-4 space-y-5">
          <CardShell titleWidth="w-40" action={false}>
            <div className="space-y-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-3 h-3 rounded-full bg-slate-200 mt-1 shrink-0" />
                  <div className="flex-1 space-y-1.5"><Bar className="h-4 w-32" /><SoftBar className="h-3 w-44" /></div>
                  <div className="space-y-1.5"><SoftBar className="h-3 w-16" /><SoftBar className="h-3 w-12" /></div>
                </div>
              ))}
            </div>
          </CardShell>
          <CardShell titleWidth="w-48">
            <div className="space-y-3">
              {["w-28", "w-40", "w-24", "w-8", "w-8"].map((w, i) => (
                <div key={i} className="flex gap-4"><SoftBar className="h-4 w-28" /><Bar className={`h-4 ${w}`} /></div>
              ))}
            </div>
          </CardShell>
          <CardShell titleWidth="w-32">
            <div className="rounded-xl border border-dash p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200" />
                <div className="space-y-1.5"><Bar className="h-4 w-20" /><SoftBar className="h-3 w-32" /></div>
              </div>
              <SoftBar className="h-4 w-full" />
            </div>
          </CardShell>
        </div>
      </div>
    </div>
  );
}

export default CommerceDetailsSkeleton;
