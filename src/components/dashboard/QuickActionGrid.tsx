import React from "react";
import Link from "next/link";
import { PlusCircle, UserPlus, Sparkles, SlidersHorizontal } from "lucide-react";

export function QuickActionGrid() {
  const actions = [
    {
      label: "Create Course",
      description: "Draft syllabus & upload video lessons",
      href: "/courses",
      icon: PlusCircle,
      color: "text-[#1C4D8D] bg-brand-ice-soft",
    },
    {
      label: "Manage Users",
      description: "Assign instructor roles & verify students",
      href: "/users",
      icon: UserPlus,
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      label: "AI Syllabus Suite",
      description: "Auto-generate lesson outlines & quizzes",
      href: "/courses",
      icon: Sparkles,
      color: "text-purple-700 bg-purple-50",
    },
    {
      label: "Platform Settings",
      description: "Branding, SMTP & maintenance toggle",
      href: "/settings",
      icon: SlidersHorizontal,
      color: "text-slate-700 bg-slate-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((act, idx) => {
        const Icon = act.icon;
        return (
          <Link
            key={idx}
            href={act.href}
            className="dashboard-card p-4 flex items-center gap-3.5 hover:border-brand-primary transition-all duration-200 group text-left"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${act.color} transition-transform group-hover:scale-105`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="body-sm-medium text-brand-navy group-hover:text-brand-primary transition-colors truncate">
                {act.label}
              </span>
              <span className="body-xsm-regular text-muted truncate">
                {act.description}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
