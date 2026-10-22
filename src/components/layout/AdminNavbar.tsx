"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Bell,
  Calendar,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Shield,
  Settings,
} from "lucide-react";
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

  const handleSearchFocus = () => {
    toast.info("Search Activated", {
      description: "Search for courses, students, and transaction records.",
    });
  };

  return (
    <header className="h-16 px-6 lg:px-8 bg-white border-b border-dash flex items-center justify-between sticky top-0 z-20">
      {/* Search Bar with ⌘ K shortcut */}
      <div className="relative w-72 md:w-96">
        <Search className="w-4 h-4 text-primary-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchFocus();
          }}
          placeholder="Search courses, students, orders..."
          className="w-full h-10 pl-10 pr-12 rounded-xl bg-[#F8FAFC]/60 border border-dash body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none focus:border-brand-orange focus:bg-white transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <kbd className="body-2xsm-regular font-semibold text-primary-300 px-1.5 py-0.5 rounded border border-slate-200 bg-white shadow-2xs">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Date Selector Pill */}
        <button
          type="button"
          onClick={() => toast.info("Date range selector", { description: "Viewing analytics for Oct 20, 2026." })}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dash bg-white body-sm-medium text-primary-500 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-primary-400" />
          <span>Oct 20, 2026</span>
          <ChevronDown className="w-3.5 h-3.5 text-primary-300" />
        </button>

        {/* Notifications Bell with count badge */}
        <button
          type="button"
          onClick={() => toast.info("Notifications", { description: "You have 3 unread administrative alerts." })}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-dash bg-white text-primary-400 hover:text-primary-500 hover:bg-slate-50 transition-colors relative cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-4 h-4 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center absolute -top-1 -right-1 ring-2 ring-white">
            3
          </span>
        </button>

        {/* User Profile Pill */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl border border-transparent hover:border-dash hover:bg-slate-50 transition-all cursor-pointer"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 ring-1 ring-slate-200 shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Admin Profile"
                fill
                sizes="32px"
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="body-sm-medium font-bold text-primary-500 leading-tight">
                {user?.name || "Admin"}
              </span>
              <span className="body-2xsm-regular text-primary-300 leading-tight">
                Super Admin
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-primary-300 ml-0.5" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-dash py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2.5 border-b border-dash">
                <p className="body-sm-medium font-bold text-primary-500 truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="body-2xsm-regular text-primary-300 truncate">
                  {user?.email || "admin@edupro.com"}
                </p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-bg text-green body-2xsm-regular font-semibold">
                  <Shield className="w-3 h-3 text-green" />
                  <span>Super Admin Verified</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push("/settings");
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-left body-sm-regular text-primary-500 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-primary-300" />
                  <span>Settings</span>
                </button>
              </div>

              <div className="pt-1 border-t border-dash">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-left body-sm-medium text-red-dark hover:bg-red-14 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-dark" />
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
