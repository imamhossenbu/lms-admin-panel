"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe2, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { buildTimezoneOptions } from "./generalUtils";

export interface TimezoneSelectProps {
  id?: string;
  value: string;
  onChange: (tz: string) => void;
  onBlur?: () => void;
  error?: string;
}

/** Searchable timezone picker: "(UTC+06:00) Dhaka · Asia", filter by city, region or offset. */
export function TimezoneSelect({ id, value, onChange, onBlur, error }: TimezoneSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const options = useMemo(() => buildTimezoneOptions(value), [value]);
  const selected = options.find((o) => o.value === value);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? options.filter((o) => `${o.value} ${o.city} ${o.region} ${o.offset} ${o.offset.replace("−", "-")}`.toLowerCase().includes(q))
    : options;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", onDown);
    const t = window.setTimeout(() => searchRef.current?.focus(), 30);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.clearTimeout(t);
    };
  }, [open, onBlur]);

  const pick = (tz: string) => {
    onChange(tz);
    setOpen(false);
    setQuery("");
    onBlur?.();
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <motion.button
        id={id}
        type="button"
        whileTap={{ scale: 0.99 }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={!!error}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className={cn(
          "flex h-10 w-full items-center gap-2.5 rounded-lg border px-3.5 text-left shadow-2xs transition-colors",
          error ? "border-red bg-red-14" : open ? "border-brand-orange bg-white" : "border-dash bg-white hover:border-slate-300"
        )}
      >
        <Globe2 className="h-4 w-4 shrink-0 text-primary-300" />
        {selected ? (
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <span className="shrink-0 body-xsm-medium tabular-nums text-primary-300">{selected.offset}</span>
            <span className="truncate body-sm-medium text-primary-500">{selected.city}</span>
            <span className="truncate body-xsm-regular text-primary-300">{selected.region}</span>
          </span>
        ) : (
          <span className="flex-1 body-sm-regular text-primary-300">Select a timezone</span>
        )}
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-primary-300 transition-transform", open && "rotate-180")} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full z-40 mt-1.5 overflow-hidden rounded-xl border border-dash bg-white shadow-xl"
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
              if (e.key === "Enter") {
                // Don't submit the surrounding form; pick the first match instead.
                e.preventDefault();
                if (filtered[0]) pick(filtered[0].value);
              }
            }}
          >
            <div className="border-b border-dash p-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-300" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search city, region or UTC offset"
                  aria-label="Search timezones"
                  className="h-9 w-full rounded-lg border border-dash bg-gray-bg pl-9 pr-3 body-sm-regular text-primary-500 outline-none placeholder:text-primary-300 focus:border-brand-orange focus:bg-white"
                />
              </div>
            </div>
            <ul role="listbox" aria-label="Timezones" className="max-h-64 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <li className="px-3 py-6 text-center body-sm-regular text-primary-300">No timezone matches “{query}”.</li>
              ) : (
                filtered.map((o) => {
                  const active = o.value === value;
                  return (
                    <li key={o.value} role="option" aria-selected={active}>
                      <button
                        type="button"
                        onClick={() => pick(o.value)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                          active ? "bg-brand-orange-light" : "hover:bg-slate-50"
                        )}
                      >
                        <span className={cn("w-20 shrink-0 body-xsm-medium tabular-nums", active ? "text-brand-orange" : "text-primary-300")}>{o.offset}</span>
                        <span className="min-w-0 flex-1">
                          <span className={cn("block truncate body-sm-medium", active ? "text-brand-orange" : "text-primary-500")}>{o.city}</span>
                          <span className="block truncate body-2xsm-regular text-primary-300">{o.value}</span>
                        </span>
                        {active && <Check className="h-4 w-4 shrink-0 text-brand-orange" />}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p className="mt-1.5 body-xsm-regular text-red">{error}</p>}
    </div>
  );
}

export default TimezoneSelect;
