"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Search } from "lucide-react";
import { AppSelect, type AppSelectOption } from "@/components/ui/AppSelect";

/** Search box with its own state; tells the parent 300 ms after typing stops (fast typing never loses letters). */
function SearchBox({ query, onQuery, placeholder }: { query: string; onQuery: (v: string) => void; placeholder: string }) {
  const [value, setValue] = useState(query);
  const [seen, setSeen] = useState(query);
  // Follow outside changes (Reset, back button).
  if (seen !== query) {
    setSeen(query);
    setValue(query);
  }
  useEffect(() => {
    if (value.trim() === query) return;
    const t = window.setTimeout(() => onQuery(value.trim()), 300);
    return () => window.clearTimeout(t);
  }, [value, query, onQuery]);
  return (
    <div className="relative min-w-0 md:w-80">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-300" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-lg border border-dash bg-white pl-10 pr-3.5 body-sm-regular text-primary-500 transition-colors placeholder:text-primary-300 focus:border-brand-orange focus:outline-none"
      />
    </div>
  );
}

/** Search + status select + reset (+ optional right-side action) above a website list. */
export function ListToolbar({ query, onQuery, status, statusOptions, onStatus, placeholder, filtered, onReset, action }: {
  query: string;
  onQuery: (v: string) => void;
  status: string;
  statusOptions: AppSelectOption[];
  onStatus: (v: string) => void;
  placeholder: string;
  filtered: boolean;
  onReset: () => void;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <SearchBox query={query} onQuery={onQuery} placeholder={placeholder} />
      <AppSelect value={status} onValueChange={onStatus} options={statusOptions} className="md:w-48" />
      {filtered && (
        <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={onReset} className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 body-sm-medium text-primary-400 hover:bg-slate-100">
          <RotateCcw className="h-4 w-4" />
          Reset
        </motion.button>
      )}
      {action && <div className="md:ml-auto">{action}</div>}
    </div>
  );
}

export default ListToolbar;
