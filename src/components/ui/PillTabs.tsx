import React from "react";
import { cn } from "@/lib/cn";

export interface PillTabItem {
  id: string;
  label: string;
  count?: number;
}

interface PillTabsProps {
  tabs: PillTabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function PillTabs({
  tabs,
  activeTab,
  onChange,
  className,
}: PillTabsProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center p-1 bg-slate-100 rounded-lg gap-1 border border-dash",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "px-3 py-1.5 rounded-md body-sm-medium transition-all select-none flex items-center gap-1.5",
              isActive
                ? "bg-white text-brand-navy shadow-xs border border-dash font-semibold"
                : "text-muted hover:text-brand-navy hover:bg-slate-200/50"
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[11px]",
                  isActive
                    ? "bg-brand-primary/10 text-brand-primary"
                    : "bg-slate-200 text-slate-600"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
