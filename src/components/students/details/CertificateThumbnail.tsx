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
        innerBorder: "border-slate-200",
        bg: "bg-slate-50",
        seal: "text-slate-400 bg-slate-200",
        text: "text-slate-400",
      };
    }

    switch (accentColor) {
      case "amber":
        return {
          border: "border-amber-400/80",
          innerBorder: "border-amber-300/60",
          bg: "bg-amber-50/50",
          seal: "text-amber-500 bg-amber-100",
          text: "text-amber-700",
        };
      case "blue":
        return {
          border: "border-blue-400/80",
          innerBorder: "border-blue-300/60",
          bg: "bg-blue-50/50",
          seal: "text-blue-500 bg-blue-100",
          text: "text-blue-700",
        };
      case "purple":
        return {
          border: "border-purple-400/80",
          innerBorder: "border-purple-300/60",
          bg: "bg-purple-50/50",
          seal: "text-purple-500 bg-purple-100",
          text: "text-purple-700",
        };
      case "green":
      default:
        return {
          border: "border-emerald-400/80",
          innerBorder: "border-emerald-300/60",
          bg: "bg-emerald-50/50",
          seal: "text-emerald-500 bg-emerald-100",
          text: "text-emerald-700",
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
        className={`w-full h-full border ${theme.innerBorder} rounded-[2px] p-0.5 flex flex-col justify-between items-center relative`}
      >
        {/* Top mini header */}
        <span
          className={`text-[5px] font-bold tracking-widest uppercase ${theme.text} scale-90`}
        >
          Certificate
        </span>

        {/* Decorative lines representing certificate body */}
        <div className="w-full space-y-0.5 px-1 opacity-70">
          <div className="h-[1px] w-full bg-current opacity-40 mx-auto" />
          <div className="h-[1px] w-3/4 bg-current opacity-30 mx-auto" />
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
