"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Search } from "lucide-react";
import { AppSelect, type AppSelectOption } from "@/components/ui/AppSelect";
import { useTeacherCourses } from "./useTeacherCourses";

/** Search (debounced) + course filter + optional extra select + reset; values come from / go to the URL. */
export function TeacherToolbar({ query, onQuery, courseId, onCourse, placeholder, extra, onReset }: {
  query: string;
  onQuery: (v: string) => void;
  courseId: string;
  onCourse: (v: string) => void;
  placeholder: string;
  extra?: { value: string; options: AppSelectOption[]; onChange: (v: string) => void };
  onReset: () => void;
}) {
  const { courses } = useTeacherCourses();
  const [value, setValue] = useState(query);
  const [seen, setSeen] = useState(query);
  if (seen !== query) {
    setSeen(query);
    setValue(query);
  }
  useEffect(() => {
    if (value.trim() === query) return;
    const t = window.setTimeout(() => onQuery(value.trim()), 300);
    return () => window.clearTimeout(t);
  }, [value, query, onQuery]);
  const filtered = !!query || (courseId && courseId !== "All") || (extra && extra.value !== "All");

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="relative min-w-0 md:w-80">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-300" />
        <input type="search" value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} aria-label={placeholder} className="h-10 w-full rounded-lg border border-dash bg-white pl-10 pr-3.5 body-sm-regular text-primary-500 placeholder:text-primary-300 focus:border-brand-orange focus:outline-none" />
      </div>
      <AppSelect value={courseId || "All"} onValueChange={onCourse} options={[{ value: "All", label: "All courses" }, ...(courses ?? []).map((c) => ({ value: c.id, label: c.title }))]} className="md:w-64" />
      {extra && <AppSelect value={extra.value} onValueChange={extra.onChange} options={extra.options} className="md:w-44" />}
      {filtered && (
        <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={onReset} className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 body-sm-medium text-primary-400 hover:bg-slate-100">
          <RotateCcw className="h-4 w-4" />
          Reset
        </motion.button>
      )}
    </div>
  );
}

export default TeacherToolbar;
