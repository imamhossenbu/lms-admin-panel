"use client";

import React from "react";
import { InstructorTabKey } from "./InstructorDetailsTabs";

const Bar = ({ className }: { className: string }) => <div className={`rounded bg-slate-200 ${className}`} />;
const SoftBar = ({ className }: { className: string }) => <div className={`rounded bg-slate-100 ${className}`} />;

function CardShell({ withIcon = true, titleWidth, action = true, children }: {
  withIcon?: boolean;
  titleWidth: string;
  action?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-dash shadow-2xs p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {withIcon && <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />}
          <Bar className={`h-5 ${titleWidth}`} />
        </div>
        {action && <div className="h-9 w-20 rounded-lg border border-dash bg-white" />}
      </div>
      {children}
    </div>
  );
}

function InfoRowsSkeleton({ widths }: { widths: string[] }) {
  return (
    <div className="divide-y divide-dash">
      {widths.map((w, i) => (
        <div key={i} className="flex items-center gap-4 py-2.5 first:pt-0 last:pb-0">
          <SoftBar className="h-4 w-28 shrink-0" />
          <Bar className={`h-4 ${w}`} />
        </div>
      ))}
    </div>
  );
}

function TableSkeleton({ rows, columns, checkbox = false, tall = false }: {
  rows: number;
  columns: { width: string; kind?: "thumb" | "avatar" | "badge" | "progress" | "menu" }[];
  checkbox?: boolean;
  tall?: boolean;
}) {
  return (
    <div className="rounded-lg border border-dash overflow-hidden">
      <div className="flex bg-slate-50 border-b border-dash divide-x divide-dash">
        {checkbox && <div className="w-12 py-3 px-3.5"><div className="w-4 h-4 rounded border border-dash bg-white" /></div>}
        <div className="w-12 py-3 px-3.5"><Bar className="h-3.5 w-3" /></div>
        {columns.map((c, i) => (
          <div key={i} className={`py-3 px-3.5 ${c.kind === "thumb" || c.kind === "avatar" ? "flex-2" : "flex-1"}`}>
            <Bar className="h-3.5 w-16" />
          </div>
        ))}
      </div>
      <div className="divide-y divide-dash">
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className={`flex items-center divide-x divide-dash ${tall ? "min-h-16" : ""}`}>
            {checkbox && <div className="w-12 py-3 px-3.5"><div className="w-4 h-4 rounded border border-dash" /></div>}
            <div className="w-12 py-3 px-3.5"><SoftBar className="h-3.5 w-3" /></div>
            {columns.map((c, i) => (
              <div key={i} className={`py-3 px-3.5 ${c.kind === "thumb" || c.kind === "avatar" ? "flex-2" : "flex-1"}`}>
                {c.kind === "thumb" || c.kind === "avatar" ? (
                  <div className="flex items-center gap-3">
                    <div className={`${tall ? "w-10 h-10" : "w-5 h-5"} ${c.kind === "avatar" ? "rounded-full" : "rounded-md"} bg-slate-200 shrink-0`} />
                    <div className="space-y-1.5 flex-1">
                      <Bar className={`h-4 ${c.width}`} />
                      {tall && <SoftBar className="h-3 w-3/4" />}
                    </div>
                  </div>
                ) : c.kind === "badge" ? (
                  <SoftBar className={`h-6 ${c.width} rounded-md`} />
                ) : c.kind === "progress" ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100"><div className="h-full w-1/2 rounded-full bg-slate-200" /></div>
                    <SoftBar className="h-3.5 w-8" />
                  </div>
                ) : c.kind === "menu" ? (
                  <div className="w-9 h-9 rounded-lg border border-dash mx-auto" />
                ) : (
                  <SoftBar className={`h-4 ${c.width}`} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function FooterSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <SoftBar className="h-4 w-44" />
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`w-8 h-8 rounded-lg ${i === 1 ? "bg-slate-200" : "border border-dash"}`} />
        ))}
      </div>
    </div>
  );
}

function FilterBarSkeleton({ count }: { count: number }) {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="h-11 md:flex-1 rounded-lg border border-dash bg-white flex items-center gap-3 px-3.5">
        <div className="w-4 h-4 rounded bg-slate-100" />
        <SoftBar className="h-3.5 w-28" />
      </div>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-11 md:w-56 rounded-lg border border-dash bg-white flex items-center px-3.5">
          <Bar className="h-3.5 w-24" />
        </div>
      ))}
    </div>
  );
}

