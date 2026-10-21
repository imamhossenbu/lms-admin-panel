import React from "react";
import { EduProLogo } from "@/components/ui/EduProLogo";

interface AuthRightPanelProps {
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
  copyrightText?: string | null;
}

export function AuthRightPanel({
  title,
  subtitle,
  children,
  copyrightText = null,
}: AuthRightPanelProps) {
  return (
    <div className="w-full lg:w-[46%] xl:w-[45%] bg-white p-7 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-center relative overflow-y-auto">
      {/* Centered Form Area with Substantial Width */}
      <div className="max-w-[460px] lg:max-w-[480px] xl:max-w-[500px] w-full mx-auto py-6 sm:py-8">
        {/* Brand Header */}
        <div className="mb-7 sm:mb-8">
          <EduProLogo
            variant="orange"
            size="lg"
            subtitle="LMS Admin Panel"
            className="mb-5 sm:mb-6"
          />

          <h2 className="text-3xl sm:text-[34px] font-bold text-slate-900 tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2.5 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Content Body / Form */}
        {children}
      </div>

      {/* Bottom Copyright (Only if explicitly passed) */}
      {copyrightText && (
        <div className="text-center text-xs text-slate-400 pt-3">
          {copyrightText}
        </div>
      )}
    </div>
  );
}
