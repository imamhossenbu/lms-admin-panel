"use client";

import React, { useState } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";

export const AVAILABLE_LANGUAGES = ["English", "Español", "Français", "Deutsch", "বাংলা"];

interface LanguageSelectorProps {
  selected?: string;
  onSelect?: (lang: string) => void;
  className?: string;
}

export function LanguageSelector({
  selected = "English",
  onSelect,
  className = "",
}: LanguageSelectorProps) {
  const [currentLang, setCurrentLang] = useState(selected);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (lang: string) => {
    setCurrentLang(lang);
    setIsOpen(false);
    onSelect?.(lang);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dash hover:border-slate-300 bg-white body-xsm-medium text-primary-400 shadow-2xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
        aria-expanded={isOpen}
        aria-label="Select language"
      >
        <Globe className="w-3.5 h-3.5 text-primary-300" />
        <span className="body-xsm-medium text-primary-400">{currentLang}</span>
        <ChevronDown
          className={`w-3 h-3 text-primary-300 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-36 bg-white border border-dash rounded-xl shadow-lg py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
            {AVAILABLE_LANGUAGES.map((lang) => {
              const isSelected = currentLang === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleSelect(lang)}
                  className={`w-full text-left px-3 py-1.5 body-xsm-medium transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "text-brand-orange font-semibold bg-brand-orange-light"
                      : "text-primary-400 hover:bg-slate-50"
                  }`}
                >
                  <span>{lang}</span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-brand-orange stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
