"use client";

import { canWith } from "@/lib/usePermission";
import type { TeamModule } from "@/types/team";
import React, { useSyncExternalStore } from "react";
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
  UserCog,
  ChevronLeft,
  ChevronRight,
  Receipt,
} from "lucide-react";
import type { FeatureKey } from "@/types/saas";
import { hasFeature, minPlanFor, useCurrentInstitution, useSaasStore } from "@/lib/planAccess";
import { UpgradeBadge } from "@/components/plan-gate/UpgradeBadge";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { cn } from "@/lib/cn";
import { EduProCapIcon } from "@/components/ui/EduProLogo";
import { getUnreadCount } from "@/lib/notificationStorage";
import { subscribeNotifications, useNotificationsLoader } from "@/components/notifications/shared/useNotificationsStore";

interface NavCategory {
  category: string;
  items: {
    href: string;
    label: string;
    /** Team permission module needed to see this item (View). */
    module?: TeamModule;
    icon: React.ComponentType<{ className?: string }>;
    /** Plan feature the page needs — shows a lock/plan badge when missing (the page itself shows the upsell). */
    feature?: FeatureKey;
  }[];
}

const SIDEBAR_SECTIONS: NavCategory[] = [
  {
    category: "Overview",
    items: [
      { href: "/", module: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/analytics", module: "analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    category: "Learning",
    items: [
      { href: "/courses", module: "courses", label: "Courses", icon: BookOpen },
      { href: "/categories", module: "categories", label: "Categories", icon: FolderTree },
    ],
  },
  {
    category: "People",
    items: [
      { href: "/students", module: "students", label: "Students", icon: Users },
      { href: "/instructors", module: "instructors", label: "Instructors", icon: UserCheck },
    ],
  },
  {
    category: "Commerce",
    items: [
      { href: "/orders", module: "orders", label: "Orders", icon: ShoppingBag },
      { href: "/payments", module: "payments", label: "Payments", icon: CreditCard },
    ],
  },
  {
    category: "Engagement",
    items: [
      { href: "/live-classes", module: "liveClasses", label: "Live Classes", icon: Video, feature: "liveClasses" },
      { href: "/assignments", module: "assignments", label: "Assignments", icon: FileSpreadsheet },
      { href: "/quizzes", module: "quizzes", label: "Quizzes", icon: CheckSquare },
      { href: "/community", module: "community", label: "Community", icon: MessageSquare, feature: "community" },
    ],
  },
  {
    category: "System",
    items: [
      { href: "/certificates", module: "certificates", label: "Certificates", icon: Award, feature: "certificates" },
      { href: "/notifications", module: "notifications", label: "Notifications", icon: Bell },
      { href: "/users", module: "team", label: "Team & Roles", icon: UserCog },
      { href: "/billing", label: "Billing & Plan", icon: Receipt },
      { href: "/settings", module: "settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const access = useAppSelector((state) => state.auth.access);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  // Live unread inbox count (same store as /notifications and the navbar bell).
  useNotificationsLoader(["inbox"]);
  const unreadNotifications = useSyncExternalStore(subscribeNotifications, getUnreadCount, () => 0);
  // Plan gating: lock badges on features outside the current plan, "Trial" on Billing while trialing.
  const saas = useSaasStore();
  const institution = useCurrentInstitution();
  const isTrialing = institution?.subscription.status === "TRIALING";
  const lockedPlanName = (feature?: FeatureKey) =>
    feature && institution && !hasFeature(institution, feature, saas.plans) ? minPlanFor(feature, saas.plans)?.name ?? "Pro" : null;

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 bg-white text-primary-500 flex flex-col justify-between transition-all duration-300 z-30 select-none border-r border-dash",
        collapsed ? "w-18" : "w-60"
      )}
    >
      <div className="flex-1 flex flex-col min-h-0">
        {/* Brand Header */}
        <div
          className={cn(
            "h-16 flex items-center border-b border-dash shrink-0 transition-all",
            collapsed ? "px-3 justify-center" : "px-4 justify-between"
          )}
        >
          {collapsed ? (
            /* Collapsed Header: Centered Logo + Click to Expand */
            <button
              type="button"
              onClick={() => dispatch(toggleSidebar())}
              className="w-10 h-10 rounded-xl bg-brand-orange-light flex items-center justify-center cursor-pointer hover:scale-105 transition-all shadow-2xs group relative"
              title="Click to expand sidebar"
            >
              <EduProCapIcon className="w-6 h-6 text-brand-orange" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-xs">
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          ) : (
            /* Expanded Header: Brand + Text + Collapse Chevron */
            <>
              <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-brand-orange-light flex items-center justify-center shrink-0">
                  <EduProCapIcon className="w-6 h-6 text-brand-orange" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="body-medium text-primary-500 tracking-tight">
                    EduPro
                  </span>
                  <span className="body-2xsm-regular text-primary-300 mt-0.5">
                    LMS Admin Panel
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => dispatch(toggleSidebar())}
                className="p-1.5 rounded-lg text-primary-300 hover:text-brand-orange hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Scrollable Navigation Categories */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-3.5 text-left custom-scrollbar">
          {SIDEBAR_SECTIONS.map((section) => ({ ...section, items: section.items.filter((item) => !item.module || canWith(access, item.module)) }))
            .filter((section) => section.items.length > 0)
            .map((section) => (
            <div key={section.category} className="space-y-1">
              {!collapsed && (
                <div className="px-3 pt-1 pb-0.5 body-xs-medium font-bold! text-primary-400 tracking-wider uppercase select-none">
                  {section.category}
                </div>
              )}

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const lockedPlan = lockedPlanName(item.feature);
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
                          ? "bg-brand-orange-light text-brand-orange border-l-4 border-brand-orange rounded-l-none"
                          : "text-primary-400 hover:bg-slate-50 hover:text-primary-500",
                        collapsed && "justify-center px-0 w-11 h-10 mx-auto"
                      )}
                      title={collapsed ? (lockedPlan ? `${item.label} (${lockedPlan} plan)` : item.label) : undefined}
                    >
                      <Icon
                        className={cn(
                          "w-4.5 h-4.5 shrink-0 transition-colors",
                          isActive
                            ? "text-brand-orange"
                            : "text-primary-300 group-hover:text-primary-400"
                        )}
                      />
                      {!collapsed && (
                        <>
                          <span className="body-sm-medium truncate">
                            {item.label}
                          </span>
                          {item.label === "Notifications" && unreadNotifications > 0 && (
                            <span
                              aria-label={`${unreadNotifications} unread notifications`}
                              className="ml-auto min-w-5 h-5 px-1 rounded-md bg-brand-orange text-white body-2xsm-regular font-bold! flex items-center justify-center shadow-2xs whitespace-nowrap shrink-0"
                            >
                              {unreadNotifications > 99 ? "99+" : unreadNotifications}
                            </span>
                          )}
                          {lockedPlan && <UpgradeBadge planName={lockedPlan} className="ml-auto" />}
                          {item.href === "/billing" && isTrialing && (
                            <ToneBadge tone="blue" size="sm" variant="pill" className="ml-auto">
                              Trial
                            </ToneBadge>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Collapse Toggle Footer (only visible when collapsed) */}
      {collapsed && (
        <div className="p-2.5 border-t border-dash">
          <button
            type="button"
            onClick={() => dispatch(toggleSidebar())}
            className="w-full flex items-center justify-center p-2 rounded-xl bg-brand-orange-light text-brand-orange hover:bg-brand-orange hover:text-white transition-all cursor-pointer shadow-2xs"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
}
