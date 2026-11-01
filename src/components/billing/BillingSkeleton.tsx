import React from "react";

const Bar = ({ className = "" }: { className?: string }) => <div className={`rounded-md bg-slate-200 ${className}`} />;
const Soft = ({ className = "" }: { className?: string }) => <div className={`rounded-md bg-slate-100 ${className}`} />;

function UsageSkeleton() {
  return (
    <div className="rounded-xl border border-dash bg-white p-4">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-slate-100" />
        <Bar className="h-3.5 flex-1" />
        <div className="h-5 w-10 rounded-full bg-slate-100" />
      </div>
      <Bar className="mt-3 h-4 w-28" />
      <Soft className="mt-2 h-2 w-full rounded-full" />
      <Soft className="mt-3 h-3 w-24" />
    </div>
  );
}

/** Mirrors /billing: breadcrumb + title + plan badges, capsule tabs, plan card + payment column, usage meters, feature list. */
export function BillingSkeleton({ tab = "overview" }: { tab?: string }) {
  return (
    <div className="animate-pulse space-y-5 pb-8" aria-hidden>
      <div className="space-y-2">
        <Soft className="h-4 w-40" />
        <div className="flex items-center gap-2.5">
          <Bar className="h-7 w-44" />
          <div className="h-6 w-16 rounded-md bg-slate-100" />
          <div className="h-6 w-16 rounded-md bg-slate-100" />
        </div>
        <Soft className="h-3.5 w-80 max-w-full" />
      </div>

      <div className="flex w-fit gap-1.5 rounded-2xl border border-dash bg-gray-bg p-1.5">
        {["w-24", "w-20", "w-24"].map((w, i) => (
          <div key={i} className={`h-9 rounded-xl ${i === 0 ? "bg-white border border-dash" : "bg-slate-100"} ${w}`} />
        ))}
      </div>

      {tab === "invoices" ? (
        <div className="overflow-hidden rounded-xl border border-dash bg-white">
          <div className="flex divide-x divide-dash border-b border-dash bg-gray-bg">
            {[18, 22, 14, 14, 16, 16].map((w, i) => (
              <div key={i} className="px-3.5 py-3" style={{ width: `${w}%` }}>
                <Bar className="h-3 w-2/3" />
              </div>
            ))}
          </div>
          {Array.from({ length: 6 }, (_, r) => (
            <div key={r} className="flex divide-x divide-dash border-b border-dash last:border-b-0">
              {[18, 22, 14, 14, 16, 16].map((w, i) => (
                <div key={i} className="px-3.5 py-3.5" style={{ width: `${w}%` }}>
                  {i === 3 ? <div className="h-5 w-14 rounded-full bg-slate-100" /> : i === 5 ? <div className="h-7 w-20 rounded-lg bg-slate-100" /> : <Soft className="h-3.5 w-3/4" />}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : tab === "plans" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-dash bg-white p-5">
              <Bar className="h-5 w-24" />
              <Soft className="mt-2 h-3 w-full" />
              <Bar className="mt-5 h-8 w-28" />
              <div className="mt-4 h-10 w-full rounded-lg bg-slate-100" />
              <div className="mt-5 space-y-2 border-t border-dash pt-4">
                {[0, 1, 2, 3].map((j) => (
                  <div key={j} className="flex justify-between">
                    <Soft className="h-3 w-20" />
                    <Soft className="h-3 w-10" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="dashboard-card p-5 xl:col-span-2">
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <Bar className="h-4 w-36" />
                  <Soft className="h-3 w-56" />
                </div>
                <div className="h-8.5 w-28 rounded-lg bg-slate-100" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-dash pt-4 md:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="space-y-1.5">
                    <Soft className="h-3 w-16" />
                    <Bar className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
            <div className="dashboard-card p-5">
              <Bar className="h-4 w-32" />
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-dash p-3.5">
                <div className="h-9 w-12 rounded-md bg-slate-200" />
                <div className="flex-1 space-y-1.5">
                  <Bar className="h-3.5 w-24" />
                  <Soft className="h-3 w-16" />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-8.5 w-24 rounded-lg bg-slate-100" />
                <div className="h-8.5 w-36 rounded-lg bg-slate-100" />
              </div>
            </div>
          </div>
          <div className="dashboard-card p-5">
            <Bar className="h-4 w-28" />
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <UsageSkeleton key={i} />
              ))}
            </div>
          </div>
          <div className="dashboard-card p-5">
            <Bar className="h-4 w-36" />
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-dash p-3">
                  <div className="h-5 w-5 rounded-full bg-slate-200" />
                  <Soft className="h-3.5 flex-1" />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BillingSkeleton;
