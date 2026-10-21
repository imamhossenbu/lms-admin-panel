import React from "react";
import { EduProLogo } from "@/components/ui/EduProLogo";
import { AuthFeature, AuthFeatureList } from "./AuthFeatureList";

interface AuthLeftPanelProps {
  title: React.ReactNode;
  description: React.ReactNode;
  features: AuthFeature[];
  mockupSrc: string;
  mockupAlt: string;
  topBadge?: React.ReactNode;
  footerTagline?: string;
}

export function AuthLeftPanel({
  title,
  description,
  features,
  mockupSrc,
  mockupAlt,
  topBadge,
  footerTagline = "A modern LMS for a brighter future",
}: AuthLeftPanelProps) {
  return (
    <div className="hidden lg:flex w-full lg:w-[54%] xl:w-[55%] bg-gradient-to-b from-[#182434] via-[#141C27] to-[#121821] text-white relative flex-col justify-between overflow-hidden select-none min-h-[780px] xl:min-h-[820px]">
      {/* Ambient Lighting Behind Mockup */}
      <div className="absolute top-[140px] right-0 w-[460px] h-[460px] rounded-full bg-[#FF5B00]/15 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-20 w-[350px] h-[350px] rounded-full bg-[#1A253C]/60 blur-[90px] pointer-events-none" />

      {/* Right-Flush Large 3D Mockup Image with Gradual Soft Mask */}
      <div
        className="absolute right-0 inset-y-0 h-full w-[56%] xl:w-[60%] pointer-events-none select-none overflow-hidden z-0"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.05) 15%, rgba(0, 0, 0, 0.5) 38%, black 65%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.05) 15%, rgba(0, 0, 0, 0.5) 38%, black 65%)",
        }}
      >
        <img
          src={mockupSrc}
          alt={mockupAlt}
          className="h-full w-full object-cover object-right-bottom"
        />
      </div>

      {/* Top Brand Header Row */}
      <div className="relative z-10 flex items-center justify-between p-7 sm:p-10 lg:pl-12 xl:pl-14 lg:pr-8 xl:pr-10 lg:pt-12 xl:pt-14 pb-0">
        <EduProLogo variant="light" size="md" subtitle="LMS Admin Panel" />
        {topBadge}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 my-auto p-7 sm:p-10 lg:pl-12 xl:pl-14 lg:pr-4 xl:pr-4 py-6 max-w-full lg:max-w-[400px] xl:max-w-[450px]">
        {/* Hero Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl lg:text-[44px] xl:text-[48px] font-bold text-white tracking-tight leading-[1.12]">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mt-3">
            {description}
          </p>
        </div>

        {/* Feature Items List */}
        <AuthFeatureList features={features} className="space-y-4 pt-6" />
      </div>

      {/* Bottom Footnote */}
      <div className="relative z-10 p-7 sm:p-10 lg:pl-12 xl:pl-14 lg:pb-12 xl:pb-14 pt-0 flex items-center gap-2 text-xs text-slate-400">
        <span className="w-4 h-[2px] bg-brand-orange rounded-full inline-block" />
        <span>{footerTagline}</span>
      </div>
    </div>
  );
}
