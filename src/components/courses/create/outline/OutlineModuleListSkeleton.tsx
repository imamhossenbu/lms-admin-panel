import React from "react";

const LESSON_WIDTHS = ["w-48", "w-40", "w-56", "w-36"];
const MODULE_WIDTHS = ["w-52", "w-44", "w-60", "w-48"];

/** Mirrors module rows (handle, number, title, meta, actions) plus one expanded lesson list. */
export function OutlineModuleListSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3" aria-hidden="true">
      {MODULE_WIDTHS.map((width, moduleIndex) => (
        <div key={width + moduleIndex} className="rounded-xl border border-dash bg-white">
          <div className="flex items-center gap-3 px-3 py-3">
            <div className="h-5 w-3 rounded bg-slate-100" />
            <div className="h-9 w-9 rounded-full bg-slate-200" />
            <div className={`h-4 rounded-md bg-slate-200 ${width}`} />
            <div className="ml-auto hidden h-3 w-28 rounded-md bg-slate-100 sm:block" />
            <div className="h-7 w-7 rounded-lg bg-slate-100" />
            <div className="h-7 w-7 rounded-lg bg-slate-100" />
            <div className="h-7 w-7 rounded-lg bg-slate-100" />
          </div>
          {moduleIndex === 0 && (
            <div className="border-t border-dash px-3 pb-3 pt-1">
              <div className="ml-4 border-l border-dash pl-3">
                {LESSON_WIDTHS.map((lessonWidth) => (
                  <div key={lessonWidth} className="flex items-center gap-3 border-b border-dash py-2.5 last:border-b-0">
                    <div className="h-8 w-8 rounded-lg bg-slate-100" />
                    <div className={`h-3.5 rounded-md bg-slate-200 ${lessonWidth}`} />
                    <div className="ml-auto h-3 w-12 rounded-md bg-slate-100" />
                    <div className="h-7 w-7 rounded-lg bg-slate-100" />
                    <div className="h-7 w-7 rounded-lg bg-slate-100" />
                  </div>
                ))}
              </div>
              <div className="mt-2 h-11 rounded-lg bg-slate-100" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default OutlineModuleListSkeleton;
