"use client";

import { useEffect } from "react";

export function ThemeToggle() {
  useEffect(() => {
    // Ensure document always runs in light mode
    if (typeof document !== "undefined") {
      document.documentElement.removeAttribute("data-theme");
    }
  }, []);

  return null;
}
