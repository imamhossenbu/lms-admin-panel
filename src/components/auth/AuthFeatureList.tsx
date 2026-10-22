import React from "react";
import { LucideIcon } from "lucide-react";

export interface AuthFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface AuthFeatureListProps {
  features: AuthFeature[];
  className?: string;
}

export function AuthFeatureList({
  features,
  className = "space-y-3.5 pt-5",
}: AuthFeatureListProps) {
  return (
    <div className={className}>
      {features.map((feature, idx) => {
        const Icon = feature.icon;
        return (
          <div key={idx} className="flex items-center gap-3.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1F2A3B] border border-white/10 flex items-center justify-center text-white/90 shrink-0 group-hover:bg-brand-orange-20 group-hover:text-brand-orange transition-all">
              <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </div>
            <div>
              <h3 className="body-sm-medium text-white tracking-tight leading-snug">
                {feature.title}
              </h3>
              <p className="body-xsm-regular text-slate-400 leading-tight mt-0.5">
                {feature.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
