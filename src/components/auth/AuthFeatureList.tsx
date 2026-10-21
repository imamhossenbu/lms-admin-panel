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
  className = "space-y-3 pt-5",
}: AuthFeatureListProps) {
  return (
    <div className={className}>
      {features.map((feature, idx) => {
        const Icon = feature.icon;
        return (
          <div key={idx} className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-[#202B3B] flex items-center justify-center text-white/90 shrink-0 group-hover:bg-[#FF5B00]/25 transition-colors">
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-[13px] font-semibold text-white tracking-tight leading-snug">
                {feature.title}
              </h3>
              <p className="text-[11px] text-slate-400 leading-tight">
                {feature.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
