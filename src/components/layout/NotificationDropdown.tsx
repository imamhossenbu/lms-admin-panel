"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  BookOpen,
  CreditCard,
  UserCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  type: "enrollment" | "payment" | "instructor" | "system";
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "New Student Enrolled",
    description: "Fahim Rahman enrolled in Complete Web Development.",
    timestamp: "10m ago",
    isRead: false,
    type: "enrollment",
  },
  {
    id: "notif-2",
    title: "Payment Received",
    description: "Received $49.00 payment for Order #ORD-1001.",
    timestamp: "45m ago",
    isRead: false,
    type: "payment",
  },
  {
    id: "notif-3",
    title: "Instructor Application",
    description: "Dr. Sarah Khan applied for AI & Machine Learning.",
    timestamp: "2h ago",
    isRead: false,
    type: "instructor",
  },
  {
    id: "notif-4",
    title: "Automated Backup Verified",
    description: "Cloud database snapshot saved successfully.",
    timestamp: "5h ago",
    isRead: true,
    type: "system",
  },
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("Notifications Updated", {
      description: "All notifications marked as read.",
    });
  };

  const handleItemClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "enrollment":
        return {
          icon: BookOpen,
          bg: "bg-[#FFF4ED]",
          color: "text-[#FF5B00]",
        };
      case "payment":
        return {
          icon: CreditCard,
          bg: "bg-green-bg",
          color: "text-green",
        };
      case "instructor":
        return {
          icon: UserCheck,
          bg: "bg-[#EFF6FF]",
          color: "text-[#3B82F6]",
        };
      case "system":
        return {
          icon: ShieldCheck,
          bg: "bg-slate-100",
          color: "text-primary-400",
        };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button with Unread Badge */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-dash bg-white text-primary-400 hover:text-primary-500 hover:bg-slate-50 transition-colors relative cursor-pointer shadow-2xs"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center absolute -top-1 -right-1 ring-2 ring-white animate-in zoom-in-75">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Notification Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-dash overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Card Header */}
          <div className="px-5 py-4 border-b border-dash flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2.5">
              <h3 className="heading-h6 font-bold text-primary-500 text-sm">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-brand-orange-light text-brand-orange body-2xsm-regular font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="body-2xsm-regular font-semibold text-brand-orange hover:text-brand-orange-hover flex items-center gap-1 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
            {notifications.map((item) => {
              const { icon: Icon, bg, color } = getIcon(item.type);

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`p-4 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50/80 text-left ${
                    !item.isRead ? "bg-[#FFF9F5]/60" : "bg-white"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="body-sm-medium text-primary-500 font-semibold truncate">
                        {item.title}
                      </p>
                      <span className="body-2xsm-regular text-primary-300 shrink-0">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="body-2xsm-regular text-primary-400 mt-0.5 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-brand-orange shrink-0 mt-2" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Card Footer */}
          <div className="p-3 bg-slate-50/80 border-t border-dash text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="body-sm-medium font-semibold text-brand-orange hover:text-brand-orange-hover hover:underline transition-colors block py-1"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
