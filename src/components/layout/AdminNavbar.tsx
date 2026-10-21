"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, Sparkles, LogOut, ChevronDown, User as UserIcon, Shield } from "lucide-react";
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
    <header className="h-16 px-6 bg-white border-b border-[#EDEDED] flex items-center justify-between sticky top-0 z-20">
      {/* Search Bar */}
      <div className="relative w-72 md:w-96">
        <Search className="w-4 h-4 text-primary-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Quick search courses, users, transactions..."
          className="w-full h-[40px] pl-10 pr-4 rounded-[8px] bg-white border border-[#EDEDED] body-sm-regular text-primary-500 placeholder:text-[#969696] focus:outline-none focus:border-[#FF5B00] transition-colors"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <ToneBadge
          tone="ice"
          size="sm"
          className="hidden md:inline-flex items-center gap-1.5 font-medium h-[32px] px-2.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF5B00]" />
          <span>Gemini 3.8 Flash Online</span>
        </ToneBadge>

        <button
          type="button"
          className="h-[40px] w-[40px] flex items-center justify-center rounded-[8px] border border-[#EDEDED] bg-white text-primary-300 hover:text-primary-500 hover:bg-[#F8F9FA] transition-colors relative cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white" />
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 pl-2 py-1 pr-2 rounded-[8px] border border-transparent hover:border-[#EDEDED] hover:bg-[#F8F9FA] transition-all cursor-pointer h-[40px]"
          >
            <Avatar name={user?.name || "Admin"} size="sm" />
            <div className="hidden lg:flex flex-col text-left">
              <span className="body-sm-medium text-primary-500 truncate max-w-[140px]">
                {user?.name || "Administrator"}
              </span>
              <span className="body-xsm-regular subtext-500 uppercase tracking-wider font-semibold">
                {user?.role || "ADMIN"}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-primary-300 ml-0.5" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-[10px] shadow-xl border border-[#EDEDED] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-[#F0F0F0]">
                <p className="body-sm-medium text-primary-500 font-semibold truncate">
                  {user?.name || "Administrator"}
                </p>
                <p className="body-xsm-regular subtext-500 truncate">
                  {user?.email || "admin@lms.com"}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 body-xsm-medium border border-emerald-200">
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
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-left body-sm-regular text-primary-500 hover:bg-[#F8F9FA] transition-colors cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-primary-300" />
                  <span>Account Settings</span>
                </button>
              </div>

              <div className="pt-1 border-t border-[#F0F0F0]">
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
