"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  BookOpen,
  FolderTree,
  Users,
  UserCheck,
  ShoppingBag,
  CreditCard,
  Video,
  FileSpreadsheet,
  CheckSquare,
  MessageSquare,
  Award,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { cn } from "@/lib/cn";
import { EduProCapIcon } from "@/components/ui/EduProLogo";

interface NavCategory {
  category: string;
  items: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const SIDEBAR_SECTIONS: NavCategory[] = [
  {
    category: "Overview",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    category: "Learning",
    items: [
      { href: "/courses", label: "Courses", icon: BookOpen },
      { href: "/categories", label: "Categories", icon: FolderTree },
    ],
  },
  {
    category: "People",
    items: [
      { href: "/users?role=student", label: "Students", icon: Users },
      { href: "/users?role=instructor", label: "Instructors", icon: UserCheck },
    ],
  },
  {
    category: "Commerce",
    items: [
      { href: "/orders", label: "Orders", icon: ShoppingBag },
      { href: "/payments", label: "Payments", icon: CreditCard },
    ],
  },
  {
    category: "Engagement",
    items: [
      { href: "/live-classes", label: "Live Classes", icon: Video },
      { href: "/assignments", label: "Assignments", icon: FileSpreadsheet },
      { href: "/quizzes", label: "Quizzes", icon: CheckSquare },
      { href: "/community", label: "Community", icon: MessageSquare },
    ],
  },
  {
    category: "System",
    items: [
      { href: "/certificates", label: "Certificates", icon: Award },
      { href: "/notifications", label: "Notifications", icon: Bell },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 bg-white text-primary-500 flex flex-col justify-between transition-all duration-300 z-30 select-none border-r border-dash",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      <div className="flex-1 flex flex-col min-h-0">
        {/* Brand Header */}
        <div
          className={cn(
            "h-16 flex items-center border-b border-dash shrink-0 transition-all",
            collapsed ? "px-2.5 justify-between" : "px-4 justify-between"
          )}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <button
              type="button"
              onClick={() => collapsed && dispatch(toggleSidebar())}
              className={cn(
                "w-9 h-9 rounded-xl bg-brand-orange-light flex items-center justify-center shrink-0 transition-transform",
                collapsed ? "cursor-pointer hover:scale-105" : ""
              )}
              title={collapsed ? "Click to expand sidebar" : "EduPro LMS"}
            >
              <EduProCapIcon className="w-6 h-6 text-brand-orange" />
            </button>

            {!collapsed && (
              <Link href="/" className="flex flex-col text-left">
                <span className="body-medium font-extrabold text-primary-500 tracking-tight leading-none">
                  EduPro
                </span>
                <span className="body-2xsm-regular text-primary-300 mt-0.5 leading-none">
                  LMS Admin Panel
                </span>
              </Link>
            )}
          </div>

          {/* Toggle Button in Header - Always Visible */}
          <button
            type="button"
            onClick={() => dispatch(toggleSidebar())}
            className="p-1.5 rounded-lg text-primary-300 hover:text-brand-orange hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-brand-orange" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Scrollable Navigation Categories */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-left custom-scrollbar">
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.category} className="space-y-1">
              {!collapsed && (
                <div className="px-3 py-1 body-2xsm-regular font-semibold text-primary-300 tracking-wider">
                  {section.category}
                </div>
              )}

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href.split("?")[0]);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl transition-all group",
                        isActive
                          ? "bg-brand-orange-light text-brand-orange font-semibold border-l-4 border-brand-orange rounded-l-none"
                          : "text-primary-400 hover:bg-slate-50 hover:text-primary-500"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          isActive
                            ? "text-brand-orange"
                            : "text-primary-300 group-hover:text-primary-400"
                        )}
                      />
                      {!collapsed && (
                        <span className="body-sm-medium truncate">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-dash">
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          className={cn(
            "w-full flex items-center justify-center p-2 rounded-xl transition-colors cursor-pointer",
            collapsed
              ? "bg-brand-orange-light text-brand-orange hover:bg-brand-orange hover:text-white"
              : "text-primary-400 hover:bg-slate-50 hover:text-primary-500"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              <span className="body-sm-medium">Collapse</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
