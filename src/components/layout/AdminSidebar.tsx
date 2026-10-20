"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  BarChart3,
  Settings,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/orders", label: "Orders & Sales", icon: CreditCard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 bg-[#0F2854] text-white flex flex-col justify-between transition-all duration-300 z-30 select-none border-r border-[#1C355E]",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div>
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#1C355E]">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#1C4D8D] flex items-center justify-center shrink-0 shadow-sm border border-[#4988C4]/40">
              <GraduationCap className="w-6 h-6 text-[#BDE8F5]" />
            </div>
            {!collapsed && (
              <div className="flex flex-col text-left">
                <span className="h6-medium font-bold text-white tracking-tight">
                  LMS AI
                </span>
                <span className="body-xsm-regular text-[#BDE8F5]/80">
                  Admin Workspace
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                  isActive
                    ? "bg-[#1C4D8D] text-white shadow-sm font-semibold border-l-4 border-[#BDE8F5]"
                    : "text-slate-300 hover:bg-[#163564] hover:text-white"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-colors",
                    isActive ? "text-[#BDE8F5]" : "text-slate-400 group-hover:text-white"
                  )}
                />
                {!collapsed && (
                  <span className="body-sm-medium truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-[#1C355E]">
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-[#163564] text-slate-300 hover:text-white hover:bg-[#1C4D8D] transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="body-sm-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
