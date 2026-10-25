import React from "react";
import { CloudOff, RotateCw } from "lucide-react";

/** Shown when the courses API can't be reached; offers a retry. */
export function CoursesLoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-dash shadow-2xs p-10 flex flex-col items-center text-center gap-3">
      <span className="w-12 h-12 rounded-full bg-red-14 text-red flex items-center justify-center">
        <CloudOff className="w-6 h-6" />
      </span>
      <h2 className="heading-h5 font-bold text-primary-500">Couldn&apos;t load courses</h2>
      <p className="body-sm-regular text-primary-300 max-w-md">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-dash bg-white body-sm-medium text-primary-500 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <RotateCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}

export default CoursesLoadError;
