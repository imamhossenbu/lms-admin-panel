"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import type { CertificateRecipient } from "@/types/certificate";
import { Avatar } from "@/components/ui/Avatar";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";

const MAX_RESULTS = 40;

export interface LearnerPickerProps {
  learners: CertificateRecipient[];
  value: string;
  onChange: (id: string) => void;
  /** Learners that can't be picked → short reason shown as a badge (e.g. "Has certificate"). */
  blocked?: Map<string, string>;
  error?: string;
  id?: string;
}

/** Searchable learner list (name or email) with the current pick shown as a removable chip. */
export function LearnerPicker({ learners, value, onChange, blocked, error, id }: LearnerPickerProps) {
  const [query, setQuery] = useState("");
  const selected = learners.find((l) => l.id === value) ?? null;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? learners.filter((l) => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q)) : learners;
    return { items: list.slice(0, MAX_RESULTS), total: list.length };
  }, [learners, query]);

  if (selected) {
    return (
      <div className={cn("flex items-center gap-3 rounded-lg border bg-white px-3 py-2", error ? "border-red" : "border-dash")}>
        <Avatar name={selected.name} size={32} />
        <div className="min-w-0 flex-1">
          <p className="truncate body-sm-medium font-semibold! text-primary-500">{selected.name}</p>
          <p className="truncate body-xsm-regular text-primary-300">{selected.email}</p>
        </div>
        {blocked?.get(selected.id) && (
          <ToneBadge tone="yellow" size="sm">
            {blocked.get(selected.id)}
          </ToneBadge>
        )}
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => onChange("")}
          aria-label="Change learner"
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-dash text-primary-400 transition-colors hover:bg-slate-50"
        >
          <X className="h-3.5 w-3.5" />
        </motion.button>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border bg-white", error ? "border-red" : "border-dash")}>
      <div className="relative border-b border-dash">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-300" />
        <input
          id={id}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search learners by name or email..."
          className="h-10 w-full bg-white pl-9 pr-3 body-sm-regular text-primary-500 outline-none placeholder:text-primary-300"
        />
      </div>
      <ul className="max-h-48 overflow-y-auto py-1" role="listbox" aria-label="Learners">
        {results.items.length === 0 && <li className="px-3 py-4 text-center body-sm-regular text-primary-300">No learners match “{query}”.</li>}
        {results.items.map((l) => {
          const reason = blocked?.get(l.id);
          return (
            <li key={l.id}>
              <button
                type="button"
                role="option"
                aria-selected={false}
                disabled={!!reason}
                onClick={() => onChange(l.id)}
                className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-1.5 text-left transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Avatar name={l.name} size={28} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate body-sm-medium text-primary-500">{l.name}</span>
                  <span className="block truncate body-xsm-regular text-primary-300">{l.email}</span>
                </span>
                {reason && (
                  <ToneBadge tone="gray" size="sm">
                    {reason}
                  </ToneBadge>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      {results.total > MAX_RESULTS && (
        <p className="border-t border-dash px-3 py-1.5 body-2xsm-regular text-primary-300">
          Showing {MAX_RESULTS} of {results.total} — keep typing to narrow the list.
        </p>
      )}
    </div>
  );
}

export default LearnerPicker;
