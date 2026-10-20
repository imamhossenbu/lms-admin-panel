"use client";

import React from "react";
import { motion } from "framer-motion";

export interface PillTabItem {
  id: string;
  label: string;
  count?: number;
}

export interface PillTabsProps {
  tabs: PillTabItem[];
  activeId?: string;
  activeTab?: string;
  onChange: (id: string) => void;
  className?: string;
}

export function PillTabs({
  tabs,
  activeId,
  activeTab,
  onChange,
  className = "",
}: PillTabsProps) {
  const currentActive = activeId ?? activeTab ?? tabs[0]?.id;

  return (
    <div
      className={`flex items-center gap-1 bg-[#F3F4F6] rounded-[8px] p-1 w-fit overflow-x-auto max-w-full ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === currentActive;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative whitespace-nowrap px-3 py-1.5 rounded-[6px] body-xsm-medium transition-colors duration-150 cursor-pointer flex items-center shrink-0 z-10 ${
              isActive
                ? "text-[#1C4D8D] font-semibold"
                : "text-primary-300 hover:text-primary-500"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-white rounded-[6px] shadow-2xs -z-10"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 body-xsm-medium font-semibold leading-none ${
                  isActive
                    ? "bg-[#EBF4FC] text-[#1C4D8D]"
                    : "bg-[#E5E7EB] text-primary-400"
                }`}
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

export default PillTabs;
