"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, BellOff, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import type { AdminNotification } from "@/types/notification";
import { markRead } from "@/lib/notificationStorage";
import { apiErrorMessage } from "@/lib/apiError";
import { timeAgo } from "@/lib/notificationStats";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { useViewportFit } from "@/lib/useViewportFit";
import { CategoryIcon } from "@/components/notifications/shared/CategoryIcon";
import { useNotificationsStore } from "@/components/notifications/shared/useNotificationsStore";

const LATEST_COUNT = 6;

/** Navbar bell: live unread badge + the 6 latest non-archived notifications (same store as /notifications). */
export function NotificationDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  useViewportFit(isOpen, fitRef);
  const { inbox } = useNotificationsStore(["inbox"]);

  const live = useMemo(() => inbox.filter((n) => !n.isArchived), [inbox]);
  const unreadCount = live.filter((n) => !n.isRead).length;
  const latest = useMemo(
    () => [...live].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, LATEST_COUNT),
    [live]
  );

  useEffect(() => {
    if (!isOpen) return;
    const onClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setIsOpen(false);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const handleMarkAllAsRead = async () => {
    const toastId = toast.loading("Marking all as read...", { description: `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.` });
    try {
      await markRead("all");
      toast.success("All caught up", { id: toastId, description: "All notifications marked as read." });
    } catch (err) {
      toast.error("Couldn't update notifications", { id: toastId, description: apiErrorMessage(err) });
    }
  };

  const handleItemClick = (item: AdminNotification) => {
    if (!item.isRead) void markRead([item.id]).catch(() => {});
    setIsOpen(false);
    router.push(item.href);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button with Unread Badge */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : "Notifications"}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-dash bg-white text-primary-400 hover:text-primary-500 hover:bg-slate-50 transition-colors relative cursor-pointer shadow-2xs"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="min-w-4 h-4 px-1 rounded-full bg-brand-orange text-white body-2xsm-regular font-bold! flex items-center justify-center absolute -top-1 -right-1 ring-2 ring-white whitespace-nowrap"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Floating Notification Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={fitRef}
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-dash overflow-hidden z-50"
          >
            {/* Card Header */}
            <div className="px-5 py-4 border-b border-dash flex items-center justify-between gap-3 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <h3 className="heading-h6 font-bold! text-primary-500">Notifications</h3>
                {unreadCount > 0 && (
                  <ToneBadge tone="orange" size="sm">
                    {unreadCount} new
                  </ToneBadge>
                )}
              </div>

              {unreadCount > 0 && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => void handleMarkAllAsRead()}
                  className="body-xsm-medium font-semibold! text-brand-orange hover:text-brand-orange-hover flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all as read</span>
                </motion.button>
              )}
            </div>

            {/* Notifications List */}
            {latest.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-bg text-primary-300">
                  <BellOff className="h-5 w-5" />
                </span>
                <p className="body-sm-medium font-semibold! text-primary-500">You&apos;re all caught up</p>
                <p className="body-xsm-regular text-primary-300">New activity will show up here.</p>
              </div>
            ) : (
              <ul className="max-h-96 overflow-y-auto divide-y divide-dash custom-scrollbar">
                {latest.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, ease: "easeOut", delay: i * 0.025 }}
                  >
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        "w-full p-4 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50 text-left",
                        !item.isRead ? "bg-brand-orange-soft" : "bg-white"
                      )}
                    >
                      <CategoryIcon category={item.category} className="mt-0.5" />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={cn("body-sm-medium truncate", !item.isRead ? "text-primary-500 font-bold!" : "text-primary-400")}>{item.title}</p>
                          <span className="body-xsm-regular text-primary-300 shrink-0">{timeAgo(item.createdAt)}</span>
                        </div>
                        <p className="body-sm-regular text-primary-400 mt-0.5 line-clamp-2">{item.message}</p>
                      </div>

                      {!item.isRead && <span className="w-2 h-2 rounded-full bg-brand-orange shrink-0 mt-2" aria-label="Unread" />}
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}

            {/* Card Footer */}
            <div className="p-3 bg-slate-50 border-t border-dash text-center">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="body-sm-medium font-semibold! text-brand-orange hover:text-brand-orange-hover hover:underline transition-colors block py-1"
              >
                View all notifications
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationDropdown;
