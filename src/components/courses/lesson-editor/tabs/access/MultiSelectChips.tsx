"use client";

import React, { useCallback, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { useDismiss } from "./useDismiss";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectChipsProps {
  id?: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  /** Show a search box in the dropdown (long lists such as countries). */
  searchable?: boolean;
  "aria-label"?: string;
}

/** Multi-select: selected values as removable chips + dropdown to add more. */
export function MultiSelectChips({
  id,
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled,
  error,
  searchable = false,
  ...rest
}: MultiSelectChipsProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);
  useDismiss(rootRef, open, close);

  const labelOf = useMemo(() => new Map(options.map((o) => [o.value, o.label])), [options]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  const toggle = (optionValue: string) =>
    onChange(value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue]);

  return (
    <div ref={rootRef} className="relative w-full">
      <div
        id={id}
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-label={rest["aria-label"]}
        aria-expanded={open}
        aria-controls={listId}
        aria-disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        className={cn(
          "flex min-h-11 w-full items-center gap-2 rounded-lg border bg-white px-3 py-1.5 shadow-xs transition-colors outline-none",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          error ? "border-red bg-red-14" : open ? "border-brand-orange" : "border-dash hover:border-primary-300/40"
        )}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {value.length === 0 && <span className="body-sm-regular text-primary-300">{placeholder}</span>}
          <AnimatePresence initial={false}>
            {value.map((v) => (
              <motion.span
                key={v}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                className="inline-flex"
              >
                <ToneBadge tone="blue" size="md">
                  {labelOf.get(v) ?? v}
                  <button
                    type="button"
                    disabled={disabled}
                    aria-label={`Remove ${labelOf.get(v) ?? v}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(value.filter((item) => item !== v));
                    }}
                    className="-mr-1 cursor-pointer rounded p-0.5 transition-colors hover:bg-blue/10 disabled:cursor-not-allowed"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </ToneBadge>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.15 }} className="shrink-0 text-primary-300">
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </div>
      {error && <p className="mt-1.5 body-xsm-regular text-red">{error}</p>}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-30 mt-1 rounded-xl border border-dash bg-white p-1.5 shadow-xl"
          >
            {searchable && (
              <div className="relative mb-1.5">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-300" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  aria-label="Search options"
                  className="h-9 w-full rounded-lg border border-dash bg-slate-50 pl-9 pr-3 body-sm-regular text-primary-500 outline-none placeholder:text-primary-300 focus:border-brand-orange focus:bg-white"
                />
              </div>
            )}
            <ul id={listId} role="listbox" aria-multiselectable="true" className="max-h-60 overflow-y-auto">
              {filtered.length === 0 && <li className="px-3 py-3 text-center body-sm-regular text-primary-300">No matches</li>}
              {filtered.map((option) => {
                const selected = value.includes(option.value);
                return (
                  <li key={option.value} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => toggle(option.value)}
                      className={cn(
                        "flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-left body-sm-medium transition-colors",
                        selected ? "bg-brand-orange-light text-brand-orange" : "text-primary-500 hover:bg-slate-50"
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                      {selected && <Check className="h-4 w-4 shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MultiSelectChips;
