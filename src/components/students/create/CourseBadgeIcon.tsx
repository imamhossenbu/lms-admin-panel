"use client";

import React from "react";

interface CourseBadgeIconProps {
  type: "html" | "css" | "javascript" | "react" | "node" | "uiux" | "tools" | "design";
  size?: "sm" | "md" | "lg";
}

/** Technology logo tiles mapped to the nearest globals.css colour tokens. */
const BRAND_CLASSES = {
  html: "bg-brand-orange text-white",
  css: "bg-blue text-white",
  javascript: "bg-yellow text-white",
  react: "bg-brand-navy text-blue",
  node: "bg-brand-navy text-green",
} as const;

export function CourseBadgeIcon({ type, size = "md" }: CourseBadgeIconProps) {
  const dimClass =
    size === "sm" ? "w-5 h-5 body-2xsm-regular font-bold!" : size === "lg" ? "w-10 h-10 body-regular font-bold! rounded-lg" : "w-7 h-7 body-xsm-regular font-bold!";

  switch (type) {
    case "html":
      return (
        <div
          className={`${dimClass} rounded-md ${BRAND_CLASSES.html} flex items-center justify-center shrink-0 shadow-xs tracking-tighter`}
          title="HTML5"
        >
          <span>5</span>
        </div>
      );
    case "css":
      return (
        <div
          className={`${dimClass} rounded-md ${BRAND_CLASSES.css} flex items-center justify-center shrink-0 shadow-xs tracking-tighter`}
          title="CSS3"
        >
          <span>3</span>
        </div>
      );
    case "javascript":
      return (
        <div
          className={`${dimClass} rounded-md ${BRAND_CLASSES.javascript} flex items-center justify-center shrink-0 shadow-xs`}
          title="JavaScript"
        >
          <span className="body-2xsm-regular font-bold!">JS</span>
        </div>
      );
    case "react":
      return (
        <div
          className={`${dimClass} rounded-md ${BRAND_CLASSES.react} flex items-center justify-center shrink-0 shadow-xs`}
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
          className={`${dimClass} rounded-md ${BRAND_CLASSES.node} flex items-center justify-center shrink-0 shadow-xs`}
          title="Node.js"
        >
          <span className="body-2xsm-regular font-bold!">node</span>
        </div>
      );
    case "uiux":
      return (
        <div
          className={`${dimClass} rounded-md bg-purple text-white flex items-center justify-center shrink-0 shadow-xs`}
          title="UI/UX Design"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      );
    case "tools":
    case "design":
      return (
        <div
          className={`${dimClass} rounded-md bg-yellow text-white flex items-center justify-center shrink-0 shadow-xs`}
          title="Design Tools"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </div>
      );
    default:
      return (
        <div className={`${dimClass} rounded-md bg-brand-orange text-white flex items-center justify-center shrink-0`}>
          <span>C</span>
        </div>
      );
  }
}
