import React from "react";
import { cn } from "@/lib/cn";
import type { AnalyticsTab } from "./report/analyticsReport";

const BAR_HEIGHTS = [42, 68, 55, 80, 36, 62, 74, 48, 88, 58, 70, 44, 66, 52];

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("bg-white rounded-xl border border-dash p-5 shadow-2xs", className)}>{children}</div>;
}

function CardHead({ action = true }: { action?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="space-y-1.5">
        <div className="h-5 w-40 bg-slate-200 rounded-md" />
        <div className="h-3.5 w-56 bg-slate-100 rounded-md" />
      </div>
      {action && <div className="h-8 w-28 bg-slate-100 rounded-lg border border-dash" />}
    </div>
  );
}

function KpiTiles({ count }: { count: number }) {
  return (
    <div className={cn("grid gap-3 grid-cols-1 sm:grid-cols-2", count === 5 ? "lg:grid-cols-3 xl:grid-cols-5" : "xl:grid-cols-4")}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-white rounded-xl border border-dash py-3.5 px-4 h-28 flex flex-col justify-between shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-dash shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-6 w-24 bg-slate-200 rounded-md" />
              <div className="h-3.5 w-28 bg-slate-100 rounded-md" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="h-3.5 w-32 bg-slate-100 rounded-md" />
            <div className="h-6 w-16 bg-slate-100 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

function BarsChart({ className, height = "h-64", legend = 2, bars = 14 }: { className?: string; height?: string; legend?: number; bars?: number }) {
  return (
    <Card className={className}>
      <CardHead />
      <div className="flex items-center gap-4 mb-3">
        {Array.from({ length: legend }, (_, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <div className="h-3 w-16 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
      <div className={cn("flex gap-3", height)}>
        <div className="flex flex-col justify-between py-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-2.5 w-8 bg-slate-100 rounded" />
          ))}
        </div>
        <div className="flex-1 flex items-end gap-2 border-b border-dash pb-1">
          {BAR_HEIGHTS.slice(0, bars).map((h, i) => (
            <div key={i} className="flex-1 bg-slate-100 rounded-t-md" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </Card>
  );
}

function DonutCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHead action={false} />
      <div className="flex flex-col items-center gap-5">
        <div className="relative h-40 w-40 rounded-full border-18 border-slate-100 flex items-center justify-center">
          <div className="space-y-1.5 flex flex-col items-center">
            <div className="h-5 w-16 bg-slate-200 rounded-md" />
            <div className="h-3 w-12 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="w-full space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <div className="h-3.5 flex-1 bg-slate-100 rounded" />
              <div className="h-3.5 w-14 bg-slate-200 rounded" />
              <div className="h-3.5 w-9 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function HBarsCard({ className, rows = 5 }: { className?: string; rows?: number }) {
  return (
    <Card className={className}>
      <CardHead action={false} />
      <div className="space-y-4">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-3 w-24 bg-slate-100 rounded" />
            <div className="h-5 bg-slate-100 rounded-r-md" style={{ width: `${BAR_HEIGHTS[i + 3]}%` }} />
          </div>
        ))}
      </div>
    </Card>
  );
}

function TableCard({ className, rows = 6, cols = 5 }: { className?: string; rows?: number; cols?: number }) {
  return (
    <Card className={className}>
      <CardHead />
      <div className="rounded-xl border border-dash overflow-hidden">
        <div className="flex divide-x divide-dash bg-gray-bg border-b border-dash">
          {Array.from({ length: cols }, (_, c) => (
            <div key={c} className={cn("px-3.5 py-3", c === 0 ? "flex-2" : "flex-1")}>
              <div className="h-3 w-16 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
        <div className="divide-y divide-dash">
          {Array.from({ length: rows }, (_, r) => (
            <div key={r} className="flex divide-x divide-dash">
              {Array.from({ length: cols }, (_, c) => (
                <div key={c} className={cn("px-3.5 py-3", c === 0 ? "flex-2 flex items-center gap-2.5" : "flex-1")}>
                  {c === 0 ? (
                    <>
                      <div className="h-7 w-7 rounded-full bg-slate-200 shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3.5 w-3/4 bg-slate-200 rounded" />
                        <div className="h-2.5 w-1/2 bg-slate-100 rounded" />
                      </div>
                    </>
                  ) : c === cols - 1 ? (
                    <div className="h-5 w-14 bg-slate-100 rounded-full" />
                  ) : (
                    <div className="h-3.5 w-12 bg-slate-100 rounded" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function HighlightsSkeleton() {
  return (
    <Card>
      <CardHead action={false} />
      <div className="divide-y divide-dash">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start gap-3 py-2.5">
            <div className="h-9 w-9 rounded-lg bg-slate-100 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-2.5 w-20 bg-slate-100 rounded" />
              <div className="h-3.5 w-40 bg-slate-200 rounded" />
              <div className="h-3 w-32 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AreaCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHead />
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-dash bg-gray-bg px-3 py-2.5 space-y-1.5">
            <div className="h-2.5 w-14 bg-slate-200 rounded" />
            <div className="h-5 w-20 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
      <div className="h-48 flex items-end gap-2 border-b border-dash pb-1">
        {BAR_HEIGHTS.map((h, i) => (
          <div key={i} className="flex-1 bg-slate-100 rounded-t-md" style={{ height: `${h}%` }} />
        ))}
      </div>
    </Card>
  );
}

export function AnalyticsTabSkeleton({ tab }: { tab: AnalyticsTab }) {
  switch (tab) {
    case "revenue":
      return (
        <div className="space-y-3">
          <KpiTiles count={5} />
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            <BarsChart className="xl:col-span-2" height="h-72" legend={3} />
            <DonutCard />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <HBarsCard />
            <HBarsCard />
          </div>
          <TableCard rows={6} cols={5} />
        </div>
      );
    case "students":
      return (
        <div className="space-y-3">
          <KpiTiles count={4} />
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            <BarsChart className="xl:col-span-2" />
            <DonutCard />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            <BarsChart legend={3} />
            <DonutCard />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            <HBarsCard />
            <TableCard className="xl:col-span-2" rows={6} cols={6} />
          </div>
        </div>
      );
    case "courses":
      return (
        <div className="space-y-3">
          <KpiTiles count={4} />
          <TableCard rows={6} cols={6} />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            <HBarsCard rows={7} />
            <TableCard rows={5} cols={4} />
          </div>
        </div>
      );
    case "engagement":
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            <AreaCard />
            <AreaCard />
            <AreaCard />
            <AreaCard />
            <AreaCard className="xl:col-span-2" />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            <TableCard rows={5} cols={4} />
            <TableCard rows={5} cols={4} />
          </div>
        </div>
      );
    default:
      return (
        <div className="space-y-3">
          <KpiTiles count={8} />
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            <BarsChart className="xl:col-span-2" height="h-72" />
            <HighlightsSkeleton />
          </div>
        </div>
      );
  }
}

/** Full-page skeleton: header (breadcrumb, title, picker, export), capsule tabs and the tab's layout. */
export function AnalyticsSkeleton({ tab = "overview", withHeader = true }: { tab?: AnalyticsTab; withHeader?: boolean }) {
  return (
    <div className="space-y-3 animate-pulse select-none pb-6 text-left" aria-busy="true" aria-label="Loading analytics">
      {withHeader && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 bg-slate-200 rounded" />
                <div className="h-3 w-3 bg-slate-100 rounded" />
                <div className="h-3.5 w-16 bg-slate-200 rounded" />
              </div>
              <div className="h-6 w-32 bg-slate-200 rounded-lg" />
              <div className="h-4 w-80 bg-slate-100 rounded-md" />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="hidden lg:block h-3.5 w-40 bg-slate-100 rounded" />
              <div className="h-10 w-36 bg-slate-100 rounded-lg border border-dash" />
              <div className="h-10 w-36 bg-slate-200 rounded-lg" />
            </div>
          </div>
          <div className="w-fit bg-gray-bg border border-dash p-1.5 rounded-2xl flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={cn("h-9 w-28 rounded-xl", i === 0 ? "bg-white border border-dash" : "bg-slate-200")} />
            ))}
          </div>
        </>
      )}
      <AnalyticsTabSkeleton tab={tab} />
    </div>
  );
}

export default AnalyticsSkeleton;
