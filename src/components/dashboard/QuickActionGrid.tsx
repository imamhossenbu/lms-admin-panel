import React from "react";
import Link from "next/link";
import {
  PlusCircle,
  UserPlus,
  Sparkles,
  SlidersHorizontal,
  ArrowUpRight,
} from "lucide-react";

export function QuickActionGrid() {
  const actions = [
    {
      label: "Create New Course",
      description: "Draft syllabus & upload video lessons",
      href: "/courses",
      icon: PlusCircle,
      badge: "Fast Launch",
      color: "text-blue-600 bg-blue-50 border-blue-200/60 group-hover:bg-blue-600 group-hover:text-white",
      hoverBorder: "hover:border-blue-300",
    },
    {
      label: "AI Curriculum Suite",
      description: "Auto-generate lesson outlines & quizzes",
      href: "/courses",
      icon: Sparkles,
      badge: "Gemini 3.8",
      color: "text-purple-600 bg-purple-50 border-purple-200/60 group-hover:bg-purple-600 group-hover:text-white",
      hoverBorder: "hover:border-purple-300",
    },
    {
      label: "Institutional Users",
      description: "Assign instructor roles & verify students",
      href: "/users",
      icon: UserPlus,
      badge: "RBAC",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200/60 group-hover:bg-emerald-600 group-hover:text-white",
      hoverBorder: "hover:border-emerald-300",
    },
    {
      label: "Platform Hardening",
      description: "Security tokens, SMTP & AI model keys",
      href: "/settings",
      icon: SlidersHorizontal,
      badge: "Config",
      color: "text-primary-400 bg-gray-bg border-dash group-hover:bg-blue! group-hover:text-white",
      hoverBorder: "hover:border-blue/40!",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {actions.map((act, idx) => {
        const Icon = act.icon;
        return (
          <Link
            key={idx}
            href={act.href}
            className={`rounded-xl bg-white border border-dash shadow-xs ${act.hoverBorder} hover:shadow-md transition-all duration-200 p-4.5 flex flex-col justify-between group text-left relative overflow-hidden`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div
                className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-all duration-300 ${act.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="body-xsm-medium font-semibold px-2 py-0.5 rounded-full bg-gray-bg text-primary-500 border border-dash group-hover:border-blue/30! transition-colors">
                  {act.badge}
                </span>
                <ArrowUpRight className="w-4 h-4 text-primary-300 group-hover:text-blue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="body-sm-medium text-primary-500 font-semibold group-hover:text-blue transition-colors block truncate">
                {act.label}
              </span>
              <p className="body-xsm-regular subtext-500 line-clamp-1">
                {act.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
