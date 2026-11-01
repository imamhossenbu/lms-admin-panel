import React from "react";

const Bar = ({ className = "" }: { className?: string }) => <div className={`rounded-md bg-slate-200 ${className}`} />;
const Soft = ({ className = "" }: { className?: string }) => <div className={`rounded-md bg-slate-100 ${className}`} />;

/** Mirrors the Domain section: header, default-address card, custom-domain card with DNS table, tips aside. */
export function DomainSkeleton() {
  return (
    <div className="animate-pulse space-y-5" aria-hidden>
      <div className="flex items-center gap-3.5">
        <div className="h-12 w-12 rounded-2xl bg-slate-200" />
        <div className="space-y-2">
          <Bar className="h-5 w-28" />
          <Soft className="h-3.5 w-64" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          {[0, 1].map((card) => (
            <div key={card} className="dashboard-card p-5">
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <Bar className="h-4 w-36" />
                  <Soft className="h-3 w-64 max-w-full" />
                </div>
                {card === 1 && <div className="h-5 w-24 rounded-full bg-slate-100" />}
              </div>
              <div className="mt-4 border-t border-dash pt-4">
                <div className="flex items-center gap-3 rounded-xl border border-dash p-3.5">
                  <div className="h-9 w-9 rounded-lg bg-slate-100" />
                  <div className="flex-1 space-y-1.5">
                    <Bar className="h-4 w-48" />
                    <Soft className="h-3 w-32" />
                  </div>
                  <div className="h-5 w-16 rounded-full bg-slate-100" />
                </div>
                {card === 1 && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-dash">
                    {[0, 1, 2].map((r) => (
                      <div key={r} className={`flex divide-x divide-dash border-b border-dash last:border-b-0 ${r === 0 ? "bg-gray-bg" : ""}`}>
                        {["w-[14%]", "w-[34%]", "w-[34%]", "w-[18%]"].map((w, i) => (
                          <div key={i} className={`px-3.5 py-3 ${w}`}>
                            {r > 0 && i === 0 ? <div className="h-5 w-14 rounded-md bg-slate-100" /> : <Soft className="h-3 w-3/4" />}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-5 xl:col-span-4">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-dash p-4">
              <div className="h-5 w-5 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <Bar className="h-3.5 w-24" />
                <Soft className="h-3 w-full" />
                <Soft className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DomainSkeleton;
