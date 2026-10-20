"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, Sparkles, LogOut, ChevronDown, User as UserIcon, Shield } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar } from "@/components/ui/Avatar";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AdminNavbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    dispatch(logout());
    toast.success("Signed out successfully", {
      description: "Your administrative session has ended.",
    });
    router.push("/login");
  };

  return (
    <header className="h-16 px-6 bg-white border-b border-dash flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
      {/* Search Bar */}
      <div className="relative w-72 md:w-96">
        <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Quick search courses, users, transactions..."
          className="w-full h-9 pl-9 pr-4 rounded-lg bg-slate-50 border border-dash body-sm-regular text-brand-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-primary transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <ToneBadge
          tone="ice"
          size="sm"
          className="hidden md:inline-flex items-center gap-1 font-medium"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#1C4D8D]" />
          <span>Gemini 3.8 Flash Online</span>
        </ToneBadge>

        <ThemeToggle />

        <button
          type="button"
          className="p-2 rounded-lg border border-dash text-muted hover:text-brand-navy hover:bg-slate-100 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 pl-2 py-1 pr-1.5 rounded-lg border border-transparent hover:border-dash hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Avatar name={user?.name || "Admin"} size="sm" />
            <div className="hidden lg:flex flex-col text-left">
              <span className="body-sm-medium text-brand-navy truncate max-w-[140px]">
                {user?.name || "Administrator"}
              </span>
              <span className="body-xsm-regular text-muted uppercase tracking-wider text-[11px] font-semibold">
                {user?.role || "ADMIN"}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted ml-0.5" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-dash py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-dash">
                <p className="body-sm-medium text-brand-navy font-semibold truncate">
                  {user?.name || "Administrator"}
                </p>
                <p className="body-xsm-regular text-muted truncate">
                  {user?.email || "admin@lms.com"}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  <span>Verified {user?.role || "ADMIN"} Session</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push("/settings");
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-left body-sm-regular text-brand-navy hover:bg-slate-50 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-muted" />
                  <span>Account Settings</span>
                </button>
              </div>

              <div className="pt-1 border-t border-dash">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-left body-sm-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