function TabPanelHeader({ titleWidth, actionWidth }: { titleWidth: string; actionWidth: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <Bar className={`h-6 ${titleWidth}`} />
        <SoftBar className="h-4 w-80 max-w-full" />
      </div>
      <div className={`h-11 ${actionWidth} rounded-lg bg-slate-200`} />
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      <div className="xl:col-span-8 space-y-6">
        <CardShell titleWidth="w-48" action={false}>
          <InfoRowsSkeleton widths={["w-32", "w-48", "w-32", "w-16", "w-24", "w-80"]} />
        </CardShell>
        <CardShell titleWidth="w-36">
          <TableSkeleton
            rows={5}
            columns={[{ width: "w-32", kind: "thumb" }, { width: "w-10" }, { width: "w-16", kind: "badge" }, { width: "w-20" }, { width: "w-20" }]}
          />
        </CardShell>
        <CardShell titleWidth="w-36">
          <TableSkeleton rows={5} columns={[{ width: "w-24" }, { width: "w-32" }, { width: "w-20" }, { width: "w-16", kind: "badge" }]} />
        </CardShell>
      </div>
      <div className="xl:col-span-4 space-y-6">
        <CardShell titleWidth="w-36" action={false}>
          <InfoRowsSkeleton widths={["w-20", "w-16", "w-32", "w-32"]} />
        </CardShell>
        <CardShell titleWidth="w-44" action={false}>
          <InfoRowsSkeleton widths={["w-28", "w-36", "w-24"]} />
        </CardShell>
        <CardShell titleWidth="w-32">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Bar className="h-4 w-36" />
                  <SoftBar className="h-3 w-28" />
                </div>
                <div className="space-y-1.5">
                  <SoftBar className="h-3 w-16" />
                  <SoftBar className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardShell>
      </div>
    </div>
  );
}

function CoursesSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-dash shadow-2xs p-5 space-y-5">
      <TabPanelHeader titleWidth="w-32" actionWidth="w-40" />
      <FilterBarSkeleton count={2} />
      <TableSkeleton
        rows={5}
        tall
        columns={[
          { width: "w-36", kind: "thumb" },
          { width: "w-28", kind: "badge" },
          { width: "w-8" },
          { width: "w-14" },
          { width: "w-10" },
          { width: "w-16", kind: "badge" },
          { width: "w-20" },
          { width: "", kind: "menu" },
        ]}
      />
      <FooterSkeleton />
    </div>
  );
}

function StudentsSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-dash shadow-2xs p-5 space-y-5">
      <TabPanelHeader titleWidth="w-40" actionWidth="w-72" />
      <FilterBarSkeleton count={1} />
      <TableSkeleton
        rows={8}
        tall
        checkbox
        columns={[
          { width: "w-28", kind: "avatar" },
          { width: "w-32", kind: "thumb" },
          { width: "w-20" },
          { width: "", kind: "progress" },
          { width: "w-16", kind: "badge" },
          { width: "", kind: "menu" },
        ]}
      />
      <FooterSkeleton />
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-dash shadow-2xs p-5 space-y-4">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div className="space-y-2">
          <Bar className="h-6 w-36" />
          <SoftBar className="h-4 w-72" />
        </div>
        <div className="flex items-center gap-6">
          <div className="rounded-xl border border-dash px-8 py-4 flex flex-col items-center gap-2">
            <Bar className="h-8 w-12" />
            <div className="flex gap-1">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="w-6 h-6 rounded bg-slate-200" />)}</div>
            <SoftBar className="h-4 w-20" />
          </div>
          <div className="space-y-2 w-72">
            {["w-4/5", "w-1/4", "w-1/12", "w-1/12", "w-0"].map((w, i) => (
              <div key={i} className="flex items-center gap-3">
                <SoftBar className="h-3.5 w-12" />
                <div className="flex-1 h-1.5 rounded-full bg-slate-100"><div className={`h-full ${w} rounded-full bg-slate-200`} /></div>
                <SoftBar className="h-3.5 w-6" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="pt-4 border-t border-dash">
        <FilterBarSkeleton count={2} />
      </div>
      <div className="divide-y divide-dash border-b border-dash">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="grid grid-cols-12 gap-6 items-center py-4">
            <div className="col-span-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Bar className="h-4 w-28" />
                <SoftBar className="h-3.5 w-36" />
              </div>
            </div>
            <div className="col-span-2 flex gap-1">{[1, 2, 3, 4, 5].map((s) => <div key={s} className="w-4 h-4 rounded bg-slate-200" />)}</div>
            <div className="col-span-5 space-y-1.5">
              <SoftBar className="h-3.5 w-full" />
              <SoftBar className="h-3.5 w-2/3" />
            </div>
            <div className="col-span-2 flex items-center justify-end gap-4">
              <SoftBar className="h-3.5 w-20" />
              <div className="w-9 h-9 rounded-lg border border-dash" />
            </div>
          </div>
        ))}
      </div>
      <FooterSkeleton />
    </div>
  );
}

function ScheduleSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-dash shadow-2xs p-5 space-y-5">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="space-y-2">
          <Bar className="h-6 w-28" />
          <SoftBar className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-11 w-56 rounded-lg border border-dash bg-white" />
          <div className="h-11 w-10 rounded-lg border border-dash" />
          <Bar className="h-4 w-28" />
          <div className="h-11 w-10 rounded-lg border border-dash" />
          <div className="h-11 w-20 rounded-lg border border-dash" />
        </div>
      </div>
      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-5">
        <div className="2xl:col-span-5 rounded-xl border border-dash">
          <div className="flex justify-between px-5 py-4 border-b border-dash">
            <Bar className="h-5 w-44" />
            <SoftBar className="h-4 w-14" />
          </div>
          <div className="p-5 divide-y divide-dash">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                <div className="w-16 h-16 rounded-xl bg-slate-100 flex flex-col items-center justify-center gap-1.5 shrink-0">
                  <Bar className="h-3 w-7" />
                  <Bar className="h-5 w-6" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <SoftBar className="h-3 w-32" />
                  <Bar className="h-4 w-44" />
                  <SoftBar className="h-3 w-28" />
                </div>
                <SoftBar className="h-6 w-20 rounded-md" />
                <div className="w-9 h-9 rounded-lg border border-dash" />
              </div>
            ))}
          </div>
        </div>
        <div className="2xl:col-span-7 space-y-4">
          <div className="rounded-xl border border-dash overflow-hidden">
            <div className="flex justify-between items-center px-5 py-3.5 border-b border-dash">
              <Bar className="h-5 w-36" />
              <div className="flex rounded-lg border border-dash overflow-hidden">
                <div className="h-9 w-16 bg-slate-200" />
                <div className="h-9 w-16 border-l border-dash" />
                <div className="h-9 w-14 border-l border-dash" />
              </div>
            </div>
            <div className="grid grid-cols-7 bg-slate-50 border-b border-dash">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="py-3 flex justify-center"><Bar className="h-3.5 w-8" /></div>
              ))}
            </div>
            <div className="grid grid-cols-7 [&>*]:border-r [&>*]:border-b [&>*]:border-dash [&>*:nth-child(7n)]:border-r-0">
              {Array.from({ length: 35 }, (_, i) => (
                <div key={i} className="min-h-24 p-2 space-y-2">
                  <SoftBar className="h-4 w-5" />
                  {i % 5 === 2 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                        <Bar className="h-3 w-16" />
                      </div>
                      <SoftBar className="h-3 w-10 ml-3.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-6">
            {["w-16", "w-14", "w-20", "w-10", "w-10"].map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <SoftBar className={`h-3.5 ${w}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NotesSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-dash shadow-2xs p-5 space-y-4">
      <TabPanelHeader titleWidth="w-28" actionWidth="w-32" />
      {[1, 2, 3].map((i) => (
        <div key={i} className={`rounded-xl border border-dash p-5 space-y-3 ${i === 1 ? "bg-slate-50" : ""}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-slate-200" />
              <div className="space-y-1.5">
                <Bar className="h-4 w-28" />
                <SoftBar className="h-3.5 w-36" />
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg border border-dash bg-white" />
          </div>
          <div className="flex items-center gap-2">
            <Bar className="h-4 w-48" />
            <SoftBar className="h-5 w-24 rounded-md" />
          </div>
          <SoftBar className="h-3.5 w-full" />
          <SoftBar className="h-3.5 w-2/3" />
          <div className="flex gap-2.5">
            <SoftBar className="h-8 w-28 rounded-md" />
            <SoftBar className="h-8 w-24 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityLogSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-dash shadow-2xs p-5 space-y-5">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="space-y-2">
          <Bar className="h-6 w-32" />
          <SoftBar className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex gap-3">
          <div className="h-11 w-48 rounded-lg border border-dash bg-white" />
          <div className="h-11 w-48 rounded-lg border border-dash bg-white" />
          <div className="h-11 w-64 rounded-lg border border-dash bg-white" />
        </div>
      </div>
      <TableSkeleton
        rows={8}
        tall
        columns={[
          { width: "w-20" },
          { width: "w-24", kind: "avatar" },
          { width: "w-28", kind: "badge" },
          { width: "w-48" },
          { width: "w-24" },
          { width: "w-12" },
        ]}
      />
      <FooterSkeleton />
    </div>
  );
}

interface InstructorDetailsSkeletonProps {
  activeTab?: InstructorTabKey;
}

export function InstructorDetailsSkeleton({ activeTab = "overview" }: InstructorDetailsSkeletonProps) {
  const isOverview = activeTab === "overview";

  return (
    <div className="space-y-6 animate-pulse text-left pb-10">
      {/* Breadcrumb + profile header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bar className="h-4 w-20" />
          <Bar className="h-4 w-2" />
          <Bar className="h-4 w-32" />
        </div>
        <div className="bg-white rounded-xl border border-dash shadow-2xs p-5 flex flex-col xl:flex-row gap-5">
          <div className="h-10 w-44 rounded-lg border border-dash bg-white shrink-0" />
          <div className="flex gap-5 flex-1">
            <div className="w-28 h-28 rounded-full bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="flex justify-between gap-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <Bar className="h-8 w-56" />
                    <SoftBar className="h-6 w-16 rounded-md" />
                  </div>
                  <div className="flex gap-4">
                    <SoftBar className="h-4 w-44" />
                    <SoftBar className="h-4 w-32" />
                    <SoftBar className="h-4 w-36" />
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <div className="h-10 w-40 rounded-lg bg-slate-200" />
                  <div className="h-10 w-10 rounded-lg border border-dash" />
                </div>
              </div>
              {isOverview && (
                <div className="flex justify-between gap-4 items-center">
                  <div className="space-y-1.5 flex-1 max-w-2xl">
                    <SoftBar className="h-3.5 w-full" />
                    <SoftBar className="h-3.5 w-2/3" />
                  </div>
                  <div className="flex divide-x divide-dash">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 px-5 first:pl-0">
                        <div className="w-6 h-6 rounded bg-slate-200" />
                        <div className="space-y-1.5">
                          <Bar className="h-5 w-14" />
                          <SoftBar className="h-3.5 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar (PillTabs geometry) */}
      <div className="py-1">
        <div className="bg-gray-bg p-1.5 rounded-2xl flex items-center gap-1.5 w-fit max-w-full overflow-hidden">
          {[
            { w: "w-16", badge: false },
            { w: "w-14", badge: true },
            { w: "w-16", badge: true },
            { w: "w-14", badge: true },
            { w: "w-16", badge: false },
            { w: "w-12", badge: false },
            { w: "w-20", badge: false },
          ].map((tab, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl shrink-0 ${i === 0 ? "bg-white shadow-xs" : ""}`}
            >
              <div className="w-4 h-4 rounded bg-slate-200" />
              <Bar className={`h-4 ${tab.w}`} />
              {tab.badge && <div className="h-4 w-7 rounded-full bg-slate-200" />}
            </div>
          ))}
        </div>
      </div>

      {activeTab === "overview" && <OverviewSkeleton />}
      {activeTab === "courses" && <CoursesSkeleton />}
      {activeTab === "students" && <StudentsSkeleton />}
      {activeTab === "reviews" && <ReviewsSkeleton />}
      {activeTab === "schedule" && <ScheduleSkeleton />}
      {activeTab === "notes" && <NotesSkeleton />}
      {activeTab === "activity-log" && <ActivityLogSkeleton />}
    </div>
  );
}

export default InstructorDetailsSkeleton;
