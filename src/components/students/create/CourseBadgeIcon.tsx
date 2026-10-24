"use client";

import React from "react";

interface CourseBadgeIconProps {
  type: "html" | "css" | "javascript" | "react" | "node" | "uiux";
  size?: "sm" | "md";
}

export function CourseBadgeIcon({ type, size = "md" }: CourseBadgeIconProps) {
  const dimClass = size === "sm" ? "w-5 h-5 text-[10px]" : "w-7 h-7 text-xs";

  switch (type) {
    case "html":
      return (
        <div
          className={`${dimClass} rounded-md bg-[#F06529] text-white font-black flex items-center justify-center shrink-0 shadow-xs tracking-tighter`}
          title="HTML5"
        >
          <span className="font-bold">5</span>
        </div>
      );
    case "css":
      return (
        <div
          className={`${dimClass} rounded-md bg-[#2965F1] text-white font-black flex items-center justify-center shrink-0 shadow-xs tracking-tighter`}
          title="CSS3"
        >
          <span className="font-bold">3</span>
        </div>
      );
    case "javascript":
      return (
        <div
          className={`${dimClass} rounded-md bg-[#F7DF1E] text-black font-black flex items-center justify-center shrink-0 shadow-xs`}
          title="JavaScript"
        >
          <span className="font-bold text-[10px]">JS</span>
        </div>
      );
    case "react":
      return (
        <div
          className={`${dimClass} rounded-md bg-[#0D1B2A] text-[#61DAFB] font-bold flex items-center justify-center shrink-0 shadow-xs`}
          title="React"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(0 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
            <circle cx="12" cy="12" r="1.8" fill="currentColor" />
          </svg>
        </div>
      );
    case "node":
      return (
        <div
          className={`${dimClass} rounded-md bg-[#0F2F1E] text-[#68A063] font-bold flex items-center justify-center shrink-0 shadow-xs`}
          title="Node.js"
        >
          <span className="font-bold text-[10px]">node</span>
        </div>
      );
    case "uiux":
      return (
        <div
          className={`${dimClass} rounded-md bg-[#6D28D9] text-white font-bold flex items-center justify-center shrink-0 shadow-xs`}
          title="UI/UX Design"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      );
    default:
      return (
        <div className={`${dimClass} rounded-md bg-brand-orange text-white font-bold flex items-center justify-center shrink-0`}>
          <span>C</span>
        </div>
      );
  }
}
