"use client";

import React from "react";
import { Award } from "lucide-react";

interface CertificateThumbnailProps {
  accentColor: "amber" | "blue" | "purple" | "green";
  isEarned?: boolean;
}

export function CertificateThumbnail({
  accentColor,
  isEarned = true,
}: CertificateThumbnailProps) {
  const getThemeClasses = () => {
    if (!isEarned) {
      return {
        border: "border-slate-300",
        innerBorder: "border-dash",
        bg: "bg-slate-50",
        seal: "text-primary-300 bg-slate-200",
        text: "text-primary-300",
      };
    }

    switch (accentColor) {
      case "amber":
        return {
          border: "border-yellow",
          innerBorder: "border-yellow/30",
          bg: "bg-yellow-bg/50",
          seal: "text-yellow bg-yellow-14",
          text: "text-yellow",
        };
      case "blue":
        return {
          border: "border-blue",
          innerBorder: "border-blue/30",
          bg: "bg-blue-14",
          seal: "text-blue bg-blue-14",
          text: "text-blue",
        };
      case "purple":
        return {
          border: "border-purple/40",
          innerBorder: "border-purple/25",
          bg: "bg-purple-14",
          seal: "text-purple bg-purple-14",
          text: "text-purple",
        };
      case "green":
      default:
        return {
          border: "border-green",
          innerBorder: "border-green/30",
          bg: "bg-green-bg/50",
          seal: "text-green bg-green-bg",
          text: "text-green",
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div
      className={`relative w-14 h-9 sm:w-16 sm:h-10 rounded-sm border ${theme.border} ${theme.bg} p-1 shadow-2xs flex flex-col justify-between shrink-0 select-none overflow-hidden`}
    >
      {/* Decorative double border */}
      <div
        className={`w-full h-full border ${theme.innerBorder} rounded-xs p-0.5 flex flex-col justify-between items-center relative`}
      >
        {/* Top mini header */}
        <span
          className={`body-2xsm-regular font-bold! tracking-widest uppercase whitespace-nowrap ${theme.text} h-1.5 flex items-center scale-45`}
        >
          Certificate
        </span>

        {/* Decorative lines representing certificate body */}
        <div className="w-full space-y-0.5 px-1 opacity-70">
          <div className="h-px w-full bg-current opacity-40 mx-auto" />
          <div className="h-px w-3/4 bg-current opacity-30 mx-auto" />
        </div>

        {/* Mini Certificate Seal / Badge */}
        <div
          className={`w-2.5 h-2.5 rounded-full ${theme.seal} flex items-center justify-center shrink-0 shadow-2xs`}
        >
          <Award className="w-1.5 h-1.5" />
        </div>
      </div>
    </div>
  );
}
