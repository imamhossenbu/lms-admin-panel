"use client";

import React, { useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/slices/uiSlice";

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    if (theme === "night") {
      document.documentElement.setAttribute("data-theme", "night");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      className="p-2 rounded-lg border border-dash text-muted hover:text-brand-navy hover:bg-slate-100 transition-colors"
      title={theme === "light" ? "Switch to night mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4 text-amber-400" />
      )}
    </button>
  );
}
